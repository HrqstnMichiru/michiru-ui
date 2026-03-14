<template>
    <div class="m-pagination-wrapper" :style="{ justifyContent: alignMap[position] }">
        <div class="m-pagination" :class="`m-pagination-${size}`">
            <span class="total-text" v-if="showTotal">{{ totalText }}</span>

            <MSelect v-if="showPageSize" v-model="pageSize" :width="100" :size="size">
                <MOption v-for="size in pageSizeOptions" :key="size" :value="size" :label="`${size}/每页`" />
            </MSelect>

            <div
                class="prev"
                @click="toPrevPage"
                :class="{
                    'is-disabled': currentPage === 1
                }">
                <MIcon name="ic:round-arrow-back-ios-new" class="prev-icon"></MIcon>
            </div>

            <div class="page-list">
                <template v-for="item in pageItems" :key="item.key">
                    <div
                        class="page-item"
                        :class="{
                            'is-active': item.active,
                            'is-ellipsis': item.type === 'ellipsis'
                        }"
                        @click="item.type === 'page' && handlePageChange(item.page)">
                        {{ item.label }}
                    </div>
                </template>
            </div>

            <div
                class="next"
                @click="toNextPage"
                :class="{
                    'is-disabled': currentPage === totalPages
                }">
                <MIcon name="ic:round-arrow-back-ios-new" class="next-icon"></MIcon>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon, MOption, MSelect } from "@/components";
import { computed, ref, watch } from "vue";
import type { MPaginationEmits, MPaginationProps } from "./types";

interface PageItem {
    key: string;
    label: string;
    type: "page" | "ellipsis";
    page: number;
    active: boolean;
}

defineOptions({
    name: "MPagination"
});
const props = withDefaults(defineProps<MPaginationProps>(), {
    pageCount: 5,
    size: "medium",
    position: "center"
});
const emits = defineEmits<MPaginationEmits>();

const currentPage = ref<number>(1);
const pageSize = ref<number>(props.pageSize || props.pageSizeOptions?.[0] || 10);
const totalPages = computed(() => Math.ceil(props.totalCount / pageSize.value));
const totalText = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value + 1;
    const end = Math.min(currentPage.value * pageSize.value, props.totalCount);
    return `共${props.totalCount}条，第${start}-${end}条`;
});

const alignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
};

// 生成页码项
const createPageItem = (page: number): PageItem => ({
    key: `page-${page}`,
    label: `${page}`,
    type: "page",
    page,
    active: page === currentPage.value
});

// 生成省略号项
const createEllipsisItem = (key: string): PageItem => ({
    key: `ellipsis-${key}`,
    label: "...",
    type: "ellipsis",
    page: -1,
    active: false
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

    const middleCount = buttonCount - 2; // 中间页码数量（扣除首尾页）
    let middleStart = current - Math.floor(middleCount / 2); // 中间页起始页
    let middleEnd = middleStart + middleCount - 1; // 中间页结束页

    // 若中间页起始页小于2，调整为从2开始
    if (middleStart < 2) {
        middleStart = 2;
        middleEnd = middleStart + middleCount - 1;
    }

    // 若中间页结束页超过总页数-1，调整为以总页数-1结束
    if (middleEnd > total - 1) {
        middleEnd = total - 1;
        middleStart = middleEnd - middleCount + 1;
    }

    // 添加首页
    items.push(createPageItem(1));

    // 若中间页起始页大于2，添加左侧省略号
    if (middleStart > 2) {
        items.push(createEllipsisItem("left"));
    }

    // 添加中间页
    for (let i = middleStart; i <= middleEnd; i++) {
        items.push(createPageItem(i));
    }

    // 若中间页结束页小于总页数-1，添加右侧省略号
    if (middleEnd < total - 1) {
        items.push(createEllipsisItem("right"));
    }

    // 添加尾页
    items.push(createPageItem(total));

    return items;
});

const handlePageChange = (page: number) => {
    if (page === currentPage.value) return;
    currentPage.value = page;
    emits("page-change", page);
};

watch(
    () => pageSize.value,
    newSize => {
        currentPage.value = 1;
        emits("page-size-change", 1, newSize);
    }
);

const toPrevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value -= 1;
        emits("page-change", currentPage.value);
    }
};

const toNextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
        emits("page-change", currentPage.value);
    }
};
</script>

<style lang="scss" scoped>
.m-pagination-wrapper {
    display: flex;
    .m-pagination {
        user-select: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        &.m-pagination-small {
            .total-text {
                font-size: 14px;
            }
            .prev,
            .next {
                height: 40px;
                width: 40px;
                .prev-icon,
                .next-icon {
                    font-size: 24px;
                }
            }
            .page-list {
                .page-item {
                    height: 30px;
                    width: 26px;
                    font-size: 12px;
                }
            }
        }
        .total-text {
            font-size: 16px;
            background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .prev {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50px;
            width: 50px;
            border-radius: 50%;
            background-color: rgb(236, 89, 92);
            cursor: pointer;
            transition: all 0.2s ease;
            .prev-icon {
                transform: rotate(180deg);
                color: #fff;
                font-size: 32px;
            }
            &:hover:not(.is-disabled) {
                transform: scale(1.05);
            }
            &.is-disabled {
                background-color: #d1d5db;
                cursor: not-allowed;
                opacity: 0.5;
                .prev-icon {
                    color: #9ca3af;
                }
            }
        }
        .page-list {
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            .page-item {
                color: rgb(236, 89, 92);
                height: 40px;
                width: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 14px;
                background-image: url("@/assets/image/frame_pager.png");
                background-size: cover;
                background-repeat: no-repeat;
                transition: all 0.3s ease;
                position: relative;
                &::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-image: url("@/assets/image/frame_pager-active.png");
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: contain;
                    transform: scale(0.6);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                &.is-active {
                    background-image: url("@/assets/image/frame_pager-active.png");
                    color: #fff;
                }
                &.is-ellipsis {
                    width: auto;
                    min-width: 20px;
                    background-image: none;
                    cursor: default;
                    color: #6b7280;
                    &::before {
                        display: none;
                    }
                }
                &:hover:not(.is-active)::before {
                    transform: scale(1);
                    opacity: 0.3;
                }
                &:hover.is-ellipsis {
                    transform: none;
                }
            }
        }
        .next {
            height: 50px;
            width: 50px;
            border-radius: 50%;
            background-color: rgb(236, 89, 92);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            .next-icon {
                font-size: 32px;
                color: #fff;
            }
            &:hover:not(.is-disabled) {
                transform: scale(1.05);
            }
            &.is-disabled {
                background-color: #d1d5db;
                cursor: not-allowed;
                opacity: 0.5;
                .next-icon {
                    color: #9ca3af;
                }
            }
        }
    }
}
</style>
