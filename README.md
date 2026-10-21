# Xinghao's Blog

Hugo + **Blowfish v3.9.0** 个人博客，由 GitHub Pages 免费托管。

- 网站：<https://frodo2875.github.io/xinghao.github.io/>
- 仓库：<https://github.com/Frodo2875/xinghao.github.io>
- 项目目录：`D:\code\Blog_gxh`
- Hugo Extended：`0.166.0`，本地与 GitHub Actions 共用 `.hugo-version`。

## 本地预览

```powershell
cd D:\code\Blog_gxh
powershell -ExecutionPolicy Bypass -File .\scripts\preview.ps1
```

打开 <http://localhost:1313/>，按 Ctrl+C 停止。显示草稿时在命令最后加 `-Drafts`。便携 Hugo 在 `.tools/hugo/hugo.exe`，不依赖全局安装。命令中的执行策略仅作用于当前 PowerShell 进程。

在新电脑安装：

```powershell
git clone --recurse-submodules https://github.com/Frodo2875/xinghao.github.io.git
cd xinghao.github.io
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

安装脚本从 Hugo 官方发布页下载并校验 SHA256，主题通过 Git 子模块固定版本。

## 日常写作与更新

```powershell
.\.tools\hugo\hugo.exe new content posts/my-note/index.md
```

编辑文章顶部的标题、日期、分类、标签和摘要，完成后改为 `draft: false`。图片可放在文章目录中并用 `![说明](photo.jpg)` 引用。

数学文章加 `math: true`，支持 `$...$`、`$$...$$`，使用随站点保存的 MathJax 3.2.2。代码高亮、复制、目录、阅读进度和文章导航由 Blowfish 提供。搜索按钮位于导航栏，也可按 Ctrl / ⌘ + K；原 `/search/` 地址继续可用。

发布更新：

```powershell
git add <本次修改的文件或目录>
git commit -m "更新博客内容"
git push
```

GitHub Actions 会构建、检查内部链接及静态资源，再部署到 Pages。工作流支持项目子路径，不需要服务器、数据库或付费域名。当前仓库名与账户名不同，所以网址包含 `/xinghao.github.io/`。

## 主题配置与目录

| 位置 | 用途 |
| --- | --- |
| `hugo.yaml` | 中文语言、Ocean 配色、菜单、Landing 首页、文章和搜索配置 |
| `content/_index.md` | 首页标题、简介与按钮 |
| `content/posts/` | 现有三篇文章，地址保持不变 |
| `content/about.md` | 个人介绍 |
| `assets/css/custom.css` | 首屏渐变、中文行距和公式滚动等少量样式 |
| `layouts/archives.html` | 适配 Blowfish 的时间归档 |
| `layouts/search.html` | 兼容旧搜索入口 |
| `layouts/partials/` | 数学渲染和站点图标扩展 |
| `themes/blowfish/` | 官方主题子模块，不直接修改 |
| `.github/workflows/hugo.yml` | 构建、检查与免费部署 |

本次只完成主题应用：Landing 首屏、卡片文章、蓝色强调色、明暗切换、搜索和阅读功能。未创建空的项目栏目，未新增评论或统计。参考文档 `Blowfish_build.md` 是本地规划资料，未随本次部署上传。

## 正式构建与检查

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -BaseURL https://frodo2875.github.io/xinghao.github.io/
python .\scripts\check-output.py public https://frodo2875.github.io/xinghao.github.io/
```

`public/`、`.tools/`、`.preview/`、环境变量及浏览器验证产物均不提交。

## 依赖

- [Blowfish](https://github.com/nunocoracao/blowfish)：MIT，版本 v3.9.0，固定提交 `ebe683e9c2668972b71bc011e61e0004ff8e7689`。
- [Hugo](https://github.com/gohugoio/hugo)：Apache-2.0，版本由 `.hugo-version` 指定。
- [MathJax](https://github.com/mathjax/MathJax)：Apache-2.0，本地保存版本 3.2.2。

第三方许可证保留在对应目录。本站文章未统一指定开源许可证。
