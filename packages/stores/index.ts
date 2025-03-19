let StoreMap = {}

export const installStore = (stores = {}) => {
  Object.assign(StoreMap, stores)
}

export default StoreMap
