<template>
    <div class="tab-content">
        <!-- MAlert -->
        <MCard title="MAlert - 警告提示">
            <p>基础样式 - 带图标/标题/内容</p>
            <div class="alert-group">
                <MAlert variant="primary" title="主要" message="这是一条主要的提示信息，用于显示重要内容"></MAlert>
                <MAlert variant="success" title="成功" message="操作成功完成，数据已保存到服务器"></MAlert>
                <MAlert variant="warning" title="警告" message="请注意检查您的输入信息，可能存在潜在风险"></MAlert>
                <MAlert variant="danger" title="错误" message="操作失败，请检查网络连接后重试"></MAlert>
                <MAlert variant="info" title="信息" message="系统将于今晚 22:00 进行维护，请提前保存"></MAlert>
            </div>

            <p style="margin-top: 16px">仅标题/仅内容</p>
            <div class="alert-group">
                <MAlert variant="primary" title="主要提示内容"></MAlert>
                <MAlert variant="success" title="成功提示内容"></MAlert>
                <MAlert variant="warning" title="警告提示内容"></MAlert>
                <MAlert variant="info" message="这是一段较长的提示内容，只有内容没有标题，这种情况适用于需要呈现较多文字信息的场景，不需要特别强调标题" no-title></MAlert>
            </div>

            <p style="margin-top: 16px">深色模式</p>
            <div class="alert-group">
                <MAlert variant="primary" title="主要提示内容" message="深色样式提示" effect="dark"></MAlert>
                <MAlert variant="success" title="成功" message="深色样式提示" effect="dark"></MAlert>
                <MAlert variant="warning" title="警告" message="深色样式" effect="dark"></MAlert>
                <MAlert variant="danger" title="错误" message="深色样式" effect="dark"></MAlert>
            </div>

            <p style="margin-top: 16px">自定义图标/禁用关闭/禁用图标</p>
            <div class="alert-group">
                <MAlert variant="success" icon="baocun" title="自定义图标提示" message="使用自定义图标替代默认图标"></MAlert>
                <MAlert variant="warning" title="不可关闭提示" message="此提示不可被手动关闭" :closable="false"></MAlert>
                <MAlert variant="info" :showIcon="false" title="隐藏图标提示" message="此提示不显示图标"></MAlert>
            </div>
        </MCard>

        <!-- MDrawer -->
        <MCard title="MDrawer - 抽屉">
            <p>点击按钮从不同方向打开抽屉</p>
            <div class="actions">
                <MButton variant="primary" @click="openDrawerRight">从右侧打开</MButton>
                <MButton variant="primary" @click="openDrawerLeft">从左侧打开</MButton>
                <MButton variant="primary" @click="openDrawerTop">从顶部打开</MButton>
                <MButton variant="primary" @click="openDrawerBottom">从底部打开</MButton>
            </div>
        </MCard>

        <!-- MMessage -->
        <MCard title="MMessage - 消息提示">
            <p>全局静态方法调用，无需注入 Provider</p>
            <div class="actions">
                <MButton variant="success" @click="showSuccess">Success 消息</MButton>
                <MButton variant="warning" @click="showWarning">Warning 消息</MButton>
                <MButton variant="danger" @click="showDanger">Danger 消息</MButton>
            </div>
        </MCard>

        <!-- MMessageProvider (useMessage) -->
        <MCard title="MMessageProvider - 消息提示">
            <p>使用 useMessage 管理消息，需配合 MMessageProvider 使用</p>
            <div class="actions">
                <MButton variant="primary" @click="message.primary('这是一条主要消息提示')">Primary</MButton>
                <MButton variant="success" @click="message.success('操作已成功完成')">Success</MButton>
                <MButton variant="warning" @click="message.warning('请注意风险')">Warning</MButton>
                <MButton variant="danger" @click="message.danger('操作失败了')">Danger</MButton>
                <MButton variant="info" @click="message.info('这是一条普通消息')">Info</MButton>
                <MButton variant="purple" @click="message.purple('紫色消息')">Purple</MButton>
                <MButton variant="pink" @click="message.pink('粉色消息')">Pink</MButton>
            </div>

            <p style="margin-top: 16px">高级配置</p>
            <div class="actions">
                <MButton variant="primary" @click="message.success('操作成功，点击关闭', { showClose: true })">显示关闭</MButton>
                <MButton variant="purple" @click="message.info('10秒后消失', { duration: 10000 })">持续10秒</MButton>
                <MButton variant="warning" @click="message.warning('永不消失的消息', { duration: 0, showClose: true })">永久显示</MButton>
                <MButton variant="success" @click="message.destroyAll()">清除所有</MButton>
            </div>
        </MCard>

        <!-- MNotification -->
        <MCard title="MNotification - 通知提示">
            <p>各类通知 - 5 秒后消失</p>
            <div class="actions">
                <MButton variant="primary" @click="showNotificationPrimary">Primary</MButton>
                <MButton variant="success" @click="showNotificationSuccess">Success</MButton>
                <MButton variant="warning" @click="showNotificationWarning">Warning</MButton>
                <MButton variant="danger" @click="showNotificationDanger">Danger</MButton>
                <MButton variant="info" @click="showNotificationInfo">Info</MButton>
            </div>

            <p style="margin-top: 16px">弹出位置</p>
            <div class="actions">
                <MButton variant="primary" size="small" @click="showNotificationTopRight">右上角</MButton>
                <MButton variant="primary" size="small" @click="showNotificationTopLeft">左上角</MButton>
                <MButton variant="primary" size="small" @click="showNotificationBottomRight">右下角</MButton>
                <MButton variant="primary" size="small" @click="showNotificationBottomLeft">左下角</MButton>
            </div>

            <p style="margin-top: 16px">高级用法</p>
            <div class="actions">
                <MButton variant="success" @click="showNotificationWithDesc">带描述内容</MButton>
                <MButton variant="warning" @click="showNotificationWithoutClose">不显示关闭</MButton>
                <MButton variant="info" @click="showNotificationWithoutIcon">不显示图标</MButton>
            </div>
        </MCard>

        <!-- MNotificationProvider (useNotification) -->
        <MCard title="MNotificationProvider - 通知提示">
            <p>使用 useNotification 管理通知，需配合 MNotificationProvider 使用</p>
            <div class="actions">
                <MButton variant="primary" @click="notification.primary('这是一条主要通知消息')">Primary</MButton>
                <MButton variant="success" @click="notification.success('操作成功完成')">Success</MButton>
                <MButton variant="warning" @click="notification.warning('请注意风险')">Warning</MButton>
                <MButton variant="danger" @click="notification.danger('操作失败了')">Danger</MButton>
                <MButton variant="info" @click="notification.info('这是一条普通通知')">Info</MButton>
            </div>

            <p style="margin-top: 16px">高级配置</p>
            <div class="actions">
                <MButton variant="gray" @click="notification.info('10秒后消失', { duration: 10000 })">持续10秒</MButton>
                <MButton variant="gray" @click="notification.warning('永不消失的通知', { duration: 0 })">永不关闭</MButton>
                <MButton variant="gray" @click="notification.success('带自定义标题的通知内容', { title: '自定义标题' })">带自定义标题</MButton>
                <MButton variant="gray" @click="notification.destroyAll()">清除所有</MButton>
            </div>

            <p style="margin-top: 16px">弹出位置</p>
            <div class="actions">
                <MButton variant="primary" size="small" @click="notification.primary('右上角通知', { placement: 'top-right' })">右上角</MButton>
                <MButton variant="success" size="small" @click="notification.success('左上角通知', { placement: 'top-left' })">左上角</MButton>
                <MButton variant="warning" size="small" @click="notification.warning('右下角通知', { placement: 'bottom-right' })">右下角</MButton>
                <MButton variant="danger" size="small" @click="notification.danger('左下角通知', { placement: 'bottom-left' })">左下角</MButton>
            </div>
        </MCard>

        <!-- MDialog -->
        <MCard title="MDialog - 对话框">
            <p>各类对话框</p>
            <div class="actions">
                <MButton variant="primary" @click="openDialogAlert">警告弹窗</MButton>
                <MButton variant="warning" @click="openDialogConfirm">确认对话框</MButton>
                <MButton variant="success" @click="openDialogSuccess">成功提示</MButton>
                <MButton variant="danger" @click="openDialogDanger">错误提示</MButton>
                <MButton variant="info" @click="openDialogInfo">信息提示</MButton>
            </div>

            <p style="margin-top: 16px">高级用法</p>
            <div class="actions">
                <MButton variant="info" @click="openDialogCustom">自定义样式</MButton>
                <MButton variant="purple" @click="openDialogAsync">异步关闭</MButton>
            </div>
        </MCard>

        <!-- MTooltip -->
        <MCard title="MTooltip - 文字提示">
            <p>基础用法 - Hover 触发</p>
            <div class="actions">
                <MTooltip content="顶部提示内容" placement="top">
                    <MButton variant="primary">顶部提示</MButton>
                </MTooltip>
                <MTooltip content="底部提示内容" placement="bottom">
                    <MButton variant="success">底部提示</MButton>
                </MTooltip>
                <MTooltip content="左侧提示内容" placement="left">
                    <MButton variant="warning">左侧提示</MButton>
                </MTooltip>
                <MTooltip content="右侧提示内容" placement="right">
                    <MButton variant="danger">右侧提示</MButton>
                </MTooltip>
            </div>

            <p style="margin-top: 16px">更多方向</p>
            <div class="actions">
                <MTooltip content="top-start方向" placement="top-start">
                    <MButton variant="info">Top Start</MButton>
                </MTooltip>
                <MTooltip content="top-end方向" placement="top-end">
                    <MButton variant="info">Top End</MButton>
                </MTooltip>
                <MTooltip content="bottom-start方向" placement="bottom-start">
                    <MButton variant="purple">Bottom Start</MButton>
                </MTooltip>
                <MTooltip content="bottom-end方向" placement="bottom-end">
                    <MButton variant="purple">Bottom End</MButton>
                </MTooltip>
            </div>

            <p style="margin-top: 16px">触发方式</p>
            <div class="actions">
                <MTooltip content="Hover 触发提示内容" trigger="hover">
                    <MButton variant="primary">Hover 触发</MButton>
                </MTooltip>
                <MTooltip content="Click 触发内容" trigger="click">
                    <MButton variant="success">Click 触发</MButton>
                </MTooltip>
                <MTooltip content="ContextMenu 触发内容" trigger="contextmenu">
                    <MButton variant="danger">右键触发</MButton>
                </MTooltip>
            </div>

            <p style="margin-top: 16px">切换动画</p>
            <div class="actions">
                <MTooltip content="渐入渐出效果" transition="fade">
                    <MButton variant="info">Fade</MButton>
                </MTooltip>
                <MTooltip content="展开收起" transition="translate" placement="top">
                    <MButton variant="purple">Translate</MButton>
                </MTooltip>
                <MTooltip content="向下滑动" transition="translate" placement="right" theme="light">
                    <MButton variant="pink">Translate</MButton>
                </MTooltip>

                <MTooltip content="无动画" transition="none">
                    <MButton variant="gray">None</MButton>
                </MTooltip>
            </div>

            <p style="margin-top: 16px">主题色</p>
            <div class="actions">
                <MTooltip content="浅色主题提示内容" theme="light" placement="top-start">
                    <MButton variant="primary">Light 主题</MButton>
                </MTooltip>
                <MTooltip content="深色主题" theme="dark">
                    <MButton variant="gray">Dark 主题</MButton>
                </MTooltip>
            </div>
        </MCard>

        <!-- MPopover -->
        <MCard title="MPopover - 弹出框">
            <p>基础用法</p>
            <div class="actions">
                <MPopover content="这是 MPopover 弹出框～" title="标题" placement="right-start" transition="translate" trigger="contextmenu">
                    <MButton variant="primary">右键触发</MButton>
                </MPopover>
            </div>
        </MCard>

        <!-- MPopconfirm -->
        <MCard title="MPopconfirm - 气泡确认框">
            <p>基础用法 - Click 触发</p>
            <div class="actions">
                <MPopconfirm
                    title="确认删除"
                    message="此操作将永久删除该记录，是否继续？"
                    positiveText="删除"
                    negativeText="取消"
                    variant="danger"
                    placement="bottom-start"
                    :onPositiveClick="handlePopconfirmDelete"
                    :onNegativeClick="handlePopconfirmCancel">
                    <MButton variant="danger">确认删除</MButton>
                </MPopconfirm>

                <MPopconfirm
                    title="确认提交"
                    message="请确认所有信息无误后再提交"
                    positiveText="提交"
                    negativeText="再检查一下"
                    variant="primary"
                    placement="left"
                    :onPositiveClick="handlePopconfirmSubmit"
                    :onNegativeClick="handlePopconfirmCancel">
                    <MButton variant="success">确认提交</MButton>
                </MPopconfirm>

                <MPopconfirm
                    title="确认清除"
                    message="此操作将清理所有缓存数据，操作不可撤销"
                    positiveText="确认"
                    negativeText="返回"
                    variant="warning"
                    placement="top"
                    :onPositiveClick="handlePopconfirmClear">
                    <MButton variant="warning">确认清除</MButton>
                </MPopconfirm>
            </div>

            <p style="margin-top: 16px">异步确认操作</p>
            <div class="actions">
                <MPopconfirm
                    title="确认发布"
                    message="发布后将对所有用户可见，确认发布？"
                    positiveText="发布"
                    negativeText="取消"
                    variant="success"
                    placement="top-start"
                    :loading="publishLoading"
                    :onPositiveClick="handleAsyncPublish">
                    <MButton variant="success">确认发布</MButton>
                </MPopconfirm>

                <MPopconfirm
                    title="确认导出"
                    message="将导出当前所有数据，文件较大请耐心等待..."
                    positiveText="开始导出"
                    negativeText="取消"
                    variant="primary"
                    placement="top"
                    :loading="exportLoading"
                    :onPositiveClick="handleAsyncExport">
                    <MButton variant="info">确认导出</MButton>
                </MPopconfirm>

                <MPopconfirm
                    title="确认上传"
                    message="将上传本地文件到服务器，确认继续？"
                    positiveText="开始上传"
                    negativeText="取消"
                    variant="primary"
                    placement="top"
                    :loading="uploadLoading"
                    :onPositiveClick="handleAsyncUpload">
                    <MButton variant="primary">确认上传</MButton>
                </MPopconfirm>
            </div>

            <p style="margin-top: 16px">快捷尺寸</p>
            <div class="actions">
                <MPopconfirm title="确认删除" message="确认删除此项？" positiveText="删除" negativeText="取消" variant="danger" placement="top-start">
                    <MButton variant="danger" size="small">删除</MButton>
                </MPopconfirm>

                <MPopconfirm title="确认提交" message="确认提交所有更改？" positiveText="提交" negativeText="取消" variant="success" placement="top">
                    <MButton variant="success" size="small">提交</MButton>
                </MPopconfirm>

                <MPopconfirm title="警告" message="确认执行此操作？" positiveText="确认" negativeText="取消" variant="warning" placement="top">
                    <MButton variant="warning" size="small">警告</MButton>
                </MPopconfirm>

                <MPopconfirm title="信息" message="确认查看详细信息？" positiveText="查看" negativeText="关闭" variant="info" placement="top">
                    <MButton variant="info" size="small">信息</MButton>
                </MPopconfirm>
            </div>

            <p style="margin-top: 16px">行为记录</p>
            <div class="actions">
                <MPopconfirm
                    title="确认操作"
                    :message="`已操作 ${popconfirmActionCount} 次`"
                    placement="top-start"
                    :onPositiveClick="() => handlePopconfirmWithLog('确认')"
                    :onNegativeClick="() => handlePopconfirmWithLog('取消')">
                    <MButton variant="primary">记录操作</MButton>
                </MPopconfirm>

                <MPopconfirm title="确认操作" message="点击确认后将等待5秒模拟异步处理" positiveText="开始执行" negativeText="取消" variant="danger" placement="top">
                    <MButton variant="danger" size="small">异步操作</MButton>
                </MPopconfirm>

                <MPopconfirm title="确认操作" message="这是一个仅有确认按钮的气泡框" positiveText="确认" negativeText="关闭" variant="warning" placement="top">
                    <MButton variant="gray" size="small">关闭</MButton>
                </MPopconfirm>
            </div>
        </MCard>

        <!-- MLoading -->
        <MCard title="MLoading - 加载中">
            <p>使用 useLoading 管理加载，需配合 MLoadingProvider 使用</p>
            <div class="actions">
                <MButton variant="primary" @click="showFullscreenLoading">全屏加载</MButton>
                <MButton variant="success" @click="showTargetLoading">指定容器加载</MButton>
                <MButton variant="warning" @click="showDarkLoading">深色加载</MButton>
                <MButton variant="danger" @click="loading.destroyAll()">清除所有</MButton>
            </div>

            <p style="margin-top: 16px">指定容器加载效果</p>
            <div
                id="loading-target"
                style="height: 150px; border: 1px dashed #dcdfe6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #909399; position: relative">
                点击「指定容器加载」后，Loading 将显示在此区域内 MLoading
            </div>
        </MCard>

        <!-- MResult -->
        <MCard title="MResult - 结果">
            <p>各类结果状态展示，用于请求结果的反馈</p>

            <!-- 成功状态 -->
            <div style="margin-bottom: 32px">
                <h4 style="margin: 0 0 16px">成功状态</h4>
                <div style="border: 1px solid #e4e7ed; border-radius: 8px">
                    <MResult status="success" title="提交成功" description="您的申请已提交，我们将在 3 个工作日内完成审核，请关注您的邮箱通知">
                        <template #extra>审核完成后您将收到邮件和站内通知</template>
                        <template #action>
                            <MFlex :gap="12">
                                <MButton variant="primary">查看详情</MButton>
                                <MButton variant="primary" plain>返回</MButton>
                                <MButton variant="primary" plain>首页</MButton>
                            </MFlex>
                        </template>
                    </MResult>
                </div>
            </div>

            <!-- 主要状态 -->
            <div style="margin-bottom: 32px">
                <h4 style="margin: 0 0 16px">主要状态</h4>
                <div style="border: 1px solid #e4e7ed; border-radius: 8px">
                    <MResult status="primary" title="处理中" description="您的请求正在处理中，请稍候...">
                        <template #action>
                            <MButton variant="primary">刷新状态</MButton>
                        </template>
                    </MResult>
                </div>
            </div>

            <!-- 警告状态 -->
            <div style="margin-bottom: 32px">
                <h4 style="margin: 0 0 16px">警告状态</h4>
                <div style="border: 1px solid #e4e7ed; border-radius: 8px">
                    <MResult status="warning" title="权限不足" description="您当前没有访问该资源的权限，请联系管理员获取授权">
                        <template #action>
                            <MFlex :gap="12">
                                <MButton variant="warning">申请权限</MButton>
                                <MButton variant="warning" plain>返回首页</MButton>
                            </MFlex>
                        </template>
                    </MResult>
                </div>
            </div>

            <!-- 错误状态 -->
            <div>
                <h4 style="margin: 0 0 16px">错误状态</h4>
                <div style="border: 1px solid #e4e7ed; border-radius: 8px">
                    <MResult status="danger" title="请求失败" description="网络连接失败，请检查您的网络设置或稍后重试">
                        <template #action>
                            <MFlex :gap="12">
                                <MButton variant="danger">重新请求</MButton>
                                <MButton variant="danger" plain>返回首页</MButton>
                            </MFlex>
                        </template>
                    </MResult>
                </div>
            </div>
        </MCard>

        <MDrawer ref="drawerRef" :placement="placement" title="抽屉标题" :width="300" :height="200" maskClosable @after-close="onDrawerClose">
            <div style="padding: 20px">
                <p>
                    当前方向：
                    <strong>{{ placement }}</strong>
                    方向的抽屉
                </p>
                <p>这里是抽屉的内容区域，可以放任何内容。</p>
            </div>
        </MDrawer>
    </div>
</template>

<script lang="ts" setup>
import type { DrawerInstance } from "@/components";
import { MAlert, MButton, MCard, MDrawer, MFlex, MMessage, MNotification, MPopconfirm, MPopover, MResult, MTooltip, useDialog, useLoading, useMessage, useNotification } from "@/components";
import { ref, useTemplateRef } from "vue";

const dialog = useDialog();
const message = useMessage();
const notification = useNotification();
const loading = useLoading();

// MLoading
const showFullscreenLoading = () => {
    const instance = loading.create();
    setTimeout(() => {
        instance.destroy();
        message.success("加载完成");
    }, 5000);
};
const showTargetLoading = () => {
    const instance = loading.create("#loading-target");
    setTimeout(() => {
        instance.destroy();
        message.success("目标加载完成");
    }, 5000);
};
const showDarkLoading = () => {
    const instance = loading.create(
    );
    setTimeout(() => {
        instance.destroy();
        message.success("加载完成");
    }, 2000);
};

// MDrawer
const drawerRef = useTemplateRef<DrawerInstance>("drawerRef");
const placement = ref<"left" | "right" | "top" | "bottom">("right");
const openDrawer = (dir: "left" | "right" | "top" | "bottom") => {
    placement.value = dir;
    drawerRef.value?.open();
};
const openDrawerRight = () => openDrawer("right");
const openDrawerLeft = () => openDrawer("left");
const openDrawerTop = () => openDrawer("top");
const openDrawerBottom = () => openDrawer("bottom");

const onDrawerClose = () => {
    console.log("抽屉已关闭");
};

// MessageBox
const showSuccess = () => {
    MMessage.success("这是一条成功消息，操作已完成");
};
const showWarning = () => {
    MMessage.warning("这是一条警告消息，请注意操作风险");
};
const showDanger = () => {
    MMessage.danger("这是一条错误消息，操作失败请重试");
};

// MNotification
const showNotificationPrimary = () => {
    MNotification.primary("这是一条 Primary 通知，5秒后消失");
};
const showNotificationSuccess = () => {
    MNotification.success("操作成功完成，数据已保存");
};
const showNotificationWarning = () => {
    MNotification.warning("请注意潜在风险，操作前请确认");
};
const showNotificationDanger = () => {
    MNotification.danger("操作失败，请检查后重试");
};
const showNotificationInfo = () => {
    MNotification.info("系统通知：维护窗口即将开始");
};
const showNotificationTopRight = () => {
    MNotification.primary("右上角通知", {
        placement: "top-right"
    });
};
const showNotificationTopLeft = () => {
    MNotification.success("左上角通知", {
        placement: "top-left"
    });
};
const showNotificationBottomRight = () => {
    MNotification.warning("右下角通知", {
        placement: "bottom-right"
    });
};
const showNotificationBottomLeft = () => {
    MNotification.danger("左下角通知", {
        placement: "bottom-left"
    });
};
const showNotificationWithDesc = () => {
    MNotification.success("文件已下载至 /Downloads/file.zip", {
        title: "下载完成"
    });
};
const showNotificationWithoutClose = () => {
    MNotification.info("此通知不显示关闭按鈕，将在5秒后自动消失", {
        title: "系统通知",
        showClose: false
    });
};
const showNotificationWithoutIcon = () => {
    MNotification.warning("这条通知不显示图标", {
        showIcon: false
    });
};

// MDialog
const openDialogAlert = () => {
    dialog.alert("这是一条警告信息，请仔细阅读", "警告", {
        positiveText: "知道了"
    });
};
const openDialogConfirm = () => {
    dialog.confirm("确认执行此操作吗？", "确认对话框", {
        positiveText: "确认",
        negativeText: "取消"
    });
};
const openDialogSuccess = () => {
    dialog.success("操作成功", "成功", {
        positiveText: "知道了"
    });
};
const openDialogDanger = () => {
    dialog.danger("操作失败，请检查后重试", "错误", {
        positiveText: "知道了"
    });
};
const openDialogInfo = () => {
    dialog.info("这是一条提示信息", "信息", {
        positiveText: "确定好的"
    });
};
const openDialogCustom = () => {
    dialog.primary("这是一个自定义样式的对话框", "自定义样式", {
        positiveText: "确定",
        negativeText: "取消"
    });
};
const openDialogAsync = () => {
    const d = dialog.confirm("点击确认后，将模拟异步操作等待结果", "异步操作", {
        variant: "primary",
        positiveText: "确认",
        negativeText: "取消",
        onPositiveClick: async () => {
            d.loading = true;
            await sleep(1200);
            MMessage.success("加载完成");
            return true;
        }
    });
};

// MPopconfirm
const handlePopconfirmDelete = async () => {
    MMessage.success("删除成功");
    return true;
};
const handlePopconfirmCancel = () => {
    MMessage.info("已取消操作");
};
const handlePopconfirmSubmit = async () => {
    MMessage.success("提交成功");
    return true;
};
const handlePopconfirmClear = async () => {
    MMessage.warning("缓存已清除");
    return true;
};

const publishLoading = ref(false);
const exportLoading = ref(false);
const uploadLoading = ref(false);
const handleAsyncPublish = async () => {
    publishLoading.value = true;
    await sleep(1200);
    publishLoading.value = false;
    MMessage.success("发布成功");
    return true;
};
const handleAsyncExport = async () => {
    exportLoading.value = true;
    await sleep(1500);
    exportLoading.value = false;
    MMessage.success("导出文件成功");
    return true;
};
const handleAsyncUpload = async () => {
    uploadLoading.value = true;
    await sleep(2000);
    uploadLoading.value = false;
    MMessage.success("上传成功");
    return true;
};

const alertCloseCount = ref(0);
const handleAlertClose = () => {
    alertCloseCount.value++;
    MMessage.info(`MAlert 已关闭 ${alertCloseCount.value} 次`);
};

const popconfirmActionCount = ref(0);
const handlePopconfirmWithLog = async (action: string) => {
    popconfirmActionCount.value++;
    MMessage.info(`操作记录：${action}`);
    return true;
};

// Helper function
async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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

.alert-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
