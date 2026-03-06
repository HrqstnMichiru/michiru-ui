<template>
    <div
        class="m-collapse"
        :style="{
            '--collapse-speed': `${context?.duration || duration}ms`
        }">
        <div class="m-collapse__trigger" @click="toggleCollapse">
            <span class="collapse__trigger-title">
                <MIcon :name="prefixIcon" v-if="prefixIcon" :color="colorMap[props.iconVariant]"></MIcon>
                <span>{{ title }}</span>
            </span>
            <MIcon
                name="material-symbols:arrow-forward-ios"
                class="m-collapse__trigger-suffix"
                :class="{
                    'm-collapse__trigger-suffix--active': context?.isActive(name) || !collapsed
                }"></MIcon>
        </div>
        <Transition name="slide" v-on="transitionEvents">
            <div class="m-collapse__content" v-show="context?.isActive(name) || !collapsed" :style="contentStyle">
                <slot name="content">
                    <div class="m-collapse__text" v-if="content">{{ content }}</div>
                </slot>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { inject, ref } from "vue";
import type { CollapseGroupContext, CollapseIconVariant, CollapseProps } from "./types";
import { CollapseGroupContextKey } from "./types";

defineOptions({
    name: "MCollapse"
});
const props = withDefaults(defineProps<CollapseProps>(), {
    collapsed: true,
    duration: 300,
    name: undefined,
    iconVariant: "gray"
});
const context = inject<CollapseGroupContext | null>(CollapseGroupContextKey, null);
if (context) {
    context.register(props.name);
}

const collapsed = ref<boolean>(true);
const contentStyle = {
    paddingLeft: props.prefixIcon ? "21px" : "",
    ...props.contentStyle
};
const toggleCollapse = () => {
    if (context) {
        context.toggle(props.name);
    } else {
        collapsed.value = !collapsed.value;
    }
};

const transitionEvents: Record<string, (el: HTMLElement) => void> = {
    beforeEnter(el: HTMLElement) {
        el.style.height = "0";
        el.style.overflow = "hidden";
    },
    enter(el: HTMLElement) {
        el.style.height = `${el.scrollHeight}px`;
    },
    afterEnter(el: HTMLElement) {
        el.style.overflow = "";
        el.style.height = "";
    },
    beforeLeave(el: HTMLElement) {
        el.style.overflow = "hidden";
        el.style.height = `${el.scrollHeight}px`;
    },
    leave(el: HTMLElement) {
        el.style.height = "0";
    },
    afterLeave(el: HTMLElement) {
        el.style.overflow = "";
        el.style.height = "";
    }
};

const colorMap: Record<CollapseIconVariant, string> = {
    gray: "#6B6B6B",
    primary: "#409EFF",
    success: "#67C23A",
    warning: "#E6A23C",
    error: "#F56C6C",
    info: "#17A2B8",
    purple: "#801EFF",
    pink: "#FF69B4"
};
</script>

<style lang="scss" scoped>
.m-collapse {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    .m-collapse__trigger {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 16px;
        font-weight: 500;
        color: rgb(41, 52, 61);
        .m-collapse__trigger-title {
            flex: 1;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            height: 100%;
            white-space: nowrap;
            color: rgb(41, 52, 61);
        }
        .m-collapse__trigger-suffix {
            flex-shrink: 0;
            font-size: 16px;
            color: rgb(107, 107, 107);
            transition: transform 0.3s ease;
            &.m-collapse__trigger-suffix--active {
                transform: rotate(90deg);
            }
        }
    }
    .m-collapse__content {
        width: 100%;
        .m-collapse__text {
            color: #6b6b6b;
            font-size: 14px;
            line-height: 1.6;
            padding-bottom: 20px;
        }
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: all var(--collapse-speed) var(--ease-in-out);
}
</style>
