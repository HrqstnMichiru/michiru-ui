<template>
    <div class="tab-content">
        <!-- MHMenu -->
        <MCard title="MHMenu - 水平菜单" style="z-index: 2">
            <p style="margin-bottom: 16px">基础用法</p>
            <div class="menu-container">
                <MHMenu>
                    <MHMenuItem label="首页" icon="mdi:home" name="h-home" />
                    <MHMenuItem label="关于" icon="mdi:information" name="h-about" />
                    <MHMenuItem label="联系" icon="mdi:phone" name="h-contact" />
                    <MHMenuItem label="设置" icon="mdi:cog" name="h-settings" />
                </MHMenu>
            </div>
            <p style="margin-top: 16px; margin-bottom: 16px">带子菜单的水平菜单</p>
            <div class="menu-container">
                <MHMenu mode="slide" default-active="cloud-service">
                    <MHMenuItem label="首页" icon="mdi:home" name="h-home2" />
                    <MHSubMenu label="产品" icon="mdi:package-variant" name="product">
                        <MHMenuItem label="产品 A" name="product-a" />
                        <MHMenuItem label="产品 B" name="product-b" />
                        <MHMenuItem label="产品 C" name="product-c" />
                    </MHSubMenu>
                    <MHSubMenu label="服务" icon="mdi:server" name="service">
                        <MHMenuItem label="云服务" name="cloud-service" />
                        <MHMenuItem label="技术支持" name="tech-support" />
                        <MHSubMenu label="解决方案" name="acquire">
                            <MHMenuItem label="商业方案" name="business" />
                            <MHMenuItem label="技术方案" name="technical" />
                            <MHSubMenu label="深层方案" name="acquire2">
                                <MHMenuItem label="商业方案" name="business2" />
                                <MHMenuItem label="技术方案" name="technical2" />
                            </MHSubMenu>
                        </MHSubMenu>
                    </MHSubMenu>
                    <MHMenuItem label="关于我们" icon="mdi:account-group" name="h-about2" />
                </MHMenu>
            </div>
        </MCard>

        <!-- MVMenu -->
        <MCard title="MVMenu - 垂直菜单">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px">
                <div>
                    <p style="margin-bottom: 12px">基础用法</p>
                    <div style="border: 1px solid #e4e7ed; border-radius: 8px">
                        <MVMenu accordion default-active="list-basic">
                            <MVMenuItem label="首页" icon="mdi:home" name="home" />
                            <MVSubMenu label="组件" icon="mdi:layers" name="component">
                                <MVMenuItem label="按钮" icon="mdi:button-cursor" name="button" />
                                <MVMenuItem label="输入框" icon="mdi:text-input" name="input" />
                                <MVMenuItem label="选择器" icon="mdi:form-select" name="select" />
                            </MVSubMenu>
                            <MVSubMenu label="数据展示" icon="mdi:chart-box" name="data">
                                <MVMenuItem label="表格" icon="mdi:table" name="table" />
                                <MVMenuItem label="卡片" icon="mdi:card-text-outline" name="card" />
                                <MVSubMenu label="列表" icon="mdi:format-list-bulleted" name="list">
                                    <MVMenuItem label="基础列表" icon="mdi:circle-small" name="list-basic" />
                                    <MVMenuItem label="虚拟列表" icon="mdi:circle-small" name="list-virtual" />
                                </MVSubMenu>
                            </MVSubMenu>
                            <MVSubMenu label="设置" icon="mdi:cog" name="setting">
                                <MVSubMenu label="列表" icon="mdi:format-list-bulleted" name="list2">
                                    <MVMenuItem label="基础列表" icon="mdi:circle-small" name="list-basic2" />
                                    <MVMenuItem label="虚拟列表" icon="mdi:circle-small" name="list-virtual2" />
                                </MVSubMenu>
                            </MVSubMenu>
                        </MVMenu>
                    </div>
                </div>
                <div>
                    <p style="margin-bottom: 12px">可折叠菜单</p>
                    <div style="border: 1px solid #e4e7ed; border-radius: 8px">
                        <MFlex justify="center">
                            <MButton @click="toggleMenu" variant="primary">
                                {{ menuCollapsed ? "展开" : "收起" }}
                            </MButton>
                        </MFlex>
                        <MVMenu ref="menuRef" :collapsed="menuCollapsed" accordion default-active="home2">
                            <MVMenuItem label="首页" icon="mdi:home" name="home2" />
                            <MVSubMenu label="组件" icon="mdi:layers" name="component">
                                <MVMenuItem label="按钮" icon="mdi:button-cursor" name="button2" />
                                <MVMenuItem label="输入框" icon="mdi:text-input" name="input2" />
                                <MVMenuItem label="选择器" icon="mdi:form-select" name="select2" />
                            </MVSubMenu>
                            <MVSubMenu label="数据展示" icon="mdi:chart-box" name="data">
                                <MVMenuItem label="表格" icon="mdi:table" name="table2" />
                                <MVMenuItem label="卡片" icon="mdi:card-text-outline" name="card2" />
                            </MVSubMenu>
                            <MVSubMenu label="设置" icon="mdi:cog" name="settings">
                                <MVMenuItem label="基础列表" icon="mdi:circle-small" name="list-basic" />
                                <MVMenuItem label="虚拟列表" icon="mdi:circle-small" name="list-virtual" />
                                <MVSubMenu label="数据展示" icon="mdi:chart-box" name="display">
                                    <MVMenuItem label="表格" icon="mdi:table" name="table4" disabled />
                                    <MVMenuItem label="卡片" icon="mdi:card-text-outline" name="card5" />
                                </MVSubMenu>
                            </MVSubMenu>
                        </MVMenu>
                    </div>
                </div>
            </div>
        </MCard>

        <!-- MDropdown -->
        <MCard title="MDropdown - 下拉菜单">
            <p>基础用法 - Hover 触发</p>
            <div class="actions">
                <MDropdown :width="200" placement="bottom-start">
                    <MButton variant="primary">下拉菜单</MButton>
                    <template #menu>
                        <MDropdownItem label="成功项" icon="mdi:check-circle" @click="handleDropdownClick('成功项')" />
                        <MDropdownItem label="警告项" icon="mdi:alert" @click="handleDropdownClick('警告项')" />
                        <MDropdownItem label="错误项" icon="mdi:alert-circle" @click="handleDropdownClick('错误项')" />
                        <MDropdownItem label="已禁用项" disabled icon="mdi:alert-circle" />
                    </template>
                </MDropdown>
                <MDropdown :width="180" placement="bottom-end">
                    <MButton variant="success">编辑操作</MButton>
                    <template #menu>
                        <MDropdownItem label="复制" icon="mdi:content-copy" />
                        <MDropdownItem label="粘贴" icon="mdi:content-paste" />
                        <MDropdownItem label="删除" icon="mdi:delete" />
                    </template>
                </MDropdown>
            </div>
            <p style="margin-top: 16px">右键触发菜单</p>
            <div class="actions">
                <MTooltipProvider>
                    <MDropdown placement="top-start">
                        <MButton variant="info">右键菜单</MButton>
                        <template #menu>
                            <MDropdownItem label="编辑" icon="mdi:pencil" />
                            <MDropdownItem label="查看" icon="mdi:eye" />
                            <MDropdownItem label="删除" icon="mdi:delete-outline" />
                            <MDropdown label="更多" icon="mdi:alert-circle">
                                <template #menu>
                                    <MDropdownItem label="复制" icon="mdi:content-copy" />
                                    <MDropdownItem label="粘贴" icon="mdi:content-paste" />
                                    <MDropdownItem label="删除" icon="mdi:delete" />
                                    <MDropdown label="嵌套更多" icon="mdi:alert-circle">
                                        <template #menu>
                                            <MDropdownItem label="复制" icon="mdi:content-copy" />
                                            <MDropdownItem label="粘贴" icon="mdi:content-paste" />
                                            <MDropdownItem label="删除" icon="mdi:delete" />
                                        </template>
                                    </MDropdown>
                                </template>
                            </MDropdown>
                        </template>
                    </MDropdown>
                </MTooltipProvider>
            </div>
            <p style="margin-top: 16px">切换动画</p>
            <div class="actions">
                <MDropdown :width="200" transition="fade" placement="top-start">
                    <MButton variant="purple">Fade 动画</MButton>
                    <template #menu>
                        <MDropdownItem label="选项一" />
                        <MDropdownItem label="选项二" />
                        <MDropdownItem label="选项三" />
                    </template>
                </MDropdown>
                <MDropdown :width="200" transition="translate" placement="top-start">
                    <MButton variant="pink">Translate 动画</MButton>
                    <template #menu>
                        <MDropdownItem label="选项一" />
                        <MDropdownItem label="选项二" />
                        <MDropdownItem label="选项三" />
                    </template>
                </MDropdown>
            </div>
        </MCard>

        <!-- MPagination -->
        <MCard title="MPagination - 分页">
            <p>基础用法</p>
            <MPagination :total-count="180" @page-change="handlePageChange" />

            <p style="margin-top: 16px">显示总数/可修改每页条数</p>
            <MPagination
                :total-count="320"
                show-total
                show-page-size
                :page-size-options="[10, 20, 50, 100]"
                :page-size="20"
                :page-count="5"
                @page-change="handlePageChange"
                @page-size-change="handlePageSizeChange" />

            <p style="margin-top: 16px">小尺寸 + 减少按钮数/自定义每页按钮数</p>
            <MPagination :total-count="88" size="small" :page-count="5" @page-change="handlePageChange" show-total position="right" />

            <p style="margin-top: 16px">不同 Variant（主要体现 active 样式）</p>
            <div style="display: flex; flex-direction: column; gap: 12px">
                <MPagination :total-count="180" :page-count="5" variant="primary" />
                <MPagination :total-count="180" :page-count="5" variant="success" />
                <MPagination :total-count="180" :page-count="5" variant="warning" />
                <MPagination :total-count="180" :page-count="5" variant="danger" />
                <MPagination :total-count="180" :page-count="5" variant="info" />
                <MPagination :total-count="180" :page-count="5" variant="purple" />
                <MPagination :total-count="180" :page-count="5" variant="pink" />
            </div>

            <p style="margin-top: 16px">样式模式（default / plain / outlined）</p>
            <div style="display: flex; flex-direction: column; gap: 12px">
                <MPagination :total-count="180" :page-count="5" variant="primary" />
                <MPagination :total-count="180" :page-count="5" variant="primary" plain />
                <MPagination :total-count="180" :page-count="5" variant="primary" outlined />
            </div>

            <p style="margin-top: 16px">禁用状态（disabled）</p>
            <div style="display: flex; flex-direction: column; gap: 12px">
                <MPagination :total-count="180" :page-count="5" disabled />
                <MPagination :total-count="320" show-total show-page-size :page-size-options="[10, 20, 50, 100]" :page-size="20" :page-count="5" variant="primary" plain disabled />
            </div>

            <p style="margin-top: 16px">当前操作：{{ paginationLog }}</p>
        </MCard>
    </div>
</template>

<script lang="ts" setup>
import type { VMenuInstance } from "@/components";
import { MButton, MCard, MDropdown, MDropdownItem, MFlex, MHMenu, MHMenuItem, MHSubMenu, MMessage, MPagination, MTooltipProvider, MVMenu, MVMenuItem, MVSubMenu } from "@/components";
import { ref } from "vue";

// MVMenu
const menuRef = ref<VMenuInstance>();
const menuCollapsed = ref(false);

const toggleMenu = () => {
    menuRef.value?.toggleCollapse();
    menuCollapsed.value = !menuCollapsed.value;
};

// MDropdown
const handleDropdownClick = (item: string) => {
    MMessage.success(`点击了：${item}`);
};

// MPagination
const paginationLog = ref("等待操作...");

const handlePageChange = (page: number) => {
    paginationLog.value = `切换到第${page}页`;
};

const handlePageSizeChange = (page: number, pageSize: number) => {
    paginationLog.value = `每页${pageSize}条，当前第${page}页`;
};
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

.menu-container {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    height: 60px;
    border-radius: 8px;
}
</style>
