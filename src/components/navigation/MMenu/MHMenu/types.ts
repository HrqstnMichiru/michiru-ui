import type { InjectionKey } from "vue";

export interface MHMenuProps {
    router?: boolean; // 是否启用路由模式
    defaultActive?: string | number; // 默认激活菜单项
}
export interface MHMenuContext {
    isActive: (name: string | number) => boolean; // 判断菜单项是否激活
    setCurrent: (name: string | number) => void; // 设置当前激活菜单项
    registerState: (state: MHMenuItemModel) => void; // 注册菜单项
    registerNode: (item: MHMenuItemModel) => void; // 注册菜单项
}
export interface MHMenuInstance {
    currentPath: Array<MHMenuItemProps>;
}
export const MHMenuContextKey: InjectionKey<MHMenuContext> = Symbol("MHMenuContext");

export interface MHMenuItemProps {
    disabled?: boolean; // 是否禁用
    icon?: string; // 菜单图标
    name: string | number; // 菜单唯一标识
    label: string; // 菜单标题
}
export interface MHMenuItemModel {
    data: MHMenuItemProps; // 菜单项数据
    parentName?: string | number; // 父级菜单名称
    children?: MHMenuItemModel[]; // 子菜单项列表
    active: boolean; // 是否激活
}
export interface MHSubMenuContext {
    registerState: (state: MHMenuItemModel) => void; // 注册菜单项
    parentName: string | number; // 父级菜单标识
}
export interface MMenuNodeContext {
    hide(): void; // 隐藏菜单
}
export const MHSubMenuContextKey: InjectionKey<MHSubMenuContext> = Symbol("MHSubMenuContext");
export const MMenuNodeContextKey: InjectionKey<MMenuNodeContext> = Symbol("MMenuNodeContext");
