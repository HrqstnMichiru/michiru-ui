type MTableSize = "small" | "medium" | "large";

interface MColumn {
    prop?: string; // 列字段
    label: string; // 列标题
    width?: number; // 列宽度
    align?: "left" | "center" | "right"; // 对齐方式
    wrap?: boolean; // 是否允许换行
    gap?: number; // 列内容间距
    scopedSlot?: string; // 作用域插槽名称
    clamp?: number; // 文本行数限制
}

export type MColumns = MColumn[];

export interface MTableProps<T extends Record<string, any>> {
    striped?: boolean; // 斑马纹
    data: T[]; // 表格数据
    columns: MColumns; // 表头列
    selectable?: boolean; // 可选择行
    hoverable?: boolean; // 悬停高亮
    size?: MTableSize; // 尺寸
    rowKey: keyof T; // 行唯一标识字段，必须是T的键
    showRowKey?: boolean; // 显示行唯一标识列
    extHeight?: number; // 额外高度
    showPagination?: boolean; // 显示分页
    totalCount?: number; // 数据总数
    request?: (pageNo: number, pageSize: number) => Promise<void>; // 请求数据的方法
    pageSizeOptions?: number[]; // 每页显示数量选项
    defaultPageSize?: number; // 默认每页显示数量
}

export interface MTableEmits<T extends Record<string, any>> {
    (e: "row-click", row: T): void; // 行点击事件
    (e: "row-select", row: T): void; // 行选择事件
    (e: "selection-change", selectedRows: T[]): void; // 选择行变化事件
}

export interface MTableInstance<T extends Record<string, any>> {
    getSelectedRows: () => T[]; // 获取已选择的行
    getSelectionSize: () => number; // 获取已选择行数量
    toggleRowSelected: (row: T) => void; // 切换行选择状态
    refresh: (showLoading?: boolean) => Promise<void>; // 刷新表格数据
}
