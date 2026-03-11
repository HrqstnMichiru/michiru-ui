<template>
    <template v-if="children">
        <MTooltip
            ref="tooltipRef"
            theme="light"
            block
            transition="translate"
            :showArrow="!parentName"
            :placement="!parentName ? 'bottom' : 'right'"
            :disabled="data.disabled"
            :offset="8"
            @visible-change="onVisibleChange"
            :trigger-align="parentName ? 'start' : 'center'">
            <slot :active="visible" :data="data">
                <div
                    class="menu-node"
                    :class="{
                        'is-disabled': data.disabled,
                        'is-active': active
                    }">
                    <div class="left">
                        <MIcon :name="data.icon" v-if="data.icon" :size="20"></MIcon>
                        <span class="label">{{ data.label }}</span>
                    </div>
                    <div class="right">
                        <MIcon name="material-symbols:arrow-forward-ios"></MIcon>
                    </div>
                </div>
            </slot>
            <template #content>
                <div class="child-menu">
                    <MenuNode v-for="node in children" v-bind="node" :key="node.data.name"></MenuNode>
                </div>
            </template>
        </MTooltip>
    </template>
    <template v-else>
        <div
            class="menu-node"
            @click="handleClick"
            :class="{
                'is-disabled': data.disabled,
                'is-active': active
            }">
            <div class="left">
                <MIcon :name="data.icon" v-if="data.icon" :size="20"></MIcon>
                <span class="label">{{ data.label }}</span>
            </div>
            <div class="right">
                <MIcon name="ic:sharp-check" :size="18" v-show="active"></MIcon>
            </div>
        </div>
    </template>
</template>

<script lang="ts" setup>
import type { MTooltipInstance } from "@/components";
import { MIcon, MTooltip } from "@/components";
import { inject, provide, ref, useTemplateRef } from "vue";
import MenuNode from "./MHMenuNode.vue";
import type { MHMenuContext, MHMenuItemModel, MMenuNodeContext } from "./types";
import { MHMenuContextKey, MMenuNodeContextKey } from "./types";

const props = defineProps<MHMenuItemModel>();
const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");
const context = inject<MMenuNodeContext | null>(MMenuNodeContextKey, null);
const menuContext = inject<MHMenuContext | null>(MHMenuContextKey, null);
const visible = ref(false);
const handleClick = () => {
    if (props.data.disabled) return;
    if (menuContext && !props.active) {
        menuContext.setCurrent(props.data.name);
    }
    context?.hide();
};
const onVisibleChange = (val: boolean) => {
    visible.value = val;
};

if (props.children) {
    provide<MMenuNodeContext>(MMenuNodeContextKey, {
        hide: () => {
            tooltipRef.value?.hide();
            context?.hide();
        }
    });
}
</script>

<style lang="scss" scoped>
.menu-node {
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
    padding: 0 8px;
    border-radius: 6px;
    transition: background-color 0.2s ease;
    position: relative;
    width: 100%;
    justify-content: space-between;
    .left,
    .right {
        display: inline-flex;
        align-items: center;
        color: rgb(107, 107, 107);
        height: 36px;
        font-size: 16px;
        transition: color 0.2s ease;
    }
    .left {
        gap: 8px;
        flex: 1;
        .label {
            transition: color 0.2s ease;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            user-select: none;
        }
    }
    .right {
        width: 18px;
        margin-left: 30px;
    }
    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
        color: #801eff;
        .left,
        .right {
            color: #801eff;
        }
    }
    &.is-disabled {
        color: #a8abb2;
        cursor: not-allowed;
        .left,
        .right {
            color: #a8abb2;
        }
        &:hover {
            background: none;
            .left,
            .right {
                color: #a8abb2;
            }
        }
    }
    &.is-active {
        background-color: rgba(240, 218, 255, 1);
        color: #801eff;
        .left,
        .right {
            color: #801eff;
        }
    }
}

.child-menu {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 4px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
}
</style>
