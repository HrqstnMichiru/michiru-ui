import type { InjectionKey } from "vue";

export type CollapseIconVariant = "gray" | "primary" | "success" | "warning" | "error" | "info" | "purple" | "pink";
export interface CollapseProps {
    duration?: number;
    name: string | number;
    title?: string;
    prefixIcon?: string;
    iconVariant?: CollapseIconVariant;
    content?: string;
    contentStyle?: Record<string, string>;
}

export interface CollapseGroupProps {
    accordion?: boolean;
    expanded?: boolean;
    duration?: number;
    defaultActive?: (string | number) | Array<string | number>;
}
export interface CollapseGroupInstance {
    expandAll(): void;
    collapseAll(): void;
}
export interface CollapseGroupContext {
    duration: number | undefined;
    accordion: boolean | undefined;
    expanded: boolean | undefined;
    register(name: string | number): void;
    toggle(name: string | number): void;
    isActive(name: string | number): boolean;
}
export const CollapseGroupContextKey: InjectionKey<CollapseGroupContext> = Symbol("CollapseGroupContext");
