---
title: "写作指南：用 Markdown 留下一篇好笔记"
date: 2026-10-21T08:00:00+08:00
draft: false
description: "标题、代码、图片和草稿，一份简洁的博客写作入门。"
summary: "从新建文章到插入代码与图片，了解这个博客的日常写作方式。让内容留在 Markdown 中，把排版交给 Hugo。"
categories: [技术笔记]
tags: [Markdown, Hugo, 示例]
---

这是博客的写作入门示例。文章保存在 `content/posts/` 中，每篇文章都是普通的 Markdown 文件。

## 新建一篇文章

在项目根目录打开 PowerShell：

```powershell
.\.tools\hugo\hugo.exe new content posts/my-first-note/index.md
```

新文章默认是草稿。预览时加入 `-Drafts` 参数，准备发布时把文件顶部的 `draft` 改成 `false`。

## 用标题组织思路

文章标题由文件顶部的 `title` 决定。正文从二级标题 `##` 开始，三级标题 `###` 用于更细的章节，目录会自动生成。

> 先写清楚问题，再记录尝试，最后留下结论和仍未解决的疑问。

## 展示代码和图片

代码块标记语言后会自动高亮，右上角可以复制代码：

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

推荐每篇文章使用一个文件夹，例如 `content/posts/my-first-note/index.md`，将图片放在同一目录，用 `![图片说明](photo.jpg)` 引用。

## 发布前检查

| 项目 | 检查内容 |
| --- | --- |
| 标题与摘要 | 能否让读者理解文章主题 |
| 分类与标签 | 是否便于以后查找 |
| 代码与公式 | 是否显示正确 |
| 草稿状态 | `draft: false` 才会出现在正式构建中 |

更多本地运行和部署说明，见项目根目录的 `README.md`。
