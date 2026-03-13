<template>
    <div
        class="table-wrapper"
        :class="{
            [`table--${props.size}`]: true,
            'table--bordered': props.bordered
        }">
        <div class="table-column-register">
            <slot></slot>
        </div>

        <div ref="headerScrollbarRef" class="table-header-scrollbar">
            <div class="table-content">
                <div class="table-header-wrapper">
                    <div class="table-header-row table-grid-row" :style="headerGridStyle">
                        <div v-for="column in renderColumns" :key="column.key" class="table-header-cell" :class="getCellClass(column, true)" :style="getCellStyle(column, true)">
                            <template v-if="column.type === 'selection'">
                                <MCheckBox @click.stop :size="size" :model-value="checkAll" @update:model-value="toggleAll"></MCheckBox>
                            </template>
                            <template v-else-if="column.type === 'index'">
                                {{ column.label || "#" }}
                            </template>
                            <template v-else>
                                <RenderHeaderSlot v-if="column.slots?.header" :render="column.slots?.header" :scope="{ column }"></RenderHeaderSlot>
                                <template v-else>
                                    {{ column.label }}
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="data.length > 0"
            ref="bodyScrollbarRef"
            class="table-body-scrollbar"
            :style="{
                height: `${height}px`,
                maxHeight: `${maxHeight}px`
            }"
            v-loading="props.loading">
            <div class="table-content">
                <div class="table-body">
                    <div
                        v-for="(row, rowIndex) in data"
                        :key="getRowKey(row)"
                        class="table-body-row table-grid-row"
                        :class="{ 'table-body-row--hoverable': hoverable, 'table-body-row--striped': striped && rowIndex % 2 === 1 }"
                        :style="bodyGridStyle"
                        @click="handleRowClick(row)">
                        <div v-for="column in renderColumns" :key="column.key" class="table-body-cell" :class="getCellClass(column, false)" :style="getCellStyle(column, false)">
                            <template v-if="column.type === 'selection'">
                                <MCheckBox @click.stop :size="size" :model-value="isSelected(row)" @update:model-value="() => toggleRow(row)"></MCheckBox>
                            </template>
                            <template v-else-if="column.type === 'index'">
                                {{ rowIndex + 1 }}
                            </template>
                            <template v-else-if="column.slots?.default">
                                <div class="table-body-cell--scoped" :style="{ justifyContent: alignMap[column.aligns || 'center'] }">
                                    <RenderCellSlot :render="column.slots?.default" :scope="{ row, index: rowIndex, column }"></RenderCellSlot>
                                </div>
                            </template>
                            <template v-else-if="column.prop">
                                <span class="table-body-cell__value">
                                    <template v-if="column.tooltip">
                                        <MEllipsis :tooltip="column.tooltip" :placement="column.placement || 'top'" :max-lines="column.maxLines">{{ row[column.prop] }}</MEllipsis>
                                    </template>
                                    <template v-else>{{ row[column.prop] }}</template>
                                </span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <MEmpty
            v-else
            description="暂无数据"
            :style="{
                height: `${height}px`,
                maxHeight: `${maxHeight}px`
            }"></MEmpty>
    </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { MCheckBox, MEllipsis, MEmpty } from "@/components";
import vLoading from "@/directives/loading";
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, shallowReactive, useTemplateRef, watch, type CSSProperties, type PropType } from "vue";
import type { MRenderColumn, MResolvedColumn, MTableDefaultSlotScope, MTableEmits, MTableHeaderSlotScope, MTableFixed, MTableInstance, MTableProps } from "./types";
import { MTableContextKey } from "./types";

const DEFAULT_FIXED_COLUMN_WIDTH = "160px";
const SELECTION_COLUMN_WIDTH = "44px";
const INDEX_COLUMN_WIDTH = "72px";
const NATIVE_SCROLLBAR_COMPENSATION = 5.5;

defineOptions({
    name: "MTable"
});

const props = withDefaults(defineProps<MTableProps<T>>(), {
    size: "medium",
    loading: false
});
const emits = defineEmits<MTableEmits<T>>();

const headerScrollbarRef = useTemplateRef<HTMLDivElement>("headerScrollbarRef");
const bodyScrollbarRef = useTemplateRef<HTMLDivElement>("bodyScrollbarRef");
const slotColumns = reactive<MResolvedColumn[]>([]);
const selectedRows = shallowReactive<Map<keyof T, T>>(new Map());
const hasVerticalScrollbar = ref(false);
const showLeftShadow = ref(false);
const showRightShadow = ref(false);

let isSyncingScroll = false;
let bodyResizeObserver: ResizeObserver | null = null;

const RenderHeaderSlot = defineComponent({
    name: "MTableRenderHeaderSlot",
    props: {
        render: {
            type: Function as PropType<(scope: MTableHeaderSlotScope) => any>,
            required: true
        },
        scope: {
            type: Object as PropType<MTableHeaderSlotScope>,
            required: true
        }
    },
    setup(renderProps) {
        return () => renderProps.render(renderProps.scope);
    }
});

const RenderCellSlot = defineComponent({
    name: "MTableRenderCellSlot",
    props: {
        render: {
            type: Function as PropType<(scope: MTableDefaultSlotScope<T>) => any>,
            required: true
        },
        scope: {
            type: Object as PropType<MTableDefaultSlotScope<T>>,
            required: true
        }
    },
    setup(renderProps) {
        return () => renderProps.render(renderProps.scope);
    }
});

const alignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
};
const resolveFixedSide = (fixed?: MTableFixed): "left" | "right" | undefined => {
    if (fixed === true) return "left";
    if (fixed === "left" || fixed === "right") return fixed;
    return undefined;
};
const mergeCssLengths = (lengths: string[]) => {
    if (lengths.length === 0) return "0px";
    if (lengths.length === 1) return lengths[0]!;
    return `calc(${lengths.join(" + ")})`;
};
const normalizeWidth = (column: MResolvedColumn) => {
    if (column.minWidth !== undefined) return `minmax(${column.minWidth}px, 1fr)`;
    if (column.width !== undefined) return `${column.width}px`;
    if (column.type === "selection") return SELECTION_COLUMN_WIDTH;
    if (column.type === "index") return INDEX_COLUMN_WIDTH;
    return resolveFixedSide(column.fixed) ? DEFAULT_FIXED_COLUMN_WIDTH : "minmax(0, 1fr)";
};

const renderColumns = computed<MRenderColumn[]>(() => {
    const columns: MRenderColumn[] = slotColumns.map(column => ({
        ...column,
        trackWidth: normalizeWidth(column),
        fixedSide: resolveFixedSide(column.fixed)
    }));

    const leftOffsets: string[] = [];
    columns.forEach(column => {
        if (column.fixedSide !== "left") return;
        column.stickyOffset = mergeCssLengths(leftOffsets);
        leftOffsets.push(column.trackWidth);
    });

    const rightOffsets: string[] = [];
    [...columns].reverse().forEach(column => {
        if (column.fixedSide !== "right") return;
        column.stickyOffset = mergeCssLengths(rightOffsets);
        rightOffsets.push(column.trackWidth);
    });

    return columns;
});

const leftFixedColumns = computed(() => renderColumns.value.filter(column => column.fixedSide === "left"));
const rightFixedColumns = computed(() => renderColumns.value.filter(column => column.fixedSide === "right"));
const lastLeftFixedKey = computed(() => {
    const columns = leftFixedColumns.value;
    return columns[columns.length - 1]?.key;
});
const firstRightFixedKey = computed(() => rightFixedColumns.value[0]?.key);

const compensateTracks = (tracks: string[]) => {
    if (!hasVerticalScrollbar.value || tracks.length === 0) return tracks;
    return tracks.map((track, index) => (index === tracks.length - 1 ? `calc(${track} + ${NATIVE_SCROLLBAR_COMPENSATION}px)` : track));
};

const bodyGridStyle = computed<CSSProperties>(() => ({
    gridTemplateColumns: renderColumns.value.map(column => column.trackWidth).join(" ") || "minmax(0, 1fr)"
}));
const headerGridStyle = computed<CSSProperties>(() => ({
    gridTemplateColumns: compensateTracks(renderColumns.value.map(column => column.trackWidth)).join(" ") || "minmax(0, 1fr)"
}));

const updateScrollState = () => {
    const bodyEl = bodyScrollbarRef.value;
    if (!bodyEl) return;
    hasVerticalScrollbar.value = bodyEl.scrollHeight > bodyEl.clientHeight + 0.5;
    const maxScrollLeft = Math.max(0, bodyEl.scrollWidth - bodyEl.clientWidth);
    showLeftShadow.value = bodyEl.scrollLeft > 0.5;
    showRightShadow.value = bodyEl.scrollLeft < maxScrollLeft - 0.5;
};

const syncScrollPosition = (source: "header" | "body") => {
    if (isSyncingScroll) return;
    const headerEl = headerScrollbarRef.value;
    const bodyEl = bodyScrollbarRef.value;
    if (!headerEl || !bodyEl) return;

    isSyncingScroll = true;
    if (source === "body") headerEl.scrollLeft = bodyEl.scrollLeft;
    else bodyEl.scrollLeft = headerEl.scrollLeft;

    requestAnimationFrame(() => {
        isSyncingScroll = false;
    });
};

const handleBodyScroll = () => {
    syncScrollPosition("body");
    updateScrollState();
};

const getCellStyle = (column: MRenderColumn, isHeader: boolean): CSSProperties => {
    const style: CSSProperties = {
        textAlign: column.aligns || "center"
    };
    if (!column.fixedSide) return style;
    style.position = "sticky";
    style.zIndex = isHeader ? 10 : 4;
    if (column.fixedSide === "left") style.left = column.stickyOffset || "0px";
    if (column.fixedSide === "right") style.right = column.stickyOffset || "0px";
    return style;
};

const getCellClass = (column: MRenderColumn, isHeader: boolean) => ({
    [isHeader ? "table-header-check" : "table-body-check"]: column.type === "selection",
    "table-cell--index": column.type === "index",
    "table-cell--fixed-left": column.fixedSide === "left",
    "table-cell--fixed-right": column.fixedSide === "right",
    "table-cell--fixed-left-shadow": column.key === lastLeftFixedKey.value && showLeftShadow.value,
    "table-cell--fixed-right-shadow": column.key === firstRightFixedKey.value && showRightShadow.value
});

const hasSelectionColumn = computed(() => renderColumns.value.some(column => column.type === "selection"));
const checkAll = computed(() => hasSelectionColumn.value && props.data.length > 0 && selectedRows.size === props.data.length);

const getRowKey = (row: T) => {
    return row[props.rowKey];
};
const isSelected = (row: T) => selectedRows.has(row[props.rowKey]);
const getSelectedRows = () => Array.from(selectedRows.values());
const clearSelection = () => selectedRows.clear();

const toggleAll = () => {
    if (!hasSelectionColumn.value) return;
    if (checkAll.value) selectedRows.clear();
    else props.data.forEach(row => selectedRows.set(row[props.rowKey], row));
    emits("selection-change", getSelectedRows());
};
const toggleRow = (row: T) => {
    if (!hasSelectionColumn.value) return;
    const key = row[props.rowKey];
    if (selectedRows.has(key)) selectedRows.delete(key);
    else {
        selectedRows.set(key, row);
        emits("row-select", row);
    }
    emits("selection-change", getSelectedRows());
};
const handleRowClick = (row: T) => emits("row-click", row);

provide(MTableContextKey, {
    registerColumn(column) {
        const key = Symbol("table-column");
        slotColumns.push({
            ...column,
            key
        });
        return key;
    },
    updateColumn(key, column) {
        const index = slotColumns.findIndex(item => item.key === key);
        if (index === -1) return;
        slotColumns[index] = {
            ...column,
            key
        };
    },
    unregisterColumn(key) {
        const index = slotColumns.findIndex(item => item.key === key);
        if (index === -1) return;
        slotColumns.splice(index, 1);
    }
});

// 监听数据变化，清空选择并更新滚动状态
watch(
    () => props.data,
    () => {
        selectedRows.clear();
        nextTick(updateScrollState);
    }
);

// 监听列配置变化，更新滚动状态和滚动位置
watch(
    renderColumns,
    () => {
        nextTick(() => {
            updateScrollState();
            handleBodyScroll();
        });
    },
    { deep: true }
);

onMounted(() => {
    const bodyEl = bodyScrollbarRef.value;
    bodyEl?.addEventListener("scroll", handleBodyScroll, { passive: true });
    if (bodyEl) {
        bodyResizeObserver = new ResizeObserver(updateScrollState);
        bodyResizeObserver.observe(bodyEl);
    }
    nextTick(() => {
        updateScrollState();
        handleBodyScroll();
    });
});

onBeforeUnmount(() => {
    const bodyEl = bodyScrollbarRef.value;
    bodyEl?.removeEventListener("scroll", handleBodyScroll);
    bodyResizeObserver?.disconnect();
    bodyResizeObserver = null;
});

defineExpose<MTableInstance<T>>({
    getSelectedRows,
    get selectionSize() {
        return selectedRows.size;
    },
    toggleRowSelected: toggleRow,
    clearSelection
});
</script>

<style lang="scss" scoped>
.table-wrapper {
    --table-cell-padding-y: 8px;
    --table-cell-padding-x: 12px;
    --table-font-size: 14px;
    --table-line-height: 21px;
    --table-header-color: #909399;
    --table-body-color: #606266;
    --table-row-bg: #fff;
    --table-row-hover-bg: #ecf5ff;
    --table-row-striped-bg: #f5f7fa;
    --table-border-color: #ebeef5;
    --table-shadow-width: 12px;
    --table-shadow-color: rgba(0, 0, 0, 0.12);
    width: 100%;
    background: #fff;

    &.table--small {
        --table-cell-padding-y: 6px;
        --table-cell-padding-x: 8px;
        --table-font-size: 12px;
        --table-line-height: 18px;
    }

    &.table--large {
        --table-cell-padding-y: 10px;
        --table-cell-padding-x: 14px;
        --table-line-height: 24px;
    }

    &.table--bordered {
        border: 1px solid var(--table-border-color);

        .table-header-cell,
        .table-body-cell {
            border-right: 1px solid var(--table-border-color);
        }

        .table-header-cell:last-child,
        .table-body-cell:last-child {
            border-right: none;
        }
    }
}

.table-column-register {
    display: none;
}

.table-header-scrollbar {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        height: 0;
    }
}

.table-body-scrollbar {
    width: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;

        &:hover {
            background-color: rgba(0, 0, 0, 0.3);
        }
    }
}

.table-content,
.table-grid-row,
.table-body {
    width: max-content;
    min-width: 100%;
}

.table-content {
    position: relative;
}

.table-grid-row {
    display: grid;
    align-items: stretch;
}

.table-header-wrapper {
    z-index: 6;
    background: #fff;
}

.table-header-cell,
.table-body-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
    font-size: var(--table-font-size);
    line-height: var(--table-line-height);
    text-align: center;
    box-sizing: border-box;
}

.table-header-cell {
    color: var(--table-header-color);
    font-weight: 500;
    background: #fff;
    border-bottom: 1px solid var(--table-border-color);
    text-wrap: nowrap;
}

.table-body-row {
    --table-current-row-bg: var(--table-row-bg);
    background-color: var(--table-current-row-bg);
    transition: background-color 0.2s ease;

    &.table-body-row--striped {
        --table-current-row-bg: var(--table-row-striped-bg);
    }

    &.table-body-row--hoverable {
        cursor: pointer;

        &:hover {
            --table-current-row-bg: var(--table-row-hover-bg);
        }
    }

    .table-body-cell {
        border-bottom: 1px solid var(--table-border-color);
    }
}

.table-body-cell {
    min-width: 0;
    position: relative;
    color: var(--table-body-color);
    font-weight: 400;
    word-break: break-word;
    background-color: var(--table-current-row-bg);
}

.table-body-cell--scoped {
    width: 100%;
    display: flex;
    align-items: center;
}

.table-body-cell__value {
    display: inline-block;
    width: 100%;
}

.table-header-check,
.table-body-check,
.table-cell--index {
    text-align: center;
}

.table-cell--fixed-left,
.table-cell--fixed-right {
    position: sticky;
    z-index: 4;
    overflow: visible;
    background-color: var(--table-current-row-bg, #fff);
    background-clip: padding-box;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: -1px;
        width: var(--table-shadow-width);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.18s ease;
        z-index: 2;
    }
}

.table-header-cell.table-cell--fixed-left,
.table-header-cell.table-cell--fixed-right {
    z-index: 10;
    background-color: #fff;
}

.table-cell--fixed-left-shadow::after {
    right: calc(var(--table-shadow-width) * -1);
    opacity: 1;
    background: linear-gradient(to right, var(--table-shadow-color), rgba(0, 0, 0, 0));
}

.table-cell--fixed-right-shadow::after {
    left: calc(var(--table-shadow-width) * -1);
    opacity: 1;
    background: linear-gradient(to left, var(--table-shadow-color), rgba(0, 0, 0, 0));
}
</style>
