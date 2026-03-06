<template>
    <div class="tab-content">
        <!-- MCard -->
        <MCard title="MCard - 卡片">
            <p>卡片组件基础用法</p>
            <MGrid :cols="4" :gap="16">
                <MCard title="始终显示阴影" shadow="always">
                    <p style="margin: 0">这是一个始终显示阴影的卡片示例内容</p>
                </MCard>
                <MCard title="始终显示阴影" shadow="always">
                    <p style="margin: 0">这是一个始终显示阴影的卡片示例内容</p>
                </MCard>
                <MCard title="始终显示阴影" shadow="always">
                    <p style="margin: 0">这是一个始终显示阴影的卡片示例内容</p>
                </MCard>
                <MCard title="成功图标" icon="success" shadow="always">
                    <p style="margin: 0">带图标的卡片示例</p>
                </MCard>
                <MCard title="悬停显示阴影" shadow="hover">
                    <p style="margin: 0">悬停卡片时才显示阴影</p>
                </MCard>
            </MGrid>
        </MCard>

        <!-- MCollapse -->
        <MCard title="MCollapse - 折叠面板">
            <p>折叠面板支持手风琴模式</p>
            <MCollapseGroup accordion>
                <MCollapse title="面板1" prefix-icon="bi:info-circle-fill" content="这是面板1的内容信息" icon-variant="primary" name="面板1"></MCollapse>
                <MCollapse title="面板2" prefix-icon="ooui:success" content="这是面板2的内容信息" icon-variant="purple" name="面板2"></MCollapse>
                <MCollapse title="面板3" prefix-icon="streamline:warning-octagon-solid" content="这是面板3的内容信息" icon-variant="pink" disabled name="面板3"></MCollapse>
            </MCollapseGroup>
        </MCard>

        <!-- MNumberAnimation -->
        <MCard title="MNumberAnimation - 数字动画">
            <p>数字动画组件</p>
            <div style="display: flex; gap: 32px; flex-wrap: wrap">
                <div>
                    <h4 style="margin: 0 0 8px">基础用法</h4>
                    <MNumberAnimation :value="12345" />
                </div>

                <div>
                    <h4 style="margin: 0 0 8px">前缀后缀</h4>
                    <MNumberAnimation :value="89" prefix="共" suffix="人" />
                </div>

                <div>
                    <h4 style="margin: 0 0 8px">小数</h4>
                    <MNumberAnimation :value="3.14159" :decimals="5" />
                </div>

                <div>
                    <h4 style="margin: 0 0 8px">大数字</h4>
                    <MNumberAnimation :value="1234567" />
                </div>

                <div>
                    <h4 style="margin: 0 0 8px">自定义缓动</h4>
                    <MNumberAnimation :value="88888" :duration="2000" easing="easeInOutCubic" prefix="¥" />
                </div>

                <div>
                    <h4 style="margin: 0 0 8px">动态数值</h4>
                    <MNumberAnimation :value="dynamicValue" :duration="1500" />
                    <div style="margin-top: 8px">
                        <button @click="randomizeValue" style="padding: 4px 8px; margin-right: 8px">随机数值</button>
                        <button @click="incrementValue" style="padding: 4px 8px">递增</button>
                    </div>
                </div>

                <div>
                    <h4 style="margin: 0 0 8px">自定义样式</h4>
                    <MNumberAnimation :value="66666" prefix="共 " suffix=" 条数据" :decimals="0" style="font-size: 24px; color: #ff6b6b; font-weight: 600" />
                </div>

                <div>
                    <h4 style="margin: 0 0 8px">不同缓动效果</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px">
                        <div>
                            Linear:
                            <MNumberAnimation :value="1000" easing="linear" />
                        </div>
                        <div>
                            EaseOut:
                            <MNumberAnimation :value="1000" easing="easeOutCubic" />
                        </div>
                        <div>
                            EaseQuad:
                            <MNumberAnimation :value="1000" easing="easeOutQuad" />
                        </div>
                    </div>
                </div>
            </div>
        </MCard>

        <!-- MStatistic -->
        <MCard title="MStatistic - 统计数值">
            <p>展示统计数据，支持趋势指示、图标、前缀/后缀等</p>
            <MGrid :cols="3" :gap="24">
                <!-- 用户总数 -->
                <MStatistic title="注册用户总数" :value="12345" suffix="人" icon="mdi:account-group" variant="primary" trend-type="up" trend-value="12%" trend-prefix="同比" />

                <!-- 销售额 -->
                <MStatistic title="本月销售额" :value="89765" prefix="¥" :precision="2" icon="mdi:star" variant="success" trend-type="up" trend-value="15.3%" />

                <!-- 订单量 -->
                <MStatistic title="今日订单量" :value="543" suffix="单" icon="mdi:cart" variant="danger" trend-type="down" trend-value="5.2%" />

                <!-- 访问量 -->
                <MStatistic title="页面访问量" :value="1234" suffix="次" icon="mdi:eye" variant="info" trend-type="unchanged" />

                <!-- 资金余额 -->
                <MStatistic title="账户可用余额" :value="9876543.21" prefix="¥" :precision="2" icon="mdi:credit-card" variant="warning" trend-type="up" trend-value="1.2%" trend-prefix="较昨日" />

                <!-- 响应时间 -->
                <MStatistic
                    title="平均响应时间"
                    :value="85.6"
                    :precision="1"
                    suffix="ms"
                    icon="mdi:clock-outline"
                    variant="success"
                    :duration="2000"
                    trend-type="down"
                    trend-value="10ms"
                    trend-prefix="较上周" />
            </MGrid>
        </MCard>

        <!-- MEmpty -->
        <MCard title="MEmpty - 空状态">
            <p>空状态组件，用于展示没有数据时的提示</p>
            <MGrid :cols="3" :gap="24">
                <!-- 默认用法 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">默认用法</h4>
                    <MEmpty />
                </div>

                <!-- 自定义描述 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">自定义描述文字</h4>
                    <MEmpty description="暂无相关数据" />
                </div>

                <!-- 自定义图标大小 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">小图标</h4>
                    <MEmpty :image-size="80" description="暂无数据" />
                </div>

                <!-- 隐藏描述 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">无描述</h4>
                    <MEmpty :show-description="false" />
                </div>

                <!-- 指定高度 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">指定高度</h4>
                    <MEmpty :height="200" description="暂无数据" />
                </div>

                <!-- 带按钮 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">带操作</h4>
                    <MEmpty description="暂无数据">
                        <MButton variant="primary" size="small">立即添加</MButton>
                    </MEmpty>
                </div>
            </MGrid>
        </MCard>

        <!-- MImage -->
        <MCard title="MImage - 图片">
            <p>图片组件，支持多种填充方式、圆形、圆角、边框和预览功能</p>
            <MGrid :cols="4" :gap="24">
                <!-- 默认用法 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">默认用法</h4>
                    <MImage :src="sampleImages[0]!" :width="160" :height="120" :url-format="urlFormat" />
                </div>

                <!-- contain填充 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">contain 填充</h4>
                    <MImage :src="sampleImages[1]!" :width="120" :height="120" fit="contain" :url-format="urlFormat" />
                </div>

                <!-- 圆形裁剪 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">圆形裁剪</h4>
                    <MImage :src="sampleImages[2]!" :width="120" :height="120" circle :url-format="urlFormat" />
                </div>

                <!-- 圆角边框 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">圆角边框</h4>
                    <MImage :src="sampleImages[0]!" :width="200" :height="120" rounded :url-format="urlFormat" />
                </div>

                <!-- 带边框 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">带边框</h4>
                    <MImage :src="sampleImages[1]!" :width="160" :height="120" show-border :url-format="urlFormat" />
                </div>
                <!-- 禁用预览 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">禁用预览</h4>
                    <MImage :src="sampleImages[2]!" :width="160" :height="120" preview-disabled :url-format="urlFormat" />
                </div>
            </MGrid>

            <h4 style="margin: 24px 0 16px">图片组（MImageGroup）</h4>
            <p style="font-size: 13px; color: #606266; margin-bottom: 12px">MImageGroup 将多张图片组合为统一预览组，点击任意图片可翻页浏览整个组</p>
            <MImageGroup :url-format="urlFormat">
                <MFlex :gap="12" wrap>
                    <MImage v-for="(img, index) in sampleImages" :key="index" :src="img" :width="100" :height="100" show-border />
                </MFlex>
            </MImageGroup>
        </MCard>

        <!-- MImageGallery -->
        <MCard title="MImageGallery - 图片画廊">
            <p>图片画廊支持多种切换动画效果</p>
            <MGrid :cols="1" :gap="32">
                <!-- 翻页切换 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">翻页切换</h4>
                    <MImageGallery :list="sampleImages" :width="800" :height="600" :url-format="urlFormat" :thumbnail-format="urlFormat" transition="page" />
                </div>

                <!-- slide切换 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">slide切换</h4>
                    <MImageGallery :list="sampleImages" :width="800" :height="600" :url-format="urlFormat" :thumbnail-format="urlFormat" transition="slide" />
                </div>

                <!-- 禁用预览 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">禁用预览</h4>
                    <MImageGallery :list="editableImages" :width="800" :height="600" :url-format="urlFormat" :thumbnail-format="urlFormat" transition="rotate" preview-disabled />
                </div>

                <!-- contain 填充 -->
                <div style="border: 1px solid #e4e7ed; border-radius: 8px; padding: 20px">
                    <h4 style="margin: 0 0 16px; font-size: 14px; color: #909399">contain 填充</h4>
                    <MImageGallery :list="sampleImages" :width="800" :height="600" fit="contain" :url-format="urlFormat" :thumbnail-format="urlFormat" />
                </div>
            </MGrid>
        </MCard>

        <!-- MWaterFall -->
        <MCard title="MWaterFall - 瀑布流">
            <p>使用 example/results/data.json 作为数据源，演示按页加载与滚动触底加载</p>
            <MWaterFall :columns="5" :gap="12" :page-size="20" :request="requestWaterfall"  />
        </MCard>

        <!-- MTree -->
        <MCard title="MTree - 树形组件">
            <p>树形组件，支持手风琴/选中/父子同步等功能，也支持只选叶子节点模式</p>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">深层树（3层，手风琴模式）</h4>
                <MTree :data="treeDeepSmall" accordion />
            </div>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">深层树（4层，可选中 + 父子同步）</h4>
                <MTree :data="treeDeepMedium" selectable sync-parent-with-children />
            </div>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">含禁用节点 + 仅叶子节点可选</h4>
                <MTree :data="treeSmall" selectable only-leaf :selected-keys="[11, 21]" sync-parent-with-children></MTree>
            </div>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">全展开/收起 和 全选/取消（通过实例ref调用toggleExpandAll/toggleSelectAll方法）</h4>
                <MFlex :gap="10">
                    <MButton variant="primary" @click="toggleExpandAll">{{ expandAll ? "全部收起" : "全部展开" }}</MButton>
                    <MButton variant="success" @click="toggleSelectAll">{{ selectAll ? "取消全选" : "全部选中" }}</MButton>
                </MFlex>
                <MTree :data="treeDeepMedium" ref="treeRef" selectable only-leaf></MTree>
            </div>
        </MCard>
    </div>
</template>

<script lang="ts" setup>
import type { TreeInstance } from "@/components";
import { MButton, MCard, MCollapse, MCollapseGroup, MEmpty, MFlex, MGrid, MImage, MImageGallery, MImageGroup, MNumberAnimation, MStatistic, MTree, MWaterFall } from "@/components";
import { ref, useTemplateRef } from "vue";
import manager from "../scripts/data-manager";

const dynamicValue = ref(12345);

// 树形组件实例和展开/折叠控制
const treeRef = useTemplateRef<TreeInstance>("treeRef");
const expandAll = ref(false);
const selectAll = ref(false);
const toggleExpandAll = () => {
    expandAll.value = !expandAll.value;
    treeRef?.value?.toggleExpandAll();
};
const toggleSelectAll = () => {
    selectAll.value = !selectAll.value;
    treeRef?.value?.toggleSelectAll();
};

// MImage 示例数据
const sampleImages: string[] = [
    "2025/09/20/00/06/37/135297795_p0.png",
    "2026/02/16/05/03/07/141243135_p0.jpg",
    "2021/07/24/14/28/02/91456700_p1.png",
    "2021/07/24/14/28/02/91456700_p0.png",
    "2025/08/02/00/44/18/133378399_p0.png"
];
const urlFormat = (url: string) => {
    return `https://i.yuki.sh/img-original/img/${url}`;
};

const editableImages = ref([...sampleImages]);

const requestWaterfall = async (page: number, pageSize: number) => {
    return manager.getPageData(page, pageSize);
};

const randomizeValue = () => {
    dynamicValue.value = Math.floor(Math.random() * 100000);
};

const incrementValue = () => {
    dynamicValue.value += 1000;
};

// 生成深层树形数据的工具函数
const generateDeepTree = (levels: number, breadth: number) => {
    let idCounter = 1;

    const make = (level: number) => {
        return Array.from({ length: breadth }, () => {
            const id = idCounter++;
            const node: any = { id, label: `节点${id}` };
            if (level > 1) {
                node.children = make(level - 1);
            }
            return node;
        });
    };

    return make(levels);
};

// 生成不同层级的树，分别3层和4层
const treeDeepSmall = generateDeepTree(3, 3);
const treeDeepMedium = generateDeepTree(4, 3);

// 含禁用节点的浅层树
const treeSmall = [
    {
        id: 1,
        label: "分组节点1",
        disabled: true,
        children: [
            { id: 11, label: "子节点1-1" },
            { id: 12, label: "子节点1-2" }
        ]
    },
    {
        id: 2,
        label: "分组节点2",
        children: [{ id: 21, label: "子节点2-1", disabled: true }]
    }
];
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
</style>
