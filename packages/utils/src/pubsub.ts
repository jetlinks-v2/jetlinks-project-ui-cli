import PubSub from 'pubsub-js'

export const subscribe = (keys: string | string[], cb: any) => {
  const arrKeys = Array.isArray(keys) ? keys : [keys]
  arrKeys.forEach(key => {
    PubSub.subscribe(key, cb)
  })
}

export const unsubscribe = (keys: string | string[]) => {
  const arrKeys = Array.isArray(keys) ? keys : [keys]
  arrKeys.forEach(key => {
    PubSub.unsubscribe(key)
  })
}

export const publish = (key: string, data: any) => {
  PubSub.publish(key, data)
}
