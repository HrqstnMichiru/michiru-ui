<template>
    <span
        v-if="visible"
        class="tag"
        :class="[
            `tag--${size}`,
            `tag--${variant}`,
            `tag--${shape}`,
            {
                'tag--outlined': outlined,
                'tag--plain': plain
            }
        ]">
        <!-- 图标 -->
        <MIcon v-if="icon" :name="icon" style="flex-shrink: 0; margin-right: 2px" />

        <!-- 文本内容 -->
        <span v-if="text || slots.default" class="tag-content">
            <slot>{{ text }}</slot>
        </span>

        <!-- 关闭图标 -->
        <MIcon v-if="closable" name="material-symbols:close" class="tag-close" @click.stop="onClose" />
    </span>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { ref, useSlots } from "vue";
import type { MTagEmits, MTagProps } from "./types";

defineOptions({
    name: "MTag"
});
const props = withDefaults(defineProps<MTagProps>(), {
    size: "medium",
    variant: "gray",
    shape: "rounded"
});
const slots = useSlots();
const emits = defineEmits<MTagEmits>();

const visible = ref<boolean>(true);
const onClose = () => {
    if (props.autoClose) {
        visible.value = false;
    }
    emits("close");
};
</script>

<style lang="scss" scoped>
.tag {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    border: 1px solid transparent;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    cursor: pointer;
    .tag-close {
        flex-shrink: 0;
        opacity: 0.7;
        margin-left: 2px;
        transition: opacity 0.2s ease;
        cursor: pointer;
        &:hover {
            opacity: 1;
        }
    }

    // 大小变体
    &.tag--small {
        height: 20px;
        padding: 3.7px 6px;
        font-size: 11px; // 20px/28px
        .tag-content {
            line-height: 11px;
        }
        .tag-close {
            font-size: 11px !important;
        }
    }
    &.tag--medium {
        height: 24px;
        padding: 4.7px 8px;
        font-size: 13px; // 24px/34px
        .tag-content {
            line-height: 13px;
        }
        .tag-close {
            font-size: 13px !important;
        }
    }
    &.tag--large {
        height: 28px;
        padding: 5.7px 10px;
        font-size: 15px; // 28px/40px
        .tag-content {
            line-height: 15px !important;
        }
        .tag-close {
            font-size: 13px !important;
        }
    }

    // 形状变体
    &.tag--rounded {
        border-radius: 14px;
    }
    &.tag--circle {
        border-radius: 50%;
        overflow: hidden;
        justify-content: center;
        &.tag--small {
            width: 20px;
        }
        &.tag--medium {
            width: 24px;
        }
        &.tag--large {
            width: 28px;
        }
    }
    &.tag--square {
        border-radius: 4px;
    }

    // 颜色变体
    &.tag--primary {
        background-color: #409eff;
        color: #ffffff;
        border-color: #409eff;
        &:hover {
            background-color: #66b1ff;
            border-color: #66b1ff;
        }
    }
    &.tag--success {
        background-color: #67c23a;
        color: #ffffff;
        border-color: #67c23a;
        &:hover {
            background-color: #85ce61;
            border-color: #85ce61;
        }
    }
    &.tag--warning {
        background-color: #e6a23c;
        color: #ffffff;
        border-color: #e6a23c;
        &:hover {
            background-color: #ebb563;
            border-color: #ebb563;
        }
    }
    &.tag--danger {
        background-color: #f56c6c;
        color: #ffffff;
        border-color: #f56c6c;
        &:hover {
            background-color: #f78989;
            border-color: #f78989;
        }
    }
    &.tag--info {
        background-color: #13c2c2;
        color: white;
        border-color: #13c2c2;
        &:hover {
            background-color: #36cfc9;
            border-color: #36cfc9;
        }
    }
    &.tag--purple {
        background-color: #7c3aed;
        color: #ffffff;
        border-color: #7c3aed;
        &:hover {
            background-color: #8b5cf6;
            border-color: #8b5cf6;
        }
    }
    &.tag--pink {
        background-color: #db2777;
        color: white;
        border-color: #db2777;
        &:hover:not(.tag--disabled) {
            background-color: #ec4899;
            border-color: #ec4899;
        }
    }
    &.tag--gray {
        background-color: #6b7280;
        color: white;
        border-color: #6b7280;
        &:hover:not(.tag--disabled) {
            background-color: #7c8594;
            border-color: #7c8594;
        }
    }

    // 轮廓样式
    &.tag--outlined {
        background-color: transparent;
        &.tag--primary {
            color: #409eff;
            border-color: #409eff;
            &:hover {
                background-color: transparent;
            }
        }
        &.tag--success {
            color: #67c23a;
            border-color: #67c23a;
            &:hover {
                background-color: transparent;
            }
        }
        &.tag--warning {
            color: #e6a23c;
            border-color: #e6a23c;
            &:hover {
                background-color: transparent;
            }
        }
        &.tag--danger {
            color: #f56c6c;
            border-color: #f56c6c;
            &:hover {
                background-color: transparent;
            }
        }
        &.tag--info {
            color: #13c2c2;
            border-color: #13c2c2;
            &:hover {
                background-color: transparent;
            }
        }
        &.tag--purple {
            color: #7c3aed;
            border-color: #7c3aed;
            &:hover {
                background-color: transparent;
            }
        }
        &.tag--pink {
            color: #db2777;
            border-color: #db2777;
            &:hover {
                background-color: transparent;
            }
        }
        &.tag--gray {
            color: #6b7280;
            border-color: #6b7280;
            &:hover {
                background-color: transparent;
            }
        }
    }

    // Plain 样式
    &.tag--plain {
        &.tag--primary {
            color: #409eff;
            background-color: #e3f0ff;
            border-color: #409eff;
            &:hover {
                background-color: #e3f0ff;
            }
        }
        &.tag--success {
            color: #67c23a;
            background-color: #e8f5df;
            border-color: #67c23a;
            &:hover {
                background-color: #e8f5df;
            }
        }
        &.tag--warning {
            color: #e6a23c;
            background-color: #fbefdd;
            border-color: #e6a23c;
            &:hover {
                background-color: #fbefdd;
            }
        }
        &.tag--danger {
            color: #f56c6c;
            background-color: #fde8e8;
            border-color: #f56c6c;
            &:hover {
                background-color: #fde8e8;
            }
        }
        &.tag--info {
            color: #13c2c2;
            background-color: #d8faf4;
            border-color: #13c2c2;
            &:hover {
                background-color: #d8faf4;
            }
        }
        &.tag--purple {
            color: #7c3aed;
            background-color: #ebdcff;
            border-color: #7c3aed;
            &:hover {
                background-color: #ebdcff;
            }
        }
        &.tag--pink {
            color: #db2777;
            background-color: #fbe7f2;
            border-color: #db2777;
            &:hover {
                background-color: #fbe7f2;
            }
        }
        &.tag--gray {
            color: #6b7280;
            background-color: #ebedf0;
            border-color: #6b7280;
            &:hover {
                background-color: #ebedf0;
            }
        }
    }
}
</style>
