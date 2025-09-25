import {addons} from '@storybook/manager-api';
import {themes} from '@storybook/theming';
import logo from './public/logo.png'

addons.setConfig({
    theme: {
        ...themes.light,
        brandTitle: 'Jetlinks组件库',
        brandImage: logo,
        brandUrl: './',

        // Ant Design Vue 主题色彩
        colorPrimary: '#1677ff', // Ant Design 主色
        colorSecondary: '#722ed1', // 辅助色

        // 界面颜色
        appBg: '#ffffff',
        appContentBg: '#ffffff',
        appBorderColor: '#d9d9d9',
        appBorderRadius: 6,

        // 文本颜色
        textColor: '#000000d9', // Ant Design 主文本色
        textInverseColor: '#ffffff',
        textMutedColor: '#00000073', // Ant Design 次要文本色

        // 侧边栏
        barTextColor: '#000000d9',
        barSelectedColor: '#1677ff',
        barBg: '#ffffff',

        // 输入框
        inputBg: '#ffffff',
        inputBorder: '#d9d9d9',
        inputTextColor: '#000000d9',
        inputBorderRadius: 6,

        // 按钮
        buttonBg: '#ffffff',
        buttonBorder: '#d9d9d9',
    },
    toolbar: {
        title: { hidden: false },
        zoom: { hidden: false },
        eject: { hidden: true }, // 隐藏设置按钮
        remount: { hidden: true },
        fullscreen: { hidden: false },
        outline: { hidden: false },
        grid: { hidden: false },
        background: { hidden: false },
        viewport: { hidden: false },
        measure: { hidden: false },
    },
    sidebar: {
        showRoots: false,
    },
    panel: {
        hidden: false,
    },
});

// Ant Design Vue 风格的样式 - 修复版本
const style = document.createElement('style');
style.textContent = `
  /* 全局样式 - Ant Design Vue 风格 */
  .sidebar-container [role="document"] {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  }
  
  /* 侧边栏样式 */
  .sidebar-container {
    background: #ffffff !important;
    border-right: 1px solid #f0f0f0 !important;
    overflow: hidden !important; /* 禁用整个侧边栏的滚动 */
    display: flex !important;
    flex-direction: column !important;
  }
  
  /* 侧边栏内容区域，使搜索框下方的区域可滚动 */
  .sidebar-container [data-nodetype="story"] {
    overflow-y: auto !important;
    flex: 1 !important;
  }
  
  /* 搜索框区域固定在顶部 */
  .sidebar-container form[role="search"] {
    flex-shrink: 0 !important;
    position: sticky !important;
    top: 0 !important;
    background: #ffffff !important;
    z-index: 10 !important;
    padding: 8px !important;
    border-bottom: 1px solid #f0f0f0 !important;
  }
  
  /* 侧边栏头部 */
  .sidebar-header {
    display: flex !important;
    align-items: center !important;
    padding-bottom: 12px !important;
    border-bottom: 1px solid #f0f0f0 !important;
    background: #ffffff !important;
    height: 48px !important;
  }
  
  .sidebar-header img {
    height: 32px !important;
    width: auto !important;
    margin-right: 12px !important;
  }
  
  /* 品牌标题样式 */
  .sidebar-header::after {
    content: "Jetlinks组件库";
    font-weight: 600 !important;
    font-size: 22px !important;
    color: #000000d9 !important;
    margin-left: 8px;
    position: absolute;
    left: 50px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  /* 侧边栏项目样式 - 更温和的样式 */
  .sidebar-item[data-selected="true"] {
    background-color: #e6f4ff !important;
    color: #1677ff !important;
  }
  
  .sidebar-item:hover:not([data-selected="true"]) {
    background-color: #f5f5f5 !important;
  }
  
  /* 搜索框样式 - 只针对侧边栏搜索框 */
  .sidebar-container input[type="search"] {
    border-radius: 6px !important;
    padding: 8px 12px !important;
    font-size: 14px !important;
    transition: border-color 0.2s !important;
  }
  
  .sidebar-container input[type="search"]:focus {
    border-color: #1677ff !important;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1) !important;
    outline: none !important;
  }
  
  /* 工具栏按钮样式 - 更保守的样式 */
  .toolbar-container button {
    border-radius: 6px !important;
    transition: all 0.2s !important;
  }
  
  .toolbar-container button:hover {
    border-color: #1677ff !important;
  }
  
  /* 隐藏不需要的元素 */
  .sidebar-header button[aria-label],
  .sidebar-header button[title] {
    display: none !important;
  }
`;
document.head.appendChild(style);
