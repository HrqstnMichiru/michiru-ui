export interface MPaginationProps {
    totalCount: number; // 总数据量
    pageSizeOptions?: number[]; // 每页显示条数选择器的选项
    showPageSize?: boolean; // 是否显示每页显示条数选择器
    showTotal?: boolean; // 是否显示总数信息
    pageCount?: number; // 最多显示的数字页按钮数量（不含省略号，最小按 7 处理）
    size?: "small" | "medium" | "large"; // 尺寸
    pageSize?: number; // 默认每页显示条数
    position?: "left" | "center" | "right"; // 分页组件的位置
    variant?: "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";
    plain?:boolean;
    outlined?:boolean;
}

export interface PageItem {
    key: string;
    label: string;
    type: "page" | "ellipsis";
    page: number;
}

export interface MPaginationEmits {
    (event: "page-change", page: number): void; // 页码改变事件
    (event: "page-size-change", page: number, pageSize: number): void; // 每页显示条数改变事件
}
