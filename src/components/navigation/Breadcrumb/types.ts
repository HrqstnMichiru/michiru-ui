import type { InjectionKey } from "vue";

export interface BreadcrumbProps {
    separator?: string; // 分隔符
}

export interface BreadcrumbContext {
    separator: string;
}

export const BreadcrumbContextKey: InjectionKey<BreadcrumbContext> = Symbol("BreadcrumbContextKey");

export interface BreadcrumbItemProps {
    text: string; // 面包屑项文本
    disabled?: boolean; // 是否禁用该面包屑项
    to?: string; // 路由跳转地址
}

export interface BreadcrumbItemEmits {
    (e: "click"): void;
}
