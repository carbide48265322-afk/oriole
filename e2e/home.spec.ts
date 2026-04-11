import { test, expect } from '@playwright/test';

/**
 * E2E 测试: 首页访问和导航
 * 
 * 对应 SPEC.md 中的 E2E-1 测试用例:
 * - 访问首页，验证页面标题
 * - 点击"进入审核工作台"按钮
 * - 验证跳转到 /tasks
 * - 验证 /tasks 页面显示占位内容
 */

test('首页访问和导航', async ({ page }) => {
  // 1. 访问首页
  await page.goto('/');
  
  // 2. 验证页面显示 "Oriole 内容审核平台"
  await expect(page.getByText('Oriole 内容审核平台')).toBeVisible();
  
  // 3. 验证页面包含关键功能描述
  await expect(page.getByText('AI 自动审核')).toBeVisible();
  await expect(page.getByText('人工复审')).toBeVisible();
  await expect(page.getByText('微前端架构')).toBeVisible();
  
  // 4. 点击 "进入审核工作台" 按钮
  await page.getByText('进入审核工作台').click();
  
  // 5. 验证跳转到 /tasks
  await expect(page).toHaveURL('/tasks');
  
  // 6. 验证 /tasks 页面显示占位内容
  await expect(page.getByText('审核任务列表')).toBeVisible();
});

test('首页元素完整性', async ({ page }) => {
  await page.goto('/');
  
  // 验证页面包含主要元素
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: '进入审核工作台' })).toBeVisible();
  
  // 验证功能卡片存在
  const cards = page.locator('.grid > div');
  await expect(cards).toHaveCount(3);
});

test('首页按钮可点击并正确跳转', async ({ page }) => {
  await page.goto('/');
  
  // 点击按钮
  const workButton = page.getByRole('button', { name: '进入审核工作台' });
  await expect(workButton).toBeVisible();
  await workButton.click();
  
  // 验证 URL 变化
  await expect(page).toHaveURL(/.*\/tasks/);
});
