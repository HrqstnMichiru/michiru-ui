<template>
    <div class="result" :class="`result--${status}`">
        <!-- 图标区域 -->
        <MIcon :name="icon || defaultIcon" :size="iconSize" />
        <!-- 内容区域 -->
        <div class="result__content">
            <!-- 标题 -->
            <h2 class="result__title">
                {{ title }}
            </h2>
            <!-- 副标题 -->
            <p class="result__description">
                {{ description }}
            </p>
        </div>
        <!-- 补充信息区域 -->
        <div v-if="slots.extra" class="result__extra">
            <slot name="extra"></slot>
        </div>
        <!-- 操作区域 -->
        <slot name="action"></slot>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { computed, useSlots } from "vue";
import type { ResultProps, ResultStatus } from "./types";

defineOptions({
    name: "MResult"
});
const props = withDefaults(defineProps<ResultProps>(), {
    status: "primary",
    iconSize: 80
});
const slots = useSlots();

const iconMap: Record<ResultStatus, string> = {
    primary: "bi:info-circle-fill",
    success: "ooui:success",
    warning: "streamline:warning-octagon-solid",
    danger: "zondicons:close-solid",
    info: "bi:info-circle-fill"
};
const defaultIcon = computed(() => {
    return iconMap[props.status];
});
</script>

<style lang="scss" scoped>
.result {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    text-align: center;
    min-height: 300px;
    .result__content {
        margin-top: 24px;
        margin-bottom: 16px;
        width: 100%;
        .result__title {
            margin: 0;
            font-size: 28px;
            font-weight: 500;
            line-height: 1.4;
            color: #606266;
            margin-bottom: 5px;
        }
        .result__description {
            margin: 0 auto;
            text-align: center;
            font-size: 16px;
            line-height: 1.6;
            color: #909399;
            width: 100%;
            max-width: 75%;
        }
    }
    .result__extra {
        width: 100%;
        max-width: 90%;
        background-color: #ecedf1;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 20px;
        color: #606266;
        font-size: 14px;
        line-height: 1.6;
        text-align: left;
    }
    &.result--success {
        color: #67c23a;
    }
    &.result--primary {
        color: #409eff;
    }
    &.result--warning {
        color: #e6a23c;
    }
    &.result--danger {
        color: #f56c6c;
    }
    &.result--info {
        color: #17a2b8;
    }
}
</style>
