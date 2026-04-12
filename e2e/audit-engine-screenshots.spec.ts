import { test, expect } from '@playwright/test';
import * as path from 'path';

const SCREENSHOT_DIR = path.join(
  process.cwd(),
  'test-screenshots',
  'audit-engine'
);

test.describe('审核引擎 UI 验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/audit/image');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  test('01-三栏布局验证', async ({ page }) => {
    // 验证左侧列表区
    const leftSider = page.locator('.ant-layout-sider').first();
    await expect(leftSider).toBeVisible();

    // 验证右侧工作区
    const workspaceArea = page.locator('.ant-layout-content').last();
    await expect(workspaceArea).toBeVisible();

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-three-column-layout.png'),
      fullPage: false,
    });

    // 验证布局比例（左侧默认 280px，收缩时 48px）
    const leftBox = await leftSider.boundingBox();
    expect(leftBox?.width).toBeGreaterThanOrEqual(200);
  });

  test('02-搜索框和收缩按钮布局', async ({ page }) => {
    // 验证搜索框存在
    const searchInput = page.locator('input[placeholder*="搜索"]').first();
    await expect(searchInput).toBeVisible();

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-search-layout.png'),
      fullPage: false,
    });

    // 验证搜索框可见
    const searchBox = await searchInput.boundingBox();
    expect(searchBox?.width).toBeGreaterThan(100);
  });

  test('03-全屏按钮位置', async ({ page }) => {
    // 通过图标查找全屏按钮
    const fullscreenBtn = page.locator('button').filter({ has: page.locator('.anticon-expand, .anticon-compress') }).first();
    
    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-fullscreen-btn.png'),
      fullPage: false,
    });

    // 验证按钮在右上角
    const btnBox = await fullscreenBtn.boundingBox();
    expect(btnBox?.y).toBeLessThan(100);
  });

  test('04-全屏模式', async ({ page }) => {
    // 点击全屏按钮
    const fullscreenBtn = page.locator('button').filter({ has: page.locator('.anticon-expand, .anticon-compress') }).first();
    await fullscreenBtn.click();
    await page.waitForTimeout(600);

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-fullscreen-mode.png'),
      fullPage: false,
    });

    // 验证全屏样式
    const container = page.locator('div[style*="100vh"]').first();
    await expect(container).toBeVisible();
  });

  test('05-拖拽调整', async ({ page }) => {
    // 查找分隔条
    const visibleDivider = page.locator('div[style*="col-resize"]').first();
    const dividerBox = await visibleDivider.boundingBox();
    
    if (dividerBox) {
      const startX = dividerBox.x + dividerBox.width / 2;
      const startY = dividerBox.y + dividerBox.height / 2;

      // 拖拽
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX - 50, startY, { steps: 10 });
      await page.mouse.up();

      await page.waitForTimeout(300);
    }

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-resize-adjusted.png'),
      fullPage: false,
    });
  });
});
