<template>
    <div
        :style="{
            display: inline ? 'inline-flex' : 'flex',
            flexDirection: vertical ? 'column' : 'row',
            gap: Array.isArray(gap) ? `${gap[0]}px ${gap[1]}px` : `${gap}px`,
            alignItems: aligns,
            justifyContent: justify,
            flexWrap: wrap ? 'wrap' : 'nowrap',
            marginLeft: `${offset}px`,
            flex: span > 0 ? `0 0 ${span}%` : 'initial'
        }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import type { MFlexProps } from "./types";

defineOptions({
    name: "MFlex"
});
const props = withDefaults(defineProps<MFlexProps>(), {
    vertical: false,
    gap: 0,
    aligns: "stretch",
    justify: "start",
    wrap: false,
    offset: 0,
    inline: false,
    span: 0
});
// 当 span > 0 时 (例如 span = 25)：
// 结果为：flex: 0 0 25%
// flex-grow: 0: 禁止放大。即使整行有剩余空间，该元素也不会变宽。
// flex-shrink: 0: 禁止缩小。即使空间不足，该元素也不会被挤压。
// flex-basis: 25%: 基础宽度。规定该元素在行内占据 25% 的空间。
// 当 span <= 0 时：
// 结果为：flex: initial
// 这是 flex 属性的默认值。
// 相当于 flex: 0 1 auto。
// 效果：元素的宽度由其自身内容决定。如果没有设置 width，它会有多大内容就占多大地方。
</script>
