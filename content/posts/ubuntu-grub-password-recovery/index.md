---
title: "Ubuntu 22.04 服务器忘记密码：通过 GRUB 恢复登录"
date: 2026-11-25T18:47:00+08:00
draft: false
slug: ubuntu-grub-password-recovery
description: "一次 Ubuntu 22.04 服务器密码恢复笔记，记录如何使用 GRUB 恢复模式重置本机账户密码，以及如何验证登录和 sudo 权限。"
summary: "先确认丢失的是本机密码还是 SSH 密钥，再通过 GRUB 恢复模式重置目标账户。正常启动后，用新会话验证登录和 sudo 权限。"
categories: [技术笔记]
tags: [Linux, Ubuntu, GRUB, 服务器运维]
showTableOfContents: true
---

一次 Ubuntu 22.04 服务器的密码恢复，前半段是在启动阶段找回登录权限，后半段是在系统正常启动后，确认日常账号还能用 `sudo`。中间有个容易误判的地方：终端已经提示密码更新成功，随后执行的状态查询却又进入了密码输入界面。

这篇把当时解决的问题整理成一套流程。原对话使用的是临时启动 shell，下面以 Ubuntu 的 GRUB 恢复菜单为例。文中的 `operator` 是示例用户名。

## 一、先确认要恢复什么

| 现场情况 | 处理方式 |
| --- | --- |
| 还有能登录的管理员账号 | 正常登录后执行 `sudo passwd operator`，服务器可以继续运行。 |
| 忘记本机账号密码，所有可用管理员账号都登不进去 | 确认能使用授权的物理、虚拟机或远程管理控制台，再安排重启进入恢复模式。 |
| 只有 SSH 私钥丢了，或 SSH 提示 `Permission denied (publickey)` | 通过已有的管理通道或云平台恢复功能更换公钥。此时要恢复的是 SSH 密钥。 |

生产机器重启前，先核对主机、维护窗口和备份或快照。**提前试一次控制台，确认能看到启动过程并输入按键。** 如果磁盘启用了 LUKS，提前准备获授权的解锁凭据。如果控制台无法进入 GRUB，或者 GRUB 要求额外认证，就走平台提供的救援入口。 [Ubuntu 恢复模式](https://wiki.ubuntu.com/RecoveryMode) · [Ubuntu Server 用户管理](https://documentation.ubuntu.com/server/how-to/security/user-management/)

## 二、通过 GRUB 恢复模式重置密码

1. 从已授权的控制台重启，在 GRUB 菜单中选择 `Advanced options for Ubuntu`，进入带 `(recovery mode)` 的启动项。菜单隐藏时，Ubuntu 文档给出的常见操作是 BIOS 启动按住 `Shift`，UEFI 启动尝试按 `Esc`。 [Ubuntu 恢复模式](https://wiki.ubuntu.com/RecoveryMode)
2. 选择 `root – Drop to root shell prompt`。进入恢复终端后，根文件系统通常是只读的，先重新挂载成可写，再确认目标账号并重置密码。若 `getent` 查不到账号，先核对用户名和账户来源。 [Ubuntu 恢复模式](https://wiki.ubuntu.com/RecoveryMode)

   ```bash
   mount -o remount,rw /
   getent passwd operator
   passwd operator
   ```

3. 按提示输两遍新密码。输入时屏幕不会显示字符，留意键盘布局和大小写。看到 `password updated successfully` 后，执行 `exit` 返回恢复菜单，选择 `resume` 继续启动。需要按正常启动项重新开机时，从恢复菜单或管理控制台发起正常重启。

Ubuntu 默认锁定 `root` 的密码登录。如果日常使用普通账号加 `sudo`，就恢复那个普通账号。明确需要恢复已经启用的本地 `root` 密码时，目标账号才是 `root`。 [Ubuntu Server 用户管理](https://documentation.ubuntu.com/server/how-to/security/user-management/)

## 三、启动后验证登录和 sudo

先从控制台用目标账号和新密码登录。账号原本应有管理员权限时，在**新登录的会话**里执行：

```bash
id -nG
sudo -k
sudo whoami
```

`id -nG` 能看到当前会话的用户组。默认配置下，`sudo whoami` 按提示输入当前账号的密码，输出 `root`，就说明这条提权路径可用。若账号按授权本应在 `sudo` 组，但查明组成员资格确实缺失，可由现有管理员补回：

```bash
sudo adduser operator sudo
id operator
```

补回后，退出目标账号的旧会话，重新登录再测。生产环境还应核对日常使用的 SSH 登录方式和业务服务是否恢复。 [Ubuntu Server 用户管理](https://documentation.ubuntu.com/server/how-to/security/user-management/)

## 四、这次对话里遇到的一个细节

原对话中，密码修改已经出现成功提示，随后尝试用 `passwd -S root` 查询状态时，终端显示了 `Changing password for -S`，接着提示输入新密码。从现有记录看，可以确定这次查询走进了密码修改流程，具体原因还无法确认。当时控制台里的 `Ctrl+C` 也没有按预期中断交互。

遇到类似情况，先看清终端是在等待命令，还是在等待密码输入。回到正常启动的系统后，再用 `sudo passwd -S operator` 检查状态，并通过实际登录确认结果。**密码更新提示、登录验证和 sudo 验证分别回答三个问题：密码有没有写入、账号能不能登录、账号能不能执行管理操作。**
