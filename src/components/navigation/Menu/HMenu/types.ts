import type { InjectionKey } from "vue";

export interface HMenuProps {
    router?: boolean; // 是否启用路由模式
    defaultActive?: string | number; // 默认激活菜单项
}
export interface HMenuContext {
    isActive: (name: string | number) => boolean; // 判断菜单项是否激活
    setCurrent: (name: string | number) => void; // 设置当前激活菜单项
    registerState: (state: HMenuItemModel) => void; // 注册菜单项
    registerNode: (item: HMenuItemModel) => void; // 注册菜单项
}
export interface HMenuInstance {
    currentPath: Array<HMenuItemProps>;
}
export const HMenuContextKey: InjectionKey<HMenuContext> = Symbol("HMenuContext");

export interface HMenuItemProps {
    disabled?: boolean; // 是否禁用
    icon?: string; // 菜单图标
    name: string | number; // 菜单唯一标识
    label: string; // 菜单标题
}
export interface HMenuItemModel {
    data: HMenuItemProps; // 菜单项数据
    parentName?: string | number; // 父级菜单名称
    children?: HMenuItemModel[]; // 子菜单项列表
    active: boolean; // 是否激活
}
export interface HSubMenuContext {
    registerState: (state: HMenuItemModel) => void; // 注册菜单项
    parentName: string | number; // 父级菜单标识
}
export interface MenuNodeContext {
    hide(): void; // 隐藏菜单
}
export const HSubMenuContextKey: InjectionKey<HSubMenuContext> = Symbol("HSubMenuContext");
export const MenuNodeContextKey: InjectionKey<MenuNodeContext> = Symbol("MenuNodeContext");
