export const data = Array(12)
    .fill(1)
    .map((item, index) => {
        return {
            key: index + item,
            name: 'John Brown',
            age: (Math.random() * 100).toFixed(0),
            address: 'New York No. 1 Lake Park',
            status: {
                text: '123',
            },
        };
    });
export const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        ellipsis: true
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'status.text',
        key: 'status.text',
    },
]

const dataSource = Array(1000)
    .fill(1)
    .map((item, index) => {
        return {
            id: index + item,
            name: 'John Brown' + index,
            age: (Math.random() * 100).toFixed(0),
            address: 'New York No. 1 Lake Park',
        };
    });

export const query = (_params: any) =>
    new Promise((resolve) => {
        const _value = _params.terms?.[0]?.value || ''
        const _data = dataSource.filter(i => {
            return !_value || i.name.includes(_value)
        })
        const _from = _params.pageIndex * _params.pageSize;
        const _to = (_params.pageIndex + 1) * _params.pageSize;
        setTimeout(() => {
            resolve({
                result: {
                    data: _data.slice(_from, _to),
                    pageIndex: _params.pageIndex || 0,
                    pageSize: _params.pageSize || 12,
                    total: _data.length || 0,
                },
                status: 200,
                success: true
            });
        }, 500);
    });
