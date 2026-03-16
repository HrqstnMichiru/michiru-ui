type MSegmentedSize = "small" | "medium" | "large";
type MSegmentedType = "default" | "line" | "bar";
type MSegmentedVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";

export interface MSegmentedOption {
    label: string;
    value: string | number;
    icon?: string;
    disabled?: boolean;
}

export interface MSegmentedProps {
    options: MSegmentedOption[];
    type?: MSegmentedType;
    size?: MSegmentedSize;
    variant?: MSegmentedVariant;
    disabled?: boolean;
    block?: boolean; // 展开充满容器宽度
    iconOnly?: boolean; // 仅显示图标
    gap?: number; // 仅在 type 为 line 和 bar 时有效，表示选项之间的间距
}

export interface MSegmentedEmits {
    (e: "change"): void;
}
