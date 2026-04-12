import { test, expect } from '@playwright/test';

test.describe('审核引擎 UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/audit/image');
    await page.waitForLoadState('networkidle');
  });

  test('三栏布局比例正确', async ({ page }) => {
    // 验证左侧、中间、右侧区域都存在
    const leftPanel = page.locator('[data-testid="audit-left-panel"]');
    const middlePanel = page.locator('[data-testid="audit-middle-panel"]');
    const rightPanel = page.locator('[data-testid="audit-right-panel"]');
    
    await expect(leftPanel).toBeVisible();
    await expect(middlePanel).toBeVisible();
    await expect(rightPanel).toBeVisible();
    
    // 验证中间区域最大
    const leftBox = await leftPanel.boundingBox();
    const middleBox = await middlePanel.boundingBox();
    const rightBox = await rightPanel.boundingBox();
    
    expect(middleBox!.width).toBeGreaterThan(leftBox!.width);
    expect(middleBox!.width).toBeGreaterThan(rightBox!.width);
  });

  test('右侧拖拽方向正确', async ({ page }) => {
    // 获取右侧分隔条
    const divider = page.locator('[data-testid="right-resizable-divider"]');
    const rightPanel = page.locator('[data-testid="audit-right-panel"]');
    
    const beforeBox = await rightPanel.boundingBox();
    
    // 往右拖拽（放大右侧）
    await divider.dragTo(page.locator('body'), {
      targetPosition: { x: beforeBox!.x + beforeBox!.width + 50, y: beforeBox!.y + beforeBox!.height / 2 }
    });
    
    const afterBox = await rightPanel.boundingBox();
    expect(afterBox!.width).toBeGreaterThan(beforeBox!.width);
  });

  test('全屏按钮不遮挡内容', async ({ page }) => {
    // 点击列表项
    await page.locator('[data-testid="audit-list-item"]').first().click();
    
    // 验证审核信息卡片显示
    const auditInfo = page.locator('[data-testid="audit-info-card"]');
    await expect(auditInfo).toBeVisible();
    
    // 验证全屏按钮
    const fullscreenBtn = page.locator('[data-testid="fullscreen-btn"]');
    await expect(fullscreenBtn).toBeVisible();
    
    // 验证不重叠（按钮 Y 坐标应该小于卡片 Y 坐标）
    const btnBox = await fullscreenBtn.boundingBox();
    const cardBox = await auditInfo.boundingBox();
    expect(btnBox!.y + btnBox!.height).toBeLessThanOrEqual(cardBox!.y);
  });

  test('全屏模式切换', async ({ page }) => {
    const fullscreenBtn = page.locator('[data-testid="fullscreen-btn"]');
    
    // 点击全屏
    await fullscreenBtn.click();
    await page.waitForTimeout(500);
    
    // 验证全屏状态
    const container = page.locator('[data-testid="audit-engine-container"]');
    const box = await container.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(page.viewportSize()!.height - 10);
    
    // 点击恢复
    await page.locator('[data-testid="fullscreen-btn"]').click();
    await page.waitForTimeout(500);
    
    // 验证恢复
    const restoredBox = await container.boundingBox();
    expect(restoredBox!.height).toBeLessThan(page.viewportSize()!.height);
  });
});
