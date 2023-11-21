import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

type Options = {
  onLine?: () => void
  offline?: () => void
}

export const useNetwork = (options?: Options): { isOnline: Ref<boolean> } => {
  const isOnline = ref(true)
  const connection = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const downLink = connection.downlink;

  const connectionChange = () => {
    if (downLink !== navigator.connection.downlink || navigator.connection.rtt === 0) {
      //网络断开
      isOnline.value = false
      options?.offline?.()
    } else if (downLink === navigator.connection.downlink || navigator.connection.rtt !== 0) {
      //连接到网络
      isOnline.value = true
      options?.onLine?.()
    }
  }

  onMounted(() => {
    if (connection ) {
      connection.addEventListener('change', connectionChange)
    }
  })

  onUnmounted(() => {
    if (connection ) {
      connection.removeEventListener('change', connectionChange)
    }
  })

  return { isOnline }
}
