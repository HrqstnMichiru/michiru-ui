export interface EllipsisProps {
    content?: string; // 文本内容
    maxLines?: number; // 最大显示行数
    tooltip?: boolean; // 是否显示 tooltip
    indent?: boolean; // 是否缩进首行
}
export interface EllipsisInstance {
    expand: () => void; // 展开文本
    collapse: () => void; // 收起文本
}
