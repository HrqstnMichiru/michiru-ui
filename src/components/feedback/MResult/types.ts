export type MResultStatus = "success" | "info" | "warning" | "danger" | "primary";

export interface MResultProps {
    status?: MResultStatus;
    title?: string;
    description?: string;
    icon?: string;
    iconSize?: number;
}
