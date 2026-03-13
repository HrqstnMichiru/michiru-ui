import type { MPlacement } from "@/components/feedback/MTooltip/types";
import type { PropType } from "vue";
import { defineComponent, inject, onBeforeUnmount, onMounted, useSlots, watch } from "vue";
import type { MTableAlign, MTableColType, MTableColumnConfig, MTableColumnSlots, MTableContext, MTableFixed } from "./types";
import { MTableContextKey } from "./types";

const MTableCol = defineComponent({
    name: "MTableCol",
    props: {
        prop: String,
        label: String,
        width: Number,
        minWidth: Number,
        aligns: String as PropType<MTableAlign>,
        fixed: [Boolean, String] as PropType<MTableFixed>,
        type: String as PropType<MTableColType>,
        tooltip: Boolean,
        placement: String as PropType<MPlacement>,
        maxLines: Number
    },
    setup(props) {
        const tableContext = inject<MTableContext>(MTableContextKey);
        const slots = useSlots();
        let columnId: symbol | null = null;

        const createColumn = (): MTableColumnConfig => ({
            ...props,
            slots: {
                default: slots.default,
                header: slots.header
            } as MTableColumnSlots
        });

        onMounted(() => {
            if (!tableContext) return;
            columnId = tableContext.registerColumn(createColumn());
        });

        watch(
            () => [props.prop, props.label, props.width, props.minWidth, props.aligns, props.fixed, props.type],
            () => {
                if (!tableContext || !columnId) return;
                tableContext.updateColumn(columnId, createColumn());
            }
        );

        onBeforeUnmount(() => {
            // 这一步主要是在列组件上加了v-if的情况下，列组件被销毁时能够正确地从表格上下文中注销
            if (!tableContext || !columnId) return;
            tableContext.unregisterColumn(columnId);
            columnId = null;
        });

        return () => null;
    }
});

export default MTableCol;
