import ts from "typescript";
import path from "path";
import fs from "fs";
import { resourceData } from "./docs/resources.js";

// 定义组件Props接口
interface ComponentProp {
    name: string;
    type: string;
    description: string;
    required: boolean;
}

// 定义组件接口
interface Component {
    name: string;
    props?: ComponentProp[];
    description: string;
    example: string;
}

// 从类型中提取 props
function extractPropsFromType(checker: ts.TypeChecker, type: ts.Type): ComponentProp[] {
    const props: ComponentProp[] = [];
    const properties = type.getProperties();

    for (const prop of properties) {
        const propDeclaration = prop.valueDeclaration;
        if (!propDeclaration) continue;
        
        const propType = checker.getTypeOfSymbolAtLocation(prop, propDeclaration);
        const propTypeName = checker.typeToString(propType);
        props.push({
            name: prop.getName(),
            type: propTypeName,
            description: prop.getDocumentationComment(checker)
                .map((d) => d.text)
                .join(" "),
            required: !(propDeclaration as any).questionToken,
        });
    }
    return props;
}

export function parseAntdvComponents(): { components: Component[] } {
    const antdPath = path.resolve("node_modules/ant-design-vue/es/index.d.ts");
    
    // 检查文件是否存在
    if (!fs.existsSync(antdPath)) {
        console.warn(`ant-design-vue 类型文件不存在: ${antdPath}`);
        return { components: [] };
    }
    
    const program = ts.createProgram([antdPath], {});
    const checker = program.getTypeChecker();
    const source = program.getSourceFile(antdPath);

    const components: Component[] = [];

    if (!source) {
        console.warn("无法读取 ant-design-vue 源文件");
        return { components: [] };
    }

    ts.forEachChild(source, (node) => {
        // 检查是否是导出声明
        if (ts.isExportDeclaration(node) && node.exportClause) {
            const exportClause = node.exportClause;

            // 只处理 NamedExports 类型
            if (ts.isNamedExports(exportClause)) {
                for (const el of exportClause.elements) {
                    const name = el.name.text;
                    const symbol = checker.getSymbolAtLocation(el.name);
                    if (!symbol || !symbol.valueDeclaration) continue;

                    const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    const props = extractPropsFromType(checker, type);

                    components.push({
                        name,
                        props,
                        description: `Ant Design Vue 组件: ${name}`,
                        example: `<a-${name.toLowerCase()} />`,
                    });
                }
            }
        }
    });

    return { components };
}

// 定义扫描出的组件接口
interface ScannedComponent {
    name: string;
    description: string;
    filePath: string;
}

// 定义扫描出的工具接口
interface ScannedUtil {
    name: string;
    description: string;
    filePath: string;
}

// 定义项目信息接口
export interface ProjectInfo {
    name?: string;
    version?: string;
    antdVersion?: string;
    vueVersion?: string;
    viteVersion?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

// 读取项目的 package.json 信息
export function getProjectInfo(baseDir: string): ProjectInfo {
    const packageJsonPath = path.resolve(baseDir, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        console.warn(`未找到 package.json: ${packageJsonPath}`);
        return {};
    }

    try {
        const content = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(content);

        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};
        const allDeps = { ...dependencies, ...devDependencies };

        return {
            name: packageJson.name,
            version: packageJson.version,
            antdVersion: allDeps['ant-design-vue'],
            vueVersion: allDeps['vue'],
            viteVersion: allDeps['vite'],
            dependencies,
            devDependencies
        };
    } catch (error) {
        console.error(`读取 package.json 失败:`, error);
        return {};
    }
}

export function scanComponents(baseDir: string): ScannedComponent[] {
    const components: ScannedComponent[] = [];

    // 优先读取 src/components/index.ts 中注册的组件
    const indexPath = path.resolve(baseDir, "src/components/index.ts");
    if (fs.existsSync(indexPath)) {
        try {
            const content = fs.readFileSync(indexPath, 'utf-8');

            // 解析导出的组件
            // 匹配 export { ComponentName } 或 export { default as ComponentName }
            const exportMatches = content.matchAll(/export\s+\{\s*(?:default\s+as\s+)?(\w+)\s*\}/g);
            for (const match of exportMatches) {
                const componentName = match[1];
                components.push({
                    name: componentName,
                    description: `已注册的组件：${componentName}`,
                    filePath: indexPath,
                });
            }

            // 匹配 export * from './ComponentName'
            const reExportMatches = content.matchAll(/export\s+\*\s+from\s+['"]\.\/(\w+)['"]/g);
            for (const match of reExportMatches) {
                const componentName = match[1];
                const componentPath = path.resolve(baseDir, `src/components/${componentName}`);
                components.push({
                    name: componentName,
                    description: `已注册的组件：${componentName}`,
                    filePath: componentPath,
                });
            }

            // 如果成功从 index.ts 解析到组件，直接返回
            if (components.length > 0) {
                return components;
            }
        } catch (error) {
            console.warn(`解析 ${indexPath} 失败:`, error);
        }
    }

    // 如果没有 index.ts 或解析失败，回退到扫描目录
    const dir = path.resolve(baseDir, "src/components");
    if (!fs.existsSync(dir)) return components;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 检查目录下是否有 index.ts/vue/tsx
            const indexFiles = ['index.ts', 'index.vue', 'index.tsx'];
            for (const indexFile of indexFiles) {
                const indexFilePath = path.join(filePath, indexFile);
                if (fs.existsSync(indexFilePath)) {
                    components.push({
                        name: file,
                        description: `自动扫描的组件：${file}`,
                        filePath: indexFilePath,
                    });
                    break;
                }
            }
        } else if (file.endsWith(".vue") || file.endsWith(".tsx")) {
            components.push({
                name: path.basename(file, path.extname(file)),
                description: `自动扫描的组件：${file}`,
                filePath,
            });
        }
    }

    return components;
}

export function scanUtils(baseDir: string): ScannedUtil[] {
    const utils: ScannedUtil[] = [];
    const dir = path.resolve(baseDir, "src/utils");
    if (!fs.existsSync(dir)) return utils;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (file.endsWith(".ts") || file.endsWith(".js")) {
            utils.push({
                name: path.basename(file, path.extname(file)),
                description: `工具函数文件：${file}`,
                filePath,
            });
        }
    }

    return utils;
}

// 定义组件详情返回接口
interface ComponentDetails {
    name: string;
    description: string;
    source: 'jetlinks' | 'antdv' | 'project';
    sourceDescription: string;
    api?: any[];
    props?: ComponentProp[];
    example?: string;
    content?: string;
    filePath?: string;
}

// 定义工具函数详情返回接口
interface UtilDetails {
    name: string;
    description: string;
    source: 'jetlinks' | 'project';
    sourceDescription: string;
    params?: any[];
    example?: string;
    content?: string;
    filePath?: string;
}

// 获取单个组件的详细信息
export function getComponentDetails(componentName: string, source: 'jetlinks' | 'antdv' | 'project'): ComponentDetails | null {
    
    switch (source) {
        case 'jetlinks':
            const jetlinksComponent = resourceData.components.find(c => c.name === componentName);
            if (jetlinksComponent) {
                return {
                    ...jetlinksComponent,
                    source: 'jetlinks',
                    sourceDescription: 'JetLinks 组件库'
                };
            }
            break;
            
        case 'antdv':
            const antdvData = parseAntdvComponents();
            const antdvComponent = antdvData.components.find(c => c.name === componentName);
            if (antdvComponent) {
                return {
                    ...antdvComponent,
                    source: 'antdv',
                    sourceDescription: 'Ant Design Vue 组件库'
                };
            }
            break;
            
        case 'project':
            const projectComponents = scanComponents(process.cwd());
            const projectComponent = projectComponents.find(c => c.name === componentName);
            if (projectComponent) {
                // 读取组件文件内容以获取更多信息
                if (fs.existsSync(projectComponent.filePath)) {
                    const content = fs.readFileSync(projectComponent.filePath, 'utf-8');
                    return {
                        ...projectComponent,
                        source: 'project',
                        sourceDescription: '项目组件库',
                        content: content.substring(0, 2000) // 限制内容长度
                    };
                }
                return {
                    ...projectComponent,
                    source: 'project',
                    sourceDescription: '项目组件库'
                };
            }
            break;
    }
    
    return null;
}

// 获取单个工具函数的详细信息
export function getUtilDetails(utilName: string, source: 'jetlinks' | 'project'): UtilDetails | null {
    
    switch (source) {
        case 'jetlinks':
            const jetlinksUtil = resourceData.utilFunctions.find(u => u.name === utilName);
            if (jetlinksUtil) {
                return {
                    ...jetlinksUtil,
                    source: 'jetlinks',
                    sourceDescription: 'JetLinks 工具函数库'
                };
            }
            break;
            
        case 'project':
            const projectUtils = scanUtils(process.cwd());
            const projectUtil = projectUtils.find(u => u.name === utilName);
            if (projectUtil) {
                // 读取工具函数文件内容以获取更多信息
                if (fs.existsSync(projectUtil.filePath)) {
                    const content = fs.readFileSync(projectUtil.filePath, 'utf-8');
                    return {
                        ...projectUtil,
                        source: 'project',
                        sourceDescription: '项目工具函数库',
                        content: content.substring(0, 2000) // 限制内容长度
                    };
                }
                return {
                    ...projectUtil,
                    source: 'project',
                    sourceDescription: '项目工具函数库'
                };
            }
            break;
    }
    
    return null;
}
