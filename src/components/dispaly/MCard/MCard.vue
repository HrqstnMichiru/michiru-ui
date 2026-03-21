<template>
    <div class="m-card" :class="[`m-card--${shadow}`]">
        <div
            class="m-card__header"
            v-if="slots.header || title"
            :style="{
                ...headerStyle,
                justifyContent: center ? 'center' : 'flex-start'
            }">
            <slot name="header">
                <span class="m-card-title">
                    <MIcon :name="icon" v-if="icon" :color="colorMap[variant]"></MIcon>
                    <span>{{ title }}</span>
                </span>
            </slot>
        </div>
        <div
            class="m-card__content"
            :style="{
                ...contentStyle,
                justifyContent: center ? 'center' : 'flex-start'
            }">
            <slot></slot>
        </div>
        <div
            class="m-card__footer"
            v-if="slots.footer"
            :style="{
                ...footerStyle,
                justifyContent: center ? 'center' : 'flex-end'
            }">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { useSlots } from "vue";
import type { MCardEmits, MCardIconVariant, MCardProps } from "./types";

defineOptions({
    name: "MCard"
});
const props = withDefaults(defineProps<MCardProps>(), {
    shadow: "always",
    variant: "gray"
});
const emits = defineEmits<MCardEmits>();
const slots = useSlots();

const colorMap: Record<MCardIconVariant, string> = {
    gray: "#6B6B6B",
    primary: "#409EFF",
    success: "#67C23A",
    warning: "#E6A23C",
    danger: "#F56C6C",
    info: "#17A2B8",
    purple: "#801EFF",
    pink: "#FF69B4"
};
</script>

<style lang="scss" scoped>
.m-card {
    position: relative;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid rgb(220, 223, 230);
    &.m-card--always {
        box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
    }
    &.m-card--hover:hover {
        box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
    }
    // &.m-card--blurable {
    //     background-color: rgba(255, 255, 255, 0.6);
    //     backdrop-filter: blur(15px) saturate(180%);
    // }
    .m-card__header {
        display: flex;
        padding: 12px 16px 8px;
        align-items: center;
        gap: 6px;
        border-bottom: 1px solid rgb(220, 223, 230);
        color: rgb(41, 52, 61);
        font-size: 20px;
        font-weight: 500;
        line-height: 1.5;
        white-space: nowrap;
        .m-card-title {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
    }
    .m-card__content {
        color: rgb(107, 107, 107);
        display: flex;
        flex-direction: column;
        padding: 16px 24px;
    }
    .m-card__footer {
        display: flex;
        padding: 8px 12px 12px;
        gap: 12px;
        align-items: center;
        border-top: 1px solid rgb(220, 223, 230);
    }
}
</style>
