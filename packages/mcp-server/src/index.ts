import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { resourceData } from "./docs/data";

// 根据当前环境确定文件路径
const isBuilt = __dirname.includes('dist');
const basePath = isBuilt ? path.resolve(__dirname, "../src") : __dirname;

const filePath = path.resolve(basePath, "docs/resources.md");
const promptsFilePath = path.resolve(basePath, "docs/prompts.md");

// 初始化 MCP 服务器
const server = new McpServer({
    name: '@jetlinks-web/mcp-server',
    version: '2.0.0'
}, {
    capabilities: {
        tools: {},
        resources: {},
        prompts: {}
    }
});

// 注册提示词
server.registerPrompt(
    "jetlinks-component-helper",
    {
        title: "JetLinks UI组件库使用指南",
        description: `JetLinks UI组件库使用指南和代码生成助手 - 包含 ${resourceData.components.length} 个组件和 ${resourceData.utilFunctions.length} 个工具函数`,
        argsSchema: {}
    },
    async () => {
        try {
            const promptsContent = await fs.promises.readFile(promptsFilePath, "utf-8");
            const resourcesContent = await fs.promises.readFile(filePath, "utf-8");

            return {
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: promptsContent + "\n\n以下是 JetLinks UI 组件库的完整资源文档，包含所有可用组件的详细API和使用示例：\n\n" + resourcesContent
                        }
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Error loading prompt content: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
);

// 注册获取所有组件和方法的工具
server.tool('get_all_components', 'Get all components from JetLinks UI library', {}, async () => {
    try {
        const { components } = resourceData;

        return {
            content: [{
                type: 'text',
                text: `# JetLinks UI 组件库资源清单\n\n
                ## 组件 (${components.length}个)\n${components.map(c => `- ${c.name}${c.description ? ` - ${c.description}` : ''}`).join('\n')}`
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: `获取组件列表时出错: ${error instanceof Error ? error.message : String(error)}`
            }]
        };
    }
});

// 注册获取所有工具函数的工具
server.tool('get_all_functions', 'Get all methods from JetLinks UI library', {}, async () => {
    try {
        const { utilFunctions } = resourceData;

        return {
            content: [{
                type: 'text',
                text: `# JetLinks UI 组件库资源清单\n\n
                ## 工具函数 (${utilFunctions.length}个)\n${utilFunctions.map(u => `- ${u.name}${u.description ? ` - ${u.description}` : ''}`).join('\n')}`
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: `获取方法列表时出错: ${error instanceof Error ? error.message : String(error)}`
            }]
        };
    }
});

// 注册获取使用示例的工具
server.registerTool(
    'get_usage_examples',
    {
        title: 'Get usage examples for specific component or method',
        description: 'Get usage examples for a specific component or method from the JetLinks UI library',
        inputSchema: {
            name: z.string().describe('Component or method name')
        }
    },
    async ({ name }) => {
        try {
            if (!name) {
                return {
                    content: [{
                        type: 'text',
                        text: '请提供组件或方法名称'
                    }]
                };
            }
            const { components, utilFunctions } = resourceData;

        // 查找组件
        const component = components.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (component) {
            let apiTableContent = '';
            if (component.api && component.api.length > 0) {
                apiTableContent = '\n\n## API 参数\n\n| 参数名 | 描述 | 类型 | 默认值 |\n|--------|------|------|--------|\n';
                apiTableContent += component.api.map(api =>
                    `| ${api.name} | ${api.description} | ${api.type} | ${api.default || '-'} |`
                ).join('\n');
            }

            return {
                content: [{
                    type: 'text',
                    text: `# ${component.name} 使用指南\n\n${component.description ? `## 描述\n${component.description}\n\n` : ''}## 代码示例\n\n\`\`\`vue\n${component.code}\n\`\`\`${apiTableContent}`
                }]
            };
        }

        // 查找工具函数
        const utilFunction = utilFunctions.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (utilFunction) {
            let paramsContent = '';
            if (utilFunction.params && utilFunction.params.length > 0) {
                paramsContent = '\n\n## 参数\n\n| 参数名 | 类型 | 必需 | 默认值 | 描述 |\n|--------|------|------|--------|------|\n';
                paramsContent += utilFunction.params.map(param =>
                    `| ${param.name} | ${param.type} | ${param.required ? '是' : '否'} | ${param.default || '-'} | ${param.description} |`
                ).join('\n');
            }

            return {
                content: [{
                    type: 'text',
                    text: `# ${utilFunction.name} 使用指南\n\n## 描述\n${utilFunction.description}${paramsContent}\n\n${utilFunction.returnType || utilFunction.returnDescription ? `## 返回值\n${utilFunction.returnType ? `类型: ${utilFunction.returnType}\n` : ''}${utilFunction.returnDescription ? `描述: ${utilFunction.returnDescription}` : ''}\n\n` : ''}## 代码示例\n\n\`\`\`javascript\n${utilFunction.example}\n\`\`\``
                }]
            };
        }

        // 模糊搜索
        const fuzzyComponents = components.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
        const fuzzyUtilFunctions = utilFunctions.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));

        if (fuzzyComponents.length > 0 || fuzzyUtilFunctions.length > 0) {
            let suggestions = '';
            if (fuzzyComponents.length > 0) {
                suggestions += `\n\n相关组件:\n${fuzzyComponents.map(c => `- ${c.name}${c.description ? ` - ${c.description}` : ''}`).join('\n')}`;
            }
            if (fuzzyUtilFunctions.length > 0) {
                suggestions += `\n\n相关工具函数:\n${fuzzyUtilFunctions.map(u => `- ${u.name}${u.description ? ` - ${u.description}` : ''}`).join('\n')}`;
            }

            return {
                content: [{
                    type: 'text',
                    text: `未找到完全匹配 "${name}" 的项目，但找到以下相关项目:${suggestions}`
                }]
            };
        }

        return {
            content: [{
                type: 'text',
                text: `未找到 "${name}" 的相关信息。请检查名称是否正确，或使用 get_all_components 工具查看所有可用的组件和方法。`
            }]
        };
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `获取 "${name}" 使用示例时出错: ${error instanceof Error ? error.message : String(error)}`
                }]
            };
        }
    }
);


// 启动服务器
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
