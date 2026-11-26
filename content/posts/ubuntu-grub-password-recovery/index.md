---
title: "Ubuntu 22.04 服务器忘记密码：通过 GRUB 恢复登录"
date: 2026-11-25T18:47:00+08:00
draft: false
slug: ubuntu-grub-password-recovery
description: "Ubuntu 22.04 控制台实操记录，按顺序整理 root 密码重置、恢复启动和 sudo 权限验证的命令。"
summary: "从现场终端记录出发，依次执行 mount、passwd、sync 和 exec，最后检查日常账号的 sudo 权限。"
categories: [技术笔记]
tags: [Linux, Ubuntu, GRUB, 服务器运维]
showTableOfContents: true
---

记录一次 Ubuntu 22.04 服务器的本地控制台恢复。现场截图从 GRUB 启动后的 `root@(none):/#` 开始，进入临时 shell 前的按键和启动参数没有记录。通过 Ubuntu 的恢复菜单也可以进入 root shell，菜单路径是 **Advanced options for Ubuntu → (recovery mode) → root**。 [Ubuntu 恢复模式](https://wiki.ubuntu.com/RecoveryMode)

## 1. 挂载为可写，重置 root 密码

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

## 2. 状态查询卡在密码输入界面

现场接着输入了 `passwd -S root`，屏幕却显示：

```text
Changing password for -S.
New password:
```

`-S` 原本用于查询状态。这次终端已经在等待密码输入，`Ctrl+C` 也没有退出。当时对话给出的退出办法是两次输入不同的临时内容，让确认失败，再等终端回到 `root@(none):/#`。只想确认恢复结果时，直接在正常启动后验证登录即可。

## 3. 同步磁盘，继续启动

回到命令提示符后，对话给出的两条命令：

```bash
sync
exec /sbin/init
```

这两条对应当时的临时启动 shell。若入口是 Ubuntu 的恢复菜单，执行 `exit` 返回菜单，再选择 `resume`。

系统起来后，在本地登录界面输入 `root` 和刚设置的密码。现场后续截图确认了 `root` 已登录。

## 4. 给日常账号补 sudo 权限并验证

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
