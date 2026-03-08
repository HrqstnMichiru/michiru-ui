<template>
    <span
        v-if="visible"
        class="tag"
        :class="[
            `tag--${props.size}`,
            `tag--${props.variant}`,
            `tag--${props.shape}`,
            {
                'tag--outlined': props.outlined,
                'tag--plain': props.plain
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
    variant: "default",
    shape: "rounded",
    closable: false,
    outlined: false,
    autoClose: false,
    plain: false
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
        padding: 3.2px 6px;
        font-size: 12px; // 20px/28px
        .tag-content {
            line-height: 12px;
        }
        .tag-close {
            font-size: 12px !important;
        }
    }
    &.tag--medium {
        height: 24px;
        padding: 4.2px 8px;
        font-size: 14px; // 24px/34px
        .tag-content {
            line-height: 14px;
        }
        .tag-close {
            font-size: 14px !important;
        }
    }
    &.tag--large {
        height: 28px;
        padding: 5.2px 10px;
        font-size: 16px; // 28px/40px
        .tag-content {
            line-height: 16px !important;
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
    &.tag--default {
        background-color: #6c757d;
        color: #ffffff;
        border-color: #6c757d;
        &:hover {
            background-color: #5a6268;
            border-color: #5a6268;
        }
    }
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
            background-color: #9ca3af;
            border-color: #9ca3af;
        }
    }

    // 轮廓样式
    &.tag--outlined {
        background-color: transparent;
        &.tag--default {
            color: #666;
            border-color: #e0e0e0;
            &:hover {
                background-color: #f5f5f5;
            }
        }
        &.tag--primary {
            color: #409eff;
            border-color: #409eff;
            &:hover {
                background-color: #ecf5ff;
            }
        }
        &.tag--success {
            color: #67c23a;
            border-color: #67c23a;
            &:hover {
                background-color: #f0f9ff;
            }
        }
        &.tag--warning {
            color: #e6a23c;
            border-color: #e6a23c;
            &:hover:not(.tag--disabled) {
                background-color: #fdf6ec;
            }
        }
        &.tag--danger {
            color: #f56c6c;
            border-color: #f56c6c;
            &:hover {
                background-color: #fef0f0;
            }
        }
        &.tag--info {
            color: #13c2c2;
            border-color: #13c2c2;
            &:hover {
                background-color: #e6fffb;
            }
        }
        &.tag--purple {
            color: #5b21b6;
            border-color: #5b21b6;
            &:hover {
                background-color: #faf5ff;
            }
        }
        &.tag--pink {
            color: #db2777;
            border-color: #db2777;
            &:hover {
                background-color: #fdf2f8;
            }
        }
        &.tag--gray {
            color: #6b7280;
            border-color: #6b7280;
            &:hover {
                background-color: #f9fafb;
            }
        }
    }

    // 朴素样式
    &.tag--plain {
        &.tag--default {
            background-color: #f8f9fa;
            color: #495057;
            border-color: #dee2e6;
            &:hover {
                background-color: #e9ecef;
                border-color: #adb5bd;
                color: #212529;
            }
        }
        &.tag--primary {
            background-color: #e3f2fd;
            color: #1976d2;
            border-color: #bbdefb;
            &:hover {
                background-color: #d1e7ff;
                border-color: #90caf9;
                color: #1565c0;
            }
        }
        &.tag--success {
            background-color: #e8f5e8;
            color: #2e7d32;
            border-color: #c8e6c9;
            &:hover {
                background-color: #d4edda;
                border-color: #a5d6a7;
                color: #1b5e20;
            }
        }
        &.tag--warning {
            background-color: #fdf6ec;
            color: #e6a23c;
            border-color: #f5dab1;
            &:hover {
                background-color: #faecd8;
                border-color: #eebe77;
                color: #cf9236;
            }
        }
        &.tag--danger {
            background-color: #f8d7da;
            color: #721c24;
            border-color: #f1aeb5;
            &:hover {
                background-color: #f1aeb5;
                border-color: #ea868f;
                color: #58151c;
            }
        }
        &.tag--info {
            background-color: #e6fffb;
            color: #13c2c2;
            border-color: #87e8de;
            &:hover {
                background-color: #b5f5ec;
                border-color: #5cdbd3;
            }
        }
        &.tag--purple {
            background-color: #f3e8ff;
            color: #7c3aed;
            border-color: #d8b4fe;
            &:hover {
                background-color: #e9d5ff;
                border-color: #c4b5fd;
                color: #6d28d9;
            }
        }
        &.tag--pink {
            background-color: #fdf2f8;
            color: #db2777;
            border-color: #f9a8d4;
            &:hover {
                background-color: #fce7f3;
                border-color: #f472b6;
            }
        }
        &.tag--gray {
            color: #6b6b6b;
            border-color: #c0c0c0;
            background-color: #f0f0f0;
            &:hover {
                background-color: #e6e6e6;
                border-color: #a8a8a8;
            }
        }
    }
}
</style>
