<template>
    <div class="m-pagination-wrapper" :style="{ justifyContent: alignMap[position] }">
        <div
            class="m-pagination"
            :class="[
                `m-pagination-${size}`,
                `m-pagination--${variant}`,
                {
                    'm-pagination--disabled': disabled,
                    'm-pagination--outlined': outlined,
                    'm-pagination--plain': plain
                }
            ]"
            :style="paginationVars">
            <span class="total-text" v-if="showTotal">{{ `共${totalCount}条` }}</span>

            <span @click="toPrevPage">
                <slot name="prev" :disabled="disabled || currentPage === 1">
                    <span
                        class="prev"
                        :class="{
                            'is-disabled': disabled || currentPage === 1
                        }">
                        <MIcon name="ic:round-arrow-back-ios-new" class="prev-icon"></MIcon>
                    </span>
                </slot>
            </span>

            <ul class="page-list">
                <template v-for="item in pageItems" :key="item.key">
                    <li @click="handlePageChange(item)">
                        <template v-if="item.type === 'ellipsis'">
                            <span class="page-item is-ellipsis">
                                {{ item.label }}
                            </span>
                        </template>
                        <template v-else>
                            <slot :data="item" :active="item.page === currentPage" :disabled="disabled" name="item">
                                <span
                                    class="page-item"
                                    :class="{
                                        'is-active': item.page === currentPage,
                                        'is-disabled': disabled
                                    }">
                                    {{ item.label }}
                                </span>
                            </slot>
                        </template>
                    </li>
                </template>
            </ul>

            <span @click="toNextPage">
                <slot name="next" :disabled="disabled || currentPage === totalPages">
                    <span
                        class="next"
                        :class="{
                            'is-disabled': disabled || currentPage === totalPages
                        }">
                        <MIcon name="ic:round-arrow-back-ios-new" class="next-icon"></MIcon>
                    </span>
                </slot>
            </span>

            <MSelect v-if="showPageSize" v-model="pageSize" :width="110" :size="size" :disabled="disabled">
                <MOption v-for="size in pageSizeOptions" :key="size" :value="size" :label="`${size}/每页`" />
            </MSelect>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon, MOption, MSelect } from "@/components";
import { computed, ref, watch } from "vue";
import type { MPaginationEmits, MPaginationProps, PageItem } from "./types";

defineOptions({
    name: "MPagination"
});
const props = withDefaults(defineProps<MPaginationProps>(), {
    pageCount: 5,
    size: "medium",
    position: "center",
    variant: "primary",
    plain: false,
    outlined: false
});
const emits = defineEmits<MPaginationEmits>();

const currentPage = ref<number>(1);
const pageSize = ref<number>(props.pageSize || props.pageSizeOptions?.[0] || 10);
const totalPages = computed(() => Math.ceil(props.totalCount / pageSize.value));

const alignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
};
const variantColorMap: Record<NonNullable<MPaginationProps["variant"]>, { color: string; bg: string }> = {
    primary: { color: "#409eff", bg: "rgba(64, 158, 255, 0.12)" },
    success: { color: "#67c23a", bg: "rgba(103, 194, 58, 0.12)" },
    warning: { color: "#e6a23c", bg: "rgba(230, 162, 60, 0.12)" },
    danger: { color: "#f56c6c", bg: "rgba(245, 108, 108, 0.12)" },
    info: { color: "#17a2b8", bg: "rgba(23, 162, 184, 0.12)" },
    purple: { color: "#801eff", bg: "rgba(128, 30, 255, 0.12)" },
    pink: { color: "#ff69b4", bg: "rgba(255, 105, 180, 0.12)" }
};
const paginationMode = computed(() => {
    if (props.outlined) return "outlined";
    if (props.plain) return "plain";
    return "default";
});
const paginationVars = computed(() => {
    const variant = props.variant || "primary";
    return {
        "--m-pagination-variant-color": variantColorMap[variant].color,
        "--m-pagination-variant-light": variantColorMap[variant].bg
    };
});

// 生成页码项
const createPageItem = (page: number): PageItem => ({
    key: `page-${page}`,
    label: `${page}`,
    type: "page",
    page
});

// 生成省略号项
const createEllipsisItem = (key: string): PageItem => ({
    key: `ellipsis-${key}`,
    label: "...",
    type: "ellipsis",
    page: -1
});

const pageItems = computed(() => {
    if (totalPages.value < 1) return [];

    const items: PageItem[] = [];
    const total = totalPages.value;
    const current = currentPage.value;
    const buttonCount = Math.max(5, props.pageCount);

    if (total <= buttonCount) {
        // 总页数小于等于按钮数量，显示所有页码
        for (let i = 1; i <= total; i++) {
            items.push(createPageItem(i));
        }
        return items;
    }

    // 保持总项稳定：中间态为 pageCount + 2（左右省略号）
    // 起始/结尾段有“滞后区间”，避免点击临界页时布局立刻跳变
    const edgeThreshold = Math.ceil((buttonCount + 2) / 2);
    const middleCount = buttonCount - 2;

    // 添加首页
    items.push(createPageItem(1));

    // 起始段：1,2,3,...,pageCount,...,last
    if (current <= edgeThreshold) {
        for (let i = 2; i <= buttonCount; i++) {
            items.push(createPageItem(i));
        }
        items.push(createEllipsisItem("right"));
        items.push(createPageItem(total));
        return items;
    }

    // 结尾段：1,...,last-pageCount+1...last
    if (current >= total - edgeThreshold + 1) {
        items.push(createEllipsisItem("left"));
        for (let i = total - buttonCount + 1; i <= total; i++) {
            items.push(createPageItem(i));
        }
        return items;
    }

    // 中间段：1,...,x,x+1,...,...,last
    let middleStart = current - Math.floor(middleCount / 2);
    let middleEnd = middleStart + middleCount - 1;
    if (middleStart < 2) {
        middleStart = 2;
        middleEnd = middleStart + middleCount - 1;
    }
    if (middleEnd > total - 1) {
        middleEnd = total - 1;
        middleStart = middleEnd - middleCount + 1;
    }
    items.push(createEllipsisItem("left"));
    for (let i = middleStart; i <= middleEnd; i++) {
        items.push(createPageItem(i));
    }
    items.push(createEllipsisItem("right"));
    items.push(createPageItem(total));

    return items;
});

const handlePageChange = (item: PageItem) => {
    if (props.disabled) return;
    if (item.type === "ellipsis") return;
    if (item.page === currentPage.value) return;
    currentPage.value = item.page;
    emits("page-change", item.page);
};

watch(
    () => pageSize.value,
    newSize => {
        currentPage.value = 1;
        emits("page-size-change", 1, newSize);
    }
);

const toPrevPage = () => {
    if (props.disabled) return;
    if (currentPage.value > 1) {
        currentPage.value -= 1;
        emits("page-change", currentPage.value);
    }
};

const toNextPage = () => {
    if (props.disabled) return;
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
        emits("page-change", currentPage.value);
    }
};
</script>

<style lang="scss" scoped>
// .m-pagination-wrapper {
//     display: flex;
//     .m-pagination {
//         user-select: none;
//         display: inline-flex;
//         align-items: center;
//         justify-content: center;
//         gap: 8px;
//         &.m-pagination-small {
//             .total-text {
//                 font-size: 14px;
//             }
//             .prev,
//             .next {
//                 height: 40px;
//                 width: 40px;
//                 .prev-icon,
//                 .next-icon {
//                     font-size: 24px;
//                 }
//             }
//             .page-list {
//                 .page-item {
//                     height: 30px;
//                     width: 26px;
//                     font-size: 12px;
//                 }
//             }
//         }
//         .total-text {
//             font-size: 16px;
//             background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
//             -webkit-background-clip: text;
//             background-clip: text;
//             -webkit-text-fill-color: transparent;
//         }
//         .prev {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             height: 50px;
//             width: 50px;
//             border-radius: 50%;
//             // background-color: rgb(236, 89, 92);
//             cursor: pointer;
//             transition: all 0.2s ease;
//             .prev-icon {
//                 transform: rotate(180deg);
//                 color: #fff;
//                 font-size: 32px;
//             }
//             &:hover:not(.is-disabled) {
//                 transform: scale(1.05);
//             }
//             &.is-disabled {
//                 background-color: #d1d5db;
//                 cursor: not-allowed;
//                 opacity: 0.5;
//                 .prev-icon {
//                     color: #9ca3af;
//                 }
//             }
//         }
//         .page-list {
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//             .page-item {
//                 color: rgb(236, 89, 92);
//                 height: 40px;
//                 width: 36px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 cursor: pointer;
//                 font-size: 14px;
//                 background-image: url("@/assets/image/frame_pager.png");
//                 background-size: cover;
//                 background-repeat: no-repeat;
//                 transition: all 0.3s ease;
//                 position: relative;
//                 &::before {
//                     content: "";
//                     position: absolute;
//                     inset: 0;
//                     background-image: url("@/assets/image/frame_pager-active.png");
//                     background-position: center;
//                     background-repeat: no-repeat;
//                     background-size: contain;
//                     transform: scale(0.6);
//                     opacity: 0;
//                     transition: all 0.3s ease;
//                 }
//                 &.is-active {
//                     background-image: url("@/assets/image/frame_pager-active.png");
//                     color: #fff;
//                 }
//                 &.is-ellipsis {
//                     width: auto;
//                     min-width: 20px;
//                     background-image: none;
//                     cursor: default;
//                     color: #6b7280;
//                     &::before {
//                         display: none;
//                     }
//                 }
//                 &:hover:not(.is-active)::before {
//                     transform: scale(1);
//                     opacity: 0.3;
//                 }
//                 &:hover.is-ellipsis {
//                     transform: none;
//                 }
//             }
//         }
//         .next {
//             height: 50px;
//             width: 50px;
//             border-radius: 50%;
//             background-color: rgb(236, 89, 92);
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             .next-icon {
//                 font-size: 32px;
//                 color: #fff;
//             }
//             &:hover:not(.is-disabled) {
//                 transform: scale(1.05);
//             }
//             &.is-disabled {
//                 background-color: #d1d5db;
//                 cursor: not-allowed;
//                 opacity: 0.5;
//                 .next-icon {
//                     color: #9ca3af;
//                 }
//             }
//         }
//     }
// }

.m-pagination-wrapper {
    display: flex;
    .m-pagination {
        --m-pagination-variant-color: #409eff;
        --m-pagination-variant-light: rgba(64, 158, 255, 0.12);
        --m-pagination-active-border: var(--m-pagination-variant-color);
        --m-pagination-active-color: #fff;
        --m-pagination-active-bg: var(--m-pagination-variant-color);
        user-select: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        .total-text {
            background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .prev,
        .next,
        .page-item {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 1px solid rgb(224, 224, 230);
            color: rgb(123, 136, 142);
            background-color: #fff;
        }
        .prev,
        .next {
            &.is-disabled {
                background-color: #d1d5db;
                cursor: not-allowed;
                opacity: 0.5;
                color: #9ca3af;
            }
        }
        .next {
            transform: rotate(180deg);
        }
        .page-item {
            &.is-active {
                border: 1px solid var(--m-pagination-active-border);
                color: var(--m-pagination-active-color);
                background-color: var(--m-pagination-active-bg);
            }
            &.is-ellipsis {
                cursor: default;
                color: #6b7280;
                border-color: transparent;
            }
        }
        .page-list {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        &.m-pagination--disabled {
            .total-text {
                background: none;
                color: #a8abb2;
                -webkit-text-fill-color: currentColor;
            }
            .prev,
            .next,
            .page-item {
                cursor: not-allowed;
                color: #c0c4cc;
                background-color: #f5f7fa;
                border-color: #e4e7ed;
            }
            .page-item.is-active {
                color: #c0c4cc;
                background-color: #f0f2f5;
                border-color: #e4e7ed;
            }
            .page-item.is-ellipsis {
                background-color: transparent;
                border-color: transparent;
            }
        }
        &.m-pagination--plain {
            --m-pagination-active-border: var(--m-pagination-variant-color);
            --m-pagination-active-color: var(--m-pagination-variant-color);
            --m-pagination-active-bg: var(--m-pagination-variant-light);
        }
        &.m-pagination--outlined {
            --m-pagination-active-border: var(--m-pagination-variant-color);
            --m-pagination-active-color: var(--m-pagination-variant-color);
            --m-pagination-active-bg: #fff;
        }
        &.m-pagination--primary {
            --m-pagination-variant-color: #409eff;
            --m-pagination-variant-light: rgba(64, 158, 255, 0.12);
        }
        &.m-pagination--success {
            --m-pagination-variant-color: #67c23a;
            --m-pagination-variant-light: rgba(103, 194, 58, 0.12);
        }
        &.m-pagination--warning {
            --m-pagination-variant-color: #e6a23c;
            --m-pagination-variant-light: rgba(230, 162, 60, 0.12);
        }
        &.m-pagination--danger {
            --m-pagination-variant-color: #f56c6c;
            --m-pagination-variant-light: rgba(245, 108, 108, 0.12);
        }
        &.m-pagination--info {
            --m-pagination-variant-color: #17a2b8;
            --m-pagination-variant-light: rgba(23, 162, 184, 0.12);
        }
        &.m-pagination--purple {
            --m-pagination-variant-color: #801eff;
            --m-pagination-variant-light: rgba(128, 30, 255, 0.12);
        }
        &.m-pagination--pink {
            --m-pagination-variant-color: #ff69b4;
            --m-pagination-variant-light: rgba(255, 105, 180, 0.12);
        }
        &.m-pagination-small {
            .page-item,
            .total-text {
                font-size: 14px;
            }
            .page-item,
            .prev,
            .next {
                height: 28px;
                width: 28px;
                border-radius: 4px;
            }
            .prev-icon,
            .next-icon {
                font-size: 14px;
            }
        }
        &.m-pagination-medium {
            .page-item,
            .total-text {
                font-size: 15px;
            }
            .page-item,
            .prev,
            .next {
                height: 34px;
                width: 34px;
                border-radius: 6px;
            }
            .prev-icon,
            .next-icon {
                font-size: 18px;
            }
        }
        &.m-pagination-large {
            .page-item,
            .total-text {
                font-size: 16px;
            }
            .page-item,
            .prev,
            .next {
                height: 40px;
                width: 40px;
                border-radius: 8px;
            }
            .prev-icon,
            .next-icon {
                font-size: 20px;
            }
        }
    }
}
</style>
