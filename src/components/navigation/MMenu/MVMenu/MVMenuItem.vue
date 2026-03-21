<template>
    <div
        class="menu-item"
        :style="itemStyle"
        :class="{
            'menu-item--collapsed': isCollapsed && !!context,
            'menu-item--active': isActive,
            'menu-item--disabled': disabled
        }"
        @click="onClick">
        <div class="left">
            <MIcon :name="icon" :size="20"></MIcon>
            <span class="label" :style="labelStyle">
                {{ label }}
            </span>
        </div>
        <div class="right" v-if="context && isCollapsed">
            <MIcon name="ic:sharp-check" :size="18" v-show="isActive"></MIcon>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { computed, inject } from "vue";
import type { MVMenuContext, MVMenuItemProps, MVSubMenuContext } from "./types";
import { MVMenuContextKey, MVSubMenuContextKey } from "./types";

defineOptions({
    name: "MVMenuItem"
});
const props = defineProps<MVMenuItemProps>();
const context = inject<MVSubMenuContext | null>(MVSubMenuContextKey, null);
const menuContext = inject<MVMenuContext>(MVMenuContextKey);
const isCollapsed = computed(() => !!menuContext?.collapsed);
const isActive = computed(() => {
    if (!menuContext) return false;
    return menuContext.isActive(props.name);
});
const itemStyle = computed(() => {
    if (isCollapsed.value) {
        const padding = !context ? "12px" : "6px";
        return { paddingLeft: padding, paddingRight: padding };
    }
    const level = context ? context.level + 1 : 0;
    return { paddingLeft: `${12 + level * 28}px` };
});
const labelStyle = computed(() => {
    if (!isCollapsed.value) return {};
    return { marginLeft: !context ? "12px" : "6px" };
});
if (context) {
    context.registerState({
        get active() {
            return isActive.value;
        },
        name: props.name
    });
}
if (menuContext) {
    menuContext.register({
        data: props,
        isLeaf: true,
        parentName: context ? context.parentName : undefined
    });
}

const onClick = () => {
    if (props.disabled) return;
    if (menuContext && !isActive.value) {
        menuContext.setCurrent(props.name);
    }
    if (menuContext?.collapsed) {
        context?.hide();
    }
};
</script>

<style lang="scss" scoped>
.menu-item {
    width: 100%;
    display: inline-flex;
    align-items: center;
    padding: 0 12px;
    height: 42px;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition:
        background-color 0.2s var(--ease-in-out),
        color 0.2s var(--ease-in-out);
    .left,
    .right {
        display: inline-flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        color: rgb(107, 107, 107);
        transition: color 0.2s ease;
    }
    .left {
        flex: 1;
        .label {
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: color 0.2s ease;
            margin-left: 12px;
        }
    }
    .right {
        flex-shrink: 0;
        margin-left: 30px;
    }
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    &.menu-item--active {
        background-color: rgba(240, 218, 255, 1);
        color: #801eff;
        .left {
            color: #801eff;
            .label {
                color: #801eff;
            }
        }
        .right {
            color: #801eff;
        }
    }
    &.menu-item--disabled {
        color: #a8abb2;
        cursor: not-allowed;
        .left {
            color: #a8abb2;
            .label {
                color: #a8abb2;
            }
        }
        .right {
            color: #a8abb2;
        }
        &:hover {
            background-color: transparent;
        }
    }
    &.menu-item--collapsed {
        height: 36px;
    }
}
</style>
