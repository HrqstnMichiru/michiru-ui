<template>
    <div class="main">
        <h1 style="text-align: center; margin-bottom: 24px">Michiru UI 组件预览</h1>

        <MTabs default-active="display" position="top" :gap="24" variant="line" closable inline center :gutter="20">
            <!-- 基础组件 -->
            <MTabPane label="基础组件" name="basic">
                <BasicPanel />
            </MTabPane>

            <!-- 数据录入 -->
            <MTabPane label="数据录入" name="data">
                <DataPanel />
            </MTabPane>

            <!-- 数据展示 -->
            <MTabPane label="数据展示" name="display">
                <DisplayPanel />
            </MTabPane>

            <!-- 反馈 -->
            <MLoadingProvider>
                <MNotificationProvider>
                    <MMessageProvider :max-count="3">
                        <MDialogProvider>
                            <MTabPane label="反馈" name="feedback">
                                <FeedbackPanel />
                            </MTabPane>
                        </MDialogProvider>
                    </MMessageProvider>
                </MNotificationProvider>
            </MLoadingProvider>

            <!-- 导航 -->
            <MTabPane label="导航" name="navigation">
                <NavigationPanel />
            </MTabPane>
        </MTabs>
    </div>
</template>

<script lang="ts" setup>
import { MDialogProvider, MLoadingProvider, MMessageProvider, MNotificationProvider, MTabPane, MTabs } from "@/components";
import BasicPanel from "./components/BasicPanel.vue";
import DataPanel from "./components/DataPanel.vue";
import DisplayPanel from "./components/DisplayPanel.vue";
import FeedbackPanel from "./components/FeedbackPanel.vue";
import NavigationPanel from "./components/NavigationPanel.vue";
</script>

<style lang="scss" scoped>
.main {
    padding: 32px;
    margin: 0 auto;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}
</style>

<style lang="scss">
body,
html {
    font-family: "霞鹜文楷", "Noto Serif SC";
    background-color: rgb(244, 244, 244);
}

body::-webkit-scrollbar {
    display: none;
}
</style>
