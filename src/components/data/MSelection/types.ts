import type { InjectionKey } from "vue";

export interface MSelectionProps {
    itemKey: string; // 选项的唯一标识
    multiple?: boolean; // 是否多选
}
export interface MSelectionInstance {
    selectedItems: Array<string | number>; // 已选项列表
    isAllSelected: boolean; // 是否全选
    isPartiallySelected: boolean; // 是否部分选中（半选）
    selectAll(): void; // 全选
    clearSelection(): void; // 清空已选项
}
export interface MSelectionContext {
    setSelected: (value: string | number) => void; // 切换/设置选中状态
    isSelected: (value: string | number) => boolean; // 判断是否选中
    register: (value: string | number) => void; // 注册可选项
    unregister: (value: string | number) => void; // 取消注册可选项
    itemKey: string; // 选项的唯一标识
    multiple: boolean; // 是否多选
}
export const MSelectionContextKey: InjectionKey<MSelectionContext> = Symbol("MSelectionContextKey");

export interface MSelectionItemProps<T extends Record<string, any>> {
    data: T;
}
