import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import {readFileSync} from "fs";
import {join, dirname} from "path";
import {fileURLToPath} from "url";
import {resourceData} from "./docs/resources.js";
import {parseAntdvComponents, scanComponents, scanUtils, getComponentDetails, getUtilDetails, getProjectInfo} from "./tool.js";

// 获取当前文件所在目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 控制台友好的输出辅助函数
function createConsoleOutput(title: string, data: any[], type: 'components' | 'utils' = 'components') {
    console.log(`\n=== ${title} ===`);
    console.log(`已注册 ${data.length} 个${type === 'components' ? '组件' : '工具函数'}`);

    if (data.length > 0) {
        console.log('\n列表:');
        data.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name}${item.description ? ` - ${item.description}` : ''}`);
        });
    }

    return {
        success: true,
        count: data.length,
        items: data.map(item => ({
            name: item.name,
            description: item.description || '',
            type: type === 'components' ? 'component' : 'util'
        }))
    };
}

// 初始化 MCP 服务器
const server = new McpServer({
    name: '@jetlinks-web/mcp-server',
    version: '1.0.0'
}, {
    capabilities: {
        tools: {},
        resources: {},
        prompts: {}
    }
});

// 添加脚手架的资源数据
server.registerResource(
    "jetlinks-components",
    "jetlinks://components",
    {
        title: "JetLinks 组件库",
        description: "所有可用的 UI 组件及其 API 参数定义",
    },
    async () => {
        const {components} = resourceData;

        // 输出控制台友好的信息
        const result = createConsoleOutput("JetLinks 组件库", components, 'components');

        const usageRules = `
# 🚫 强制规则 - 必须严格遵守

## ❌ 绝对禁止项

### 禁止项 1: 图标组件
- ❌ **绝对禁止**: \`<Icon />\`、\`<a-icon />\`、任何ant-design-vue的图标组件
- ✅ **必须使用**: \`<AIcon type="icon-name" />\`

### 禁止项 2: 手动导入Vue API
- ❌ **绝对禁止**: \`import { ref, reactive, computed } from 'vue'\`
- ✅ **必须使用**: 直接使用ref、reactive、computed等(已自动导入)

### 禁止项 3: 原生message API
- ❌ **绝对禁止**: \`message.success()\`、\`message.error()\`、\`message.warning()\`
- ✅ **必须使用**: \`onlyMessage('提示内容', 'success')\`

---

## ⚠️ 重要使用规则

### 1. 图标组件使用规则(强制)
**任何需要显示图标的场景,都必须使用 AIcon 组件**:
- ✅ 正确: \`<AIcon type="icon-name" />\`
- ❌ 错误: \`<Icon />\` 或 \`<a-icon />\`

示例:
\`\`\`vue
<template>
  <!-- 正确:使用 AIcon -->
  <AIcon type="icon-setting" />

  <!-- 在按钮中使用 -->
  <a-button>
    <AIcon type="icon-plus" />
    新增
  </a-button>
</template>

<script setup>
// ✅ 正确: 直接使用ref,无需import
const visible = ref(false)

// ❌ 错误: 不要添加import语句
// import { ref } from 'vue'
</script>
\`\`\`

### 2. 组件优先级规则(强制)
组件选择必须按照以下优先级顺序:
1. **项目自定义组件**(最高优先级)
2. **JetLinks 脚手架组件**(中等优先级)
3. **Ant Design Vue 组件**(最低优先级)

**禁止跳过高优先级直接使用低优先级组件!**

---
`;

        const markdown =
            "# JetLinks 组件库\n\n" +
            usageRules +
            components
                .map((c) => {
                    let apiTable = "";
                    if (c.api && c.api.length > 0) {
                        apiTable =
                            "\n\n| 参数名 | 描述 | 类型 | 默认值 |\n|--------|------|------|--------|\n" +
                            c.api
                                .map(
                                    (api) =>
                                        `| ${api.name} | ${api.description || "-"} | ${
                                            api.type || "-"
                                        } | ${api.default || "-"} |`
                                )
                                .join("\n");
                    }
                    return `## ${c.name}\n${c.description || ""}\n${apiTable}`;
                })
                .join("\n\n");

        return {
            contents: [
                {
                    uri: "jetlinks://components",
                    mimeType: "text/markdown",
                    text: markdown,
                },
            ],
            metadata: result
        };
    }
);

server.registerResource(
    "jetlinks-utils",
    "jetlinks://utils",
    {
        title: "JetLinks 工具函数库",
        description: "JetLinks 提供的所有工具函数及参数说明",
    },
    async () => {
        const {utilFunctions} = resourceData;

        // 输出控制台友好的信息
        const result = createConsoleOutput("JetLinks 工具函数库", utilFunctions, 'utils');

        const utilsUsageRules = `
# 🚫 强制规则 - 必须严格遵守

## ❌ 绝对禁止项

### 禁止项 1: 原生message API(强制)
- ❌ **绝对禁止**: \`message.success()\`, \`message.error()\`, \`message.warning()\`, \`message.info()\`
- ✅ **必须使用**: \`onlyMessage('提示内容', 'success')\`

### 禁止项 2: 手动导入Vue API(强制)
- ❌ **绝对禁止**: \`import { ref } from 'vue'\`, \`import { reactive, computed } from 'vue'\`
- ✅ **必须使用**: 直接使用ref、reactive、computed等(已自动导入)

### 禁止项 3: 原生CSS(强制)
- ❌ **绝对禁止**: \`<style scoped>\`, \`<style>\`
- ✅ **必须使用**: \`<style lang="less" scoped>\`

---

## ⚠️ 重要使用规则

### 1. 消息提示规则(强制)
**任何需要显示消息提示的场景,必须使用 \`onlyMessage()\` 方法**:
\`\`\`javascript
// ✅ 正确写法
onlyMessage('操作成功', 'success')
onlyMessage('操作失败', 'error')
onlyMessage('警告信息', 'warning')

// ❌ 错误写法 - 绝对禁止!
// message.success('操作成功')
// message.error('操作失败')
\`\`\`

**onlyMessage 的优势**: 同类型消息只提示一次,避免重复提示

### 2. Vue API 自动引入规则(强制)
项目已配置 Vue API 自动引入,**禁止手动 import**:
\`\`\`vue
<script setup>
// ✅ 正确: 直接使用,无需import
const count = ref(0)
const state = reactive({ name: 'test' })
const doubled = computed(() => count.value * 2)

// ❌ 错误 - 绝对禁止手动导入!
// import { ref, reactive, computed } from 'vue'
</script>
\`\`\`

可以直接使用的 API:
- 响应式: \`ref\`, \`reactive\`, \`computed\`, \`watch\`, \`watchEffect\`
- 生命周期: \`onMounted\`, \`onUnmounted\`, \`onBeforeMount\` 等
- 工具函数: \`nextTick\`, \`toRefs\`, \`toRef\`, \`unref\` 等

### 3. 样式编写规则(强制)
**必须使用 \`<style lang="less" scoped>\`**:
\`\`\`vue
<!-- ✅ 正确 -->
<style lang="less" scoped>
.my-component {
  padding: 16px;
}
</style>

<!-- ❌ 错误 - 绝对禁止! -->
<!-- <style scoped> -->
<!-- <style> -->
\`\`\`

---
`;

        const markdown =
            "# JetLinks 工具函数库\n\n" +
            utilsUsageRules +
            utilFunctions
                .map((u) => {
                    let paramsTable = "";
                    if (u.params && u.params.length > 0) {
                        paramsTable =
                            "\n\n| 参数名 | 类型 | 必需 | 默认值 | 描述 |\n|--------|------|------|--------|------|\n" +
                            u.params
                                .map(
                                    (p) =>
                                        `| ${p.name} | ${p.type} | ${
                                            p.required ? "是" : "否"
                                        } | ${p.default || "-"} | ${p.description || "-"} |`
                                )
                                .join("\n");
                    }

                    return `## ${u.name}\n${u.description || ""}${paramsTable}\n\n示例:\n\`\`\`js\n${
                        u.example || ""
                    }\n\`\`\``;
                })
                .join("\n\n");

        return {
            contents: [
                {
                    uri: "jetlinks://utils",
                    mimeType: "text/markdown",
                    text: markdown,
                },
            ],
            metadata: result
        };
    }
);

server.registerResource(
    "antdv-components",
    "antdv://components",
    {
        title: "Ant Design Vue 组件库",
        description: "自动解析自 ant-design-vue 类型定义文件的组件参数与示例",
    },
    async () => {
        const {components} = parseAntdvComponents();

        // 输出控制台友好的信息
        const result = createConsoleOutput("Ant Design Vue 组件库", components, 'components');

        const antdvUsageRules = `
# 🚫 强制规则 - 必须严格遵守

## ❌ 绝对禁止项

### 禁止项 1: 跳过优先级使用组件(强制)
使用 Ant Design Vue 组件前,**必须先检查**是否有更高优先级的组件:
1. **项目自定义组件**(最高优先级) - 先检查 project://components
2. **JetLinks 脚手架组件**(中等优先级) - 再检查 jetlinks://components
3. **Ant Design Vue 组件**(最低优先级) - 最后才使用这里的组件

### 禁止项 2: 禁用的组件/API(强制)
以下场景**绝对禁止**使用 Ant Design Vue:

| 场景 | 必须使用(脚手架) | 绝对禁止(Ant Design Vue) |
|------|----------------|----------------------|
| 图标显示 | \`<AIcon type="icon-name" />\` | ❌ \`<Icon />\` 或 \`<a-icon />\` |
| 表格展示 | \`<j-pro-table />\` | ❌ \`<a-table />\` |
| 空状态 | \`<j-empty />\` | ❌ \`<a-empty />\` |
| 消息提示 | \`onlyMessage()\` | ❌ \`message.success()\` |
| 权限按钮 | \`<j-permission-button />\` | ❌ \`<a-button />\`(需要权限时) |

### 禁止项 3: 手动导入Vue API(强制)
- ❌ **绝对禁止**: \`import { ref, reactive } from 'vue'\`
- ✅ **必须使用**: 直接使用 ref、reactive、computed 等

### 禁止项 4: 原生CSS(强制)
- ❌ **绝对禁止**: \`<style scoped>\`
- ✅ **必须使用**: \`<style lang="less" scoped>\`

---

## ⚠️ 重要使用规则

### 1. 组件优先级规则(强制)
使用任何组件前,必须按以下顺序检查:
\`\`\`
检查顺序: 项目自定义 → JetLinks脚手架 → Ant Design Vue
\`\`\`

### 2. 特殊组件替代规则(强制)
\`\`\`vue
<!-- ✅ 正确: 使用AIcon -->
<AIcon type="icon-setting" />

<!-- ❌ 错误 - 绝对禁止! -->
<!-- <Icon /> -->
<!-- <a-icon /> -->

<script setup>
// ✅ 正确: 直接使用,无需import
const visible = ref(false)

// ❌ 错误 - 绝对禁止!
// import { ref } from 'vue'

// ✅ 正确: 使用onlyMessage
onlyMessage('操作成功', 'success')

// ❌ 错误 - 绝对禁止!
// message.success('操作成功')
</script>

<!-- ✅ 正确: 使用Less -->
<style lang="less" scoped>
.container { padding: 16px; }
</style>

<!-- ❌ 错误 - 绝对禁止! -->
<!-- <style scoped> -->
\`\`\`

---
`;

        const markdown =
            "# Ant Design Vue 组件库\n\n" +
            antdvUsageRules +
            components
                .map((c) => {
                    let propsTable = "";
                    if (c.props?.length) {
                        propsTable =
                            "\n\n| 属性名 | 类型 | 必需 | 描述 |\n|--------|------|------|------|\n" +
                            c.props
                                .map(
                                    (p: any) =>
                                        `| ${p.name} | ${p.type} | ${
                                            p.required ? "是" : "否"
                                        } | ${p.description || "-"} |`
                                )
                                .join("\n");
                    }

                    return `## ${c.name}\n${c.description}\n${propsTable}\n\n示例:\n\`\`\`vue\n${c.example}\n\`\`\``;
                })
                .join("\n\n");
        return {
            contents: [
                {
                    uri: "antdv://components",
                    mimeType: "text/markdown",
                    text: markdown,
                },
            ],
            metadata: result
        };
    }
);

server.registerResource(
    "project-components",
    "project://components",
    {
        title: "项目组件库",
        description: "自动扫描项目 src/components 目录下的组件",
    },
    async () => {
        const components = scanComponents(process.cwd());

        // 输出控制台友好的信息
        const result = createConsoleOutput("项目组件库", components, 'components');

        const markdown =
            "# 项目组件库\n\n" +
            components.map(c => `## ${c.name}\n路径: ${c.filePath}\n${c.description}`).join("\n\n");

        return {
            contents: [
                {
                    uri: "project://components",
                    mimeType: "text/markdown",
                    text: markdown,
                },
            ],
            metadata: result
        };
    }
);

server.registerResource(
    "project-utils",
    "project://utils",
    {
        title: "项目工具函数库",
        description: "自动扫描项目 src/utils 目录下的函数文件",
    },
    async () => {
        const utils = scanUtils(process.cwd());

        // 输出控制台友好的信息
        const result = createConsoleOutput("项目工具函数库", utils, 'utils');

        const markdown =
            "# 项目工具函数库\n\n" +
            utils.map(u => `## ${u.name}\n路径: ${u.filePath}\n${u.description}`).join("\n\n");

        return {
            contents: [
                {
                    uri: "project://utils",
                    mimeType: "text/markdown",
                    text: markdown,
                },
            ],
            metadata: result
        };
    }
);

server.registerResource(
    "project-info",
    "project://info",
    {
        title: "项目信息",
        description: "当前项目的基本信息、技术栈版本等",
    },
    async () => {
        const projectInfo = getProjectInfo(process.cwd());

        console.log("\n=== 项目信息 ===");
        console.log(`项目名称: ${projectInfo.name || '未知'}`);
        console.log(`项目版本: ${projectInfo.version || '未知'}`);
        console.log(`Vue 版本: ${projectInfo.vueVersion || '未安装'}`);
        console.log(`Vite 版本: ${projectInfo.viteVersion || '未安装'}`);
        console.log(`Ant Design Vue 版本: ${projectInfo.antdVersion || '未安装'}`);

        let markdown = "# 项目信息\n\n";
        markdown += `**项目名称**: ${projectInfo.name || '未知'}\n\n`;
        markdown += `**项目版本**: ${projectInfo.version || '未知'}\n\n`;
        markdown += "## 技术栈\n\n";
        markdown += `- **Vue**: ${projectInfo.vueVersion || '未安装'}\n`;
        markdown += `- **Vite**: ${projectInfo.viteVersion || '未安装'}\n`;
        markdown += `- **Ant Design Vue**: ${projectInfo.antdVersion || '未安装'}\n\n`;

        if (projectInfo.dependencies && Object.keys(projectInfo.dependencies).length > 0) {
            markdown += "## 主要依赖\n\n";
            markdown += "| 包名 | 版本 |\n|------|------|\n";
            for (const [name, version] of Object.entries(projectInfo.dependencies)) {
                markdown += `| ${name} | ${version} |\n`;
            }
        }

        return {
            contents: [
                {
                    uri: "project://info",
                    mimeType: "text/markdown",
                    text: markdown,
                },
            ],
            metadata: {
                success: true,
                projectInfo
            }
        };
    }
);

// 注册一个列出所有资源的工具
server.registerTool(
    "get_all_resources",
    {
        title: "获取所有资源",
        description: "列出当前 MCP 服务器中已注册的所有资源信息",
    },
    async (_args, _extra) => {
        console.log("\n=== 正在获取所有已注册资源 ===");

        // 修复资源访问错误
        let resources: Array<{id: string, uri: string, title: string, description: string}> = [];
        try {
            // 尝试获取服务器实例的资源列表
            const serverResources = (server as any)._resources || (server as any).resources;
            if (serverResources && serverResources.entries) {
                resources = Array.from(serverResources.entries()).map(
                    ([id, resource]: any) => ({
                        id,
                        uri: resource.uri,
                        title: resource.title,
                        description: resource.description,
                    })
                );
            } else {
                // 如果无法直接获取，手动列出已知的资源
                resources = [
                    {
                        id: "jetlinks-components",
                        uri: "jetlinks://components",
                        title: "JetLinks 组件库",
                        description: "所有可用的 UI 组件及其 API 参数定义"
                    },
                    {
                        id: "jetlinks-utils",
                        uri: "jetlinks://utils",
                        title: "JetLinks 工具函数库",
                        description: "JetLinks 提供的所有工具函数及参数说明"
                    },
                    {
                        id: "antdv-components",
                        uri: "antdv://components",
                        title: "Ant Design Vue 组件库",
                        description: "自动解析自 ant-design-vue 类型定义文件的组件参数与示例"
                    },
                    {
                        id: "project-components",
                        uri: "project://components",
                        title: "项目组件库",
                        description: "自动扫描项目 src/components 目录下的组件"
                    },
                    {
                        id: "project-utils",
                        uri: "project://utils",
                        title: "项目工具函数库",
                        description: "自动扫描项目 src/utils 目录下的函数文件"
                    },
                    {
                        id: "project-info",
                        uri: "project://info",
                        title: "项目信息",
                        description: "当前项目的基本信息、技术栈版本等"
                    }
                ];
            }

            console.log(`共找到 ${resources.length} 个已注册资源:`);
            resources.forEach((r, index) => {
                console.log(`${index + 1}. ${r.title} (${r.id})`);
                console.log(`   URI: ${r.uri}`);
                console.log(`   描述: ${r.description}`);
            });

        } catch (error) {
            console.error("获取资源列表时出错:", error);
        }

        const markdown =
            "# 当前可用资源列表\n\n" +
            (resources.length
                ? resources
                    .map(
                        (r) =>
                            `- **${r.title}**  \n  URI: \`${r.uri}\`  \n  描述: ${
                                r.description || "-"
                            }`
                    )
                    .join("\n\n")
                : "_暂无注册资源_");

        return {
            content: [
                {
                    type: "text",
                    text: markdown,
                },
            ],
            metadata: {
                success: true,
                resourceCount: resources.length,
                resources: resources.map(r => ({
                    id: r.id,
                    title: r.title,
                    uri: r.uri,
                    description: r.description
                }))
            }
        };
    }
);

// 注册获取单个组件详情的工具
server.registerTool(
    "get_component_details",
    {
        title: "获取单个组件详细信息",
        description: "根据组件名称和来源获取特定组件的详细信息，包括 API 参数、描述、示例等",
        inputSchema: {
            componentName: z.string().describe("组件名称"),
            source: z.enum(["jetlinks", "antdv", "project"]).describe("组件来源：jetlinks(JetLinks组件库)、antdv(Ant Design Vue)、project(项目组件)"),
        },
    },
    async (args, _extra) => {
        const { componentName, source } = args as {
            componentName: string;
            source: 'jetlinks' | 'antdv' | 'project';
        };

        console.log(`\n=== 正在查找组件: ${componentName} (来源: ${source}) ===`);

        const component = getComponentDetails(componentName, source);

        if (!component) {
            console.log(`❌ 未找到组件: ${componentName}`);
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ 未找到组件 "${componentName}" (来源: ${source})`,
                    },
                ],
                metadata: {
                    success: false,
                    componentName,
                    source,
                    error: "组件未找到"
                }
            };
        }

        console.log(`✅ 找到组件: ${component.name}`);
        console.log(`📦 来源: ${component.sourceDescription}`);

        let markdown = `# ${component.name}\n\n`;
        markdown += `**来源**: ${component.sourceDescription}\n\n`;
        markdown += `**描述**: ${component.description || '无描述'}\n\n`;

        // 根据来源类型显示不同的信息
        if (source === 'jetlinks' && component.api) {
            markdown += "## API 参数\n\n";
            markdown += "| 参数名 | 描述 | 类型 | 默认值 |\n|--------|------|------|--------|\n";
            component.api.forEach((api: any) => {
                markdown += `| ${api.name} | ${api.description || "-"} | ${api.type || "-"} | ${api.default || "-"} |\n`;
            });
        } else if (source === 'antdv' && component.props) {
            markdown += "## Props\n\n";
            markdown += "| 属性名 | 类型 | 必需 | 描述 |\n|--------|------|------|------|\n";
            component.props.forEach((prop: any) => {
                markdown += `| ${prop.name} | ${prop.type} | ${prop.required ? "是" : "否"} | ${prop.description || "-"} |\n`;
            });
        }

        if (component.example) {
            markdown += `\n## 示例\n\n\`\`\`${source === 'antdv' ? 'vue' : 'js'}\n${component.example}\n\`\`\`\n`;
        }

        if (component.content) {
            markdown += `\n## 源代码\n\n\`\`\`vue\n${component.content}\n\`\`\`\n`;
        }

        if (component.filePath) {
            markdown += `\n**文件路径**: ${component.filePath}\n`;
        }

        return {
            content: [
                {
                    type: "text",
                    text: markdown,
                },
            ],
            metadata: {
                success: true,
                component: {
                    name: component.name,
                    source: component.source,
                    sourceDescription: component.sourceDescription,
                    filePath: component.filePath || null,
                    hasApi: !!(component.api || component.props),
                    hasExample: !!component.example,
                    hasContent: !!component.content
                }
            }
        };
    }
);

// 注册获取单个工具函数详情的工具
server.registerTool(
    "get_util_details",
    {
        title: "获取单个工具函数详细信息",
        description: "根据函数名称和来源获取特定工具函数的详细信息，包括参数、描述、示例等",
        inputSchema: {
            utilName: z.string().describe("工具函数名称"),
            source: z.enum(["jetlinks", "project"]).describe("函数来源：jetlinks(JetLinks工具函数库)、project(项目工具函数)"),
        },
    },
    async (args, _extra) => {
        const { utilName, source } = args as {
            utilName: string;
            source: 'jetlinks' | 'project';
        };

        console.log(`\n=== 正在查找工具函数: ${utilName} (来源: ${source}) ===`);

        const util = getUtilDetails(utilName, source);

        if (!util) {
            console.log(`❌ 未找到工具函数: ${utilName}`);
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ 未找到工具函数 "${utilName}" (来源: ${source})`,
                    },
                ],
                metadata: {
                    success: false,
                    utilName,
                    source,
                    error: "工具函数未找到"
                }
            };
        }

        console.log(`✅ 找到工具函数: ${util.name}`);
        console.log(`📦 来源: ${util.sourceDescription}`);

        let markdown = `# ${util.name}\n\n`;
        markdown += `**来源**: ${util.sourceDescription}\n\n`;
        markdown += `**描述**: ${util.description || '无描述'}\n\n`;

        // 显示参数信息（仅对 JetLinks 工具函数）
        if (source === 'jetlinks' && util.params) {
            markdown += "## 参数\n\n";
            markdown += "| 参数名 | 类型 | 必需 | 默认值 | 描述 |\n|--------|------|------|--------|------|\n";
            util.params.forEach((param: any) => {
                markdown += `| ${param.name} | ${param.type} | ${param.required ? "是" : "否"} | ${param.default || "-"} | ${param.description || "-"} |\n`;
            });
        }

        if (util.example) {
            markdown += `\n## 示例\n\n\`\`\`js\n${util.example}\n\`\`\`\n`;
        }

        if (util.content) {
            markdown += `\n## 源代码\n\n\`\`\`typescript\n${util.content}\n\`\`\`\n`;
        }

        if (util.filePath) {
            markdown += `\n**文件路径**: ${util.filePath}\n`;
        }

        return {
            content: [
                {
                    type: "text",
                    text: markdown,
                },
            ],
            metadata: {
                success: true,
                util: {
                    name: util.name,
                    source: util.source,
                    sourceDescription: util.sourceDescription,
                    filePath: util.filePath || null,
                    hasParams: !!util.params,
                    hasExample: !!util.example,
                    hasContent: !!util.content
                }
            }
        };
    }
);

// 注册开发规范提示词
server.registerPrompt(
    "development_guidelines",
    {
        title: "Vue 3 + Ant Design Vue 开发规范",
        description: "专业的前端开发助手提示词，基于 Vue 3 + TypeScript + Ant Design Vue 4.x 技术栈",
        argsSchema: {
            task_type: z.string().optional().describe("开发任务类型"),
            component_name: z.string().optional().describe("组件名称")
        }
    },
    async (args) => {
        const { task_type, component_name } = args as {
            task_type?: string;
            component_name?: string;
        };

        // 读取 prompts.md 文件内容
        const promptsFilePath = join(__dirname, 'docs', 'prompts.md');
        let promptContent = readFileSync(promptsFilePath, 'utf-8');

        // 根据任务类型添加特定指导
        if (task_type) {
            promptContent += `\n\n# 当前任务类型: ${task_type}`;

            switch (task_type.toLowerCase()) {
                case 'component':
                    promptContent += `\n- 专注于Vue组件开发，使用Composition API
- 确保TypeScript类型安全
- 遵循响应式设计原则`;
                    break;
                case 'form':
                    promptContent += `\n- 使用Ant Design Vue的表单组件
- 实现表单验证和数据绑定
- 考虑用户体验和错误处理`;
                    break;
                case 'table':
                    promptContent += `\n- 使用Ant Design Vue的Table组件
- 实现分页、排序、筛选功能
- 优化性能和数据展示`;
                    break;
            }
        }

        if (component_name) {
            promptContent += `\n\n# 目标组件: ${component_name}`;
        }

        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: promptContent
                    }
                }
            ]
        };
    }
);


// 启动服务器
async function main() {
    console.log("\n🚀 正在启动 JetLinks MCP 服务器...");
    console.log("📦 项目: @jetlinks-web/mcp-server v1.0.0");

    // 获取并显示当前项目信息
    const projectInfo = getProjectInfo(process.cwd());
    if (projectInfo.name) {
        console.log(`\n📂 当前项目: ${projectInfo.name}${projectInfo.version ? ` v${projectInfo.version}` : ''}`);
        console.log("🔧 技术栈:");
        if (projectInfo.vueVersion) {
            console.log(`   - Vue: ${projectInfo.vueVersion}`);
        }
        if (projectInfo.viteVersion) {
            console.log(`   - Vite: ${projectInfo.viteVersion}`);
        }
        if (projectInfo.antdVersion) {
            console.log(`   - Ant Design Vue: ${projectInfo.antdVersion}`);
        }
    } else {
        console.log("🔧 默认技术栈: vue 3.5.x + vite 7.x + ant-design-vue 4.x");
    }
    console.log("📁 管理工具: Turborepo");

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.log("✅ MCP 服务器启动成功!");
    console.log("🔍 使用 'get_all_resources' 工具查看所有可用资源");
}

main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
