<template>
    <div class="watetfall-container" v-loading="loading">
        <div class="waterfall-content" ref="contentRef" @scroll.stop="handleScroll">
            <div class="waterfall-list" :style="{ height: `${listHeight}px` }">
                <div
                    class="waterfall-item"
                    v-for="(item, index) in imageList"
                    :key="item.url"
                    :style="{
                        width: imageWidth + 'px',
                        height: imagePositions[index].height + 'px',
                        transform: `translate(${imagePositions[index].left}px, ${imagePositions[index].top}px)`
                    }"
                    @click="onClick(item.url)">
                    <img class="waterfall-img" :src="item.url" loading="lazy" @load="onImageLoad" />
                </div>
            </div>
        </div>
        <MImagePreview ref="imagePreviewRef" v-if="!previewDisabled" :src="previewSrc" />
    </div>
</template>

<script lang="ts" setup>
import type { MImagePreviewInstance } from "@/components";
import { MImagePreview } from "@/components";
import vLoading from "@/directives/loading";
import { throttle } from "lodash-es";
import { computed, onMounted, ref, shallowReactive, useTemplateRef } from "vue";
import type { MWaterFallItem, MWaterFallProps } from "./types";

defineOptions({
    name: "MWaterFall"
});

const props = withDefaults(defineProps<MWaterFallProps>(), {
    urlFormat: (url: string) => url,
    gap: 10,
    columns: 3,
    pageSize: 30
});

const contentRef = useTemplateRef<HTMLDivElement>("contentRef");
const imagePreviewRef = useTemplateRef<MImagePreviewInstance>("imagePreviewRef");
const loading = ref<boolean>(false); // 加载状态
const isFinish = ref<boolean>(false); // 是否还有数据
const imageList = shallowReactive<MWaterFallItem[]>([]); // 图片列表
const imagePositions = shallowReactive<{ height: number; top: number; left: number }[]>([]); // 图片位置列表
const _pageNo = ref<number>(1); // 当前页码
const columnHeight = shallowReactive<number[]>([]); // 每列总高度
const imageWidth = ref<number>(0); // 图片的宽度
// 列表实际高度（absolute 子元素不撑开父元素，需手动设置）
const listHeight = computed(() => Math.max(...columnHeight, 0));

// 最短列的索引
const minColumnIndex = computed(() => {
    let minIndex = 0;
    for (let i = 1; i < columnHeight.length; i++) {
        if (columnHeight[i]! < columnHeight[minIndex]!) {
            minIndex = i;
        }
    }
    return minIndex;
});
const rowGap = computed(() => {
    return Array.isArray(props.gap) ? props.gap[1] : props.gap;
});
const columnGap = computed(() => {
    return Array.isArray(props.gap) ? props.gap[0] : props.gap;
});
const previewSrc = ref<string>("");

// 获取图片列表
const getImageList = async (pageNo: number, pageSize: number, isFirst: boolean): Promise<void> => {
    if (isFinish.value) return;
    loading.value = true;
    const list = await props.request(pageNo, pageSize);
    _pageNo.value += 1;
    if (list.length < pageSize) {
        isFinish.value = true;
    }
    computeImagePositions(list, isFirst);
    imageList.push(...list);
    loading.value = false;
};

const computeImagePositions = (list: MWaterFallItem[], isFirst: boolean) => {
    // 计算每张图片的位置
    list.forEach((item, index) => {
        const imageHeight = Math.floor((item.height / item.width) * imageWidth.value); // 按比例计算图片高度
        if (isFirst && index < props.columns) {
            // 第一行图片
            imagePositions.push({
                height: imageHeight,
                top: 0,
                left: index * (imageWidth.value + columnGap.value)
            });
            columnHeight[index] = imageHeight + rowGap.value;
        } else {
            const minIndex = minColumnIndex.value; // 找到最短列的索引
            imagePositions.push({
                height: imageHeight,
                top: columnHeight[minIndex],
                left: minIndex * (imageWidth.value + columnGap.value)
            });
            columnHeight[minIndex] += imageHeight + rowGap.value;
        }
    });
};

const handleScroll = throttle(() => {
    if (!contentRef.value) return;
    const { scrollTop, clientHeight, scrollHeight } = contentRef.value;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (loading.value || isFinish.value) return;
        getImageList(_pageNo.value, props.pageSize, false);
    }
}, 500);

const onImageLoad = (e: Event) => {
    (e.target as HTMLImageElement).classList.add("is-loaded");
};

const onClick = (url: string) => {
    if (props.previewDisabled) return;
    previewSrc.value = props.urlFormat(url);
    imagePreviewRef.value?.previewImage();
};

onMounted(() => {
    if (contentRef.value) {
        const containerWidth = contentRef.value?.clientWidth || 0; // 容器宽度
        const totalGap = columnGap.value * (props.columns - 1); // 总间距
        imageWidth.value = (containerWidth - totalGap) / props.columns; // 计算每张图片的宽度
        getImageList(_pageNo.value, props.pageSize, true);
    }
});
</script>

<style lang="scss" scoped>
.watetfall-container {
    width: 100%;
    height: 100%;
    .waterfall-content {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
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
        .waterfall-list {
            width: 100%;
            position: relative;
            .waterfall-item {
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #dcdfe6;
                background-color: #f0f0f0;
                .waterfall-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    filter: blur(12px);
                    opacity: 0;
                    transform: scale(1.08);
                    transition:
                        filter 0.5s ease,
                        opacity 0.5s ease,
                        transform 0.5s ease;
                    will-change: filter, opacity, transform;
                    &.is-loaded {
                        filter: blur(0);
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            }
        }
    }
}
</style>
