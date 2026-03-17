export interface MUploadProps {
    accept?: string; // 支持的文件类型
    maxSize?: number; // 单个文件的最大大小，单位：MB
    limit?: number; // 最大上传文件数量
    droppable?: boolean; // 是否支持拖拽上传
    autoUpload?: boolean; // 是否在选择文件后自动上传
    placeholder?: string; // 占位文本，显示在上传区域内
    placeIcon?: string; // 占位图标，显示在上传区域内
    enqueueStrategy?: "replace" | "ignore"; // 文件入队策略
    errorStrategy?: "keep" | "remove"; // 文件错误处理策略
    request?: (file: File) => Promise<MUploadResponse>; // 自定义上传函数，返回一个 Promise，解析为 MUploadResponse 对象
    listStyle?: "normal" | "gallery"; // 文件列表的展示样式
    circle?: boolean; // gallery模式下是否显示为圆形
    size?: number; //gallery模式下的宽高
    width?: number; //gallery模式下的宽度，优先级高于size
    height?: number; //gallery模式下的高度，优先级高于size
    urlFormat?: (url: string) => string; // gallery模式下图片URL的格式化函数
    thumbnailUrlFormat?: (url: string) => string; // gallery模式下预览图URL的格式化函数
}
export interface MUploadFile {
    fid: string; // 唯一标识，由于 File 对象没 ID，建议生成一个随机 ID
    name?: string; // 文件名
    size?: number; // 文件大小，单位：字节
    type: string; // 文件类型
    status: "uploading" | "done" | "upload-error" | "ready" | "validate-error"; // 文件状态
    errorMessage?: string; // 错误信息（仅限状态为 error 的文件）
    percent?: number; // 上传进度 (0-100)
    url?: string; // 远程服务器的地址（已上传成功的）
    file?: File; // 原始 File 对象（仅限本地选择还未传完的文件）
    thumbnailUrl?: string; // 预览图地址
    visible?: boolean; // 文件是否可见
}
export interface MUploadResponse {
    url: string; // 远程服务器的地址
    status: "success" | "error"; // 上传结果状态
    percent: number; // 上传进度 (0-100)，仅在上传过程中返回
}

export interface MUploadEmits {
    (event: "item-click", file: MUploadFile): void; // 文件点击事件
}

export interface MUploadInstance {
    clearFiles: () => void; // 清空已选择的文件
    selectFile: () => void; // 触发文件选择对话框
    uploadFiles: () => void; // 手动触发上传（仅当 autoUpload 为 false 时有效）
}
