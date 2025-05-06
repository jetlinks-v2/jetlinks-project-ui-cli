<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "HeaderItemRender",
  props: ['renderFn', 'value'],
  setup(props) {
    return () => {
      return props.renderFn(props.value)
    }
  }
})
</script>
