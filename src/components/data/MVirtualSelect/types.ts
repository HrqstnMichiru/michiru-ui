import type { MOptionProps, MSelectProps } from "@/components/data/MSelect/types";

export interface MVirtualSelectProps extends Omit<MSelectProps, "maxHeight" | "maxCount"> {
    itemHeight?: number;
    bufferSize?: number;
    maxCount?: number;
    dataSource?: Array<MOptionProps>;
    tooltipMaxCount?: number;
}
