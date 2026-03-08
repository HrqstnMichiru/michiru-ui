<template>
    <div class="table-wrapper" :class="[`table--${size}`]" ref="tableWrapperRef">
        <div class="table-header-wrapper">
            <table class="table-header" ref="headerRef">
                <thead>
                    <tr class="table-header-row">
                        <th v-if="selectable" style="text-align: center; width: 30px" class="table-header-check">
                            <CheckBox color="rgba(192, 162, 109, 1)" @click.stop :size="size" @update:model-value="toggleAll" :model-value="checkAll"></CheckBox>
                        </th>
                        <th v-if="showRowKey" class="table-header-cell" style="text-align: center; width: 80px">{{ rowKey }}</th>
                        <th v-for="col in filteredColumns" :key="col.prop" :style="{ textAlign: col.align || 'center' }" class="table-header-cell">
                            {{ col.label }}
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
        <MScrollBar :height="height" thumb-color="rgba(192, 162, 109, 0.3)" v-loading="loading">
            <div class="table-body-wrapper" v-if="data && data.length > 0">
                <table
                    class="table-body"
                    :class="{
                        'table-body--striped': striped
                    }"
                    ref="bodyRef">
                    <tbody>
                        <tr v-for="(row, index) in data" :key="getKey(row)" class="table-body-row" :class="{ 'table-body-row--hoverable': hoverable }" @click="handleRowClick(row)">
                            <td v-if="selectable" style="text-align: center; width: 30px" class="table-body-check">
                                <CheckBox color="rgba(192, 162, 109, 1)" @click.stop :size="size" :model-value="isSelected(row)" @update:model-value="() => toggleRow(row)"></CheckBox>
                            </td>
                            <td v-if="showRowKey" class="table-body-cell" style="text-align: center; font-weight: 500; width: 80px">
                                {{ row[rowKey] }}
                            </td>
                            <td v-for="col in filteredColumns" :key="col.prop" class="table-body-cell" :style="{ width: col.width + 'px', textAlign: col.align || 'center' }">
                                <template v-if="col.scopedSlot">
                                    <div
                                        class="table-body-cell--scoped"
                                        :style="{
                                            justifyContent: alignToFlex(col.align),
                                            flexWrap: col.wrap ? 'wrap' : 'nowrap',
                                            gap: col.gap ? `${col.gap}px` : '0px'
                                        }">
                                        <slot :name="col.scopedSlot" :row="row" :index="index"></slot>
                                    </div>
                                </template>
                                <template v-else-if="col.prop">
                                    <template v-if="col.clamp">
                                        <p class="table-body-cell--clamped" :style="{ '-webkit-line-clamp': col.clamp, 'line-clamp': col.clamp }">
                                            {{ row[col.prop] }}
                                        </p>
                                    </template>
                                    <template v-else>
                                        {{ row[col.prop] }}
                                    </template>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <MEmpty description="暂无数据" v-else></MEmpty>
        </MScrollBar>
        <div class="pagination" v-if="showPagination && totalCount > 0">
            <MPagination
                :total-count="totalCount"
                page-size-select-position="top"
                :page-button-count="5"
                :page-size-options="pageSizeOptions"
                :default-page-size="defaultPageSize"
                show-page-size-change
                show-total
                @page-change="handlePageChange"
                @page-size-change="handlePageSizeChange"
                size="small" />
        </div>
    </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { MEmpty, MPagination, MScrollBar } from "@/components";
import vLoading from "@/directives/loading";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowReactive, useTemplateRef, watch } from "vue";
import type { MTableEmits, MTableInstance, MTableProps } from "./types";

defineOptions({
    name: "MTable"
});

const props = withDefaults(defineProps<MTableProps<T>>(), {
    size: "medium",
    showPagination: true,
    totalCount: 0,
    extHeight: 0,
    defaultPageSize: 15,
    pageSizeOptions: () => [15, 30, 50, 100]
});
const emits = defineEmits<MTableEmits<T>>();

const headerRef = useTemplateRef<HTMLTableElement>("headerRef");
const bodyRef = useTemplateRef<HTMLTableElement>("bodyRef");
const tableWrapperRef = useTemplateRef<HTMLDivElement>("tableWrapperRef");

const loading = ref<boolean>(false);
const pageNo = ref<number>(1);
const pageSize = ref<number>(15);

const height = computed(() => {
    return window.innerHeight - props.extHeight - 40 - 20 - 10 - 41.8;
});
const alignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
};
const alignToFlex = (align: "left" | "center" | "right" = "center") => {
    return alignMap[align];
};

const filteredColumns = computed(() => {
    return props.columns.filter(column => column.prop !== props.rowKey);
});

const selectedRows = shallowReactive<Map<keyof T, T>>(new Map());
const getKey = (row: T) => row[props.rowKey];
const isSelected = (row: T) => {
    return selectedRows.has(getKey(row));
};

const checkAll = computed(() => {
    return props.data && props.data.length > 0 && selectedRows.size === props.data.length;
});

const toggleAll = () => {
    if (checkAll.value) {
        selectedRows.clear();
    } else {
        props.data.forEach(row => {
            selectedRows.set(getKey(row), row);
        });
    }
    emits("selection-change", getSelectedRows());
};

const toggleRow = (row: T) => {
    if (!props.selectable) return;
    const key = getKey(row);
    if (selectedRows.has(key)) {
        selectedRows.delete(key);
    } else {
        selectedRows.set(key, row);
        emits("row-select", row);
    }
    emits("selection-change", getSelectedRows());
};

const handleRowClick = (row: T) => {
    emits("row-click", row);
};

const handleRequest = async (showLoading: boolean = false): Promise<void> => {
    if (props.request) {
        if (showLoading) {
            loading.value = true;
        }
        await props.request(pageNo.value, pageSize.value);
        loading.value = false;
    }
};

const getSelectedRows = () => {
    return Array.from(selectedRows.values());
};

const getSelectionSize = () => {
    return selectedRows.size;
};

const handlePageSizeChange = async (newPage: number, newSize: number) => {
    pageNo.value = newPage;
    pageSize.value = newSize;
    console.log(newPage, newSize);
    await handleRequest();
};

const handlePageChange = async (newPage: number) => {
    pageNo.value = newPage;
    console.log(newPage);
    await handleRequest();
};

const syncColumnWidths = () => {
    if (!headerRef.value || !bodyRef.value) return;
    const headerTh = headerRef.value.querySelectorAll("th");
    const firstRowTds = bodyRef.value.querySelector("tr")?.querySelectorAll("td");
    if (!headerTh || !firstRowTds) return;
    firstRowTds.forEach((td, i) => {
        const rowWidth = td.clientWidth;
        if (headerTh[i]) {
            headerTh[i].style.width = `${rowWidth}px`;
        }
    });
};

watch(
    () => props.data,
    () => {
        selectedRows.clear();
        nextTick(() => {
            syncColumnWidths();
        });
    }
);

let resizeObserver: ResizeObserver | null = null;
onMounted(async () => {
    if (tableWrapperRef.value) {
        resizeObserver = new ResizeObserver(() => {
            syncColumnWidths();
        });
        resizeObserver.observe(tableWrapperRef.value);
    }
});

onBeforeUnmount(() => {
    if (resizeObserver && tableWrapperRef.value) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
});

defineExpose<MTableInstance<T>>({
    getSelectedRows,
    toggleRowSelected: toggleRow,
    refresh: handleRequest,
    getSelectionSize
});
</script>

<style lang="scss" scoped>
.table-wrapper {
    &.table--small {
        .table-header-cell,
        .table-body-cell {
            height: 100%;
            padding: 4px 0px;
            font-size: 12px;
        }
        .table-header-cell {
            padding-bottom: 12px;
        }
        .table-header-check {
            height: 100%;
            padding-bottom: 8px;
        }
    }

    &.table--large {
        .table-header-cell,
        .table-body-cell {
            height: 100%;
            padding: 8px 0px;
            font-size: 16px;
        }
        .table-header-cell {
            padding-bottom: 16px;
        }
        .table-header-check {
            height: 100%;
            padding-bottom: 8px;
        }
    }
    &.table--medium {
        .table-header-cell,
        .table-body-cell {
            height: 100%;
            padding: 6px 0px;
            font-size: 14px;
        }
        .table-header-cell {
            padding-bottom: 14px;
        }
        .table-header-check {
            height: 100%;
            padding-bottom: 8px;
        }
    }
    width: 100%;
    background: #fff;
    .table-header-wrapper {
        width: 100%;
        .table-header {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            table-layout: fixed;
            .table-header-row {
                th {
                    text-wrap: nowrap;
                    font-weight: 600;
                    position: relative;
                    &::before {
                        content: "";
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 8px;
                        background-image: linear-gradient(180deg, rgba(192, 162, 109, 1) 25%, rgba(255, 255, 255, 0) 25% 50%, rgba(192, 162, 109, 0.97) 50%);
                    }
                }
            }
        }
    }
    .table-body-wrapper {
        width: 100%;
        .table-body {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            &--striped {
                .table-body-row:nth-child(even) {
                    background-color: #e8f4fd;
                }
            }
            .table-body-row {
                transition: background-color 0.2s ease;
                &:last-child {
                    border-bottom: none;
                }
                &--hoverable {
                    cursor: pointer;
                    &:hover {
                        background-color: #e8f4fdbb;
                    }
                }
                .table-body-check {
                    height: 100%;
                    padding-bottom: 1px;
                }
                td {
                    color: #606266;
                    height: 100%;
                    position: relative;
                    text-wrap: wrap;
                    word-break: break-word;
                    .table-body-cell--scoped {
                        width: 100%;
                        display: flex;
                        align-items: center;
                    }
                    .table-body-cell--clamped {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }
                }
                &:not(:last-child) td {
                    color: #606266;
                    height: 100%;
                    position: relative;
                    &:first-child:before {
                        content: "";
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: -6.5px;
                        height: 13px;
                        background: url("@/assets/image/icon_accent-y.png") no-repeat bottom left / 12px 13px;
                    }
                    &:last-child::before {
                        content: "";
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: -6.5px;
                        height: 13px;
                        background: url("@/assets/image/icon_accent-y.png") no-repeat bottom right / 12px 13px;
                    }
                    &::after {
                        content: "";
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: -0.5px;
                        height: 1px;
                        background-color: #c1a26d;
                    }
                    &:first-child:after {
                        left: 10px;
                    }
                    &:last-child:after {
                        right: 10px;
                    }
                }
            }
        }
    }
    .pagination {
        margin-top: 10px;
        padding: 10px 0;
        border-top: 1px solid #e4e7ed;
        display: flex;
        justify-content: center;
    }
}
</style>
