import type { PropType, ExtractPropTypes } from 'vue';
import type { Theme, ContentWidth } from './typings';
import {CSSProperties} from "vue";
import PropTypes from "ant-design-vue/es/_util/vue-types";

export interface RenderSetting {
    headerRender?: false;
    menuRender?: false;
    menuHeaderRender?: false;
}

export interface DefaultSettingProps {
    theme?: Theme;
    /**
     * 自定义页眉高度
     */
    headerHeight?: number;
    /**
     *
     */
    layout: 'side' | 'top' | 'mix' | 'sider';

    contentWidth: ContentWidth;
    /**
     * sticky header
     */
    fixedHeader: boolean;
    /**
     * sticky siderbar
     */
    fixSiderbar: boolean;
    menu: { locale?: boolean; defaultOpenAll?: boolean };
    title: string;
    // Your custom iconfont Symbol script Url
    // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
    // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
    // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
    iconfontUrl: string;
    primaryColor: string;
    colorWeak?: boolean;
    splitMenus?: boolean;
}

export type ProSettings = DefaultSettingProps & RenderSetting;

export const defaultSettings = {
    theme: 'light',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixSiderbar: true,
    menu: {
        locale: true,
    },
    headerHeight: 48,
    title: 'Jetlink UI Components',
    iconfontUrl: '',
    primaryColor: '#315EFB',
};

export const LayoutType = {
  CARD: 'card',
  PAD: 'pad',
  LIST: 'list'
}

export const defaultSettingProps = {
    theme: {
        type: String as PropType<DefaultSettingProps['theme']>,
        default: defaultSettings.theme,
    },
    layout: {
        type: String as PropType<DefaultSettingProps['layout']>,
        default: defaultSettings.layout,
    },
    contentWidth: {
        type: String as PropType<DefaultSettingProps['contentWidth']>,
        default: defaultSettings.contentWidth,
    },
    fixedHeader: {
        type: Boolean as PropType<DefaultSettingProps['fixedHeader']>,
        default: defaultSettings.fixedHeader,
    },
    fixSiderbar: {
        type: Boolean as PropType<DefaultSettingProps['fixSiderbar']>,
        default: defaultSettings.fixSiderbar,
    },
    menu: {
        type: Object as PropType<DefaultSettingProps['menu']>,
        default: () => {
            return {
                locale: true,
            };
        },
    },
    headerHeight: {
        type: Number as PropType<DefaultSettingProps['headerHeight']>,
        default: defaultSettings.headerHeight,
    },
    title: {
        type: String as PropType<DefaultSettingProps['title']>,
        default: () => defaultSettings.title,
    },
    iconfontUrl: {
        type: String as PropType<DefaultSettingProps['iconfontUrl']>,
        default: () => defaultSettings.iconfontUrl,
    },
    primaryColor: {
        type: String as PropType<DefaultSettingProps['primaryColor']>,
        default: () => defaultSettings.primaryColor,
    },
    layoutType: {
      type: String,
      default: LayoutType.LIST
    },
    cardSiderWidth: {
      type: Number,
      default: 60
    },
    historyRoutes: {
      type: Array as PropType<{}>,
      default: () => []
    },
    historyActive: {
      type: String,
      default: undefined
    },
    pageFooterStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => undefined,
    },
    pageHeaderStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => undefined,
    },
    apps: {
      type: Array as PropType<Array<any>>,
      default: () => []
    },
    onAppMenuClick:  PropTypes.func
};

export type ProSettingsProps = ExtractPropTypes<typeof defaultSettingProps>;
