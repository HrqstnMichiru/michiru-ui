export type MActionSize = "small" | "medium" | "large";
type MActionVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";

// icon配合circle使用，text配合round使用
export interface MActionProps {
    type?: "text" | "icon";
    action: string;
    size?: MActionSize;
    disabled?: boolean;
    round?: boolean;
    circle?: boolean;
    color?: string;
    hoverable?: boolean;
    variant?: MActionVariant;
}

export interface MActionEmits {
    (e: "click"): void;
}
