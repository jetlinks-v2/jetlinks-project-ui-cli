import { baseHeaderProps, TopNavHeader } from '../TopHeader';
import type { BaseHeaderPropsType } from '../TopHeader';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import type { VueNode } from 'ant-design-vue/es/_util/type';
import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, computed, toRefs } from 'vue';
import type { LeftContentRender, WithFalse } from '../typings';
import { useRouteContext } from '../RouteContext';
import { Layout } from 'ant-design-vue';
import {LayoutType} from "../defaultSettings";

export const headerViewProps = {
    ...baseHeaderProps,
    headerRender: {
        type: [Object, Function, Boolean] as PropType<
            WithFalse<(props: any, defaultDom: VueNode) => VueNode>
        >,
        default: () => undefined,
    },
    headerTitleRender: {
        type: [Object, Function, Boolean] as PropType<
            WithFalse<(props: any, defaultDom: VueNode) => VueNode>
        >,
        default: () => undefined,
    },
    headerContentRender: {
        type: [Object, Function, Boolean] as PropType<
            WithFalse<(props: any) => VueNode>
        >,
        default: () => undefined,
    },
    leftContentRender: {
        type: [Object, Function, Boolean] as PropType<LeftContentRender>,
        default: () => undefined,
    },
    hasSiderMenu: PropTypes.looseBool,
    siderWidth: PropTypes.number.def(208),
};

export type HeaderViewProps = Partial<
    ExtractPropTypes<typeof headerViewProps> & BaseHeaderPropsType
>;

export default defineComponent({
    name: 'HeaderView',
    inheritAttrs: false,
    props: headerViewProps,
    setup(props) {
        const {
            prefixCls,
            fixedHeader,
            headerHeight,
            layout,
            theme,
            onCollapse,
        } = toRefs(props);
        const context = useRouteContext();
        const needFixedHeader = computed(
            () => fixedHeader.value || context.fixedHeader,
        );
        const isTop = computed(() => layout.value === 'top');

        const className = computed(() => {
            return {
                [`${prefixCls.value}-fixed-header`]: needFixedHeader.value,
                [`${prefixCls.value}-top-menu`]: isTop.value,
            };
        });

        const renderContent = () => {
            const defaultDom = (
                <TopNavHeader
                    theme={theme.value}
                    mode="horizontal"
                    {...props}
                    leftContentRender={props.leftContentRender}
                    onCollapse={onCollapse.value}
                    menuData={context.menuData}
                />
            );
            if (props.headerRender) {
                return props.headerRender(props, defaultDom);
            }
            return defaultDom;
        };

        const right = computed(() => (needFixedHeader.value ? 0 : undefined));

        const width = computed(() => {
          if (context.layoutType === LayoutType.PAD) {
            return context.siderWidth
          }
          return 0
        })

        return () => (
            <>
                {needFixedHeader.value && (
                    <Layout.Header
                        style={{
                            height: `${headerHeight.value}px`,
                            lineHeight: `${headerHeight.value}px`,
                            background: 'transparent',
                        }}
                    />
                )}
                <Layout.Header
                    style={{
                        padding: 0,
                        height: `${headerHeight.value}px`,
                        lineHeight: `${headerHeight.value}px`,
                        width: props.hasSiderMenu ? `calc(100% - ${width.value}px)` : '100%',
                        zIndex: 100,
                        right: right.value,
                    }}
                    class={className.value}
                >
                    {renderContent()}
                </Layout.Header>
            </>
        );
    },
});
