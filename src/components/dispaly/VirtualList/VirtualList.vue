<template>
    <div class="virtual-list-container" ref="containerRef" @scroll="handleScroll" @wheel.stop :style="{ height: `${viewHeight}px` }">
        <!-- 占位元素，撑起滚动高度 -->
        <div class="virtual-list-phantom" :style="{ height: `${totalHeight}px` }"></div>
        <!-- 实际渲染的列表 -->
        <div class="virtual-list-content" :style="{ transform: `translateY(${offsetY}px)` }">
            <div v-for="item in visibleData" :key="item.index" :style="{ height: `${itemHeight}px` }">
                <slot :item="item.data" :index="item.index"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup generic="T">
import { computed, ref, useTemplateRef } from "vue";
import type { VirtualListProps } from "./types";

defineOptions({
    name: "MVirtualList"
});

const props = withDefaults(defineProps<VirtualListProps<T>>(), {
    bufferSize: 5,
    dataSource: () => [],
    maxCount: 10,
    itemHeight: 50
});

const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const scrollTop = ref(0); // 当前滚动位置

// 列表总高度
const totalHeight = computed(() => props.dataSource.length * props.itemHeight);

// 可视区域高度
const viewHeight = computed(() => props.maxCount * props.itemHeight);

// 开始索引
const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - (props.bufferSize || 0));
});

// 结束索引
const endIndex = computed(() => {
    return Math.min(props.dataSource.length, Math.ceil((scrollTop.value + viewHeight.value) / props.itemHeight) + (props.bufferSize || 0));
});

// 可见数据
const visibleData = computed(() => {
    return props.dataSource.slice(startIndex.value, endIndex.value).map((data, idx) => ({
        data,
        index: startIndex.value + idx
    }));
});

// 偏移量
const offsetY = computed(() => startIndex.value * props.itemHeight);

// 滚动事件处理
const handleScroll = (event: Event) => {
    const target = event.target as HTMLDivElement;
    scrollTop.value = target.scrollTop;
};

// 滚动到指定索引
const scrollToIndex = (index: number) => {
    if (!containerRef.value) return;
    const targetScrollTop = index * props.itemHeight;
    containerRef.value.scrollTo({
        top: targetScrollTop,
        behavior: "smooth"
    });
};

// 暴露方法给父组件
defineExpose({
    scrollToIndex
});
</script>

<style lang="scss" scoped>
.virtual-list-container {
    overflow-y: auto;
    position: relative;
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        &:hover {
            background-color: rgba(0, 0, 0, 0.3);
        }
    }
    .virtual-list-phantom {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        z-index: -1;
    }
    .virtual-list-content {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        will-change: transform;
    }
}
</style>
