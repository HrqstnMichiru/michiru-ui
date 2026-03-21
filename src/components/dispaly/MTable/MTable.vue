<template>
    <div
        class="m-table"
        v-loading="loading"
        :class="{
            [`m-table--${size}`]: true,
            'm-table--bordered': bordered
        }">
        <div class="m-table-column-register">
            <slot></slot>
        </div>

        <div ref="headerScrollbarRef" data-overlayscrollbars-initialize>
            <div class="m-table-header-row m-table-grid-row" :style="headerGridStyle">
                <div v-if="showCheckbox" class="m-table-header-cell m-table-header-check" :class="getBuiltinCellClass('selection')" :style="getBuiltinCellStyle('selection', true)">
                    <MCheckBox v-if="multiple" @click.stop :size="size" :model-value="checkState" @update:model-value="toggleAll" variant="purple"></MCheckBox>
                </div>
                <div v-if="showIndex" class="m-table-header-cell m-table-cell--index" :class="getBuiltinCellClass('index')" :style="getBuiltinCellStyle('index', true)">#</div>
                <div v-for="column in renderColumns" :key="column.key" class="m-table-header-cell" :class="getCellClass(column)" :style="getCellStyle(column, true)">
                    <RenderSlot v-if="column.slots?.header" :render="column.slots?.header" :scope="{ column }"></RenderSlot>
                    <template v-else>
                        {{ column.label }}
                    </template>
                </div>
            </div>
        </div>

        <div
            v-if="data.length > 0"
            ref="bodyScrollbarRef"
            data-overlayscrollbars-initialize
            :style="{
                height: `${height}px`
            }">
            <div
                v-for="(row, rowIndex) in data"
                :key="getRowKey(row)"
                class="m-table-body-row m-table-grid-row"
                :class="{
                    'm-table-body-row--hoverable': hoverable,
                    'm-table-body-row--striped': striped && rowIndex % 2 === 1,
                    'm-table-body-row--current': isCurrentRow(row)
                }"
                :style="bodyGridStyle"
                @click="handleRowClick(row)">
                <div v-if="showCheckbox" class="m-table-body-cell m-table-body-check" :class="getBuiltinCellClass('selection')" :style="getBuiltinCellStyle('selection', false)">
                    <MCheckBox v-if="multiple" @click.stop :size="size" :model-value="isSelected(row)" @update:model-value="() => toggleRow(row)" variant="purple"></MCheckBox>
                    <MRadioBox v-else @click.stop :size="size" :model-value="isSelected(row)" @update:model-value="() => toggleRow(row)" variant="purple"></MRadioBox>
                </div>
                <div v-if="showIndex" class="m-table-body-cell m-table-cell--index" :class="getBuiltinCellClass('index')" :style="getBuiltinCellStyle('index', false)">
                    {{ rowIndex + 1 }}
                </div>
                <div v-for="column in renderColumns" :key="column.key" class="m-table-body-cell" :class="getCellClass(column)" :style="getCellStyle(column, false)">
                    <template v-if="column.slots?.default">
                        <div class="m-table-body-cell--scoped" :style="{ justifyContent: alignMap[column.aligns || 'center'] }">
                            <RenderSlot :render="column.slots?.default" :scope="{ row, index: rowIndex }"></RenderSlot>
                        </div>
                    </template>
                    <template v-else-if="column.prop">
                        <span class="m-table-body-cell__value">
                            <template v-if="column.tooltip">
                                <MEllipsis :tooltip="column.tooltip" :max-lines="column.maxLines">{{ row[column.prop] }}</MEllipsis>
                            </template>
                            <template v-else>{{ row[column.prop] }}</template>
                        </span>
                    </template>
                </div>
            </div>
        </div>

        <MEmpty
            v-else
            description="暂无数据"
            :style="{
                height: `${height}px`
            }"></MEmpty>
    </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { MCheckBox, MEllipsis, MEmpty, MRadioBox } from "@/components";
import type { MCheckBoxState } from "@/components/data/MCheckBox/types";
import vLoading from "@/directives/loading";
import { OverlayScrollbars } from "OverlayScrollbars";
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, shallowReactive, useTemplateRef, watch, type CSSProperties, type PropType } from "vue";
import type { MRenderColumn, MResolvedColumn, MTableEmits, MTableFixed, MTableInstance, MTableProps, MTableSlotScope } from "./types";
import { MTableContextKey } from "./types";

const DEFAULT_FIXED_COLUMN_WIDTH = "160px";
const SELECTION_COLUMN_WIDTH = "44px";
const INDEX_COLUMN_WIDTH = "72px";
type BuiltinColumnKind = "selection" | "index";

defineOptions({
    name: "MTable"
});

const props = withDefaults(defineProps<MTableProps<T>>(), {
    size: "medium"
});
const emits = defineEmits<MTableEmits<T>>();

const headerScrollbarRef = useTemplateRef<HTMLDivElement>("headerScrollbarRef");
const bodyScrollbarRef = useTemplateRef<HTMLDivElement>("bodyScrollbarRef");
const slotColumns = reactive<MResolvedColumn<T>[]>([]);
const selectedRows = shallowReactive<Map<keyof T, T>>(new Map()); // 选中的行
const showLeftShadow = ref<boolean>(false); // 左侧阴影仅在存在垂直滚动条且有左侧固定列时显示
const showRightShadow = ref<boolean>(false); // 右侧阴影仅在存在垂直滚动条且有右侧固定列时显示
const headerTrackWidths = ref<string[]>([]);
const currentRow = ref<T | null>(null); // 当前行数据

let isSyncingScroll = false; // 是否正在同步滚动位置
let bodyResizeObserver: ResizeObserver | null = null;
let bodyScrollTarget: HTMLElement | null = null;
let bodyContentTarget: HTMLElement | null = null;
let headerScrollbarInstance: ReturnType<typeof OverlayScrollbars> | null = null;
let bodyScrollbarInstance: ReturnType<typeof OverlayScrollbars> | null = null;
let removeHeaderScrollListener: (() => void) | null = null;
let removeBodyScrollListener: (() => void) | null = null;

const RenderSlot = defineComponent({
    name: "MTableRenderSlot",
    props: {
        render: {
            type: Function as PropType<(scope: MTableSlotScope<T>) => any>,
            required: true
        },
        scope: {
            type: Object as PropType<MTableSlotScope<T>>,
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
const leadingBuiltinTracks = computed<string[]>(() => {
    const tracks: string[] = [];
    if (props.showCheckbox) tracks.push(SELECTION_COLUMN_WIDTH);
    if (props.showIndex) tracks.push(INDEX_COLUMN_WIDTH);
    return tracks;
});
const builtinColumnCount = computed(() => leadingBuiltinTracks.value.length);

const shouldSyncTrackWidth = (column: MResolvedColumn<T>) => column.minWidth !== undefined || column.maxWidth !== undefined;

const normalizeWidth = (column: MResolvedColumn<T>) => {
    if (column.width !== undefined) return `${column.width}px`;
    if (column.minWidth !== undefined && column.maxWidth !== undefined) {
        const minWidth = Math.min(column.minWidth, column.maxWidth);
        const maxWidth = Math.max(column.minWidth, column.maxWidth);
        return `minmax(${minWidth}px, ${maxWidth}px)`;
    }
    if (column.minWidth !== undefined) return `minmax(${column.minWidth}px, 1fr)`;
    if (column.maxWidth !== undefined) return `minmax(0, ${column.maxWidth}px)`;
    return resolveFixedSide(column.fixed) ? DEFAULT_FIXED_COLUMN_WIDTH : "minmax(0, 1fr)";
};

const renderColumns = computed<MRenderColumn<T>[]>(() => {
    const columns: MRenderColumn<T>[] = slotColumns.map(column => ({
        ...column,
        trackWidth: normalizeWidth(column),
        fixedSide: resolveFixedSide(column.fixed)
    }));

    const leftOffsets: string[] = [...leadingBuiltinTracks.value];
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
const leftFixedTokens = computed<Array<BuiltinColumnKind | symbol>>(() => {
    const tokens: Array<BuiltinColumnKind | symbol> = [];
    if (props.showCheckbox) tokens.push("selection");
    if (props.showIndex) tokens.push("index");
    leftFixedColumns.value.forEach(column => tokens.push(column.key));
    return tokens;
});
const lastLeftFixedToken = computed(() => {
    const tokens = leftFixedTokens.value;
    return tokens[tokens.length - 1];
});
const firstRightFixedKey = computed(() => rightFixedColumns.value[0]?.key);

const bodyGridStyle = computed<CSSProperties>(() => ({
    gridTemplateColumns: [...leadingBuiltinTracks.value, ...renderColumns.value.map(column => column.trackWidth)].join(" ") || "minmax(0, 1fr)"
}));
const headerGridStyle = computed<CSSProperties>(() => ({
    gridTemplateColumns:
        [
            ...leadingBuiltinTracks.value,
            ...renderColumns.value.map((column, index) => {
                if (!shouldSyncTrackWidth(column)) return column.trackWidth;
                return headerTrackWidths.value[index] || column.trackWidth;
            })
        ].join(" ") || "minmax(0, 1fr)"
}));

const syncHeaderTrackWidths = () => {
    const bodyEl = bodyContentTarget || bodyScrollbarInstance?.elements().content || bodyScrollbarRef.value;
    if (!bodyEl || props.data.length === 0) {
        if (headerTrackWidths.value.length > 0) headerTrackWidths.value = [];
        return;
    }

    const bodyRows = Array.from(bodyEl.querySelectorAll<HTMLElement>(".table-body-row"));
    const columnOffset = builtinColumnCount.value;
    const nextTrackWidths = renderColumns.value.map((column, index) => {
        if (!shouldSyncTrackWidth(column)) return "";

        const measuredWidth = bodyRows.reduce((maxWidth, row) => {
            const cell = row.children[index + columnOffset] as HTMLElement | undefined;
            if (!cell) return maxWidth;
            return Math.max(maxWidth, Math.ceil(cell.getBoundingClientRect().width));
        }, column.minWidth || 0);

        const boundedWidth = column.maxWidth !== undefined ? Math.min(measuredWidth, column.maxWidth) : measuredWidth;
        return `${boundedWidth}px`;
    });

    const hasChanged = nextTrackWidths.length !== headerTrackWidths.value.length || nextTrackWidths.some((width, index) => width !== headerTrackWidths.value[index]);

    if (hasChanged) {
        headerTrackWidths.value = nextTrackWidths;
    }
};

const updateScrollState = () => {
    const bodyEl = bodyScrollbarInstance?.elements().scrollOffsetElement || bodyScrollTarget;
    if (!bodyEl) return;
    const maxScrollLeft = Math.max(0, bodyEl.scrollWidth - bodyEl.clientWidth);
    showLeftShadow.value = bodyEl.scrollLeft > 0.5;
    showRightShadow.value = bodyEl.scrollLeft < maxScrollLeft - 0.5;
};

const syncScrollPosition = (source: "header" | "body") => {
    if (isSyncingScroll) return;
    const headerEl = headerScrollbarInstance?.elements().scrollOffsetElement;
    const bodyEl = bodyScrollbarInstance?.elements().scrollOffsetElement;
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

const handleHeaderScroll = () => {
    syncScrollPosition("header");
    updateScrollState();
};

const cleanupBodyScrollTarget = () => {
    bodyResizeObserver?.disconnect();
    bodyResizeObserver = null;
    bodyScrollTarget = null;
    bodyContentTarget = null;
    showLeftShadow.value = false;
    showRightShadow.value = false;
    headerTrackWidths.value = [];
};

const refreshTableLayout = (syncScroll = false) => {
    headerScrollbarInstance?.update(true);
    bodyScrollbarInstance?.update(true);
    syncHeaderTrackWidths();
    if (syncScroll) handleBodyScroll();
    else updateScrollState();
};

const destroyHeaderScrollbar = () => {
    removeHeaderScrollListener?.();
    removeHeaderScrollListener = null;
    headerScrollbarInstance?.destroy();
    headerScrollbarInstance = null;
};

const destroyBodyScrollbar = () => {
    removeBodyScrollListener?.();
    removeBodyScrollListener = null;
    bodyScrollbarInstance?.destroy();
    bodyScrollbarInstance = null;
    cleanupBodyScrollTarget();
};

const setupHeaderScrollTarget = () => {
    const headerEl = headerScrollbarRef.value;
    if (!headerEl) return;
    if (headerScrollbarInstance && headerScrollbarInstance.elements().target === headerEl) return;

    destroyHeaderScrollbar();
    headerScrollbarInstance = OverlayScrollbars(headerEl, {
        scrollbars: {
            clickScroll: true,
            theme: "os-theme-dark",
            visibility: "hidden"
        },
        overflow: {
            y: "hidden"
        }
    });
    removeHeaderScrollListener = headerScrollbarInstance.on("scroll", handleHeaderScroll);
};

const setupBodyScrollTarget = () => {
    const bodyEl = bodyScrollbarRef.value;
    if (!bodyEl) {
        destroyBodyScrollbar();
        return;
    }
    if (!bodyScrollbarInstance || bodyScrollbarInstance.elements().target !== bodyEl) {
        destroyBodyScrollbar();
        bodyScrollbarInstance = OverlayScrollbars(bodyEl, {
            scrollbars: {
                clickScroll: true,
                theme: "os-theme-dark"
            }
        });
        removeBodyScrollListener = bodyScrollbarInstance.on("scroll", handleBodyScroll);
    }

    bodyResizeObserver?.disconnect();
    bodyScrollTarget = bodyScrollbarInstance.elements().scrollOffsetElement;
    bodyContentTarget = bodyScrollbarInstance.elements().content;
    bodyResizeObserver = new ResizeObserver(() => {
        syncHeaderTrackWidths();
        updateScrollState();
    });
    bodyResizeObserver.observe(bodyScrollTarget);
    if (bodyContentTarget && bodyContentTarget !== bodyScrollTarget) bodyResizeObserver.observe(bodyContentTarget);

    nextTick(() => {
        refreshTableLayout(true);
    });
};

const getCellStyle = (column: MRenderColumn<T>, isHeader: boolean): CSSProperties => {
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

const getBuiltinCellStyle = (kind: BuiltinColumnKind, isHeader: boolean): CSSProperties => {
    const style: CSSProperties = {
        position: "sticky",
        zIndex: isHeader ? 10 : 4
    };
    if (kind === "selection") {
        style.left = "0px";
    } else {
        style.left = props.showCheckbox ? SELECTION_COLUMN_WIDTH : "0px";
    }
    return style;
};

const getBuiltinCellClass = (kind: BuiltinColumnKind) => ({
    "m-table-cell--fixed-left": true,
    "m-table-cell--fixed-left-shadow": lastLeftFixedToken.value === kind && showLeftShadow.value
});

const getCellClass = (column: MRenderColumn<T>) => ({
    "m-table-cell--fixed-left": column.fixedSide === "left",
    "m-table-cell--fixed-right": column.fixedSide === "right",
    "m-table-cell--fixed-left-shadow": column.key === lastLeftFixedToken.value && showLeftShadow.value,
    "m-table-cell--fixed-right-shadow": column.key === firstRightFixedKey.value && showRightShadow.value
});

const checkAll = computed(() => props.showCheckbox && !!props.multiple && props.data.length > 0 && selectedRows.size === props.data.length);
const checkPartially = computed(() => props.showCheckbox && !!props.multiple && selectedRows.size > 0 && selectedRows.size < props.data.length);
const checkState = computed<MCheckBoxState>(() => {
    if (checkAll.value) return true;
    if (checkPartially.value) return "indeterminate";
    return false;
});

const getRowKey = (row: T) => {
    return row[props.rowKey];
};
const isCurrentRow = (row: T) => {
    if (!props.highlightCurrentRow || !currentRow.value) return false;
    return getRowKey(currentRow.value) === getRowKey(row);
};
const isSelected = (row: T) => selectedRows.has(getRowKey(row));
const getSelectedRows = () => Array.from(selectedRows.values());
const clearSelection = () => selectedRows.clear();

const toggleAll = () => {
    if (!props.showCheckbox || !props.multiple) return;
    if (checkAll.value) selectedRows.clear();
    else props.data.forEach(row => selectedRows.set(getRowKey(row), row));
    emits("selection-change", getSelectedRows());
};
const toggleRow = (row: T) => {
    if (!props.showCheckbox) return;
    const key = getRowKey(row);
    if (!props.multiple) {
        if (selectedRows.has(key)) {
            selectedRows.clear();
        } else {
            selectedRows.clear();
            selectedRows.set(key, row);
            emits("row-select", row);
        }
    } else {
        if (selectedRows.has(key)) selectedRows.delete(key);
        else {
            selectedRows.set(key, row);
            emits("row-select", row);
        }
    }
    emits("selection-change", getSelectedRows());
};
const handleRowClick = (row: T) => {
    const key = getRowKey(row);
    if (props.clickWithSelect && props.showCheckbox && !selectedRows.has(key)) {
        if (!props.multiple) {
            selectedRows.clear();
        }
        selectedRows.set(key, row);
        emits("row-select", row);
    }
    if (props.highlightCurrentRow) {
        currentRow.value = row;
    }
    emits("row-click", row);
};

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
        selectedRows.clear(); // 数据变化时清空选择
        nextTick(setupBodyScrollTarget);
    }
);

// 监听列配置变化，更新滚动状态和滚动位置
watch(
    renderColumns,
    () => {
        nextTick(() => refreshTableLayout(true));
    },
    { deep: true }
);

onMounted(() => {
    setupHeaderScrollTarget();
    setupBodyScrollTarget();
});

onBeforeUnmount(() => {
    destroyHeaderScrollbar();
    destroyBodyScrollbar();
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
.m-table {
    --table-cell-padding-y: 8px;
    --table-cell-padding-x: 12px;
    --table-font-size: 14px;
    --table-line-height: 21px;
    --table-header-color: #909399;
    --table-body-color: #606266;
    --table-row-bg: #fff;
    --table-row-hover-bg: #f5f7fa;
    --table-row-striped-bg: #fafafa;
    --table-row-current-bg: #ecf5ff;
    --table-border-color: #e4e7ed;
    --table-shadow-width: 12px;
    --table-shadow-color: rgba(0, 0, 0, 0.12);
    width: 100%;
    background: #fff;
    border-bottom: 1px solid var(--table-border-color);
    position: relative;

    &.m-table--small {
        --table-cell-padding-y: 6px;
        --table-cell-padding-x: 8px;
        --table-font-size: 12px;
        --table-line-height: 18px;
    }

    &.m-table--large {
        --table-cell-padding-y: 10px;
        --table-cell-padding-x: 14px;
        --table-line-height: 24px;
    }

    &.m-table--bordered {
        border: 1px solid var(--table-border-color);

        .m-table-header-cell,
        .m-table-body-cell {
            border-right: 1px solid var(--table-border-color);
        }

        .m-table-header-cell:last-child,
        .m-table-body-cell:last-child {
            border-right: none;
        }
    }
}

.m-table-column-register {
    display: none;
}

.m-table-grid-row {
    display: grid;
    align-items: stretch;
    width: max-content;
    min-width: 100%;
}

.m-table-header-row {
    z-index: 6;
}

.m-table-header-cell,
.m-table-body-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
    font-size: var(--table-font-size);
    line-height: var(--table-line-height);
}

.m-table-header-cell {
    color: var(--table-header-color);
    font-weight: 600;
    border-bottom: 1px solid var(--table-border-color);
    text-wrap: nowrap;
}

.m-table-body-row {
    --table-current-row-bg: var(--table-row-bg);
    background-color: var(--table-current-row-bg);
    transition: background-color 0.25s ease;

    &.m-table-body-row--striped {
        --table-current-row-bg: var(--table-row-striped-bg);
    }

    &.m-table-body-row--current {
        --table-current-row-bg: var(--table-row-current-bg);
    }

    &.m-table-body-row--hoverable {
        cursor: pointer;

        &:not(.m-table-body-row--current):hover {
            --table-current-row-bg: var(--table-row-hover-bg);
        }
    }

    .m-table-body-cell {
        border-bottom: 1px solid var(--table-border-color);
    }

    &:last-child {
        .m-table-body-cell {
            border-bottom: none;
        }
    }
}

.m-table-body-cell {
    min-width: 0;
    position: relative;
    color: var(--table-body-color);
    font-weight: 400;
    word-break: break-word;
    background-color: var(--table-current-row-bg);
    transition: background-color 0.25s ease;
}

.m-table-body-cell--scoped {
    width: 100%;
    display: flex;
    align-items: center;
}

.m-table-body-cell__value {
    display: inline-block;
    width: 100%;
}

.m-table-header-check,
.m-table-body-check,
.m-table-cell--index {
    text-align: center;
}

.m-table-cell--fixed-left,
.m-table-cell--fixed-right {
    position: sticky;
    z-index: 4;
    overflow: visible;
    background-color: var(--table-current-row-bg, #fff);
    background-clip: padding-box;
    transition: background-color 0.25s ease;

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

.m-table-header-cell.m-table-cell--fixed-left,
.m-table-header-cell.m-table-cell--fixed-right {
    z-index: 10;
}

.m-table-cell--fixed-left-shadow::after {
    right: calc(var(--table-shadow-width) * -1);
    opacity: 1;
    background: linear-gradient(to right, var(--table-shadow-color), rgba(0, 0, 0, 0));
}

.m-table-cell--fixed-right-shadow::after {
    left: calc(var(--table-shadow-width) * -1);
    opacity: 1;
    background: linear-gradient(to left, var(--table-shadow-color), rgba(0, 0, 0, 0));
}
</style>
