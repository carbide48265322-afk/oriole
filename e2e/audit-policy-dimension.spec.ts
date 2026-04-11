import { test, expect } from '@playwright/test';

/**
 * E2E 测试: 审核策略与审核维度管理
 * 
 * 对应 SPEC.md 中的 E2E 测试用例:
 * - E2E-1: 审核策略列表展示与导航
 * - E2E-2: 审核维度列表展示与导航
 * - E2E-3: 审核策略新增与删除
 * - E2E-4: 策略与维度关联
 */

test.describe('审核策略与审核维度管理', () => {
  
  test('E2E-1: 审核策略列表展示与导航', async ({ page }) => {
    // 1. 直接导航到审核策略页面
    await page.goto('/audit-policy');
    
    // 2. 验证页面显示"审核策略"标题
    await expect(page.getByText('审核策略管理')).toBeVisible({ timeout: 5000 });
    
    // 3. 验证侧边栏包含"审核策略"菜单项且高亮
    const sidebarMenuItem = page.getByRole('menuitem', { name: '审核策略' });
    await expect(sidebarMenuItem).toBeVisible();
    
    // 4. 验证显示策略列表表格（至少有一行 Mock 数据）
    await expect(page.getByText('内容安全策略')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('图片审核策略')).toBeVisible();
    
    // 5. 验证表格存在
    const table = page.locator('table');
    await expect(table).toBeVisible();
    const rows = await table.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('E2E-2: 审核维度列表展示与导航', async ({ page }) => {
    // 1. 直接导航到审核维度页面
    await page.goto('/audit-dimension');
    
    // 2. 验证页面显示"审核维度"标题
    await expect(page.getByText('审核维度管理')).toBeVisible({ timeout: 5000 });
    
    // 3. 验证侧边栏包含"审核维度"菜单项且高亮
    const sidebarMenuItem = page.getByRole('menuitem', { name: '审核维度' });
    await expect(sidebarMenuItem).toBeVisible();
    
    // 4. 验证显示维度列表表格（至少有一行 Mock 数据）
    await expect(page.getByText('敏感词检测')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('暴力内容识别')).toBeVisible();
    
    // 5. 验证表格存在
    const table = page.locator('table');
    await expect(table).toBeVisible();
    const rows = await table.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('E2E-3: 审核策略新增与删除', async ({ page }) => {
    // 1. 导航到审核策略页面
    await page.goto('/audit-policy');
    await expect(page.getByText('审核策略管理')).toBeVisible({ timeout: 5000 });
    
    // 等待数据加载
    await expect(page.getByText('内容安全策略')).toBeVisible({ timeout: 5000 });
    
    // 记录初始策略数量
    const initialRows = await page.locator('table tbody tr').count();
    expect(initialRows).toBeGreaterThan(0);
    
    // 2. 点击"新增"按钮
    await page.getByRole('button', { name: '新增策略' }).click();
    
    // 3. 验证弹出表单 Modal
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('新增审核策略')).toBeVisible();
    
    // 4. 填写策略名称（描述是可选的）
    await page.getByLabel('策略名称').fill('E2E 测试策略');
    
    // 5. 按 Enter 键提交表单
    await page.getByLabel('策略名称').press('Enter');
    
    // 6. 验证保存成功提示
    await expect(page.getByText('策略创建成功')).toBeVisible({ timeout: 5000 });
    
    // 7. 验证 Modal 关闭
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
    
    // 8. 验证列表新增一行数据
    await expect(page.getByText('E2E 测试策略')).toBeVisible({ timeout: 5000 });
    const afterCreateRows = await page.locator('table tbody tr').count();
    expect(afterCreateRows).toBeGreaterThan(initialRows);
    
    // 9. 点击新增策略的"删除"按钮
    const row = page.locator('table tbody tr', { hasText: 'E2E 测试策略' });
    const deleteBtn = row.getByRole('button', { name: '删除' });
    
    // Hover 触发 Popconfirm
    await deleteBtn.hover();
    await page.waitForTimeout(500);
    await deleteBtn.click();
    
    // 10. 等待 Popconfirm 出现并确认
    // Popconfirm 可能渲染为 tooltip 或独立的 div
    await page.waitForTimeout(500);
    const popconfirmBtn = page.getByRole('button', { name: '确定' });
    if (await popconfirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await popconfirmBtn.click();
    } else {
      // 如果 Popconfirm 没出现，直接调用删除（可能已配置为自动确认）
      console.log('Popconfirm not visible, proceeding...');
    }
    
    // 11. 验证删除成功
    await expect(page.getByText('策略删除成功')).toBeVisible({ timeout: 5000 });
    
    // 12. 验证列表恢复初始行数
    await expect(page.getByText('E2E 测试策略')).not.toBeVisible({ timeout: 5000 });
    const afterDeleteRows = await page.locator('table tbody tr').count();
    expect(afterDeleteRows).toBe(initialRows);
  });

  test('E2E-4: 策略与维度关联', async ({ page }) => {
    // 1. 导航到审核策略页面
    await page.goto('/audit-policy');
    await expect(page.getByText('审核策略管理')).toBeVisible({ timeout: 5000 });
    
    // 等待数据加载
    await expect(page.getByText('内容安全策略')).toBeVisible({ timeout: 5000 });
    
    // 2. 点击某个策略的"关联维度"按钮
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.getByRole('button', { name: 'link 关联维度' }).click();
    
    // 3. 验证弹出 Transfer 对话框
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });
    
    // 验证 Modal 标题
    const dialogTitle = page.getByRole('dialog').locator('.ant-modal-title');
    await expect(dialogTitle).toContainText('关联维度');
    
    // 4. 等待 Transfer 组件渲染
    await page.waitForTimeout(1000);
    
    // 尝试查找 Transfer 组件中的项目
    const leftItems = page.locator('.ant-transfer-list-content-item');
    const itemCount = await leftItems.count().catch(() => 0);
    
    if (itemCount > 0) {
      // 点击第一个项目
      await leftItems.first().click();
      await page.waitForTimeout(300);
      
      // 点击右移按钮
      const operationButtons = page.locator('.ant-transfer-operation button');
      const opCount = await operationButtons.count().catch(() => 0);
      if (opCount > 0) {
        await operationButtons.first().click();
        await page.waitForTimeout(500);
      }
    }
    
    // 5. 点击 Modal 的footer保存按钮（可能在 dialog 外部渲染）
    // Ant Design Modal footer 按钮通常在 .ant-modal-footer 内
    const saveBtn = page.locator('.ant-modal-footer button').filter({ hasText: '保存' }).or(
      page.getByRole('button', { name: '保存' }).first()
    );
    
    if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await saveBtn.click();
    }
    
    // 6. 验证关联成功
    await expect(page.getByText('维度关联成功')).toBeVisible({ timeout: 5000 });
    
    // 7. 验证策略详情展示关联的维度列表
    await expect(firstRow.locator('.ant-tag').first()).toBeVisible({ timeout: 5000 });
  });
});
