<template>
    <component
        :is="isCollapsed ? MTooltip : 'div'"
        v-bind="isCollapsed ? { theme: 'light', block: true, transition: 'translate', offset: 8, disabled, placement: 'right', showArrow: !context, ref: 'tooltipRef' } : {}">
        <div class="sub-menu-wrapper" :style="wrapperStyle">
            <div class="sub-menu" @click="onClick" :style="menuStyle" :class="menuClasses">
                <span class="left">
                    <MIcon :name="icon" :size="20"></MIcon>
                    <span class="label" :style="labelStyle">{{ label }}</span>
                </span>
                <span class="right">
                    <MIcon name="material-symbols:arrow-forward-ios"></MIcon>
                </span>
            </div>
            <Transition name="slide" v-on="transitionEvents" v-if="!isCollapsed">
                <div v-show="isExpanded">
                    <slot></slot>
                </div>
            </Transition>
        </div>
        <template v-if="isCollapsed" #content>
            <div class="child-menu">
                <slot></slot>
            </div>
        </template>
    </component>
</template>

<script lang="ts" setup>
import type { MTooltipInstance } from "@/components";
import { MIcon, MTooltip } from "@/components";
import { computed, inject, onMounted, provide, shallowReactive, useTemplateRef } from "vue";
import type { MVMenuContext, MVMenuItemProps, MVSubMenuContext } from "./types";
import { MVMenuContextKey, MVSubMenuContextKey } from "./types";

defineOptions({
    name: "MVSubMenu"
});
const props = defineProps<MVMenuItemProps>();
const context = inject<MVSubMenuContext | null>(MVSubMenuContextKey, null);
const menuContext = inject<MVMenuContext>(MVMenuContextKey);
const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");

const isCollapsed = computed(() => !!menuContext?.collapsed);
const isExpanded = computed(() => menuContext?.isExpanded(props.name));

const wrapperStyle = computed(() => {
    if (isCollapsed.value) {
        return {};
    }
    return {
        "--menu-speed": `${menuContext?.duration}ms`
    };
});
const menuStyle = computed(() => {
    if (!isCollapsed.value) {
        const level = context ? context.level + 1 : 0;
        return { paddingLeft: `${12 + level * 28}px` };
    }
    const padding = !context ? "12px" : "6px";
    return { paddingLeft: padding, paddingRight: padding };
});
const labelStyle = computed(() => {
    if (!isCollapsed.value) return {};
    return { marginLeft: !context ? "12px" : "6px" };
});
const menuClasses = computed(() => {
    if (isCollapsed.value) {
        return {
            "sub-menu--disabled": props.disabled,
            "sub-menu--active": isActive.value
        };
    }
    return {
        "sub-menu--disabled": props.disabled,
        "sub-menu--expanded": isExpanded.value
    };
});

const stateList = shallowReactive<Array<{ active: boolean; name: string | number }>>([]);
provide<MVSubMenuContext>(MVSubMenuContextKey, {
    level: context ? context.level || 0 + 1 : 0,
    parentName: props.name,
    registerState: state => stateList.push(state),
    hide: () => {
        tooltipRef.value?.hide();
        context?.hide();
    }
});

const isActive = computed(() => {
    return stateList.some(item => item.active);
});
if (context) {
    context.registerState({
        get active() {
            return isActive.value;
        },
        name: props.name
    });
}
if (menuContext && !context) {
    menuContext.registerState({
        get active() {
            return isActive.value;
        },
        name: props.name
    });
}

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

const onClick = () => {
    if (props.disabled) return;
    if (isCollapsed.value) return;
    menuContext?.setCurrent(props.name);
};

onMounted(() => {
    if (menuContext) {
        menuContext.register({
            data: props,
            isLeaf: false,
            parentName: context ? context.parentName : undefined,
            children: stateList.map(item => item.name)
        });
    }
});
</script>

<style lang="scss" scoped>
.sub-menu-wrapper {
    width: 100%;
    overflow: hidden;
    .sub-menu {
        width: 100%;
        display: inline-flex;
        align-items: center;
        padding: 0 12px;
        height: 42px;
        cursor: pointer;
        border-radius: 6px;
        overflow: hidden;
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
                margin-left: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                transition: color 0.2s ease;
            }
        }
        .right {
            flex-shrink: 0;
            margin-left: 30px;
            transition: transform var(--menu-speed) ease;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
        &.sub-menu--active {
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
        &.sub-menu--disabled {
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
        &.sub-menu--expanded {
            .right {
                transform: rotate(90deg);
            }
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

.slide-enter-active,
.slide-leave-active {
    transition: all var(--menu-speed) var(--ease-in-out);
}
</style>
