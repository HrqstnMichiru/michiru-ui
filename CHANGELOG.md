# 更新日志

## 2026-03-21

> Update：`MTag` 组件样式更新
>
> Update：`MTable` 和 `MTree` 组件高亮当前行样式优化

## 2026-03-20

> Fix：重构 `MScrollBar` 的实现逻辑，弃用原生滚动条，改用 `OverlayScrollbars`
>
> Update：优化 `MFlex` 与 `MGrid` 布局组件
>
> Fix：重构 `MLoading` 组件样式

## 2026-03-19

> Fix：修复 `MTooltip` 在移入外部时父级未正确隐藏的问题
>
> Fix：调整 `MPagination` 样式与交互显示细节
>
> Fix：优化 `MButton`、`MInput`、`MSelect` 等组件样式表现

## 2026-03-18

> Update：`MTabs` 新增 `bar` 与 `segmented` 两种风格
>
> Update：新增 `MCascader` 级联选择器组件
>
> Update：`MTooltip` 新增 `unfold` 展开动画

## 2026-03-17

> Fix：调整 `MDrawer` 旧版 API，统一为与 `MModal` 一致的调用方式
>
> Fix：优化 `MOverlay` 动画表现与过渡细节
>
> Fix：修改 `MLoading` 的样式和 `v-loading` 指令的逻辑

## 2026-03-16

> Update：`MCheckBox` 新增部分选择（`indeterminate`）功能
>
> Fix：修改表单组件中 `label` 与必选星号（`*`）的显示逻辑
>
> Update：`MCheckBox` 与 `MRadioBox` 新增 `bordered` 样式
>
> Update：新增 `MSelection` 组件，用于可选区域交互
>
> Fix：`MIconButton` 组件更名为 `MAction`
>
> Update：`MSegmented` 新增 `line` 与 `bar` 两种样式

## 2026-03-14

> Update：完成 `MPagination` 的功能拓展
>
> Fix：修复 `MSelect` 的初始化时的问题

## 2026-03-13

> Fix：修复嵌套 `MTooltip` 在全局点击与 `mouseleave` 场景下的误隐藏问题

## 2026-03-12

> Update：新增 `MIconButton` 组件
>
> Update：新增 `MTable` 长文本省略功能
>
> Fix：重构 `MTooltip` 组件定位策略，由相对父组件绝对定位改为挂载到 `body` 的固定定位，避免父容器 `overflow: hidden` 导致提示内容被遮挡

## 2026-03-11

> Update：新增 `MTable` 固定列和固定表头等功能
>
> Fix：重构 `MTable` 组件，将原先高度耦合的单一组件拆分为 `MTable` + `MTableCol` 双组件结构，并且重新设计了表格的样式
>
> Fix：移除 `MTable` 内置分页逻辑，分页请使用 `MPagination` 组件配合实现

## 2026-03-10

> Fix：重构 `MScrollBar` 组件，弃用 `smooth-scrollbar`，改用原生滚动条实现
