import type { InjectionKey } from "vue";

export interface MBreadcrumbProps {
    separator?: string; // 分隔符
}

export interface MBreadcrumbContext {
    separator: string;
}

export const MBreadcrumbContextKey: InjectionKey<MBreadcrumbContext> = Symbol("MBreadcrumbContextKey");

export interface MBreadcrumbItemProps {
    text: string; // 面包屑项文本
    disabled?: boolean; // 是否禁用该面包屑项
    to?: string; // 路由跳转地址
}

export interface MBreadcrumbItemEmits {
    (e: "click"): void;
}
