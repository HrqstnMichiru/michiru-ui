import type { MTreeData } from "@/components/dispaly/MTree/types";
import type { MSelectProps } from "@/components/data/MSelect/types";

export interface MTreeSelectProps<T extends MTreeData> extends MSelectProps {
    nodeKey?: string;
    nodeLabel?: string;
    data?: T[];
    onlyLeaf?: boolean;
    syncParentWithChildren?: boolean;
    selectedKeys?: Array<string | number>;
    expandAll?: boolean;
    duration?: number;
    accordion?: boolean;
}

export interface MTreeSelectEmits {
    (e: "change"): void;
}
