# Claude-Surf: 一个用于控制浏览器和实时预览的 Claude Code 插件
[![Discord](https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white)](https://discord.gg/86SPfhRVbk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WarmShao](https://img.shields.io/twitter/follow/warmshao?style=social)](https://x.com/warmshao)


[English](README.md) | [简体中文](README_zh.md)

## 概述

Claude-Surf 是一个 Claude Code 插件，将 Claude 与 [VibeSurf](https://github.com/vibesurf-ai/VibeSurf) 连接，实现强大的浏览器自动化和网页交互能力。

### 你可以做什么

- **浏览器控制** - 导航网站、与元素交互
- **VibeSurf 技能** - 搜索、爬取、提取数据、总结内容、获取 URL 内容
- **工作流** - 执行预构建的自动化工作流
- **应用集成** - Gmail、GitHub、Slack，以及通过 Composio/MCP 集成的 100+ 应用
- **Browser-Use 代理** - 使用 AI 子代理进行并行多任务自动化
- **平台 API** - 支持小红书、YouTube、抖音、微博、知乎等平台的 API 数据调用

## 前置条件

### 1. Claude Code
安装 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI。

### 2. VibeSurf

选择以下安装方法之一：

#### 本地安装（控制本地浏览器）
使用此方法控制您的本地浏览器：

```bash
# 安装 VibeSurf
uv tool install vibesurf

# 启动 VibeSurf 服务器
vibesurf
```

#### Docker 安装（控制沙盒浏览器）
使用此方法在容器中控制沙盒浏览器：

```bash
# 拉取镜像
docker pull ghcr.io/vibesurf-ai/vibesurf:latest

# 运行容器
docker run --name vibesurf -d --restart unless-stopped \
  -p 9335:9335 \
  -p 6080:6080 \
  -p 5901:5901 \
  -v ./vibesurf_data:/data \
  -e IN_DOCKER=true \
  -e VIBESURF_WORKSPACE=/data/vibesurf_workspace \
  -e RESOLUTION=1440x900x24 \
  -e VNC_PASSWORD=vibesurf \
  --shm-size=4g \
  --cap-add=SYS_ADMIN \
  ghcr.io/vibesurf-ai/vibesurf:latest
```

VibeSurf 必须运行才能使 Claude-Surf 工作。

**配置**：默认情况下，Claude-Surf 连接到 `http://127.0.0.1:9335`。您可以在启动 Claude Code 之前通过设置 `VIBESURF_ENDPOINT` 环境变量来自定义：

```bash
# Linux/macOS
export VIBESURF_ENDPOINT=http://192.168.1.100:9335

# Windows PowerShell
$env:VIBESURF_ENDPOINT="http://192.168.1.100:9335"

# Windows CMD
set VIBESURF_ENDPOINT=http://192.168.1.100:9335
```

## 安装

### 从 GitHub Marketplace 安装（推荐）

```bash
# 添加 marketplace
/plugin marketplace add vibesurf-ai/claude-surf

# 安装插件
/plugin install surf
```

### 本地安装

```bash
# 克隆仓库
git clone https://github.com/vibesurf-ai/claude-surf
cd claude-surf

# 添加到 marketplace 并安装
/plugin marketplace add ./
/plugin install surf
```

**重启 Claude Code** 以加载插件。

## 快速开始

安装完成后，尝试一个简单的示例：

```
surf search AI news today
```

这将使用 VibeSurf 搜索今天的 AI 新闻并返回摘要结果。

## VSCode 集成与实时浏览器预览

使用 Docker 安装时，您可以在 VSCode 中直接控制和预览浏览器，同时使用 Claude Code：

### 打开内部浏览器

1. 打开命令面板：
   - Windows/Linux: `Ctrl + Shift + P`
   - macOS: `Cmd + Shift + P`
2. 输入并选择：`Simple Browser: Show`
3. 输入 URL：`http://127.0.0.1:6080/`
4. 按回车

### 调整 VNC 屏幕大小

1. 点击 VNC 查看器左侧边栏的**设置**图标（齿轮按钮）
2. 在 **Scaling Mode** 下，选择 **Local Scaling**
3. 这将允许 VNC 屏幕自动调整大小以适应窗口

现在您可以在 VSCode 中实时看到 Claude Code 控制浏览器！

### 演示视频

<video src="https://github.com/user-attachments/assets/e46099cf-0e10-4088-8f10-b9d175f44f77" controls="controls">Your browser does not support playing this video!</video>


## 贡献

欢迎贡献！这是一个 Markdown 优先的插件 - 直接编辑技能并测试。

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

## 致谢

- [VibeSurf](https://github.com/vibesurf-ai/VibeSurf) - 浏览器自动化框架
