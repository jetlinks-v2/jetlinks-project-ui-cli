#!/usr/bin/env node

/**
 * JetLinks UI MCP Server Test Suite
 *
 * 这个脚本测试 MCP 工具，确保服务器正常工作
 */

const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'dist/index.js');

/**
 * 将 Markdown 格式转换为控制台友好格式
 */
function formatForConsole(markdown) {
    if (!markdown) return '';

    return markdown
        // 处理代码块（在其他处理之前）
        .replace(/```[\w]*\n?([\s\S]*?)```/g, (match, code) => {
            const lines = code.trim().split('\n');
            return '\n   代码示例:\n' + lines.map(line => '   ' + line).join('\n') + '\n';
        })

        // 移除 Markdown 标题符号，保留层级
        .replace(/^### (.+)$/gm, '      ▸ $1')
        .replace(/^## (.+)$/gm, '\n ○ $1')
        .replace(/^# (.+)$/gm, '\n═══ $1 ═══')

        // 转换表格为更简洁的格式
        .replace(/\|(.+)\|/g, (match, content) => {
            const cells = content.split('|').map(cell => cell.trim()).filter(cell => cell);
            if (cells.every(cell => cell.match(/^-+$/))) {
                return '   ' + '─'.repeat(50); // 表格分隔线
            }
            return '   ' + cells.join(' | ');
        })

        // 移除多余的 Markdown 语法
        .replace(/\*\*(.+?)\*\*/g, '$1')  // 粗体
        .replace(/`(.+?)`/g, '$1')        // 行内代码

        // 转换列表
        .replace(/^- (.+)$/gm, '  • $1')

        // 清理多余空行并添加适当缩进
        .replace(/\n{3,}/g, '\n\n')
        .split('\n')
        .map(line => {
            // 为普通文本添加适当缩进
            if (line && !line.match(/^[\s]*[○•═▸]/) && !line.match(/^[\s]*URI:/) && !line.match(/^[\s]*描述:/) && !line.match(/^[\s]*─/) && !line.match(/^[\s]*代码示例/)) {
                return '   ' + line;
            }
            return line;
        })
        .join('\n')

        // 移除开头结尾的空行
        .trim();
}

// 配置 MCP 调用方法
const MCP_TOOL_METHOD = 'tools/call'; // 尝试使用 tools/call 而不是 tools/run
const MCP_RESOURCE_METHOD = 'resources/read';

// 测试用例配置
const testCases = [
    {
        name: '获取所有资源',
        category: '工具功能',
        request: {
            jsonrpc: '2.0',
            id: 1,
            method: MCP_TOOL_METHOD,
            params: {
                name: 'get_all_resources',
                arguments: {}
            }
        },
        validation: (response) => !!response.result?.content?.[0]?.text,
    },
    {
        name: '获取 JetLinks 组件库资源',
        category: '资源功能',
        request: {
            jsonrpc: '2.0',
            id: 2,
            method: MCP_RESOURCE_METHOD,
            params: {
                uri: 'jetlinks://components'
            }
        },
        validation: (response) => !!response.result?.contents?.[0]?.text?.includes('JetLinks 组件库'),
    },
    {
        name: '获取 JetLinks 工具函数库资源',
        category: '资源功能',
        request: {
            jsonrpc: '2.0',
            id: 3,
            method: MCP_RESOURCE_METHOD,
            params: {
                uri: 'jetlinks://utils'
            }
        },
        validation: (response) => !!response.result?.contents?.[0]?.text?.includes('JetLinks 工具函数库'),
    },
    {
        name: '获取 Ant Design Vue 组件库资源',
        category: '资源功能',
        request: {
            jsonrpc: '2.0',
            id: 4,
            method: MCP_RESOURCE_METHOD,
            params: {
                uri: 'antdv://components'
            }
        },
        validation: (response) => !!response.result?.contents?.[0]?.text?.includes('Ant Design Vue 组件库'),
    },
    {
        name: '获取项目组件库资源',
        category: '资源功能',
        request: {
            jsonrpc: '2.0',
            id: 5,
            method: MCP_RESOURCE_METHOD,
            params: {
                uri: 'project://components'
            }
        },
        validation: (response) => !!response.result?.contents?.[0]?.text?.includes('项目组件库'),
    },
    {
        name: '获取项目工具函数库资源',
        category: '资源功能',
        request: {
            jsonrpc: '2.0',
            id: 6,
            method: MCP_RESOURCE_METHOD,
            params: {
                uri: 'project://utils'
            }
        },
        validation: (response) => !!response.result?.contents?.[0]?.text?.includes('项目工具函数库'),
    },
    {
        name: '测试开发规范提示词',
        category: '提示词功能',
        request: {
            jsonrpc: '2.0',
            id: 7,
            method: 'prompts/get',
            params: {
                name: 'development_guidelines',
                arguments: {
                    task_type: 'component',
                    component_name: 'UserCard'
                }
            }
        },
        validation: (response) => !!response.result?.messages?.[0]?.content?.text?.includes('Vue 3'),
    },
    {
        name: '测试开发规范提示词（表单类型）',
        category: '提示词功能',
        request: {
            jsonrpc: '2.0',
            id: 8,
            method: 'prompts/get',
            params: {
                name: 'development_guidelines',
                arguments: {
                    task_type: 'form'
                }
            }
        },
        validation: (response) => !!response.result?.messages?.[0]?.content?.text?.includes('表单组件'),
    },
];

/**
 * 运行单个测试用例
 */
async function runTest(testCase) {
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
        console.log(`\n🧪 测试: ${testCase.name} [${testCase.category}]`);

        const child = spawn('node', [serverPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // 延迟等待 MCP Server 初始化
        setTimeout(() => {
            try {
                child.stdin.write(JSON.stringify(testCase.request) + '\n');
                child.stdin.end();
            } catch (err) {
                reject(new Error('发送请求失败: ' + err.message));
            }
        }, 1000); // 1 秒延迟，可根据实际启动时间调整

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error(`测试 "${testCase.name}" 超时 (>5s)`));
        }, 5000);

        child.on('close', (code) => {
            clearTimeout(timeout);
            const duration = Date.now() - startTime;

            try {
                const lines = stdout.split('\n').map(l => l.trim()).filter(Boolean);
                const jsonLine = lines.find(l => l.startsWith('{') && l.endsWith('}'));

                if (!jsonLine) {
                    throw new Error('未找到JSON响应');
                }

                const response = JSON.parse(jsonLine);

                if (testCase.validation && !testCase.validation(response)) {
                    throw new Error('响应验证失败');
                }

                console.log(`✅ ${testCase.name}: 通过 (${duration}ms)`);

                // 处理不同类型的响应内容
                let content = '';
                if (response.result?.content?.[0]?.text) {
                    // 工具调用响应
                    content = response.result.content[0].text;
                } else if (response.result?.contents?.[0]?.text) {
                    // 资源访问响应
                    content = response.result.contents[0].text;
                }

                if (content) {
                    const formattedContent = formatForConsole(content);
                    // 对于资源列表，显示完整内容
                    if (testCase.name === '获取所有资源') {
                        console.log(`   完整响应:${formattedContent}`);
                    } else {
                        // const preview = formattedContent.length > 800 ? formattedContent.substring(0, 800) + '\n   ...(内容已截断)' : formattedContent;
                        // console.log(`   响应预览:${preview}`);
                        console.log(`   响应预览:${formattedContent}`);
                    }
                }

                resolve({ ...response, testDuration: duration, testName: testCase.name, category: testCase.category });
            } catch (error) {
                console.log(`❌ ${testCase.name}: 失败 (${duration}ms)`);
                console.log(`   错误: ${error.message}`);
                if (stdout) {
                    const preview = stdout.substring(0, 200);
                    console.log(`   输出: ${preview}${stdout.length > 200 ? '...' : ''}`);
                }
                if (stderr) {
                    const preview = stderr.substring(0, 200);
                    console.log(`   错误输出: ${preview}${stderr.length > 200 ? '...' : ''}`);
                }
                reject({ error, testDuration: duration, testName: testCase.name, category: testCase.category });
            }
        });
    });
}

/**
 * 运行所有测试
 */
async function runAllTests() {
    console.log('🚀 开始 JetLinks UI MCP 服务器全面测试');
    console.log('==========================================');

    const allResults = [];
    let totalPassed = 0;
    let totalFailed = 0;

    for (const testCase of testCases) {
        try {
            const result = await runTest(testCase);
            allResults.push({ ...result, success: true });
            totalPassed++;
        } catch (error) {
            allResults.push({ ...error, success: false });
            totalFailed++;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n==========================================');
    console.log(`✅ 测试完成: ${totalPassed} 通过, ${totalFailed} 失败`);
    console.log('==========================================');
}

// 优雅处理 Ctrl+C
process.on('SIGINT', () => {
    console.log('\n👋 测试被用户中断');
    process.exit(0);
});

if (require.main === module) {
    runAllTests().catch((error) => {
        console.error('\n💥 测试运行器失败:', error.message);
        process.exit(1);
    });
}

module.exports = {
    runAllTests,
    runTest,
    testCases,
};
