# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: audit-policy-dimension.spec.ts >> 审核策略与审核维度管理 >> E2E-4: 策略与维度关联
- Location: e2e/audit-policy-dimension.spec.ts:124:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('维度关联成功')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('维度关联成功')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - img "audit" [ref=e6]:
            - img [ref=e7]
          - strong [ref=e10]: Oriole
        - menu [ref=e11]:
          - menuitem "dashboard 工作台" [ref=e12] [cursor=pointer]:
            - img "dashboard" [ref=e13]:
              - img [ref=e14]
            - generic [ref=e16]: 工作台
          - menuitem "file-text 审核策略" [ref=e17] [cursor=pointer]:
            - img "file-text" [ref=e18]:
              - img [ref=e19]
            - generic [ref=e21]: 审核策略
          - menuitem "file-text 审核维度" [ref=e22] [cursor=pointer]:
            - img "file-text" [ref=e23]:
              - img [ref=e24]
            - generic [ref=e26]: 审核维度
          - menuitem "file-text 审核任务" [ref=e27] [cursor=pointer]:
            - img "file-text" [ref=e28]:
              - img [ref=e29]
            - generic [ref=e31]: 审核任务
          - menuitem "robot AI 审核" [ref=e32] [cursor=pointer]:
            - img "robot" [ref=e33]:
              - img [ref=e34]
            - generic [ref=e36]: AI 审核
          - menuitem "user-switch 人工复审" [ref=e37] [cursor=pointer]:
            - img "user-switch" [ref=e38]:
              - img [ref=e39]
            - generic [ref=e41]: 人工复审
          - menuitem "eye 审核沉浸页" [ref=e42] [cursor=pointer]:
            - img "eye" [ref=e43]:
              - img [ref=e44]
            - generic [ref=e46]: 审核沉浸页
          - menuitem "history 审核历史" [ref=e47] [cursor=pointer]:
            - img "history" [ref=e48]:
              - img [ref=e49]
            - generic [ref=e51]: 审核历史
          - menuitem "bar-chart 统计数据" [ref=e52] [cursor=pointer]:
            - img "bar-chart" [ref=e53]:
              - img [ref=e54]
            - generic [ref=e56]: 统计数据
          - menuitem "setting 设置" [ref=e57] [cursor=pointer]:
            - img "setting" [ref=e58]:
              - img [ref=e59]
            - generic [ref=e61]: 设置
    - generic [ref=e62]:
      - banner [ref=e63]:
        - button "menu-fold" [ref=e64] [cursor=pointer]:
          - img "menu-fold" [ref=e65]:
            - img [ref=e66]
        - generic [ref=e68] [cursor=pointer]:
          - img "user" [ref=e71]:
            - img [ref=e72]
          - generic [ref=e74]: 未登录
      - main [ref=e75]:
        - generic [ref=e77]:
          - generic [ref=e79]:
            - generic [ref=e80]: 审核策略管理
            - button "plus 新增策略" [ref=e82] [cursor=pointer]:
              - img "plus" [ref=e84]:
                - img [ref=e85]
              - generic [ref=e88]: 新增策略
          - table [ref=e96]:
            - rowgroup [ref=e97]:
              - row "策略名称 描述 关联维度 创建时间 操作" [ref=e98]:
                - columnheader "策略名称" [ref=e99]
                - columnheader "描述" [ref=e100]
                - columnheader "关联维度" [ref=e101]
                - columnheader "创建时间" [ref=e102]
                - columnheader "操作" [ref=e103]
            - rowgroup [ref=e104]:
              - row "内容安全策略 用于审核用户生成内容的安全性 敏感词检测 暴力内容识别 2024/1/1 08:00:00 edit 编辑 link 关联维度 delete 删除" [ref=e105]:
                - cell "内容安全策略" [ref=e106]
                - cell "用于审核用户生成内容的安全性" [ref=e107]
                - cell "敏感词检测 暴力内容识别" [ref=e108]:
                  - generic [ref=e109]:
                    - generic [ref=e111]: 敏感词检测
                    - generic [ref=e113]: 暴力内容识别
                - cell "2024/1/1 08:00:00" [ref=e114]
                - cell "edit 编辑 link 关联维度 delete 删除" [ref=e115]:
                  - generic [ref=e116]:
                    - button "edit 编辑" [ref=e118] [cursor=pointer]:
                      - img "edit" [ref=e120]:
                        - img [ref=e121]
                      - generic [ref=e123]: 编辑
                    - button "link 关联维度" [ref=e125] [cursor=pointer]:
                      - img "link" [ref=e127]:
                        - img [ref=e128]
                      - generic [ref=e130]: 关联维度
                    - button "delete 删除" [ref=e132] [cursor=pointer]:
                      - img "delete" [ref=e134]:
                        - img [ref=e135]
                      - generic [ref=e137]: 删除
              - row "图片审核策略 专门用于图片内容的审核标准 色情内容检测 2024/1/2 08:00:00 edit 编辑 link 关联维度 delete 删除" [ref=e138]:
                - cell "图片审核策略" [ref=e139]
                - cell "专门用于图片内容的审核标准" [ref=e140]
                - cell "色情内容检测" [ref=e141]:
                  - generic [ref=e144]: 色情内容检测
                - cell "2024/1/2 08:00:00" [ref=e145]
                - cell "edit 编辑 link 关联维度 delete 删除" [ref=e146]:
                  - generic [ref=e147]:
                    - button "edit 编辑" [ref=e149] [cursor=pointer]:
                      - img "edit" [ref=e151]:
                        - img [ref=e152]
                      - generic [ref=e154]: 编辑
                    - button "link 关联维度" [ref=e156] [cursor=pointer]:
                      - img "link" [ref=e158]:
                        - img [ref=e159]
                      - generic [ref=e161]: 关联维度
                    - button "delete 删除" [ref=e163] [cursor=pointer]:
                      - img "delete" [ref=e165]:
                        - img [ref=e166]
                      - generic [ref=e168]: 删除
              - row "视频审核策略 视频内容审核规范 未关联 2024/1/3 08:00:00 edit 编辑 link 关联维度 delete 删除" [ref=e169]:
                - cell "视频审核策略" [ref=e170]
                - cell "视频内容审核规范" [ref=e171]
                - cell "未关联" [ref=e172]:
                  - generic [ref=e174]: 未关联
                - cell "2024/1/3 08:00:00" [ref=e175]
                - cell "edit 编辑 link 关联维度 delete 删除" [ref=e176]:
                  - generic [ref=e177]:
                    - button "edit 编辑" [ref=e179] [cursor=pointer]:
                      - img "edit" [ref=e181]:
                        - img [ref=e182]
                      - generic [ref=e184]: 编辑
                    - button "link 关联维度" [ref=e186] [cursor=pointer]:
                      - img "link" [ref=e188]:
                        - img [ref=e189]
                      - generic [ref=e191]: 关联维度
                    - button "delete 删除" [ref=e193] [cursor=pointer]:
                      - img "delete" [ref=e195]:
                        - img [ref=e196]
                      - generic [ref=e198]: 删除
  - generic [ref=e203] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e204]:
      - img [ref=e205]
    - generic [ref=e208]:
      - button "Open issues overlay" [ref=e209]:
        - generic [ref=e210]:
          - generic [ref=e211]: "0"
          - generic [ref=e212]: "1"
        - generic [ref=e213]: Issue
      - button "Collapse issues badge" [ref=e214]:
        - img [ref=e215]
  - alert [ref=e217]
  - generic [ref=e218]:
    - dialog "关联维度" [active]:
      - generic [ref=e219]:
        - button "Close" [ref=e220] [cursor=pointer]:
          - generic "关闭" [ref=e221]:
            - img "close" [ref=e222]:
              - img [ref=e223]
        - generic [ref=e226]: 关联维度
        - generic [ref=e228]:
          - generic [ref=e229]:
            - generic [ref=e230]:
              - checkbox [checked=mixed] [ref=e233] [cursor=pointer]
              - img "down" [ref=e234]:
                - img [ref=e235]
              - generic [ref=e237]: 1/2 项
              - generic [ref=e238]: 可选维度
            - list [ref=e240]:
              - listitem "色情内容检测" [ref=e241] [cursor=pointer]:
                - checkbox [checked] [ref=e244]
                - generic [ref=e245]: 色情内容检测
              - listitem "语音违规检测" [ref=e246]:
                - checkbox [ref=e249] [cursor=pointer]
                - generic [ref=e250]: 语音违规检测
          - generic [ref=e251]:
            - button "right" [ref=e252] [cursor=pointer]:
              - img "right" [ref=e254]:
                - img [ref=e255]
            - button "left" [disabled] [ref=e257]:
              - generic:
                - img "left":
                  - img
          - generic [ref=e258]:
            - generic [ref=e259]:
              - checkbox [ref=e262] [cursor=pointer]
              - img "down" [ref=e263]:
                - img [ref=e264]
              - generic [ref=e266]: 2 项
              - generic [ref=e267]: 已选维度
            - list [ref=e269]:
              - listitem "敏感词检测" [ref=e270]:
                - checkbox [ref=e273] [cursor=pointer]
                - generic [ref=e274]: 敏感词检测
              - listitem "暴力内容识别" [ref=e275]:
                - checkbox [ref=e278] [cursor=pointer]
                - generic [ref=e279]: 暴力内容识别
        - generic [ref=e280]:
          - button "取 消" [ref=e281] [cursor=pointer]:
            - generic [ref=e282]: 取 消
          - button "保 存" [ref=e283] [cursor=pointer]:
            - generic [ref=e284]: 保 存
```

# Test source

```ts
  75  |     await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });
  76  |     await expect(page.getByText('新增审核策略')).toBeVisible();
  77  |     
  78  |     // 4. 填写策略名称（描述是可选的）
  79  |     await page.getByLabel('策略名称').fill('E2E 测试策略');
  80  |     
  81  |     // 5. 按 Enter 键提交表单
  82  |     await page.getByLabel('策略名称').press('Enter');
  83  |     
  84  |     // 6. 验证保存成功提示
  85  |     await expect(page.getByText('策略创建成功')).toBeVisible({ timeout: 5000 });
  86  |     
  87  |     // 7. 验证 Modal 关闭
  88  |     await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
  89  |     
  90  |     // 8. 验证列表新增一行数据
  91  |     await expect(page.getByText('E2E 测试策略')).toBeVisible({ timeout: 5000 });
  92  |     const afterCreateRows = await page.locator('table tbody tr').count();
  93  |     expect(afterCreateRows).toBeGreaterThan(initialRows);
  94  |     
  95  |     // 9. 点击新增策略的"删除"按钮
  96  |     const row = page.locator('table tbody tr', { hasText: 'E2E 测试策略' });
  97  |     const deleteBtn = row.getByRole('button', { name: '删除' });
  98  |     
  99  |     // Hover 触发 Popconfirm
  100 |     await deleteBtn.hover();
  101 |     await page.waitForTimeout(500);
  102 |     await deleteBtn.click();
  103 |     
  104 |     // 10. 等待 Popconfirm 出现并确认
  105 |     // Popconfirm 可能渲染为 tooltip 或独立的 div
  106 |     await page.waitForTimeout(500);
  107 |     const popconfirmBtn = page.getByRole('button', { name: '确定' });
  108 |     if (await popconfirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  109 |       await popconfirmBtn.click();
  110 |     } else {
  111 |       // 如果 Popconfirm 没出现，直接调用删除（可能已配置为自动确认）
  112 |       console.log('Popconfirm not visible, proceeding...');
  113 |     }
  114 |     
  115 |     // 11. 验证删除成功
  116 |     await expect(page.getByText('策略删除成功')).toBeVisible({ timeout: 5000 });
  117 |     
  118 |     // 12. 验证列表恢复初始行数
  119 |     await expect(page.getByText('E2E 测试策略')).not.toBeVisible({ timeout: 5000 });
  120 |     const afterDeleteRows = await page.locator('table tbody tr').count();
  121 |     expect(afterDeleteRows).toBe(initialRows);
  122 |   });
  123 | 
  124 |   test('E2E-4: 策略与维度关联', async ({ page }) => {
  125 |     // 1. 导航到审核策略页面
  126 |     await page.goto('/audit-policy');
  127 |     await expect(page.getByText('审核策略管理')).toBeVisible({ timeout: 5000 });
  128 |     
  129 |     // 等待数据加载
  130 |     await expect(page.getByText('内容安全策略')).toBeVisible({ timeout: 5000 });
  131 |     
  132 |     // 2. 点击某个策略的"关联维度"按钮
  133 |     const firstRow = page.locator('table tbody tr').first();
  134 |     await firstRow.getByRole('button', { name: 'link 关联维度' }).click();
  135 |     
  136 |     // 3. 验证弹出 Transfer 对话框
  137 |     await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });
  138 |     
  139 |     // 验证 Modal 标题
  140 |     const dialogTitle = page.getByRole('dialog').locator('.ant-modal-title');
  141 |     await expect(dialogTitle).toContainText('关联维度');
  142 |     
  143 |     // 4. 等待 Transfer 组件渲染
  144 |     await page.waitForTimeout(1000);
  145 |     
  146 |     // 尝试查找 Transfer 组件中的项目
  147 |     const leftItems = page.locator('.ant-transfer-list-content-item');
  148 |     const itemCount = await leftItems.count().catch(() => 0);
  149 |     
  150 |     if (itemCount > 0) {
  151 |       // 点击第一个项目
  152 |       await leftItems.first().click();
  153 |       await page.waitForTimeout(300);
  154 |       
  155 |       // 点击右移按钮
  156 |       const operationButtons = page.locator('.ant-transfer-operation button');
  157 |       const opCount = await operationButtons.count().catch(() => 0);
  158 |       if (opCount > 0) {
  159 |         await operationButtons.first().click();
  160 |         await page.waitForTimeout(500);
  161 |       }
  162 |     }
  163 |     
  164 |     // 5. 点击 Modal 的footer保存按钮（可能在 dialog 外部渲染）
  165 |     // Ant Design Modal footer 按钮通常在 .ant-modal-footer 内
  166 |     const saveBtn = page.locator('.ant-modal-footer button').filter({ hasText: '保存' }).or(
  167 |       page.getByRole('button', { name: '保存' }).first()
  168 |     );
  169 |     
  170 |     if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  171 |       await saveBtn.click();
  172 |     }
  173 |     
  174 |     // 6. 验证关联成功
> 175 |     await expect(page.getByText('维度关联成功')).toBeVisible({ timeout: 5000 });
      |                                            ^ Error: expect(locator).toBeVisible() failed
  176 |     
  177 |     // 7. 验证策略详情展示关联的维度列表
  178 |     await expect(firstRow.locator('.ant-tag').first()).toBeVisible({ timeout: 5000 });
  179 |   });
  180 | });
  181 | 
```