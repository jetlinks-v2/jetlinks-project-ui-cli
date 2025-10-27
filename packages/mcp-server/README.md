# JetLinks Web MCP Server

JetLinks Web组件库的MCP (Model Context Protocol) 服务器，让AI助手能够智能地了解和使用你的Vue组件。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 功能特性

- **多源组件资源管理** - 统一管理JetLinks组件库、Ant Design Vue组件库、项目组件和工具函数
- **智能组件查询** - 提供详细的组件API参数、使用示例和源代码访问
- **开发规范提示词** - 内置Vue 3 + TypeScript + Ant Design Vue开发规范和最佳实践
- **自动化组件扫描** - 自动扫描项目中的组件和工具函数，实时同步
- **类型安全支持** - 基于TypeScript实现，提供完整的类型定义和API解析

## 📦 安装使用

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

## 🔧 配置使用

### 在 Claude Desktop 中配置

#### 1. 配置文件路径
- **macOS**: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### 2. 添加配置
```json
{
  "mcpServers": {
    "@jetlinks-web/mcp-server": {
      "command": "npx",
      "args": ["@jetlinks-web/mcp-server"]
    }
  }
}
```

#### 3. 重启 Claude Desktop
配置完成后重启 Claude Desktop，你就可以在对话中直接使用组件库相关功能了！

### 命令行直接使用

```bash
# 全局安装后直接使用
jetlinks-web-mcp

# 或者在项目目录中
npm start

# 或者直接运行
node dist/index.js
```

## 🛠️ 核心功能

### 1. 资源管理系统

MCP服务器自动注册以下资源：

- **JetLinks 组件库** (`jetlinks://components`) - 脚手架提供的UI组件及API参数
- **JetLinks 工具函数库** (`jetlinks://utils`) - 脚手架提供的工具函数及参数说明
- **Ant Design Vue 组件库** (`antdv://components`) - 自动解析的ANTDV组件类型定义
- **项目组件库** (`project://components`) - 自动扫描项目src/components目录下的组件
- **项目工具函数库** (`project://utils`) - 自动扫描项目src/utils目录下的函数文件

### 2. 核心工具函数

#### `get_all_resources`
获取所有已注册的资源信息
```bash
# 无参数
# 返回：完整的资源清单，包含数量统计和详细信息
```

#### `get_component_details`
获取指定组件的详细信息
```bash
# 参数：
# - componentName: 组件名称 (如: "AutoComplete", "ProTable")
# - source: 组件来源 ("jetlinks", "antdv", "project")
# 返回：详细的组件信息，包含API参数、使用示例、源代码等
```

#### `get_util_details`
获取指定工具函数的详细信息
```bash
# 参数：
# - utilName: 工具函数名称 (如: "LocalStore.set", "useRequest")
# - source: 函数来源 ("jetlinks", "project")
# 返回：详细的函数信息，包含参数说明、返回值、使用示例等
```

### 3. 开发规范提示词

#### `development_guidelines`
Vue 3 + Ant Design Vue 开发规范提示词
```bash
# 参数：
# - task_type: 开发任务类型 (可选)
# - component_name: 组件名称 (可选)
# 返回：针对性的开发规范和最佳实践指导
```

## 📋 使用示例

### 在Claude Desktop中的使用场景

**查询所有可用资源：**
```
用户: "JetLinks项目中有哪些可用的组件和工具函数？"
Claude: 我来帮您查询所有可用的资源...
[调用 get_all_resources 工具]
```

**获取组件详细信息：**
```
用户: "ProTable组件怎么使用？有哪些参数？"
Claude: 我来为您获取ProTable组件的详细信息...
[调用 get_component_details 工具，参数: componentName="ProTable", source="jetlinks"]
```

**获取工具函数信息：**
```
用户: "LocalStore工具类有哪些方法？"
Claude: 让我为您获取LocalStore的详细使用指南...
[调用 get_util_details 工具，参数: utilName="LocalStore.set", source="jetlinks"]
```

**获取开发规范：**
```
用户: "请遵循JetLinks的开发规范来实现一个表单组件"
Claude: 我来为您获取JetLinks的开发规范...
[调用 development_guidelines 提示词，参数: task_type="form"]
```

### API 调用示例

```bash
# 1. 查询所有资源
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_all_resources","arguments":{}}}' | node dist/index.js

# 2. 获取AutoComplete组件详情
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_component_details","arguments":{"componentName":"AutoComplete","source":"jetlinks"}}}' | node dist/index.js

# 3. 获取LocalStore工具函数详情
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_util_details","arguments":{"utilName":"LocalStore.set","source":"jetlinks"}}}' | node dist/index.js
```

## 🧪 测试

### 运行完整测试套件

```bash
npm test
```

测试结果示例：
```
🚀 正在启动 JetLinks MCP 服务器...
📦 项目: @jetlinks-web/mcp-server v1.0.0
🔧 技术栈: vue 3.5.x + vite 7.x + ant-design-vue 4.x
📁 管理工具: Turborepo
✅ MCP 服务器启动成功!

=== JetLinks 组件库 ===
已注册 18 个组件

=== JetLinks 工具函数库 ===
已注册 39 个工具函数

🎉 所有测试通过！MCP服务器工作正常。
```

### 手动测试

```bash
# 测试工具列表
npm run test:manual

# 或者手动发送请求
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js
```

## 🔍 技术架构

### 核心技术栈
- **MCP SDK**: `@modelcontextprotocol/sdk` - Model Context Protocol 实现
- **TypeScript**: 完整的类型安全支持
- **Zod**: 参数验证和类型定义
- **Node.js**: 服务器运行环境

### 关键实现特性

1. **多源资源整合**: 统一管理来自不同源的组件和工具函数
2. **TypeScript类型解析**: 自动解析Ant Design Vue的类型定义文件
3. **文件系统扫描**: 实时扫描项目文件变化
4. **控制台友好输出**: 提供清晰的日志和状态信息
5. **错误处理机制**: 完善的错误捕获和处理

### 文件结构
```
src/
├── index.ts          # MCP服务器主入口
├── tool.ts           # 工具函数实现
└── docs/
    ├── prompts.md     # 提示词文档
    └── resources.ts   # 资源数据定义
```

## 🔧 开发指南

### 添加新的资源类型

1. 在 `src/index.ts` 中注册新的资源：
```typescript
server.registerResource(
    "new-resource",
    "new://resource",
    {
        title: "新资源类型",
        description: "新资源类型的描述",
    },
    async () => {
        // 资源数据获取逻辑
    }
);
```

2. 在 `src/tool.ts` 中添加相应的工具函数

### 添加新的工具函数

1. 在 `src/index.ts` 中注册新工具：
```typescript
server.registerTool(
    "new_tool",
    {
        title: "新工具",
        description: "新工具的描述",
        inputSchema: {
            param: z.string().describe("参数描述"),
        },
    },
    async (args, _extra) => {
        // 工具函数实现逻辑
    }
);
```

### 更新资源数据

资源数据位于 `src/docs/resources.ts`，包含：
- 组件定义和API参数
- 工具函数定义和使用示例
- 类型定义和接口声明

## 🔍 故障排除

### 常见问题

#### 1. Claude Desktop 无法连接
```bash
# 检查Node.js版本
node --version  # 需要 >= 16.0.0

# 检查配置文件
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 重新构建项目
npm run build
```

#### 2. 组件信息不完整
```bash
# 重新构建项目
npm run build

# 运行测试验证
npm test
```

#### 3. 类型解析失败
```bash
# 检查Ant Design Vue安装
npm list ant-design-vue

# 检查类型文件
ls -la node_modules/ant-design-vue/es/index.d.ts
```

### 诊断命令

```bash
# 完整诊断流程
npm test
npm run test:manual

# 检查依赖
npm list

# 验证安装
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_all_resources","arguments":{}}}' | node dist/index.js
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
- [Ant Design Vue](https://antdv.com/)

---

Made with ❤️ by JetLinks Team