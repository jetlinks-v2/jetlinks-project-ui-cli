import {defineComponent, createVNode, watchEffect, inject} from 'vue';
import * as aIcon from '@ant-design/icons-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import {ComponentsEnum} from "../utils/constants";

let MyIcon = () => {
  return () => {}
}

const AntdIcon = (props: { type: string }) => createVNode(aIcon[props.type]);

const Icon = (props: any) =>
    Object.keys(aIcon).includes(props.type) ? (
        <AntdIcon {...props} />
    ) : (
        <MyIcon {...props} />
    );

export default defineComponent({
    name: 'AIcon',
    // 传入组件配置
    props: ['type', 'scriptUrl', 'class'],
    emits: ['click'],
    setup(props, {emit, attrs}) {
        const config = inject(ComponentsEnum.Icon, {}) as  { scriptUrl: string}
        watchEffect(() => {
            const url = props.scriptUrl || config.scriptUrl
            if (url) {
                MyIcon = createFromIconfontCN({
                    scriptUrl: url,
                });
            }
        });

        const click = () => {
            emit('click');
        };
        return () => <Icon {...props} style={attrs.style} onClick={click}/>;
    },
});
