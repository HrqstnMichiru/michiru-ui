import type { InjectionKey } from "vue";

export type MCollapseIconVariant = "gray" | "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";
export interface MCollapseProps {
    duration?: number;
    name: string | number;
    title?: string;
    prefixIcon?: string;
    iconVariant?: MCollapseIconVariant;
    content?: string;
    contentStyle?: Record<string, string>;
}

export interface MCollapseGroupProps {
    accordion?: boolean;
    expanded?: boolean;
    duration?: number;
    defaultActive?: (string | number) | Array<string | number>;
}
export interface MCollapseGroupInstance {
    expandAll(): void;
    collapseAll(): void;
}
export interface MCollapseGroupContext {
    duration: number | undefined;
    accordion: boolean | undefined;
    expanded: boolean | undefined;
    register(name: string | number): void;
    toggle(name: string | number): void;
    isActive(name: string | number): boolean;
}
export const MCollapseGroupContextKey: InjectionKey<MCollapseGroupContext> = Symbol("MCollapseGroupContext");
