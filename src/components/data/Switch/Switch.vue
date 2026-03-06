<template>
    <div
        class="m-switch"
        :class="[
            `m-switch--${variant}`,
            `m-switch--${customSize}`,
            {
                'is-checked': modelValue,
                'is-disabled': disabled
            }
        ]"
        @click="toggle"
        v-ripple="disabled">
        <div class="m-switch-core">
            <div class="m-switch-icon-left" v-if="icons">
                <MIcon :name="icons[0]" class="m-switch-icon left-icon" />
            </div>
            <div class="m-switch-ball"></div>
            <div class="m-switch-icon-right" v-if="icons">
                <MIcon :name="icons[1]" class="m-switch-icon right-icon" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import vRipple from "@/directives/ripple";
import { computed, inject } from "vue";
import { type FormItemContext, FormItemContextKey } from "../Form/types";
import type { SwitchEmits, SwitchProps } from "./types";

defineOptions({
    name: "MSwitch"
});
const props = withDefaults(defineProps<SwitchProps>(), {
    disabled: false,
    themeMode: false,
    variant: "primary",
    size: "small"
});
const emits = defineEmits<SwitchEmits>();

const formItemContext = inject<FormItemContext | null>(FormItemContextKey, null);
const modelValue = defineModel<number>("modelValue", { default: 0 });
const customSize = computed(() => {
    return formItemContext?.size || props.size;
});

const toggle = () => {
    if (props.disabled) return;
    modelValue.value = modelValue.value === 0 ? 1 : 0;
    emits("change");
};
</script>

<style lang="scss" scoped>
.m-switch {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    position: relative;
    overflow: hidden;
    background-color: #d1d5db;
    border: 1px solid #9ca3af;
    border-radius: 20px;
    .m-switch-core {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        position: relative;
        .m-switch-ball {
            position: absolute;
            background-color: #fff;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            top: 50%;
            border-radius: 20px;
            transform: translateY(-50%);
            left: 0;
        }

        .left-icon {
            color: #fbbf24 !important;
        }

        .right-icon {
            color: #801eff !important;
        }
    }
    // 尺寸变体
    &.m-switch--small {
        width: 56px;
        height: 28px;
        .m-switch-ball {
            width: 26px;
            height: 26px;
        }
        .m-switch-icon-left,
        .m-switch-icon-right {
            font-size: 16px;
        }
    }
    &.m-switch--medium {
        width: 68px;
        height: 34px;
        .m-switch-ball {
            width: 32px;
            height: 32px;
        }
        .m-switch-icon-left,
        .m-switch-icon-right {
            font-size: 18px;
        }
    }
    &.m-switch--large {
        width: 80px;
        height: 40px;
        .m-switch-ball {
            width: 38px;
            height: 38px;
        }
        .m-switch-icon-left,
        .m-switch-icon-right {
            font-size: 20px;
        }
    }

    /* 开启状态 */
    &.is-checked {
        &.m-switch--small .m-switch-ball {
            left: 28px;
        }
        &.m-switch--medium .m-switch-ball {
            left: 34px;
        }
        &.m-switch--large .m-switch-ball {
            left: 40px;
        }
        &.m-switch--primary {
            background-color: #409eff;
            border-color: rgba(64, 158, 255, 0.6);
            .m-switch-ball {
                box-shadow: 0px 2px 8px rgba(64, 158, 255, 0.3);
            }
        }
        &.m-switch--success {
            background-color: #67c23a;
            border-color: rgba(103, 194, 58, 0.6);
            .m-switch-ball {
                box-shadow: 0px 2px 8px rgba(103, 194, 58, 0.3);
            }
        }
        &.m-switch--warning {
            background-color: #e6a23c;
            border-color: rgba(230, 162, 60, 0.6);
            .m-switch-ball {
                box-shadow: 0px 2px 8px rgba(230, 162, 60, 0.3);
            }
        }
        &.m-switch--danger {
            background-color: #f56c6c;
            border-color: rgba(245, 108, 108, 0.6);
            .m-switch-ball {
                box-shadow: 0px 2px 8px rgba(245, 108, 108, 0.3);
            }
        }
        &.m-switch--info {
            background-color: #13c2c2;
            border-color: rgba(19, 194, 194, 0.6);
            .m-switch-ball {
                box-shadow: 0px 2px 8px rgba(19, 194, 194, 0.3);
            }
        }
        &.m-switch--purple {
            background-color: #801eff;
            border-color: rgba(103, 79, 165, 0.6);
            .m-switch-ball {
                box-shadow: 0px 2px 8px rgba(103, 79, 165, 0.3);
            }
        }
        &.m-switch--pink {
            background-color: #db2777;
            border-color: rgba(219, 39, 119, 0.6);
            .m-switch-ball {
                box-shadow: 0px 2px 8px rgba(219, 39, 119, 0.3);
            }
        }
        &.m-switch--gray {
            background-color: #6b7280;
            border-color: rgba(107, 114, 128, 0.6);
            .m-switch-ball {
                box-shadow: 0px 2px 8px rgba(107, 114, 128, 0.3);
            }
        }
    }

    /* 禁用状态 */
    &.is-disabled {
        cursor: not-allowed;
        background-color: #f5f5f5;
        border-color: #e0e0e0;
        &:hover {
            background-color: #f5f5f5;
            border-color: #e0e0e0;
            .m-switch-ball {
                transform: translateY(-50%) scale(1);
            }
        }
    }
}
</style>
