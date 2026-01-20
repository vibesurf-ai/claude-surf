# Claude-Surf: 一个用于控制浏览器和实时预览的 Claude Code 插件
[![Discord](https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white)](https://discord.gg/86SPfhRVbk)
[![WeChat](https://img.shields.io/badge/WeChat-Group-07C160?logo=wechat&logoColor=white)](#-join-our-community)
[![WarmShao](https://img.shields.io/twitter/follow/warmshao?style=social)](https://x.com/warmshao)


[English](README.md) | [简体中文](README_zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 概述

Claude-Surf 是一个 Claude Code 插件，将 Claude 与 [VibeSurf](https://github.com/vibesurf-ai/VibeSurf) 连接，实现强大的浏览器自动化和网页交互能力。

### 你可以做什么

- **浏览器控制** - 导航网站、与元素交互
- **AI 技能** - 搜索、爬取、提取数据、总结内容
- **工作流** - 执行预构建的自动化工作流
- **应用集成** - Gmail、GitHub、Slack，以及通过 Composio/MCP 集成的 100+ 应用
- **Browser-Use 代理** - 使用 AI 子代理进行并行多任务自动化

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
  -v ./data:/data \
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


## 工作原理

此插件使用 **Claude Code 的技能系统** 和 SessionStart 钩子：

1. **会话启动**：钩子检查 VibeSurf 健康状态并注入 surf 技能内容
2. **自动检测**：Claude 自动为浏览器/自动化任务加载 surf 技能
3. **直接 API 访问**：Claude 可以直接调用 VibeSurf 的 HTTP API

**无需构建过程** - 纯 Markdown 技能 + 最小化 JavaScript。

## 技能概览

插件提供以下专业化技能：

### AI 技能
| 技能 | 用途 |
|------|------|
| `search` | AI 驱动的网页搜索 |
| `fetch` | 将 URL 内容提取为结构化 Markdown |
| `js_code` | 自动生成 JS 提取列表/表格 |
| `crawl` | 使用 LLM 提取页面内容 |
| `summary` | 总结网页 |
| `finance` | 来自 Yahoo Finance 的股票数据 |
| `trend` | 热门新闻 |
| `screenshot` | 页面截图 |

### 浏览器技能
| 技能 | 用途 |
|------|------|
| `browser` | 直接控制（导航、点击、输入等） |
| `browser-use` | AI 多步骤自动化 |

### 集成技能
| 技能 | 用途 |
|------|------|
| `website-api` | 小红书、微博、知乎、抖音、YouTube |
| `workflows` | 预构建的自动化序列 |
| `integrations` | Gmail、GitHub、Slack、100+ 应用 |

## 快速参考

| 目标 | 使用技能 |
|------|---------|
| 搜索网页 | `search` |
| 获取 URL 内容 | `fetch` |
| 提取价格/产品 | `js_code` |
| 总结页面 | `summary` |
| 股票数据 | `finance` |
| 导航/点击 | `browser` |
| 填写表单 | `browser-use` |
| 发送邮件 | `integrations` |

## 最佳实践

### Browser-Use 代理
- 以任务为导向：描述你想要什么，而不是如何做
- 对独立任务使用并行
- 信任代理来确定步骤

### 直接浏览器控制
- 总是先调用 `get_browser_state`
- 使用浏览器状态中的元素索引
- Tab ID 是目标 ID 的最后 4 个字符

### AI 技能
- `js_code` 用于列表/数组（产品、帖子、列表）
- `crawl` 用于单页内容提取
- `search` 用于 AI 生成的摘要

## 故障排除

| 错误 | 解决方案 |
|------|---------|
| VibeSurf 未运行 | 运行 `vibesurf` |
| 找不到元素 | 先调用 `get_browser_state` |
| 找不到操作 | 使用 VibeSurf API 检查 |
| 超时 | 简化任务或增加超时时间 |

## 项目结构

```
claude-surf/
├── .claude-plugin/
│   ├── plugin.json          # 插件元数据
│   └── marketplace.json     # Marketplace 配置
├── hooks/
│   ├── hooks.json           # 钩子配置
│   ├── session-start.sh     # 健康检查 + 技能注入
│   └── run-hook.cmd         # 跨平台包装器
├── skills/
│   ├── surf/                # 主入口点
│   ├── search/              # AI 网页搜索
│   ├── fetch/               # 将 URL 内容提取为 Markdown
│   ├── js_code/             # 结构化数据提取
│   ├── crawl/               # 页面内容提取
│   ├── summary/             # 页面总结
│   ├── finance/             # 股票数据
│   ├── trend/               # 热门新闻
│   ├── screenshot/          # 截图
│   ├── browser/             # 直接浏览器控制
│   ├── browser-use/         # AI 自动化
│   ├── website-api/         # 平台 API
│   ├── workflows/           # 预构建工作流
│   └── integrations/        # 外部应用
├── README.md
├── README_zh.md
├── CLAUDE.md
└── LICENSE
```

## 架构说明

此插件遵循 **superpowers** 架构模式：

- **无构建系统** - 纯 Markdown 技能，无编译
- **基于钩子的注入** - SessionStart 注入技能内容
- **前置元数据驱动** - `description` 字段定义触发器
- **直接 API 访问** - Claude 直接调用 VibeSurf HTTP API（无需客户端包装器）

## 贡献

欢迎贡献！这是一个 Markdown 优先的插件 - 直接编辑技能并测试。

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

## 致谢

- [VibeSurf](https://github.com/vibesurf-ai/VibeSurf) - 浏览器自动化框架
