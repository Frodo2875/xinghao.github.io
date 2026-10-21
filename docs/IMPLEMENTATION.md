# Blowfish 主题迁移记录

## 范围

参考 `Blowfish_build.md`，以实际项目为准。此次目标为应用 Blowfish 主题并继续在 GitHub Pages 发布，保留原文章与路径，不扩展项目、评论或统计系统。

## 实现

- PaperMod 已替换为官方 Blowfish v3.9.0 Git 子模块，未修改主题源码。
- Hugo Extended 升级到 0.166.0，Windows 发布包 SHA256 校验通过；Actions 共用版本文件。
- 原生 Landing 首页、Ocean 配色、渐变首屏、卡片文章和明暗切换。
- 中文导航、搜索、目录、代码复制、阅读进度、RSS 与分类标签。
- 归档与 `/search/` 使用少量站点自有模板，保留旧入口。
- 通过 `extend-head-uncached.html` 接入已有本地 MathJax，继续支持 `math: true`。
- 保留 `https://frodo2875.github.io/xinghao.github.io/` 地址与现有 Pages 部署方式。
- 文档、主题定制和第三方源码分开；用户提供的规划文档保留在本地。

## 验证

Hugo 生产构建及内部资源检查通过。GitHub Actions 增加同样的链接检查，避免项目子路径资源失效。

Edge 浏览器检查通过：首页 Landing 与渐变样式、明暗模式切换、中文搜索结果；桌面与 390 像素手机宽度无横向溢出；数学文章有 11 处渲染公式、0 个公式错误，代码复制按钮存在，浏览器控制台无错误。截图保存在本地忽略目录 `output/playwright/`，不提交到仓库。公网部署结果见 GitHub Actions。
