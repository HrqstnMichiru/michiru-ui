export interface MVirtualListProps<T> {
    itemHeight?: number; // 每一项的固定高度（px）
    maxCount?: number; // 可视区域最多显示的项目数量
    dataSource?: T[]; // 数据源数组
    bufferSize?: number; // 缓冲区大小，在可视区域上下额外渲染的项目数，默认为5
}

export interface MVirtualListInstance {
    scrollToIndex: (index: number) => void; // 滚动到指定索引的项目
}
