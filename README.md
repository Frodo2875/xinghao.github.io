# Xinghao's Blog

Hugo + PaperMod 个人博客。项目、便携环境和构建产物均保存在 `D:\code\Blog_gxh`。

- 线上地址：<https://frodo2875.github.io/xinghao.github.io/>
- 源码仓库：<https://github.com/Frodo2875/xinghao.github.io>

仓库名为 `xinghao.github.io`，属于账户 `Frodo2875` 的项目站，因此网址包含 `/xinghao.github.io/`。是否已上线以 GitHub Actions 的部署结果为准。

## 本地预览

```powershell
cd D:\code\Blog_gxh
powershell -ExecutionPolicy Bypass -File .\scripts\preview.ps1
```

访问 <http://localhost:1313/>，按 Ctrl+C 停止。显示草稿时在命令最后加 `-Drafts`。`Bypass` 只作用于这个 PowerShell 进程，不修改系统执行策略。

已经安装 Hugo Extended 0.158.0，位于 `.tools/hugo/hugo.exe`，不需要全局安装。新电脑先运行：

```powershell
git clone --recurse-submodules <你的仓库地址> Blog_gxh
cd Blog_gxh
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

安装脚本从 Hugo 官方发布页下载并验证 SHA256。版本统一由 `.hugo-version` 指定；主题子模块固定到 Git 记录中的提交，不随上游自动更新。

## 写文章

```powershell
.\.tools\hugo\hugo.exe new content posts/my-note/index.md
```

编辑 `content/posts/my-note/index.md`：填写标题、摘要、分类和标签，完成后改为 `draft: false`。图片放同一目录，用 `![说明](photo.jpg)` 引用。正文从 `##` 开始，自动生成目录。

数学文章加 `math: true`，行内公式使用 `$x^2$`，独立公式使用 `$$...$$`。MathJax 3.2.2 已随站点保存，不需要外部 CDN。搜索使用主题自带的 Fuse.js 和首页 JSON，正式发布只索引非草稿文章。

首页有三篇初始文章，其中数学、Markdown 文章是功能示例，可修改或删除。关于页没有虚构履历，位于 `content/about.md`。首页介绍和导航位于 `hugo.yaml`。

## 免费发布：推荐 GitHub Pages

本项目使用 GitHub Pages 和仓库自带的 Actions 工作流。无需购买服务器或域名，公开仓库可使用 GitHub Free 的 Pages。以下是新建或迁移仓库的操作说明；当前项目已配置实际 `baseURL`。

1. 在自己的 GitHub 账户创建空的公开仓库。希望使用 `https://用户名.github.io/`，仓库名应为 `用户名.github.io`；普通仓库则使用 `https://用户名.github.io/仓库名/`。
2. 将 `hugo.yaml` 的 `baseURL` 从示例地址改成实际网址，确保以 `/` 结尾。
3. 审阅要公开的文章后，在项目目录运行以下命令，替换真实仓库地址：

```powershell
git add .
git commit -m "Create Xinghao blog"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

4. 仓库 `Settings → Pages → Build and deployment → Source` 选择 **GitHub Actions**。
5. 若首次推送时尚未启用 Pages，在 Actions 中重新运行工作流。成功后由工作流显示实际访问网址。

部署工作流自动使用 Pages 返回的根地址或项目子路径，因此支持两种仓库形式。PR 只构建检查，主分支才部署。发布后的更新流程就是写 Markdown、提交、推送。

本地测试正式构建：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -BaseURL https://你的用户名.github.io/
```

产物在 `public/`，不提交到源码仓库。`.tools/`、日志、环境变量文件也已忽略。

可用 Python 标准库检查生成页面中的内部链接和静态资源：

```powershell
python .\scripts\check-output.py public https://你的用户名.github.io/
```

根路径和项目子路径的构建、链接检查均已通过。当前环境未能启动浏览器，因此视觉效果、公式实际显示和点击交互仍需打开本地预览确认，详见 `docs/IMPLEMENTATION.md`。

## 后续托管与功能

- 首选 GitHub Pages：和当前 Hugo + GitHub Actions 配置直接配合，免费公开仓库即可使用。
- 备选 Cloudflare Pages：可作为静态站托管选项，接入前按官方当时的套餐与 Hugo 构建环境核实；本次未创建账户或部署。
- 评论暂未启用。等你提供自己的 GitHub 仓库后，可以接入 Giscus；不能使用参考作者的评论配置。
- 已添加 GitHub 个人主页；邮箱等链接可按需补充。

保留 PaperMod 原有的简洁黑白风格，仅改善中文行距与公式横向滚动。暖白纸张、蓝色强调色或项目展示等个性化调整，待你确认后实施。

## 依赖与参考

- [Hugo](https://github.com/gohugoio/hugo)，Apache-2.0，版本见 `.hugo-version`。
- [PaperMod](https://github.com/adityatelange/hugo-PaperMod)，MIT，许可证保留在主题目录。
- [MathJax](https://github.com/mathjax/MathJax)，3.2.2，Apache-2.0，许可证保留在 `static/vendor/mathjax/`。
- [参考博客](https://minjieblog.github.io/dase-course/math-homework/)，仅参考功能与结构，未复制作者文章、个人资料或评论标识。
- [Hugo 官方 Pages 部署指南](https://gohugo.io/host-and-deploy/deploy-to-github-pages/)
- [GitHub Pages 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

本站新增内容未统一指定开源许可证；公开源代码不自动授予他人对你文章的任意使用权。
