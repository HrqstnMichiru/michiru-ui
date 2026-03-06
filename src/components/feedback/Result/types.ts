export type ResultStatus = "success" | "info" | "warning" | "danger" | "primary";

export interface ResultProps {
    status?: ResultStatus;
    title?: string;
    description?: string;
    icon?: string;
    iconSize?: number;
}
