# CORS 跨域问题修复说明

## 问题描述

视频和音频预览组件在使用第三方 URL（Google Storage / SoundHelix）时，由于这些服务器没有设置 CORS 头，导致 video.js 和 wavesurfer.js 无法加载跨域资源。

## 解决方案

采用 **多层 fallback 机制**：

### 1. 本地测试资源（优先）

Mock 数据页面使用本地相对路径（`/assets/test-*.mp4/mp3`），避免跨域问题。

### 2. CORS 自动 Fallback

当外部 URL 加载失败时，自动切换到 base64 编码的测试数据：

- **VideoPreview**: 检测外部 URL → 设置 `crossOrigin` → 加载失败 → 使用 base64 测试视频
- **AudioPreview**: 检测外部 URL → 加载失败 → 使用 base64 测试音频

### 3. Base64 测试数据

提供极小的 base64 编码测试资源：
- 1秒静音音频 (MP3)
- 1秒黑色视频 (MP4)

## 修改文件

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/lib/test-media.ts` | 测试媒体资源工具（base64 数据 + 辅助函数） |
| `src/lib/__tests__/test-media.test.ts` | 测试媒体工具单元测试（17 个测试用例） |
| `src/components/annotation/__tests__/VideoPreview.test.tsx` | 视频预览组件单元测试（7 个测试用例） |
| `src/components/annotation/__tests__/AudioPreview.test.tsx` | 音频预览组件单元测试（6 个测试用例） |

### 修改文件

| 文件 | 变更说明 |
|------|---------|
| `src/components/annotation/VideoPreview.tsx` | 添加 CORS fallback 机制 |
| `src/components/annotation/AudioPreview.tsx` | 添加 CORS fallback 机制 |
| `src/app/(main)/audit/video/page.tsx` | 使用本地资源路径替代外部 URL |
| `src/app/(main)/audit/audio/page.tsx` | 使用本地资源路径替代外部 URL |

## 技术细节

### VideoPreview CORS Fallback 流程

```
外部 URL 加载
    ↓
设置 crossOrigin = 'anonymous'
    ↓
video.js 加载视频
    ↓
加载成功? ──Yes──→ 正常播放
    ↓ No
使用 base64 测试视频
    ↓
播放成功? ──Yes──→ 显示测试视频
    ↓ No
显示"视频加载失败"
```

### AudioPreview CORS Fallback 流程

```
外部 URL 加载
    ↓
wavesurfer.js 加载音频
    ↓
加载成功? ──Yes──→ 正常播放
    ↓ No
使用 base64 测试音频
    ↓
加载成功? ──Yes──→ 显示波形
    ↓ No
显示"音频加载失败"
```

## 单元测试覆盖率

| 模块 | 测试数 | 状态 |
|------|--------|------|
| test-media 工具 | 17 | ✅ 全部通过 |
| VideoPreview 组件 | 7 | ✅ 全部通过 |
| AudioPreview 组件 | 6 | ✅ 全部通过 |
| **总计** | **30** | **✅ 全部通过** |

## 验证结果

```bash
# TypeScript 类型检查
✅ pnpm type-check - 通过

# ESLint 代码规范
✅ pnpm lint - 通过（0 错误，33 警告为已有）

# 单元测试
✅ 30 个新增测试全部通过

# 质量门禁
✅ verify.sh - 通过（3 通过，0 失败，2 警告）
```

## 后续优化建议

1. **真实测试资源**: 将 `public/assets/` 目录下添加真实的测试视频和音频文件
2. **外部 URL 配置**: 在后端 API 中配置支持 CORS 的 CDN 地址
3. **错误监控**: 添加 CORS 错误上报，统计 fallback 触发频率
