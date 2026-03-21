<template>
    <span
        class="tag"
        :class="[
            `tag--${size}`,
            `tag--${variant}`,
            {
                'tag--rounded': rounded,
                'tag--outlined': outlined,
                'tag--borderless': borderless,
                'tag--plain': plain
            }
        ]">
        <!-- 图标 -->
        <MIcon v-if="icon" :name="icon" class="tag-icon" />

        <!-- 文本内容 -->
        <span v-if="text || slots.default">
            <slot>{{ text }}</slot>
        </span>

        <!-- 关闭图标 -->
        <MIcon v-if="closable" name="material-symbols:close" class="tag-close" @click.stop="onClose" />
    </span>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { useSlots } from "vue";
import type { MTagEmits, MTagProps } from "./types";

defineOptions({
    name: "MTag"
});
const props = withDefaults(defineProps<MTagProps>(), {
    size: "medium",
    variant: "primary"
});
const slots = useSlots();
const emits = defineEmits<MTagEmits>();

const onClose = () => {
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
    border-radius: 3px;
    padding-left: 7px;
    padding-right: 7px;
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
    .tag-icon {
        flex-shrink: 0;
        margin-right: 2px;
    }

    // 大小变体
    &.tag--small {
        height: 22px;
        font-size: 12px;
        line-height: 22px;
        .tag-icon,
        .tag-close {
            font-size: 14px;
        }
    }
    &.tag--medium {
        height: 28px;
        font-size: 14px;
        line-height: 28px;
        .tag-icon,
        .tag-close {
            font-size: 16px;
        }
    }
    &.tag--large {
        height: 34px;
        font-size: 15px;
        line-height: 34px;
        .tag-icon,
        .tag-close {
            font-size: 18px;
        }
    }

    // 形状变体
    &.tag--rounded {
        border-radius: 17px;
        &.tag--small {
            padding-left: 10.2px;
            padding-right: 10.2px;
        }
        &.tag--medium {
            padding-left: 13.2px;
            padding-right: 13.2px;
        }
        &.tag--large {
            padding-left: 16.2px;
            padding-right: 16.2px;
        }
    }

    // 颜色变体
    &.tag--primary {
        background-color: #409eff;
        color: #ffffff;
        border-color: #409eff;
    }
    &.tag--success {
        background-color: #67c23a;
        color: #ffffff;
        border-color: #67c23a;
    }
    &.tag--warning {
        background-color: #e6a23c;
        color: #ffffff;
        border-color: #e6a23c;
    }
    &.tag--danger {
        background-color: #f56c6c;
        color: #ffffff;
        border-color: #f56c6c;
    }
    &.tag--info {
        background-color: #13c2c2;
        color: #ffffff;
        border-color: #13c2c2;
    }
    &.tag--purple {
        background-color: #801eff;
        color: #ffffff;
        border-color: #801eff;
    }
    &.tag--pink {
        background-color: #db2777;
        color: white;
        border-color: #db2777;
    }
    &.tag--gray {
        background-color: #6b6b6b;
        color: white;
        border-color: #6b6b6b;
    }

    // 轮廓样式
    &.tag--outlined {
        background-color: transparent;
        &.tag--primary {
            color: #409eff;
            border-color: #409eff;
        }
        &.tag--success {
            color: #67c23a;
            border-color: #67c23a;
        }
        &.tag--warning {
            color: #e6a23c;
            border-color: #e6a23c;
        }
        &.tag--danger {
            color: #f56c6c;
            border-color: #f56c6c;
        }
        &.tag--info {
            color: #13c2c2;
            border-color: #13c2c2;
        }
        &.tag--purple {
            color: #801eff;
            border-color: #801eff;
        }
        &.tag--pink {
            color: #ff69b4;
            border-color: #ff69b4;
        }
        &.tag--gray {
            color: #333;
            border-color: #c0c0c0;
        }
    }

    // Plain 样式
    &.tag--plain {
        &.tag--primary {
            color: #409eff;
            background-color: rgba(64, 158, 255, 0.12);
            border-color: rgba(64, 158, 255, 0.3);
        }
        &.tag--success {
            color: #67c23a;
            background-color: rgba(103, 194, 58, 0.12);
            border-color: rgba(103, 194, 58, 0.3);
        }
        &.tag--warning {
            color: #e6a23c;
            background-color: rgba(230, 162, 60, 0.15);
            border-color: rgba(230, 162, 60, 0.35);
        }
        &.tag--danger {
            color: #f56c6c;
            background-color: rgba(245, 108, 108, 0.1);
            border-color: rgba(245, 108, 108, 0.23);
        }
        &.tag--info {
            color: #13c2c2;
            background-color: rgba(19, 194, 194, 0.12);
            border-color: rgba(19, 194, 194, 0.3);
        }
        &.tag--purple {
            color: #801eff;
            background-color: rgba(128, 30, 255, 0.12);
            border-color: rgba(128, 30, 255, 0.3);
        }
        &.tag--pink {
            color: #ff69b4;
            background-color: rgba(255, 105, 180, 0.1);
            border-color: rgba(255, 105, 180, 0.3);
        }
        &.tag--gray {
            color: #333;
            background-color: rgba(107, 107, 107, 0.12);
            border-color: #c0c0c0;
        }
        &.tag--borderless {
            border-color: transparent;
        }
    }
}
</style>
