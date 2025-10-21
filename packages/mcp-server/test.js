#!/usr/bin/env node

/**
 * JetLinks UI MCP Server Test Suite
 *
 * 这个脚本测试所有MCP工具以确保服务器正常工作
 */

const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'dist/index.js');

// 测试用例配置
const testCases = [
    // 提示词相关测试
    {
        name: '列出所有提示词',
        category: '提示词功能',
        request: {"jsonrpc":"2.0","id":1,"method":"prompts/list","params":{}},
        validation: (response) => {
            return response.result && response.result.prompts && response.result.prompts.length > 0;
        }
    },
    {
        name: '获取JetLinks组件库助手提示词',
        category: '提示词功能',
        request: {"jsonrpc":"2.0","id":2,"method":"prompts/get","params":{"name":"jetlinks-component-helper","arguments":{}}},
        validation: (response) => {
            return response.result && response.result.messages && response.result.messages.length > 0;
        }
    },
    
    // 工具相关测试
    {
        name: '列出所有工具',
        category: '工具功能',
        request: {"jsonrpc":"2.0","id":3,"method":"tools/list","params":{}},
        validation: (response) => {
            return response.result && response.result.tools && response.result.tools.length > 0;
        }
    },
    {
        name: '获取所有组件',
        category: '组件功能',
        request: {"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_all_components","arguments":{}}},
        validation: (response) => {
            return response.result && response.result.content && response.result.content[0].text.includes('组件');
        }
    },
    {
        name: '获取所有方法',
        category: '工具函数',
        request: {"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_all_functions","arguments":{}}},
        validation: (response) => {
            return response.result && response.result.content && response.result.content[0].text.includes('工具函数');
        }
    },
    {
        name: '获取AutoComplete组件使用示例',
        category: '使用示例',
        request: {"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"AutoComplete"}}},
        validation: (response) => {
            return response.result && response.result.content && response.result.content[0].text.includes('AutoComplete');
        }
    },
    {
        name: '获取ProTable组件使用示例',
        category: '使用示例',
        request: {"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"ProTable"}}},
        validation: (response) => {
            return response.result && response.result.content && response.result.content[0].text.includes('ProTable');
        }
    },
    {
        name: '获取LocalStore工具函数示例',
        category: '工具函数示例',
        request: {"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"LocalStore"}}},
        validation: (response) => {
            return response.result && response.result.content && response.result.content[0].text.includes('LocalStore');
        }
    }
];

// 错误处理测试用例
const errorTestCases = [
    {
        name: '获取不存在组件的使用示例',
        category: '错误处理',
        request: {"jsonrpc":"2.0","id":101,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"NonExistentComponent"}}},
        expectError: false, // 应该返回错误信息但不是RPC错误
        validation: (response) => {
            return response.result && response.result.content && response.result.content[0].text.includes('未找到');
        }
    },
    {
        name: '获取不存在的提示词',
        category: '错误处理',
        request: {"jsonrpc":"2.0","id":102,"method":"prompts/get","params":{"name":"non-existent-prompt","arguments":{}}},
        expectError: true,
        validation: (response) => {
            return response.error && response.error.message;
        }
    },
    {
        name: '调用不存在的工具',
        category: '错误处理',
        request: {"jsonrpc":"2.0","id":103,"method":"tools/call","params":{"name":"non_existent_tool","arguments":{}}},
        expectError: true,
        validation: (response) => {
            return response.error && response.error.code;
        }
    },
    {
        name: '获取空字符串组件示例',
        category: '错误处理',
        request: {"jsonrpc":"2.0","id":104,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":""}}},
        expectError: false,
        validation: (response) => {
            return response.result && response.result.content && (
                response.result.content[0].text.includes('未找到') || 
                response.result.content[0].text.includes('请提供组件或方法名称')
            );
        }
    }
];

// 性能测试用例（用于大量数据测试）
const performanceTestCases = [
    {
        name: '并发获取多个组件示例',
        category: '性能测试',
        concurrent: true,
        requests: [
            {"jsonrpc":"2.0","id":201,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"AutoComplete"}}},
            {"jsonrpc":"2.0","id":202,"method":"tools/call","params":{"name":"get_usage_examples","arguments":{"name":"ProTable"}}},
            {"jsonrpc":"2.0","id":203,"method":"tools/call","params":{"name":"get_all_components","arguments":{}}},
            {"jsonrpc":"2.0","id":204,"method":"prompts/list","params":{}}
        ]
    }
];

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
          console.log('data', data)
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // 发送测试请求
        child.stdin.write(JSON.stringify(testCase.request) + '\n');
        child.stdin.end();

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error(`测试 "${testCase.name}" 超时 (>5s)`));
        }, 5000);

        child.on('close', (code) => {
            clearTimeout(timeout);
            const duration = Date.now() - startTime;

            try {
              console.log(stdout, 'stdout')
                // 解析JSON响应
                const lines = stdout.split('\n').filter(line => line.trim());
                const jsonLine = lines.find(line => line.startsWith('{'));

                if (!jsonLine) {
                    throw new Error('未找到JSON响应');
                }

                const response = JSON.parse(jsonLine);

                // 检查是否期望错误
                if (testCase.expectError && !response.error) {
                    throw new Error('期望返回错误但实际成功');
                }

                if (!testCase.expectError && response.error) {
                    throw new Error(`MCP错误: ${response.error.message}`);
                }

                // 运行自定义验证
                if (testCase.validation && !testCase.validation(response)) {
                    throw new Error('响应验证失败');
                }

                console.log(`✅ ${testCase.name}: 通过 (${duration}ms)`);

                // 显示适当的预览
                if (testCase.name.includes('列出所有工具') && response.result && response.result.tools) {
                    console.log(`   找到 ${response.result.tools.length} 个工具`);
                } else if (response.result && response.result.content) {
                    const content = response.result.content[0].text;
                    const preview = content // .length > 100 ? content.substring(0, 100) + '...' : content;
                    console.log(`   响应预览: ${preview}`);
                } else if (testCase.expectError && response.error) {
                    console.log(`   错误代码: ${response.error.code}`);
                }

                resolve({ ...response, testDuration: duration, testName: testCase.name, category: testCase.category });
            } catch (error) {
                console.log(`❌ ${testCase.name}: 失败 (${duration}ms)`);
                console.log(`   错误: ${error.message}`);
                if (stdout && !testCase.expectError) {
                    const preview = stdout.substring(0, 200);
                    if (preview.length > 0) console.log(`   输出: ${preview}${stdout.length > 200 ? '...' : ''}`);
                }
                if (stderr && stderr.trim().length > 0) {
                    const preview = stderr.substring(0, 200);
                    console.log(`   错误输出: ${preview}${stderr.length > 200 ? '...' : ''}`);
                }
                reject({ error, testDuration: duration, testName: testCase.name, category: testCase.category });
            }
        });
    });
}

// 并发测试函数
async function runConcurrentTest(performanceTest) {
    console.log(`\n🚀 性能测试: ${performanceTest.name}`);
    const startTime = Date.now();

    try {
        const promises = performanceTest.requests.map((request, index) => {
            return new Promise((resolve, reject) => {
                const child = spawn('node', [serverPath], {
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                let stdout = '';
                child.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                child.stdin.write(JSON.stringify(request) + '\n');
                child.stdin.end();

                const timeout = setTimeout(() => {
                    child.kill();
                    reject(new Error(`并发测试超时: Request ${index + 1}`));
                }, 10000);

                child.on('close', () => {
                    clearTimeout(timeout);
                    const lines = stdout.split('\n').filter(line => line.trim());
                    const jsonLine = lines.find(line => line.startsWith('{'));
                    if (jsonLine) {
                        resolve(JSON.parse(jsonLine));
                    } else {
                        reject(new Error(`无效响应: Request ${index + 1}`));
                    }
                });
            });
        });

        const results = await Promise.all(promises);
        const duration = Date.now() - startTime;

        console.log(`✅ ${performanceTest.name}: 成功 (${duration}ms, ${results.length}个请求)`);
        console.log(`   平均响应时间: ${Math.round(duration / results.length)}ms`);

        return { success: true, duration, results, testName: performanceTest.name };
    } catch (error) {
        const duration = Date.now() - startTime;
        console.log(`❌ ${performanceTest.name}: 失败 (${duration}ms)`);
        console.log(`   错误: ${error.message}`);
        return { success: false, duration, error, testName: performanceTest.name };
    }
}

// 生成详细测试报告
function generateTestReport(results) {
    const categories = {};
    let totalDuration = 0;

    results.forEach(result => {
        if (!categories[result.category]) {
            categories[result.category] = { passed: 0, failed: 0, tests: [] };
        }

        if (result.success) {
            categories[result.category].passed++;
        } else {
            categories[result.category].failed++;
        }

        categories[result.category].tests.push(result);
        totalDuration += result.testDuration || 0;
    });

    console.log('\n📄 详细测试报告');
    console.log('=================');

    Object.entries(categories).forEach(([category, stats]) => {
        const total = stats.passed + stats.failed;
        const rate = total > 0 ? Math.round((stats.passed / total) * 100) : 0;
        console.log(`\n📎 ${category}: ${stats.passed}/${total} 通过 (${rate}%)`);

        if (stats.failed > 0) {
            stats.tests.filter(t => !t.success).forEach(test => {
                console.log(`   ❌ ${test.testName}: ${test.error?.message || '未知错误'}`);
            });
        }
    });

    console.log(`\n🕰️ 性能统计:`);
    console.log(`   总运行时间: ${totalDuration}ms`);
    console.log(`   平均测试时间: ${Math.round(totalDuration / results.length)}ms`);

    const slowTests = results
        .filter(r => r.testDuration > 1000)
        .sort((a, b) => (b.testDuration || 0) - (a.testDuration || 0));

    if (slowTests.length > 0) {
        console.log(`\n🐌 慢速测试 (>1s):`);
        slowTests.forEach(test => {
            console.log(`   ${test.testName}: ${test.testDuration}ms`);
        });
    }
}

async function runAllTests() {
    console.log('🚀 开始JetLinks UI MCP服务器全面测试');
    console.log('==========================================');

    const allResults = [];
    let totalPassed = 0;
    let totalFailed = 0;

    // 运行基础功能测试
    console.log('\n🔍 运行基础功能测试...');
    for (const testCase of testCases) {
        try {
            const result = await runTest(testCase);
            allResults.push({ ...result, success: true });
            totalPassed++;
        } catch (error) {
            allResults.push({ ...error, success: false });
            totalFailed++;
        }

        // 测试间隔
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 运行错误处理测试
    console.log('\n🛡️ 运行错误处理测试...');
    for (const testCase of errorTestCases) {
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

    // 运行性能测试
    if (performanceTestCases.length > 0) {
        console.log('\n🏁 运行性能测试...');
        for (const perfTest of performanceTestCases) {
            const result = await runConcurrentTest(perfTest);
            allResults.push({ ...result, category: perfTest.category });
            if (result.success) {
                totalPassed++;
            } else {
                totalFailed++;
            }
        }
    }

    // 显示总结果
    console.log('\n📊 测试结果总结');
    console.log('==================');
    console.log(`✅ 通过: ${totalPassed}`);
    console.log(`❌ 失败: ${totalFailed}`);
    console.log(`📊 总计: ${totalPassed + totalFailed}`);
    console.log(`🎯 成功率: ${Math.round((totalPassed / (totalPassed + totalFailed)) * 100)}%`);

    // 生成详细报告
    if (allResults.length > 0) {
        generateTestReport(allResults);
    }

    // 提供建议
    if (totalFailed > 0) {
        console.log('\n📝 建议操作:');
        console.log('1. 检查上述失败的测试用例');
        console.log('2. 运行 `npm run build` 确保项目已构建');
        console.log('3. 检查组件数据文件是否存在');
        console.log('4. 查看详细错误信息');
        console.log('\n⚠️  有测试失败，请检查上述问题。');
        process.exit(1);
    } else {
        console.log('\n🎉 所有测试通过！MCP服务器工作正常。');
        console.log('\n📜 使用方法请参考 README.md');
        console.log('\n🔗 配置 Claude Desktop:');
        console.log('   macOS: ~/Library/Application\\ Support/Claude/claude_desktop_config.json');
        console.log('   Windows: %APPDATA%\\Claude\\claude_desktop_config.json');
        process.exit(0);
    }
}

// 优雅处理Ctrl+C
process.on('SIGINT', () => {
    console.log('\n\n👋 测试被用户中断');
    process.exit(0);
});

// 运行测试
if (require.main === module) {
    runAllTests().catch((error) => {
        console.error('\n💥 测试运行器失败:', error.message);
        process.exit(1);
    });
}

module.exports = {
    runAllTests,
    runTest,
    runConcurrentTest,
    generateTestReport,
    testCases,
    errorTestCases,
    performanceTestCases
};
