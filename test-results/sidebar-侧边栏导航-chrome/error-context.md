# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sidebar.spec.ts >> 侧边栏导航
- Location: e2e/sidebar.spec.ts:3:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/ai-review"
Received: "http://localhost:3000/tasks"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/tasks"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - complementary [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - img "audit" [ref=e6]:
          - img [ref=e7]
        - strong [ref=e10]: Oriole
      - menu [ref=e11]:
        - menuitem "dashboard工作台" [ref=e12]:
          - img "dashboard" [ref=e13]:
            - img [ref=e14]
          - text: 工作台
        - menuitem "file-text审核任务" [ref=e16]:
          - img "file-text" [ref=e17]:
            - img [ref=e18]
          - text: 审核任务
        - menuitem "robotAI 审核" [active] [ref=e20]:
          - img "robot" [ref=e21]:
            - img [ref=e22]
          - text: AI 审核
        - menuitem "user-switch人工复审" [ref=e24]:
          - img "user-switch" [ref=e25]:
            - img [ref=e26]
          - text: 人工复审
        - menuitem "eye审核沉浸页" [ref=e28]:
          - img "eye" [ref=e29]:
            - img [ref=e30]
          - text: 审核沉浸页
        - menuitem "history审核历史" [ref=e32]:
          - img "history" [ref=e33]:
            - img [ref=e34]
          - text: 审核历史
        - menuitem "bar-chart统计数据" [ref=e36]:
          - img "bar-chart" [ref=e37]:
            - img [ref=e38]
          - text: 统计数据
        - menuitem "setting设置" [ref=e40]:
          - img "setting" [ref=e41]:
            - img [ref=e42]
          - text: 设置
  - generic [ref=e44]:
    - banner [ref=e45]:
      - button "menu-fold" [ref=e46]:
        - img "menu-fold" [ref=e47]:
          - img [ref=e48]
      - generic [ref=e50]:
        - img "user" [ref=e53]:
          - img [ref=e54]
        - generic [ref=e56]: 未登录
    - main [ref=e57]:
      - generic [ref=e58]:
        - heading "审核任务列表" [level=3] [ref=e59]
        - generic [ref=e61]: 此模块正在开发中，敬请期待...
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('侧边栏导航', async ({ page }) => {
  4  |   // 1. 访问 /tasks 页面
  5  |   await page.goto('/tasks');
  6  |   
  7  |   // 验证页面加载
  8  |   await expect(page.getByText('审核任务列表')).toBeVisible();
  9  |   
  10 |   // 2. 点击侧边栏 "AI 审核" 菜单
  11 |   await page.getByRole('menuitem', { name: 'AI 审核' }).click();
  12 |   
  13 |   // 3. 验证跳转到 /ai-review
> 14 |   await expect(page).toHaveURL('/ai-review');
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  15 |   
  16 |   // 4. 点击侧边栏 "审核历史" 菜单
  17 |   await page.getByRole('menuitem', { name: '审核历史' }).click();
  18 |   
  19 |   // 5. 验证跳转到 /history
  20 |   await expect(page).toHaveURL('/history');
  21 | });
  22 | 
  23 | test('侧边栏菜单项完整性', async ({ page }) => {
  24 |   await page.goto('/tasks');
  25 |   
  26 |   // 验证所有主要菜单项存在
  27 |   const menuItems = [
  28 |     '工作台',
  29 |     '审核任务',
  30 |     'AI 审核',
  31 |     '人工复审',
  32 |     '审核沉浸页',
  33 |     '审核历史',
  34 |     '统计数据',
  35 |     '设置',
  36 |   ];
  37 |   
  38 |   for (const item of menuItems) {
  39 |     await expect(page.getByRole('menuitem', { name: item })).toBeVisible();
  40 |   }
  41 | });
  42 | 
  43 | test('侧边栏菜单点击后高亮', async ({ page }) => {
  44 |   await page.goto('/tasks');
  45 |   
  46 |   // 点击 AI 审核
  47 |   await page.getByRole('menuitem', { name: 'AI 审核' }).click();
  48 |   await expect(page).toHaveURL('/ai-review');
  49 | });
  50 | 
  51 | test('侧边栏菜单点击后手动审核页面', async ({ page }) => {
  52 |   await page.goto('/tasks');
  53 |   
  54 |   // 点击人工复审
  55 |   await page.getByRole('menuitem', { name: '人工复审' }).click();
  56 |   await expect(page).toHaveURL('/manual-review');
  57 | });
  58 | 
  59 | test('侧边栏菜单点击后专注复审页面', async ({ page }) => {
  60 |   await page.goto('/tasks');
  61 |   
  62 |   // 点击审核沉浸页
  63 |   await page.getByRole('menuitem', { name: '审核沉浸页' }).click();
  64 |   await expect(page).toHaveURL('/focus-review');
  65 | });
  66 | 
  67 | test('侧边栏菜单点击后数据统计页面', async ({ page }) => {
  68 |   await page.goto('/tasks');
  69 |   
  70 |   // 点击统计数据
  71 |   await page.getByRole('menuitem', { name: '统计数据' }).click();
  72 |   await expect(page).toHaveURL('/stats');
  73 | });
  74 | 
  75 | test('侧边栏菜单点击后系统设置页面', async ({ page }) => {
  76 |   await page.goto('/tasks');
  77 |   
  78 |   // 点击设置
  79 |   await page.getByRole('menuitem', { name: '设置' }).click();
  80 |   await expect(page).toHaveURL('/settings');
  81 | });
  82 | 
```