import type { SelectOptionProps, SelectProps } from "../Select/types";

export interface VirtualSelectProps extends Omit<SelectProps, "maxHeight" | "maxCount"> {
    itemHeight?: number;
    bufferSize?: number;
    maxCount?: number;
    dataSource?: Array<SelectOptionProps>;
    tooltipMaxCount?: number;
}
