# Claude-Surf 本地测试指南

## 快速开始（推荐）

### 1. 构建插件

```bash
cd E:\AIBrowser\claude-surf\skills\surf
npm install
npm run build
```

### 2. 使用 --plugin-dir 加载测试

```bash
cd E:\AIBrowser\claude-surf
claude --plugin-dir .
```

### 3. 测试插件功能

在 Claude Code 会话中：

```
/surf                    # 列出所有可用 actions
/surf:get_browser_state  # 测试具体 action
/surf:navigate 谷歌首页  # 测试自然语言参数
```

## 方法对比

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| `--plugin-dir` | 快速、无需安装、修改后只需重启 | 每次启动都要指定 | 开发调试 |
| `marketplace add` | 一次安装、持久化 | 需要重新安装才能更新 | 正式使用 |

## Marketplace 安装方式（可选）

### 添加本地 marketplace

```bash
# 方式 1：在父目录中
cd E:\AIBrowser
/plugin marketplace add ./claude-surf

# 方式 2：在项目目录中
cd E:\AIBrowser\claude-surf
/plugin marketplace add .
```

### 安装插件

```bash
/plugin install claude-surf@claude-surf-marketplace
```

### 卸载和重新安装

```bash
/plugin uninstall claude-surf
/plugin install claude-surf@claude-surf-marketplace
```

## 验证插件结构

检查插件配置是否正确：

```bash
cd E:\AIBrowser\claude-surf
/plugin validate .
```

## 常用命令

```bash
# 列出已安装的插件
/plugin list

# 列出已添加的 marketplaces
/plugin marketplace list

# 构建并监听文件变化（开发模式）
cd skills/surf
npm run dev
```

## 开发工作流

1. **修改代码**
   ```bash
   # 编辑 skills/surf/commands/*.ts 或 client/*.ts
   ```

2. **自动构建**（如果使用 dev 模式）
   ```bash
   cd skills/surf
   npm run dev  # 监听文件变化，自动重新构建
   ```

3. **测试更新**
   - 重启 Claude Code（如果使用 `--plugin-dir`）
   - 或重新安装插件（如果使用 marketplace）

4. **验证功能**
   ```bash
   /surf  # 确认 actions 列表
   /surf:action_name  # 测试具体功能
   ```

## 前置条件

确保 VibeSurf 服务已启动：

```bash
# 检查 VibeSurf 是否运行
curl http://127.0.0.1:9335/health

# 如果未运行，启动 VibeSurf
vibesurf

# 如果未安装 VibeSurf
uv tool install vibesurf
```

## 调试技巧

### 查看插件日志

插件的 `console.log` 输出会显示在 Claude Code 的终端中。

### 检查 VibeSurf 连接

```bash
# 手动测试 VibeSurf API
curl http://127.0.0.1:9335/api/tool/search

# 测试具体 action 的参数
curl http://127.0.0.1:9335/api/tool/get_browser_state/params
```

### 验证插件加载

在 Claude Code 会话中：

```
/plugin list     # 应该看到 claude-surf
/surf           # 应该显示所有 actions
```

## 常见问题

### 1. `/plugin add` 失败

**错误**：`Invalid marketplace source format`

**原因**：`/plugin add` 命令不存在，应该使用 `/plugin marketplace add`

**解决**：使用 `claude --plugin-dir .` 或 `/plugin marketplace add .`

### 2. 插件未加载

**检查**：
- 确认 `npm run build` 成功
- 确认 `.claude-plugin/` 目录存在
- 运行 `/plugin validate .` 检查配置

### 3. VibeSurf 连接失败

**检查**：
- 运行 `vibesurf` 启动服务
- 访问 http://127.0.0.1:9335/health
- 检查 hooks.json 中的健康检查脚本

### 4. Actions 无法执行

**检查**：
- VibeSurf 是否运行
- Action 名称是否正确（运行 `/surf` 查看）
- 参数格式是否匹配（查看错误信息）

## 性能优化

### 开发模式下的快速迭代

```bash
# 终端 1：监听并自动构建
cd E:\AIBrowser\claude-surf\skills\surf
npm run dev

# 终端 2：启动 Claude Code
cd E:\AIBrowser\claude-surf
claude --plugin-dir .

# 修改代码后，重启终端 2 即可
```

### 减少构建时间

TypeScript 编译配置已优化（`skills/surf/tsconfig.json`），增量构建速度快。

## 发布前检查

```bash
# 1. 完整构建
cd skills/surf
npm run build

# 2. 验证插件
cd ../..
/plugin validate .

# 3. 测试所有主要功能
/surf
/surf:get_browser_state
/surf:navigate
/surf:skill_search

# 4. 检查文档同步
# - README.md
# - SKILL.md
# - CLAUDE.md
```
