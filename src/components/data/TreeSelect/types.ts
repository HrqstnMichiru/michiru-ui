import type { TreeData } from "../../dispaly/Tree/types";
import type { SelectProps } from "../Select/types";

export interface TreeSelectProps<T extends TreeData> extends SelectProps {
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

export interface TreeSelectEmits {
    (e: "change"): void;
}
