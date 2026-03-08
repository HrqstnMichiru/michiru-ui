import type { InjectionKey } from "vue";

export interface MVMenuProps {
    width?: number; // 菜单宽度
    collapsed?: boolean; // 是否折叠菜单
    expanded?: boolean; // 子菜单是否全部展开
    accordion?: boolean; // 是否启用手风琴模式
    duration?: number; // 动画时长，单位毫秒
    router?: boolean; // 是否启用路由模式
    defaultActive?: string | number; // 默认激活菜单名称
}
export interface MVMenuContext {
    duration: number; // 动画时长
    collapsed: boolean; // 菜单折叠状态
    isActive: (name: string | number) => boolean; // 判断菜单项是否激活
    register: (item: MVMenuItemModel) => void; // 注册菜单项
    setCurrent: (name: string | number) => void; // 设置当前激活菜单项
    isExpanded: (name: string | number) => boolean; // 判断子菜单是否展开
    registerState: (state: { active: boolean; name: string | number }) => void; // 注册菜单项状态
}
export interface MVMenuInstance {
    toggleCollapse: () => void;
    currentPath: Array<MVMenuItemProps>;
}
export const MVMenuContextKey: InjectionKey<MVMenuContext> = Symbol("MVMenuContext");

export interface MVMenuItemProps {
    label: string; // 菜单标签
    name: string | number; // 菜单唯一标识
    icon: string; // 菜单图标
    disabled?: boolean; // 是否禁用
}
export interface MVMenuItemModel {
    data: MVMenuItemProps; // 菜单项数据
    isLeaf: boolean; // 是否为叶子节点
    parentName?: string | number; // 父级菜单路径
    children?: Array<string | number>; // 子菜单名称列表
}
export interface MVSubMenuContext {
    level: number; // 菜单层级
    parentName: string | number; // 父级菜单路径
    hide: () => void; // 隐藏子菜单
    registerState: (state: { active: boolean; name: string | number }) => void; // 注册菜单项
}
export const MVSubMenuContextKey: InjectionKey<MVSubMenuContext> = Symbol("MVSubMenuContext");
