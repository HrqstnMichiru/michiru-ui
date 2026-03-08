export interface MModalProps {
    // MOverlay Props
    maskClosable?: boolean;
    maskTheme?: "light" | "dark" | "no-mask";
    zIndex?: number;
    center?: boolean;
    top?: number;
    blurable?: boolean;
    transition?: "fade-translate" | "slide-down" | "none";
    lock?: boolean;

    // MModal Props
    title?: string;
    width?: number;
    footer?: boolean;
    closable?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    fullscreen?: boolean;
    positiveText?: string;
    negativeText?: string;
    contentCenter?: boolean;
    scrollable?: boolean;
    showScrollbar?: boolean;
    loading?: boolean;
    positiveIcon?: string;
    negativeIcon?: string;
    showIcon?: boolean;
    contentStyle?: Record<string, string>;
    headerStyle?: Record<string, string>;
    onPositiveClick?: () => Promise<boolean>;
    onNegativeClick?: () => void;
}

export interface MModalInstance {
    open: () => void;
    close: () => void;
    lazyClose: () => void;
}

export interface MModalEmits {
    (event: "after-close"): void;
}
