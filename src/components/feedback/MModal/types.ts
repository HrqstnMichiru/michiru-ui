export interface MModalProps {
    maskClosable?: boolean;
    zIndex?: number;
    center?: boolean;
    top?: number;
    transition?: "fade-translate" | "slide-down" | "fade" | "none";

    title?: string;
    width?: number;
    header?: boolean;
    footer?: boolean;
    closable?: boolean;
    draggable?: boolean;
    fullscreen?: boolean;
    positiveText?: string;
    negativeText?: string;
    contentCenter?: boolean;
    scrollable?: boolean;
    loading?: boolean;
    positiveIcon?: string;
    negativeIcon?: string;
    showIcon?: boolean;
    contentStyle?: Record<string, string>;
    onPositiveClick?: () => Promise<boolean>;
    onNegativeClick?: () => void;
}

export interface MModalInstance {
    open: () => void;
    close: () => void;
}

export interface MModalEmits {
    (event: "after-close"): void;
}
