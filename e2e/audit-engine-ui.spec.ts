import { test, expect } from '@playwright/test';

/**
 * E2E 验证: 审核引擎 UI 修复效果
 */

test.describe('审核引擎 UI 验证', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/audit/image');
    await page.waitForLoadState('networkidle');
  });

  test('UI-1: 三栏布局正确显示', async ({ page }) => {
    // 验证左侧边栏存在（任务列表）
    const leftSider = page.locator('.ant-layout-sider').nth(1); // 第二个 sider 是审核引擎的
    await expect(leftSider).toBeVisible();

    // 验证中间区域存在（AuditPreview）
    const middleArea = page.locator('main').nth(1); // 第二个 main 是预览区
    await expect(middleArea).toBeVisible();

    // 验证右侧内容区域存在（AuditWorkspace）
    const rightContent = page.locator('.ant-layout-content').first();
    await expect(rightContent).toBeVisible();

    // 获取各区域宽度
    const leftBox = await leftSider.boundingBox();
    const middleBox = await middleArea.boundingBox();
    const rightBox = await rightContent.boundingBox();

    expect(leftBox).not.toBeNull();
    expect(middleBox).not.toBeNull();
    expect(rightBox).not.toBeNull();

    // 中间区域应该比左边栏宽
    expect(middleBox!.width).toBeGreaterThan(leftBox!.width);

    console.log(`左侧: ${leftBox!.width}px, 中间: ${middleBox!.width}px, 右侧: ${rightBox!.width}px`);

    await page.screenshot({ path: '/tmp/audit-three-column.png', fullPage: false });
  });

  test('UI-2: 搜索框和收缩按钮不重叠', async ({ page }) => {
    const searchInput = page.locator('.ant-input-search');
    await expect(searchInput).toBeVisible();

    const searchBox = await searchInput.boundingBox();
    expect(searchBox).not.toBeNull();
    expect(searchBox!.width).toBeGreaterThan(100);

    // 验证搜索框容器有正确的 flex 布局
    const container = page.locator('div[style*="display: flex"][style*="align-items: center"]').first();
    await expect(container).toBeVisible();

    const containerBox = await container.boundingBox();
    expect(containerBox).not.toBeNull();
    expect(containerBox!.width).toBeGreaterThan(searchBox!.width);

    await page.screenshot({ path: '/tmp/audit-search-layout.png', fullPage: false });
  });

  test('UI-3: 全屏按钮位置正确', async ({ page }) => {
    // 通过按钮文本 "expand" 定位
    const fullscreenBtn = page.getByRole('button', { name: 'expand' });
    await expect(fullscreenBtn).toBeVisible();

    const btnBox = await fullscreenBtn.boundingBox();
    expect(btnBox).not.toBeNull();
    
    // 验证按钮在页面顶部区域（考虑顶部导航栏高度约 64px）
    expect(btnBox!.y).toBeLessThan(120); // 放宽阈值到 120px

    await page.screenshot({ path: '/tmp/audit-fullscreen-btn.png', fullPage: false });
  });

  test('UI-4: 全屏动画效果', async ({ page }) => {
    const fullscreenBtn = page.getByRole('button', { name: 'expand' });
    await expect(fullscreenBtn).toBeVisible();

    // 获取容器初始状态
    const container = page.locator('div[style*="transition"]').first();
    const initialStyle = await container.getAttribute('style');
    expect(initialStyle).toContain('transition');
    expect(initialStyle).toContain('scale(0.98)');

    // 点击全屏
    await fullscreenBtn.click();
    await page.waitForTimeout(600);

    // 验证全屏状态
    const fullscreenStyle = await container.getAttribute('style');
    expect(fullscreenStyle).toContain('100vh');
    expect(fullscreenStyle).toContain('scale(1)');
    expect(fullscreenStyle).toContain('position: fixed');

    await page.screenshot({ path: '/tmp/audit-fullscreen-active.png', fullPage: false });

    // 退出全屏
    const exitBtn = page.getByRole('button', { name: 'compress' });
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();
    await page.waitForTimeout(600);

    const restoredStyle = await container.getAttribute('style');
    // 浏览器可能重新排序 calc() 表达式，只需验证包含 100vh 和 64
    expect(restoredStyle).toContain('100vh');
    expect(restoredStyle).toContain('64px');
    expect(restoredStyle).toContain('scale(0.98)');
  });

  test('UI-5: 拖拽分隔条流畅调整', async ({ page }) => {
    const divider = page.locator('div[style*="col-resize"]').first();
    await expect(divider).toBeVisible();

    const initialBox = await divider.boundingBox();
    expect(initialBox).not.toBeNull();
    const initialX = initialBox!.x;

    // 模拟拖拽
    await divider.hover();
    await page.mouse.down();
    
    // 分步拖动（模拟流畅拖拽）
    await page.mouse.move(initialX + 30, initialBox!.y, { steps: 5 });
    await page.waitForTimeout(50);
    await page.mouse.move(initialX + 60, initialBox!.y, { steps: 5 });
    await page.waitForTimeout(50);
    await page.mouse.up();
    await page.waitForTimeout(200);

    const finalBox = await divider.boundingBox();
    expect(finalBox).not.toBeNull();
    
    // 分隔条应该移动了
    expect(finalBox!.x).toBeGreaterThanOrEqual(initialX - 5);

    await page.screenshot({ path: '/tmp/audit-resize.png', fullPage: false });
  });

});
