type SegmentedSize = "small" | "medium" | "large";
type SegmentedVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";

export interface SegmentedOption {
    label: string;
    value: string | number;
    icon?: string;
    disabled?: boolean;
}

export interface SegmentedProps {
    options: SegmentedOption[];
    size?: SegmentedSize;
    variant?: SegmentedVariant;
    disabled?: boolean;
    block?: boolean; // 展开充满容器宽度
    iconOnly?: boolean; // 仅显示图标
}

export interface SegmentedEmits {
    (e: "change"): void;
}
