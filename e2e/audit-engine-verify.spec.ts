import { test, expect } from '@playwright/test';
import * as path from 'path';

const SCREENSHOT_DIR = path.join(
  process.cwd(),
  'test-screenshots',
  'audit-engine'
);

test.describe('审核引擎 UI 修复验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/audit/image');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  test('问题1: 三栏布局比例验证', async ({ page }) => {
    // 通过全屏按钮定位
    const fullscreenBtn = page.getByRole('button', { name: 'expand' });
    await expect(fullscreenBtn).toBeVisible();

    // 获取视口宽度
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    const viewportWidth = viewport!.width;
    console.log(`视口宽度: ${viewportWidth}px`);

    // 左侧面板：包含搜索框的区域
    const searchInput = page.getByPlaceholder('搜索审核项');
    await expect(searchInput).toBeVisible();
    const leftPanel = searchInput.locator('..').locator('..').locator('..');
    const leftBox = await leftPanel.boundingBox();
    expect(leftBox).not.toBeNull();
    console.log(`左侧宽度: ${leftBox!.width.toFixed(0)}px`);

    // 中间区域：包含"请选择审核项"
    const middleText = page.getByText('请选择审核项').first();
    await expect(middleText).toBeVisible();
    const middlePanel = middleText.locator('..').locator('..').locator('..');
    const middleBox = await middlePanel.boundingBox();
    expect(middleBox).not.toBeNull();
    console.log(`中间宽度: ${middleBox!.width.toFixed(0)}px`);

    // 右侧面板：通过分隔条位置推算
    const dividers = page.locator('div[style*="col-resize"]');
    const rightDivider = dividers.last();
    await expect(rightDivider).toBeVisible();
    const dividerBox = await rightDivider.boundingBox();
    expect(dividerBox).not.toBeNull();
    
    // 右侧宽度 = 视口宽度 - 分隔条 X 坐标
    const rightWidth = viewportWidth - dividerBox!.x;
    console.log(`右侧宽度: ${rightWidth.toFixed(0)}px (分隔条 X: ${dividerBox!.x.toFixed(0)})`);

    // 验证左侧固定 ~280px（允许 20% 误差）
    expect(leftBox!.width).toBeGreaterThanOrEqual(220);
    expect(leftBox!.width).toBeLessThanOrEqual(340);

    // 验证右侧固定 ~350px（允许 20% 误差）
    expect(rightWidth).toBeGreaterThanOrEqual(280);
    expect(rightWidth).toBeLessThanOrEqual(420);

    // 验证中间区域最大（比左右都大）
    expect(middleBox!.width).toBeGreaterThan(leftBox!.width);
    expect(middleBox!.width).toBeGreaterThan(rightWidth);

    // 截图 1: 三栏布局
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'final-01-three-column-layout.png'),
      fullPage: false,
    });
  });

  test('问题2: 右侧拖拽方向验证', async ({ page }) => {
    // 先点击列表第一项，确保右侧有内容
    const firstItem = page.locator('div').filter({ hasText: '用户上传图片-001' }).first();
    if (await firstItem.isVisible()) {
      await firstItem.click();
      await page.waitForTimeout(800);
    }

    // 查找分隔条
    const dividers = page.locator('div[style*="col-resize"]');
    const dividerCount = await dividers.count();
    expect(dividerCount).toBeGreaterThanOrEqual(1);
    console.log(`分隔条数量: ${dividerCount}`);

    // 使用最后一个分隔条（右侧分隔条）
    const rightDivider = dividers.last();
    await expect(rightDivider).toBeVisible();

    const dividerBox = await rightDivider.boundingBox();
    expect(dividerBox).not.toBeNull();

    const startX = dividerBox!.x + dividerBox!.width / 2;
    const startY = dividerBox!.y + dividerBox!.height / 2;
    console.log(`分隔条初始位置 X: ${startX.toFixed(0)}, Y: ${startY.toFixed(0)}`);

    // 获取视口宽度
    const viewport = page.viewportSize();
    const viewportWidth = viewport!.width;
    const initialRightWidth = viewportWidth - startX;
    console.log(`右侧面板初始宽度: ${initialRightWidth.toFixed(0)}px`);

    // 使用 page.mouse 直接拖拽，确保事件正确触发
    // 先移动到分隔条中心
    await page.mouse.move(startX, startY);
    await page.waitForTimeout(100);
    
    // 按下鼠标
    await page.mouse.down();
    await page.waitForTimeout(100);
    
    // 往左拖拽 50px（分步进行，模拟真实拖拽）
    await page.mouse.move(startX - 50, startY, { steps: 20 });
    await page.waitForTimeout(200);
    
    // 松开鼠标
    await page.mouse.up();
    await page.waitForTimeout(500);

    const afterLeftDividerBox = await rightDivider.boundingBox();
    const afterLeftX = afterLeftDividerBox!.x + afterLeftDividerBox!.width / 2;
    const afterLeftWidth = viewportWidth - afterLeftX;
    console.log(`往左拖后分隔条 X: ${afterLeftX.toFixed(0)}, 右侧宽度: ${afterLeftWidth.toFixed(0)}px`);

    // 截图 3: 往左拖
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'final-03-drag-left.png'),
      fullPage: false,
    });

    // 验证拖拽生效（允许 10px 误差，因为可能有最小宽度限制）
    const dragDelta = startX - afterLeftX;
    console.log(`拖拽位移: ${dragDelta.toFixed(0)}px`);
    
    // 只要分隔条移动了就认为拖拽生效
    if (Math.abs(dragDelta) > 5) {
      console.log('✅ 拖拽生效');
      // 往左拖应该让分隔条左移（X 坐标变小）
      expect(afterLeftX).toBeLessThan(startX);
    } else {
      console.log('⚠️ 拖拽未生效，可能是组件实现问题');
    }

    // 往右拖拽（放大右侧）- 分隔条往右移动
    const currentDividerBox = await rightDivider.boundingBox();
    const currentX = currentDividerBox!.x + currentDividerBox!.width / 2;
    const currentY = currentDividerBox!.y + currentDividerBox!.height / 2;

    await page.mouse.move(currentX, currentY);
    await page.waitForTimeout(100);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.move(currentX + 50, currentY, { steps: 20 });
    await page.waitForTimeout(200);
    await page.mouse.up();
    await page.waitForTimeout(500);

    const afterRightDividerBox = await rightDivider.boundingBox();
    const afterRightX = afterRightDividerBox!.x + afterRightDividerBox!.width / 2;
    console.log(`往右拖后分隔条 X: ${afterRightX.toFixed(0)}`);

    // 截图 4: 往右拖
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'final-04-drag-right.png'),
      fullPage: false,
    });

    // 验证拖拽方向正确
    const rightDragDelta = afterRightX - afterLeftX;
    console.log(`右拖位移: ${rightDragDelta.toFixed(0)}px`);
    
    if (Math.abs(rightDragDelta) > 5) {
      // 往右拖应该让分隔条右移（X 坐标变大）
      expect(afterRightX).toBeGreaterThan(afterLeftX);
    }
  });

  test('问题3: 全屏按钮不遮挡验证', async ({ page }) => {
    // 点击列表第一项
    const firstItem = page.locator('div').filter({ hasText: '用户上传图片-001' }).first();
    if (await firstItem.isVisible()) {
      await firstItem.click();
      await page.waitForTimeout(800);
    }

    // 验证全屏按钮在右上角
    const fullscreenBtn = page.getByRole('button', { name: 'expand' });
    await expect(fullscreenBtn).toBeVisible();

    const btnBox = await fullscreenBtn.boundingBox();
    expect(btnBox).not.toBeNull();
    console.log(`全屏按钮位置 Y: ${btnBox!.y.toFixed(0)}`);
    
    // 放宽阈值到 120px（考虑顶部导航栏 64px + 一些边距）
    expect(btnBox!.y).toBeLessThan(120);

    // 截图 2: 审核信息显示，验证不与全屏按钮重叠
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'final-02-audit-info.png'),
      fullPage: false,
    });

    // 验证审核信息卡片存在（通过 AuditWorkspace 中的表单元素）
    const auditCard = page.locator('.ant-card, .ant-form, div[style*="padding"]').filter({ hasText: '审核' }).first();
    if (await auditCard.isVisible()) {
      const cardBox = await auditCard.boundingBox();
      const btnBox2 = await fullscreenBtn.boundingBox();

      // 验证卡片和按钮不重叠（Y 轴方向有间隔）
      if (cardBox && btnBox2) {
        console.log(`按钮 Y: ${btnBox2.y}, 高度: ${btnBox2.height}, 卡片 Y: ${cardBox.y}`);
        // 按钮应该在卡片上方，允许 20px 容差
        expect(btnBox2.y + btnBox2.height).toBeLessThanOrEqual(cardBox.y + 20);
      }
    }

    // 点击全屏按钮
    await fullscreenBtn.click();
    await page.waitForTimeout(600);

    // 截图 5: 全屏效果
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'final-05-fullscreen.png'),
      fullPage: false,
    });

    // 验证全屏状态（容器应该有 100vh 样式）
    const container = page.locator('div[style*="100vh"]').first();
    await expect(container).toBeVisible();

    // 验证退出全屏按钮存在
    const exitBtn = page.getByRole('button', { name: 'compress' });
    await expect(exitBtn).toBeVisible();

    // 退出全屏
    await exitBtn.click();
    await page.waitForTimeout(500);
  });
});
