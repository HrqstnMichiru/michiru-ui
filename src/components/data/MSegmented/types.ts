type MSegmentedSize = "small" | "medium" | "large";
type MSegmentedVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";

export interface MSegmentedOption {
    label: string;
    value: string | number;
    icon?: string;
    disabled?: boolean;
}

export interface MSegmentedProps {
    options: MSegmentedOption[];
    size?: MSegmentedSize;
    variant?: MSegmentedVariant;
    disabled?: boolean;
    block?: boolean; // 展开充满容器宽度
    iconOnly?: boolean; // 仅显示图标
}

export interface MSegmentedEmits {
    (e: "change"): void;
}
