export interface MWaterFallProps {
    gap?: number | [number, number]; // 间距，支持单值或数组形式 [水平间距, 垂直间距]
    columns: number; // 列数
    pageSize?: number; // 每页加载数量
    previewDisabled?: boolean; // 是否禁用预览功能
    urlFormat?: (url: string) => string; // 图片URL格式化函数
    request: (page: number, pageSize: number) => Promise<MWaterFallItem[]>; // 数据请求函数
}

export interface MWaterFallItem {
    url: string; // 图片URL
    width: number; // 图片宽度
    height: number; // 图片高度
}
