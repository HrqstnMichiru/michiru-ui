import type { InjectionKey } from "vue";

export interface MTreeData {
    children?: any[]; // 子节点数据
    disabled?: boolean;
    [key: string]: any;
}

export interface MTreeNodeProps<T extends MTreeData = any> {
    nodeKey: string | number; // 节点唯一标识
    label: string; // 节点显示文本
    children?: MTreeNodeProps<T>[]; // 子节点
    parent?: MTreeNodeProps<T>; // 父节点
    level: number; // 节点在当前层级中的索引
    isLeaf: boolean; // 是否为叶子节点
    disabled: boolean; // 是否禁止选中
    showCheck: boolean; // 是否展示选择框
    expanded: boolean; // 是否展开
    checked: boolean; // 是否选中
    indeterminate: boolean; // 是否为部分选择状态
    data: T; // 节点数据
}

export interface MTreeEmits {
    <T extends MTreeData = any>(e: "node-select", node: MTreeNodeProps<T>): void;
    <T extends MTreeData = any>(e: "node-click", node: MTreeNodeProps<T>): void;
    <T extends MTreeData = any>(e: "selection-change", selectedNodes: T[]): void;
}

export interface MTreeProps<T extends MTreeData = any> {
    data?: T[]; // 树节点数据
    nodeKey?: keyof T; // 节点唯一标识字段
    nodeLabel?: keyof T; // 节点显示文本字段
    selectable?: boolean; // 是否可选中节点
    onlyLeaf?: boolean; // 是否仅叶子节点可选中
    onlyPrefix?: boolean; // 是否仅前缀区域可点击展开/收起
    syncParentWithChildren?: boolean; // 父节点选中状态是否与子节点联动
    selectedKeys?: Array<string | number>; // 默认选中的节点ID数组
    expandedKeys?: Array<string | number>; // 默认展开的节点ID数组
    expandAll?: boolean; // 初始是否展开所有节点
    duration?: number; // 展开/收起动画时长，单位毫秒
    accordion?: boolean; // 是否启用手风琴模式
}

export interface MTreeInstance<T extends MTreeData = any> {
    getSelectedNodes: () => T[]; // 获取已选中的节点
    toggleExpandAll: () => void; // 切换所有节点展开/收起状态
    toggleSelectAll: () => void; // 切换所有节点选中/取消选中状态
    checkAll: () => void; // 全选
    uncheckAll: () => void; // 取消全选
    toggleExpand: (nodeKey: string | number) => void; // 切换指定节点展开/收起状态
    toggleSelect: (nodeKey: string | number) => void; // 切换指定节点的选中状态
    selectAll: boolean; // 全选状态
    selectedSize: number; // 当前已选数量（可选节点维度）
    selectableSize: number; // 可选节点总数
}

export interface MTreeContext<T extends MTreeData = any> {
    toggleSelect: (nodeKey: string | number) => void; // 切换节点选中状态
    toggleExpand: (nodeKey: string | number) => void; // 切换节点展开状态
    nodeClick: (node: MTreeNodeProps<T>) => void; // 处理节点点击事件
    onlyPrefix: boolean; // 是否仅前缀区域可点击展开/收起
    duration: number; // 展开/收起动画时长，单位毫秒
}

export const MTreeContextKey: InjectionKey<MTreeContext> = Symbol("MTreeContextKey");
