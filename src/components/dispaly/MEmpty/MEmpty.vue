<template>
    <div class="empty">
        <div class="empty__image">
            <img :src="emptyImage" alt="MEmpty" @dragstart.prevent />
        </div>
        <div class="empty__description">
            {{ description }}
        </div>
        <div v-if="slots.default" class="empty__extra">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import defaultImage from "@/assets/image/小春.png";
import { useSlots } from "vue";
import type { MEmptyProps } from "./types";

defineOptions({
    name: "MEmpty"
});
const props = withDefaults(defineProps<MEmptyProps>(), {
    description: "暂无数据",
    emptyImage: defaultImage
});
const slots = useSlots();
</script>

<style lang="scss" scoped>
.empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    text-align: center;
    user-select: none;
    .empty__image {
        max-width: 400px;
        img {
            max-width: 100%;
            object-fit: contain;
        }
    }
    .empty__description {
        font-size: 15px;
        line-height: 1.6;
        color: #909399;
    }
    .empty__extra {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 16px;
    }
}
</style>
