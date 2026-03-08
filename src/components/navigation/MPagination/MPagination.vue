<template>
    <div class="m-pagination-wrapper" :class="`m-pagination-${size}`">
        <div v-if="showTotal" class="m-pagination-total">
            <span class="total-text">{{ totalText }}</span>
        </div>

        <MSelect v-if="showPageSizeChange" v-model="pageSize" :width="100" :placement="pageSizeSelectPosition" size="small">
            <MOption v-for="size in pageSizeOptions" :key="size" :value="size" :label="`${size}/每页`" />
        </MSelect>

        <div
            class="prev"
            @click="toPrevPage"
            :class="{
                disabled: currentPage === 1
            }">
            <MIcon name="ic:round-arrow-back-ios-new" class="prev-icon"></MIcon>
        </div>

        <div class="page-list">
            <template v-for="item in pageItems" :key="`page-${item.page}`">
                <div
                    class="page-item"
                    :class="{
                        active: item.active
                    }"
                    @click="handlePageChange(item.page)">
                    {{ item.page }}
                </div>
            </template>
        </div>

        <div
            class="next"
            @click="toNextPage"
            :class="{
                disabled: currentPage === totalPages
            }">
            <MIcon name="ic:round-arrow-back-ios-new" class="next-icon"></MIcon>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon, MSelect, MOption } from "@/components";
import { computed, ref, watch } from "vue";
import type { MPaginationEmits, MPaginationProps } from "./types";

defineOptions({
    name: "MPagination"
});

const props = withDefaults(defineProps<MPaginationProps>(), {
    pageSizeOptions: () => [15, 30, 50, 100],
    showPageSizeChange: false,
    showTotal: false,
    pageButtonCount: 7,
    pageSizeSelectPosition: "bottom",
    size: "large"
});
const emits = defineEmits<MPaginationEmits>();

const currentPage = ref<number>(1);
const pageSize = ref<number>(props.defaultPageSize || props.pageSizeOptions[0]!);
const totalPages = computed(() => Math.ceil(props.totalCount / pageSize.value));
const totalText = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value + 1;
    const end = Math.min(currentPage.value * pageSize.value, props.totalCount);
    return `共${props.totalCount}条，第${start}-${end}条`;
});

const pageItems = computed(() => {
    if (totalPages.value < 1) return [];

    const items = [];
    const total = totalPages.value;
    const current = currentPage.value;
    const buttonCount = props.pageButtonCount;
    if (total <= buttonCount) {
        for (let i = 1; i <= total; i++) {
            items.push({
                key: `page-${i}`,
                page: i,
                active: i === current,
                position: "fixed"
            });
        }
        return items;
    }

    const half = Math.floor(buttonCount / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, current + half);

    if (end - start + 1 < buttonCount) {
        if (start === 1) {
            end = Math.min(total, start + buttonCount - 1);
        } else {
            start = Math.max(1, end - buttonCount + 1);
        }
    }

    for (let i = start; i <= end; i++) {
        items.push({
            key: `page-${i}`,
            page: i,
            active: i === current
        });
    }
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
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 16px;
    &.m-pagination-small {
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
    .m-pagination-total {
        text-align: center;
        font-size: 13px;
        transition: all 0.3s ease;
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(5px);
        border-radius: 6px;
        .total-text {
            background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
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
        &:hover:not(.disabled) {
            transform: scale(1.05);
        }
        &.disabled {
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
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url("@/assets/image/frame_pager-active.png");
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                transform: scale(0.6);
                opacity: 0;
                transition: all 0.3s ease;
            }
            &.active {
                background-image: url("@/assets/image/frame_pager-active.png");
                color: #fff;
            }
            &:hover:not(.active)::before {
                transform: scale(1);
                opacity: 0.3;
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
        &:hover:not(.disabled) {
            transform: scale(1.05);
        }
        &.disabled {
            background-color: #d1d5db;
            cursor: not-allowed;
            opacity: 0.5;
            .next-icon {
                color: #9ca3af;
            }
        }
    }
}
</style>
