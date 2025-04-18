<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "CellRender",
  props: ['renderFn', 'value', 'record', 'index'],
  setup(props) {
    return () => {
      return props.renderFn(props.value, props.record, props.index, )
    }
  }
})
</script>
