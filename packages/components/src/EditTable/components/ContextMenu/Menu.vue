<template>
  <div
    class="jetlinks-edit-table-context-menu"
    ref="contextMenu"
    tabindex="-1"
    @blur="close"
  >
    <Menu @click="clickFunc">
      <MenuItem key="add">
        <template #icon>
          <AIcon type="PlusSquareOutlined" />
        </template>
        {{ contextLocale.contextMenu.add }}
      </MenuItem>
      <MenuItem key="copy">
        <template #icon>
          <AIcon type="icon-copy" />
        </template>
        {{contextLocale.contextMenu.copy}}
      </MenuItem>
      <MenuItem key="paste" :disabled="showPaste">
        <template #icon>
          <AIcon type="icon-paste" />
        </template>
        {{ contextLocale.contextMenu.paste }}
      </MenuItem>
      <MenuItem key="detail" :disabled="showDetail">
        <template #icon>
          <AIcon type="icon-chakan" />
        </template>
        {{ contextLocale.contextMenu.detail }}
      </MenuItem>
      <MenuItem key="delete" class="danger" :disabled="showDelete">
        <template #icon>
          <AIcon type="DeleteOutlined" />
        </template>
        {{ contextLocale.contextMenu.delete }}
      </MenuItem>
    </Menu>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, defineOptions, defineProps } from "vue";
import { AIcon } from '../../../components'
import { Menu } from 'ant-design-vue'
import {useLocaleReceiver} from "../../../LocaleReciver";

defineOptions({
  name: 'JEditTableContextMenu'
})

const MenuItem = Menu.Item

const props = defineProps({
  data: {type: Object, default: () => ({})},
  onClose: { type: Function, default: () => {} },
  onClick: { type: Function, default: () => {} },
  onCopy: { type: Function, default: () => {} },
  paste: { type: Object, default: () => ({}) }
});

const contextMenu = ref(null);
const [contextLocale] = useLocaleReceiver('EditTable');
const showDetail = computed(() => {
  return !props.data.id
})

const showPaste = computed(() => {
  return !props.paste
})

const showDelete = computed(() => {
  return props.data.expands?.isProduct
})

const clickFunc = ({ key }) => {
  if (key === 'copy') {
    props.onCopy(props.data)
  }
  props.onClick(key)
};

const close = (e) => {
  setTimeout(() => {
    props.onClose()
  }, 300)
}

onMounted(async () => {
// 确保组件已经渲染
  await nextTick();
// 触发组件focus
  contextMenu.value.focus();
});

</script>
