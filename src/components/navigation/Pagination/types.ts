export interface PaginationProps {
    totalCount: number; // 总数据量
    pageSizeOptions?: number[]; // 每页显示条数选择器的选项
    showPageSizeChange?: boolean; // 是否显示每页显示条数选择器
    showTotal?: boolean; // 是否显示总数信息
    pageButtonCount?: number; // 页码按钮数量（奇数）
    pageSizeSelectPosition?: "bottom" | "top"; // select的位置
    size?: "small" | "large"; // 尺寸
    defaultPageSize?: number; // 默认每页显示条数
}

export interface PaginationEmits {
    (event: "page-change", page: number): void; // 页码改变事件
    (event: "page-size-change", page: number, pageSize: number): void; // 每页显示条数改变事件
}
