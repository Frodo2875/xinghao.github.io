---
title: "Ubuntu 22.04 服务器忘记密码：通过 GRUB 恢复登录"
date: 2026-11-25T18:47:00+08:00
draft: false
slug: ubuntu-grub-password-recovery
description: "Ubuntu 22.04 控制台实操记录，按顺序整理 root 密码重置、恢复启动和 sudo 权限验证的命令。"
summary: "从服务器重启讲起，进入 GRUB 临时 shell 后按现场记录重置密码，最后验证本地登录和 sudo 权限。"
categories: [技术笔记]
tags: [Linux, Ubuntu, GRUB, 服务器运维]
showTableOfContents: true
---

这次在 Ubuntu 22.04 服务器的本地控制台恢复 `root` 登录。第 1、2 步参考 Ubuntu 和 GNU GRUB 文档补齐。现场截图从 `root@(none):/#` 开始，确认了后续的挂载和改密命令。

## 1. 重启服务器，进入 GRUB

1. 打开服务器的物理控制台，或已授权的远程管理控制台。生产环境先确认维护窗口，再通过控制台发起重启。
2. 厂商标志消失后、Ubuntu 启动画面出来前，BIOS 启动时按住 **Shift**，UEFI 启动时连续按 **Esc**，直到出现 GRUB 菜单。如果已经进入 Ubuntu 登录界面，就重新开机再试。
3. 用方向键选中平时使用的 **Ubuntu** 启动项，按 **E** 打开编辑界面。 [Ubuntu 恢复模式](https://wiki.ubuntu.com/RecoveryMode) · [GNU GRUB 手册](https://www.gnu.org/software/grub/manual/grub/html_node/Menu-entry-editor.html)

## 2. 临时启动到 shell

1. 找到以 `linux` 开头的内核参数行，把光标移到这条逻辑行的末尾，先加一个空格，再追加：

   ```text
   init=/bin/bash
   ```

2. 保留原来的内核和磁盘参数，包括已有的 `ro`。下一步进入 shell 后再用现场命令把根文件系统切成可写。
3. 按 **Ctrl+X** 用这次编辑的参数启动。看到类似 `root@(none):/#` 的提示符后，再执行下一节。GRUB 菜单里的编辑仅用于本次启动。 [Ubuntu 密码恢复](https://help.ubuntu.com/community/LostPassword) · [GNU GRUB 手册](https://www.gnu.org/software/grub/manual/grub/html_node/Menu-entry-editor.html)

## 3. 挂载为可写，重置 root 密码

现场执行：

```bash
mount -o remount,rw /
passwd root
```

同一个新密码输入两遍。现场屏幕显示：

```text
New password:
Retype new password:
passwd: password updated successfully
```

## 4. 状态查询卡在密码输入界面

现场接着输入了 `passwd -S root`，屏幕却显示：

```text
Changing password for -S.
New password:
```

`-S` 原本用于查询状态。这次终端已经在等待密码输入，`Ctrl+C` 也没有退出。当时对话给出的退出办法是两次输入不同的临时内容，让确认失败，再等终端回到 `root@(none):/#`。只想确认恢复结果时，直接在正常启动后验证登录即可。

## 5. 同步磁盘，继续启动

回到命令提示符后，对话给出的两条命令：

```bash
sync
exec /sbin/init
```

`sync` 把待写入的数据同步到磁盘，`exec /sbin/init` 让正常的系统初始化接管当前启动。

系统起来后，在本地登录界面输入 `root` 和刚设置的密码。现场后续截图确认了 `root` 已登录。

## 6. 给日常账号补 sudo 权限并验证

如果该账号本就应有管理权限，在 `root` 会话中执行。下面把现场用户名替换为 `operator`：

```bash
usermod -aG sudo operator
id operator
```

`-aG` 会追加用户组，保留原有组。看到 `sudo` 后，以 `operator` 重新登录，再执行：

```bash
sudo whoami
```

如果提示输入密码，输入 `operator` 自己的密码。预期输出为 `root`。这一步要在普通账号的新会话里验证。 [Ubuntu Server 用户管理](https://documentation.ubuntu.com/server/how-to/security/user-management/)
