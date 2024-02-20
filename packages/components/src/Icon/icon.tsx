import {defineComponent, createVNode, watchEffect} from 'vue';
import aIcon from '@ant-design/icons-vue';
import {createFromIconfontCN} from '@ant-design/icons-vue';
import {useIcon} from '@jetlinks-web/hooks'

let MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3183515_i7oma42he.js', // 在 iconfont.cn 上生成
});

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
    const config = useIcon()
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
