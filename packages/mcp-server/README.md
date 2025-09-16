# JetLinks Web MCP Server

JetLinks Web组件库的MCP (Model Context Protocol) 服务器，让AI助手能够智能地了解和使用你的Vue组件。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 功能特性

- **组件信息查询** - 获取组件的详细信息、props、events等
- **智能代码生成** - 自动生成组件使用示例
- **提示词管理** - 内置开发规范和最佳实践提示词
- **模块化架构** - 清晰的代码结构，易于维护和扩展

## 📦 快速开始

### 通过 npm 安装

```bash
npm install -g @jetlinks-web/mcp-server
```

### 本地开发

```bash
# 克隆项目
git clone https://github.com/jetlinks/jetlinks-project-ui-cli.git
cd jetlinks-project-ui-cli/packages/mcp-server

# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试
npm test
```

## 🔧 使用方法

### 在 Claude Desktop 中配置

这是推荐的使用方式，可以让Claude直接调用MCP服务器：

#### 1. 配置文件路径
- **macOS**: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### 2. 添加配置
```json
{
  "mcpServers": {
    "jetlinks-ui": {
      "command": "node",
      "args": ["/path/to/your/jetlinks-project-ui-cli/packages/mcp-server/dist/index.js"]
    }
  }
}
```

#### 3. 重启 Claude Desktop
配置完成后重启 Claude Desktop，你就可以在对话中直接询问组件相关问题了！

### 命令行直接使用

```bash
# 全局安装后直接使用
jetlinks-web-mcp

# 或者在项目目录中
npm start

# 或者直接运行
node dist/index.js
```

## 🧪 本地测试

### 运行完整测试套件

```bash
npm test
```

测试结果示例：
```
🚀 开始JetLinks UI MCP服务器测试
================================

🧪 测试: 列出所有工具
✅ 列出所有工具: 通过
   找到 8 个工具

🧪 测试: 列出所有组件
✅ 列出所有组件: 通过
   响应预览: 找到以下可用组件:

📊 测试结果
=============
✅ 通过: 8
❌ 失败: 0
📊 总计: 8

🎉 所有测试通过！MCP服务器工作正常。
```

### 手动测试工具

你可以使用以下命令手动测试特定功能：

```bash
# 列出所有可用工具
npm run test:manual

# 或者手动发送JSON请求
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js
```

### 测试特定功能

```bash
# 获取所有组件和工具函数列表
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_all_components","arguments":{}}}' | node dist/index.js

# 获取AutoComplete组件使用示例
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"AutoComplete"}}}' | node dist/index.js

# 获取LocalStore工具函数使用示例
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"LocalStore"}}}' | node dist/index.js

# 获取useRequest使用示例
echo '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"useRequest"}}}' | node dist/index.js
```

## 📋 完整使用示例

### 使用场景示例

配置完成后，你可以在Claude Desktop中直接提问：

**查询组件库资源：**
```
用户: "JetLinks UI库中有哪些可用的组件和工具函数？"
Claude: 我来帮您查询JetLinks UI库中的所有资源...
[调用 get_all_components 工具]
```

**获取使用示例：**
```
用户: "帮我写一个使用ProTable组件的示例"
Claude: 我来为您获取ProTable组件的详细使用示例...
[调用 get_usage_examples 工具，参数: name="ProTable"]
```

**获取工具函数示例：**
```
用户: "LocalStore工具类怎么使用？"
Claude: 让我为您获取LocalStore的详细使用指南...
[调用 get_usage_examples 工具，参数: name="LocalStore"]
```

**获取开发指南：**
```
用户: "JetLinks组件库的开发规范是什么？"
Claude: 让我为您获取JetLinks组件库的开发指南...
[调用 MCP prompts 功能获取 "jetlinks-component-helper"]
```

### API 调用流程

1. **查询可用工具**
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js
```

2. **获取所有组件和工具函数**
```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_all_components","arguments":{}}}' | node dist/index.js
```

3. **获取特定组件使用示例**
```bash
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"ProTable"}}}' | node dist/index.js
```

4. **获取工具函数使用示例**
```bash
echo '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"useRequest"}}}' | node dist/index.js
```

## 🛠️ 可用工具

### 组件和工具函数相关

#### `get_all_components`
获取所有可用的组件和工具函数列表
```bash
# 参数：无
# 返回：完整的组件和工具函数清单，包含数量统计
```

#### `get_usage_examples`
获取指定组件或工具函数的使用示例
```bash
# 参数：
# - name: 组件名称或工具函数名称 (如: "AutoComplete", "ProTable", "LocalStore", "useRequest")
# 返回：详细的使用指南，包含代码示例和API参数说明
```

### 提示词相关

JetLinks UI MCP Server 内置了强大的提示词系统，可以通过MCP协议的prompts功能获取开发指导。

#### 可用提示词
- **jetlinks-component-helper**: JetLinks UI组件库使用指南和代码生成助手

可通过MCP客户端直接调用prompts功能获取这些提示词内容。

## 📝 开发指南获取

JetLinks UI MCP Server 内置了 **jetlinks-component-helper** 提示词，包含：

- JetLinks UI组件库的完整使用指南
- 所有组件的详细API和使用示例
- 工具函数的使用方法
- 开发最佳实践和规范

可通过MCP客户端的prompts功能直接获取。

## 🧪 测试

运行完整的测试套件：

```bash
npm test
```

测试包括：
- ✅ 工具列表获取
- ✅ 组件信息查询  
- ✅ 代码示例生成
- ✅ 组件搜索
- ✅ 提示词管理
- ✅ 错误处理

## 📖 开发指南

### 添加新的工具

1. 在 `src/tools/` 目录下创建新的工具函数
2. 在 `src/index.ts` 中注册新工具
3. 添加对应的测试用例
4. 更新README文档

### 添加新的提示词

1. 在 `prompts/` 目录下创建新的markdown文件
2. 文件命名使用kebab-case格式
3. 包含标题、目的和具体内容
4. 服务器会自动检测和加载

### 组件Schema

组件信息从Storybook配置中自动生成，包含：
- 组件基本信息 (name, title, description)
- Stories配置
- ArgTypes定义
- 实际Vue文件解析 (props, events, slots)

### 构建和发布

```bash
# 生成schema
npm run gen-schema

# 构建项目
npm run build

# 运行测试
npm test

# 启动开发服务器
npm run dev
```

## 🔍 故障排除

### 快速诊断

运行诊断命令检查服务器状态：
```bash
# 检查构建状态和运行测试
npm test

# 手动验证工具列表
npm run test:manual
```

### 常见问题及解决方案

#### 1. Claude Desktop 无法连接到 MCP 服务器

**问题现象：** Claude Desktop中没有显示JetLinks UI相关功能

**解决方案：**
```bash
# 检查Node.js版本 (需要 >= 16.0.0)
node --version

# 检查文件路径是否正确
ls -la /path/to/your/jetlinks-project-ui-cli/packages/mcp-server/dist/index.js

# 确认配置文件格式正确
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 重启 Claude Desktop
```

#### 2. 组件信息不完整或过时

**问题现象：** 获取的组件信息不准确或缺失

**解决方案：**
```bash
# 重新生成schema文件
npm run gen-schema

# 重新构建项目
npm run build

# 运行测试验证
npm test
```

#### 3. 测试失败

**问题现象：** `npm test` 命令执行失败

**解决方案：**
```bash
# 确保项目已构建
npm run build

# 检查dist目录
ls -la dist/

# 单独测试工具列表
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js

# 检查详细错误信息
npm test 2>&1 | tee test.log
```

#### 4. 权限问题

**问题现象：** 无法读取文件或执行脚本

**解决方案：**
```bash
# 检查文件权限
ls -la dist/index.js

# 确保执行权限
chmod +x dist/index.js

# 检查目录权限
ls -la prompts/
```

### 调试模式

启用详细日志输出：
```bash
# 设置环境变量启用调试
DEBUG=mcp:* node dist/index.js

# 或者使用开发模式
npm run dev
```

### 验证安装

完整验证流程：
```bash
# 1. 检查依赖
npm list

# 2. 构建项目
npm run build

# 3. 运行测试
npm test

# 4. 手动测试一个工具
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_components","arguments":{}}}' | node dist/index.js
```

### 获取帮助

如果问题仍然存在：

1. **查看日志**：检查 Claude Desktop 的日志文件
2. **提交 Issue**：在 GitHub 仓库提交详细的错误报告
3. **社区支持**：在项目讨论区寻求帮助

```bash
# 收集诊断信息
echo "Node版本: $(node --version)"
echo "npm版本: $(npm --version)"
echo "操作系统: $(uname -a)"
npm test > diagnostic.log 2>&1
```

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request

## 📚 相关链接

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/download)
- [JetLinks项目文档](https://github.com/jetlinks/jetlinks-project-ui-cli)

---

Made with ❤️ by JetLinks Team
