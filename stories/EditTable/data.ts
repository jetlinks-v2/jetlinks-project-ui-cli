const typeMap = {
  0: 'object',
  1: 'string',
  2: 'number',
  3: 'date',
  4: 'boolean',
}

export const types = Object.values(typeMap).map(item => ({ label:item, value: item}))

export const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
    form: {
      required: true,
      rules: [{ required: true, message: '请输入名称' }]
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 200,
  },
]

export const dataSource = Array.from({ length: 10}).map((_, index) => {
  const type = index % 5
  return {
    id: index + 1,
    name: `名称 ${index + 1}`,
    type: `${typeMap[type]}`
  }
})

export const bigData = (len = 2000) => Array.from({ length: len}).map((_, index) => {
  const type = index % 5
  return {
    id: index + 1,
    name: `名称 ${index + 1}`,
    type: `${typeMap[type]}`
  }
})
