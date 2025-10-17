// 扁平化数据
import {omit} from "lodash-es";

export const flattenTree = (tree: any[], level = 0, parentId = null) => {
  return tree.flatMap((item: any) => {
    const _children = (item.children || []).map(i => ({
      ...omit(i, 'children')
    }))
    const flatNode = {
      ...omit(item, 'children'),
      children: _children, // 为了需要判断孩子的长度的时候使用
      level,
      parentId,
      expanded: false,
      hasChildren: item.children?.length > 0,
      visible: level === 0,
    }
    const children: any[] = item.children ? flattenTree(item.children, level + 1, item.id) : [];
    return [flatNode, ...children]
  })
}

export const findAllChildren = (data = [], parentId = null) => {
  let result = [];

  function recursive(pid) {
    data.forEach(item => {
      if (item.parentId === pid) {
        result.push(item);
        recursive(item.id); // 递归查找这个子节点的孩子
      }
    });
  }

  recursive(parentId);
  return result;
}
