<template>
    <div class="tab-content">
        <!-- MButton -->
        <MCard title="MButton - 按钮" center>
            <p>不同颜色变体的按钮</p>
            <div class="actions">
                <MButton variant="gray">Gray</MButton>
                <MButton variant="primary">Primary</MButton>
                <MButton variant="success">Success</MButton>
                <MButton variant="warning">Warning</MButton>
                <MButton variant="danger">Danger</MButton>
                <MButton variant="info">Info</MButton>
                <MButton variant="purple">Purple</MButton>
                <MButton variant="pink">Pink</MButton>
                <MButton variant="gray">Gray</MButton>
            </div>
            <p style="margin-top: 16px">Plain 样式</p>
            <div class="actions">
                <MButton variant="gray" plain>Gray</MButton>
                <MButton variant="primary" plain>Primary</MButton>
                <MButton variant="success" plain>Success</MButton>
                <MButton variant="warning" plain>Warning</MButton>
                <MButton variant="danger" plain>Danger</MButton>
                <MButton variant="info" plain>Info</MButton>
                <MButton variant="purple" plain>Purple</MButton>
                <MButton variant="pink" plain>Pink</MButton>
                <MButton variant="gray" plain>Gray</MButton>
            </div>
            <p style="margin-top: 16px">Outline 样式</p>
            <div class="actions">
                <MButton variant="gray" outline round>Gray</MButton>
                <MButton variant="primary" outline round>Primary</MButton>
                <MButton variant="success" outline>Success</MButton>
                <MButton variant="warning" outline>Warning</MButton>
                <MButton variant="danger" outline>Danger</MButton>
                <MButton variant="info" outline>Info</MButton>
                <MButton variant="purple" outline>Purple</MButton>
                <MButton variant="pink" outline>Pink</MButton>
                <MButton variant="gray" outline round>Gray</MButton>
            </div>
            <p style="margin-top: 16px">不同尺寸</p>
            <div class="actions">
                <MButton size="small" variant="primary">Small</MButton>
                <MButton size="medium" variant="primary">Medium</MButton>
                <MButton size="large" variant="primary">Large</MButton>
            </div>
            <p style="margin-top: 16px">加载中</p>
            <div class="actions">
                <MButton variant="primary" loading size="small">加载中</MButton>
                <MButton variant="warning" loading plain>加载中</MButton>
                <MButton variant="purple" icon="ooui:success">图标</MButton>
                <MButton variant="pink" icon="success" plain loading>图标</MButton>
            </div>
            <p style="margin-top: 16px">禁用状态</p>
            <div class="actions">
                <MButton variant="primary" disabled>Primary</MButton>
                <MButton variant="success" disabled>Success</MButton>
                <MButton variant="warning" disabled>Warning</MButton>
                <MButton variant="danger" disabled>Danger</MButton>
                <MButton variant="info" disabled>Info</MButton>
                <MButton variant="purple" disabled>Purple</MButton>
                <MButton variant="pink" disabled>Pink</MButton>
                <MButton variant="gray" disabled>Gray</MButton>
            </div>
            <p style="margin-top: 16px">禁用状态（Plain / Outline / 尺寸）</p>
            <div class="actions">
                <MButton variant="primary" plain disabled>Plain</MButton>
                <MButton variant="warning" plain disabled>Plain</MButton>
                <MButton variant="info" outline disabled>Outline</MButton>
                <MButton variant="gray" outline disabled>Outline</MButton>
                <MButton variant="primary" size="small" disabled>Small</MButton>
                <MButton variant="primary" size="medium" disabled>Medium</MButton>
                <MButton variant="primary" size="large" disabled>Large</MButton>
            </div>
            <p style="margin-top: 16px">按钮组</p>
            <MButtonGroup variant="success">
                <MButton>按钮1</MButton>
                <MButton>按钮2</MButton>
                <MButton>按钮3</MButton>
            </MButtonGroup>
            <p style="margin-top: 16px">Plain按钮组</p>
            <MButtonGroup variant="info" plain vertical>
                <MButton>按钮1</MButton>
                <MButton>按钮2</MButton>
                <MButton>按钮3</MButton>
            </MButtonGroup>
            <p style="margin-top: 16px">禁用按钮组</p>
            <MButtonGroup variant="danger" disabled>
                <MButton>按钮1</MButton>
                <MButton>按钮2</MButton>
                <MButton>按钮3</MButton>
            </MButtonGroup>
        </MCard>

        <!-- Text -->
        <MCard title="Text - 文本">
            <p style="margin-bottom: 16px">省略文本</p>
            <MEllipsis :max-lines="2" tooltip>
                这是一段支持展开和收起功能的文本。当文本超出指定的最大行数时，会在末尾显示展开按钮，点击后可以查看完整内容。再次点击收起按钮可以恢复省略状态。春の夜の夢のごとし、ただ春の夜の夢のごとし。まことに短い時代でありました。そして私は彼女の手首に、長い柔らかな指を巻きつけて、軽く眺めていた。少年は斜め上を見る存在に気づき、上目遣いで彼を見上げていた。微かに紅潮した顔と、期待に震える目。二人の間には、言葉にならない緊張した空気が漂っていた。
            </MEllipsis>
            <p style="margin: 16px 0 8px">渐变文本</p>
            <MGradient content="美丽的渐变文本" style="font-size: 24px" />
        </MCard>

        <!-- Icon -->
        <MCard title="Icon - 图标">
            <p>常用图标展示</p>
            <div class="actions">
                <MIcon name="ooui:success" :size="32" color="#67c23a" />
                <MIcon name="streamline:warning-octagon-solid" :size="32" color="#e6a23c" />
                <MIcon name="zondicons:close-solid" :size="32" color="#f56c6c" />
                <MIcon name="eos-icons:loading" :size="32" color="#409eff" />
                <MIcon name="mdi:heart" :size="32" color="#f472b6" />
                <MIcon name="mdi:star" :size="32" color="#fbbf24" />
                <MIcon name="mdi:account-circle" :size="32" color="#8b5cf6" />
                <MIcon name="mdi:settings" :size="32" color="#6b7280" />
            </div>
        </MCard>

        <MCard title="MAction - 轻交互按钮">
            <p>text / icon 两种模式，支持 size、round、circle、disabled</p>
            <p style="margin-top: 12px">文本模式</p>
            <MFlex aligns="center">
                <MAction type="text" action="查看" />
                <MAction type="text" action="编辑" size="small" />
                <MAction type="text" action="删除" size="medium" />
                <MAction type="text" action="更多操作" size="large" />
            </MFlex>
            <p style="margin-top: 12px">文本模式 - round / disabled</p>
            <MFlex aligns="center">
                <MAction type="text" action="圆角按钮" round />
                <MAction type="text" action="禁用按钮" disabled />
                <MAction type="text" action="禁用圆角" round disabled />
            </MFlex>
            <p style="margin-top: 12px">图标模式</p>
            <MFlex aligns="center">
                <MAction type="icon" action="mdi:dots-horizontal" />
                <MAction type="icon" action="mdi:pencil-outline" size="small" />
                <MAction type="icon" action="mdi:delete-outline" size="medium" />
                <MAction type="icon" action="mdi:cog-outline" size="large" />
            </MFlex>
            <p style="margin-top: 12px">图标模式 - circle / disabled</p>
            <MFlex aligns="center">
                <MAction type="icon" action="mdi:information-outline" circle />
                <MAction type="icon" action="mdi:heart-outline" circle size="small" />
                <MAction type="icon" action="mdi:lock-outline" disabled />
                <MAction type="icon" action="mdi:lock-outline" circle disabled />
            </MFlex>
            <p style="margin-top: 12px">文本模式 - color</p>
            <MFlex aligns="center">
                <MAction type="text" action="主色" color="#007bff" />
                <MAction type="text" action="成功色" color="#67c23a" />
                <MAction type="text" action="警告色" color="#e6a23c" />
                <MAction type="text" action="危险色" color="#f56c6c" />
                <MAction type="text" action="紫色" color="#8b5cf6" round />
            </MFlex>
            <p style="margin-top: 12px">图标模式 - color</p>
            <MFlex aligns="center">
                <MAction type="icon" action="mdi:thumb-up-outline" color="#007bff" />
                <MAction type="icon" action="mdi:check-circle-outline" color="#67c23a" />
                <MAction type="icon" action="mdi:alert-circle-outline" color="#e6a23c" />
                <MAction type="icon" action="mdi:close-circle-outline" color="#f56c6c" />
                <MAction type="icon" action="mdi:heart-outline" color="#ec4899" circle />
            </MFlex>
            <p style="margin-top: 12px">文本模式 - variant</p>
            <MFlex aligns="center">
                <MAction type="text" action="Primary" variant="primary" />
                <MAction type="text" action="Success" variant="success" />
                <MAction type="text" action="Warning" variant="warning" />
                <MAction type="text" action="Danger" variant="danger" />
                <MAction type="text" action="Info" variant="info" />
                <MAction type="text" action="Purple" variant="purple" />
                <MAction type="text" action="Pink" variant="pink" />
            </MFlex>
            <p style="margin-top: 12px">图标模式 - variant</p>
            <MFlex aligns="center">
                <MAction type="icon" action="mdi:star-outline" variant="primary" />
                <MAction type="icon" action="mdi:check-outline" variant="success" />
                <MAction type="icon" action="mdi:alert-outline" variant="warning" />
                <MAction type="icon" action="mdi:close-outline" variant="danger" />
                <MAction type="icon" action="mdi:information-outline" variant="info" />
                <MAction type="icon" action="mdi:flash-outline" variant="purple" />
                <MAction type="icon" action="mdi:heart-outline" variant="pink" />
            </MFlex>
        </MCard>

        <!-- MSplit -->
        <MCard title="MSplit - 分割面板">
            <p>水平分割（左右）</p>
            <MSplit size="40%" min="15%" max="85%" style="height: 200px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden">
                <template #first>
                    <div class="split-pane">
                        <span class="split-pane__label">左侧面板</span>
                    </div>
                </template>
                <template #second>
                    <div class="split-pane">
                        <span class="split-pane__label">右侧面板</span>
                    </div>
                </template>
            </MSplit>

            <p style="margin-top: 16px">垂直分割（上下）</p>
            <MSplit size="35%" direction="vertical" min="20%" max="80%" style="height: 240px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden">
                <template #first>
                    <div class="split-pane">
                        <span class="split-pane__label">上方面板</span>
                    </div>
                </template>
                <template #second>
                    <div class="split-pane">
                        <span class="split-pane__label">下方面板</span>
                    </div>
                </template>
            </MSplit>

            <p style="margin-top: 16px">自定义分割条宽度 &amp; 禁用拖拽</p>
            <MSplit size="60%" disabled style="height: 160px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden">
                <template #first>
                    <div class="split-pane split-pane--disabled">
                        <span class="split-pane__label">禁用拖拽</span>
                    </div>
                </template>
                <template #second>
                    <div class="split-pane split-pane--disabled">
                        <span class="split-pane__label">固定不可调整</span>
                    </div>
                </template>
            </MSplit>
        </MCard>

        <!-- MScrollBar -->
        <MCard title="MScrollBar - 滚动条">
            <p>always: 滚动条始终显示</p>
            <MScrollBar :height="160" scrollbar="always" class="scroll-demo">
                <div class="scroll-list">
                    <div class="scroll-row" v-for="item in longList" :key="`always-${item}`">Always Item {{ item }}</div>
                </div>
            </MScrollBar>

            <p style="margin-top: 16px">always: 默认模式（始终显示）</p>
            <MScrollBar :height="160" scrollbar="always" class="scroll-demo">
                <div class="scroll-list">
                    <div class="scroll-row" v-for="item in longList" :key="`always-b-${item}`">Always Item {{ item }}</div>
                </div>
            </MScrollBar>

            <p style="margin-top: 16px">never: 不显示滚动条，但内容仍可滚动</p>
            <MScrollBar :height="160" scrollbar="never" class="scroll-demo">
                <div class="scroll-list">
                    <div class="scroll-row" v-for="item in longList" :key="`never-${item}`">Never Item {{ item }}</div>
                </div>
            </MScrollBar>

            <p style="margin-top: 16px">横向滚动示例（always）</p>
            <MScrollBar :height="72" scrollbar="always" class="scroll-demo scroll-demo--x">
                <div class="scroll-chips">
                    <span class="scroll-chip" v-for="item in chipList" :key="`chip-${item}`">Tag {{ item }}</span>
                </div>
            </MScrollBar>
        </MCard>
    </div>
</template>

<script lang="ts" setup>
import { MAction, MButton, MButtonGroup, MCard, MEllipsis, MGradient, MIcon, MScrollBar, MSplit, MFlex } from "@/components";

const longList = Array.from({ length: 20 }, (_, index) => index + 1);
const chipList = Array.from({ length: 18 }, (_, index) => index + 1);
</script>

<style lang="scss" scoped>
.tab-content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    p {
        margin: 0 0 8px;
        color: #6b7280;
        font-size: 16px;
        line-height: 1.6;
    }
}

.actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.scroll-demo {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fafafa;
}

.scroll-demo--x {
    .scroll-chips {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        min-width: max-content;
        padding: 12px;
    }

    .scroll-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        padding: 0 14px;
        border-radius: 999px;
        background: #ede9fe;
        color: #5b21b6;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
    }
}

.scroll-list {
    padding: 8px;
}

.scroll-row {
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: 6px;
    color: #4b5563;
    font-size: 14px;

    &:nth-child(odd) {
        background: #f3f4f6;
    }
}

.split-pane {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: #fafafa;
    transition: background 0.2s;

    &__label {
        font-size: 14px;
        color: #374151;
        font-weight: 500;
    }

    &__value {
        font-size: 12px;
        color: #6b7280;
        background: #f3f4f6;
        padding: 2px 8px;
        border-radius: 4px;
        font-family: monospace;
    }

    &--disabled {
        background: #f9fafb;

        .split-pane__label {
            color: #9ca3af;
        }
    }
}
</style>
