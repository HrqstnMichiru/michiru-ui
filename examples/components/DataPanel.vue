<template>
    <div class="tab-content">
        <!-- MCheckBox -->
        <MCard title="MCheckBox - 多选框" action="新增" icon="bi:info-circle-fill" icon-variant="primary">
            <p>基础用法</p>
            <div class="actions">
                <MCheckBox label="选项1" />
                <MCheckBox label="选项2" :model-value="true" />
                <MCheckBox label="禁用未选中" disabled />
                <MCheckBox label="禁用且选中" :model-value="true" disabled />
            </div>
            <p style="margin-top: 16px">多选框组</p>
            <MCheckBoxGroup v-model="checkboxValues1">
                <MCheckBox label="苹果" value="apple" />
                <MCheckBox label="香蕉" value="banana" />
                <MCheckBox label="橙子" value="orange" />
            </MCheckBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择: {{ checkboxValues1.join(", ") || "无" }}</p>
            <p style="margin-top: 16px">按钮类型</p>
            <MCheckBoxGroup v-model="checkboxValues2" type="button" variant="primary">
                <MCheckBox label="周一" value="monday" />
                <MCheckBox label="周二" value="tuesday" />
                <MCheckBox label="周三" value="wednesday" />
            </MCheckBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择: {{ checkboxValues2.join(", ") || "无" }}</p>

            <p style="margin-top: 16px">不同变体的按钮类型</p>
            <MCheckBoxGroup v-model="checkboxValues3" type="button" variant="success">
                <MCheckBox label="北京" value="beijing" />
                <MCheckBox label="上海" value="shanghai" />
                <MCheckBox label="广州" value="guangzhou" />
                <MCheckBox label="深圳" value="shenzhen" />
            </MCheckBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择城市: {{ checkboxValues3.join(", ") || "无" }}</p>

            <p style="margin-top: 16px">危险按钮样式</p>
            <MCheckBoxGroup v-model="checkboxValues4" type="button" variant="danger">
                <MCheckBox label="删除文件" value="delete" />
                <MCheckBox label="清空缓存" value="clear" />
                <MCheckBox label="重置配置" value="reset" />
            </MCheckBoxGroup>

            <p style="margin-top: 16px">信息按钮样式</p>
            <MCheckBoxGroup v-model="checkboxValues5" type="button" variant="info">
                <MCheckBox label="通知" value="notification" />
                <MCheckBox label="邮件" value="email" />
                <MCheckBox label="短信" value="sms" />
                <MCheckBox label="推送" value="push" />
            </MCheckBoxGroup>

            <p style="margin-top: 16px">包含禁用选项</p>
            <MCheckBoxGroup v-model="checkboxValues6" type="button" variant="purple">
                <MCheckBox label="可选项1" value="option1" />
                <MCheckBox label="可选项2" value="option2" />
                <MCheckBox label="禁用未选" value="disabled1" disabled />
                <MCheckBox label="禁用已选" value="disabled2" disabled />
                <MCheckBox label="可选项3" value="option3" />
            </MCheckBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择: {{ checkboxValues6.join(", ") || "无" }}</p>

            <p style="margin-top: 16px">多种颜色混合</p>
            <div class="actions">
                <MCheckBoxGroup v-model="checkboxValues7" type="button" variant="warning">
                    <MCheckBox label="警告1" value="warn1" />
                    <MCheckBox label="警告2" value="warn2" />
                </MCheckBoxGroup>
                <MCheckBoxGroup v-model="checkboxValues8" type="button" variant="pink">
                    <MCheckBox label="粉色1" value="pink1" />
                    <MCheckBox label="粉色2" value="pink2" />
                </MCheckBoxGroup>
            </div>

            <p style="margin-top: 16px">全选/取消全选示例</p>
            <div class="actions">
                <MButton variant="primary" size="small" @click="selectAll">全选</MButton>
                <MButton variant="default" size="small" @click="clearAll">清空</MButton>
            </div>
            <MCheckBoxGroup v-model="checkboxValues9" ref="checkboxGroup9" variant="primary">
                <MCheckBox label="前端开发" value="frontend" />
                <MCheckBox label="后端开发" value="backend" />
                <MCheckBox label="移动开发" value="mobile" />
                <MCheckBox label="运维开发" value="devops" />
                <MCheckBox label="测试开发" value="testing" />
            </MCheckBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择: {{ checkboxValues9.length }}/5 - {{ checkboxValues9.join(", ") || "无" }}</p>
        </MCard>

        <!-- MRadioBox -->
        <MCard title="MRadioBox - 单选框">
            <p>单选框组件，支持按钮类型、禁用、多种颜色变体。</p>

            <!-- 基础单选框 -->
            <p style="margin-top: 16px">基础单选框</p>
            <MRadioBoxGroup v-model="radioValue1">
                <MRadioBox label="选项1" value="option1" />
                <MRadioBox label="选项2" value="option2" />
                <MRadioBox label="选项3" value="option3" />
            </MRadioBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ radioValue1 }}</p>

            <!-- 禁用状态 -->
            <p style="margin-top: 16px">禁用状态</p>
            <MRadioBoxGroup v-model="radioValue2">
                <MRadioBox label="可选项" value="enabled" />
                <MRadioBox label="禁用未选中" value="disabled1" disabled />
                <MRadioBox label="禁用已选中" value="disabled2" disabled />
            </MRadioBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ radioValue2 }}</p>

            <!-- 按钮类型主色 -->
            <p style="margin-top: 16px">按钮类型主色</p>
            <MRadioBoxGroup v-model="radioValue3" type="button" variant="primary">
                <MRadioBox label="北京" value="beijing" />
                <MRadioBox label="上海" value="shanghai" />
                <MRadioBox label="广州" value="guangzhou" />
                <MRadioBox label="深圳" value="shenzhen" />
            </MRadioBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ radioValue3 }}</p>

            <!-- 多种颜色 -->
            <p style="margin-top: 16px">多种颜色</p>
            <div class="actions">
                <MRadioBoxGroup v-model="radioValue4" type="button" variant="success">
                    <MRadioBox label="成功1" value="success1" />
                    <MRadioBox label="成功2" value="success2" />
                    <MRadioBox label="成功3" value="success3" />
                </MRadioBoxGroup>
            </div>
            <div class="actions" style="margin-top: 12px">
                <MRadioBoxGroup v-model="radioValue5" type="button" variant="warning">
                    <MRadioBox label="警告1" value="warning1" />
                    <MRadioBox label="警告2" value="warning2" />
                    <MRadioBox label="警告3" value="warning3" />
                </MRadioBoxGroup>
            </div>
            <div class="actions" style="margin-top: 12px">
                <MRadioBoxGroup v-model="radioValue6" type="button" variant="danger">
                    <MRadioBox label="危险1" value="danger1" />
                    <MRadioBox label="危险2" value="danger2" />
                    <MRadioBox label="危险3" value="danger3" />
                </MRadioBoxGroup>
            </div>
            <div class="actions" style="margin-top: 12px">
                <MRadioBoxGroup v-model="radioValue7" type="button" variant="info">
                    <MRadioBox label="信息1" value="info1" />
                    <MRadioBox label="信息2" value="info2" />
                    <MRadioBox label="信息3" value="info3" />
                </MRadioBoxGroup>
            </div>

            <!-- 不同尺寸 -->
            <p style="margin-top: 16px">不同尺寸</p>
            <div style="display: flex; flex-direction: column; gap: 12px">
                <MRadioBoxGroup v-model="radioValue8" type="button" variant="primary" size="small">
                    <MRadioBox label="小尺寸1" value="small1" />
                    <MRadioBox label="小尺寸2" value="small2" />
                    <MRadioBox label="小尺寸3" value="small3" />
                </MRadioBoxGroup>
                <MRadioBoxGroup v-model="radioValue9" type="button" variant="primary" size="medium">
                    <MRadioBox label="中尺寸1" value="medium1" />
                    <MRadioBox label="中尺寸2" value="medium2" />
                    <MRadioBox label="中尺寸3" value="medium3" />
                </MRadioBoxGroup>
                <MRadioBoxGroup v-model="radioValue10" type="button" variant="primary" size="large">
                    <MRadioBox label="大尺寸1" value="large1" />
                    <MRadioBox label="大尺寸2" value="large2" />
                    <MRadioBox label="大尺寸3" value="large3" />
                </MRadioBoxGroup>
            </div>

            <!-- 垂直排列 -->
            <p style="margin-top: 16px">垂直排列</p>
            <MRadioBoxGroup v-model="radioValue11" direction="vertical">
                <MRadioBox label="前端开发" value="frontend" />
                <MRadioBox label="后端开发" value="backend" />
                <MRadioBox label="移动开发" value="mobile" />
                <MRadioBox label="全栈开发" value="fullstack" />
            </MRadioBoxGroup>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ radioValue11 }}</p>

            <!-- 扩展颜色系列 -->
            <p style="margin-top: 16px">扩展颜色系列</p>
            <div style="display: flex; flex-direction: column; gap: 12px">
                <MRadioBoxGroup v-model="radioValue12" type="button" variant="purple">
                    <MRadioBox label="紫色1" value="purple1" />
                    <MRadioBox label="紫色2" value="purple2" />
                    <MRadioBox label="紫色3" value="purple3" />
                </MRadioBoxGroup>
                <MRadioBoxGroup v-model="radioValue13" type="button" variant="pink">
                    <MRadioBox label="粉色1" value="pink1" />
                    <MRadioBox label="粉色2" value="pink2" />
                    <MRadioBox label="粉色3" value="pink3" />
                </MRadioBoxGroup>
                <MRadioBoxGroup v-model="radioValue14" type="button" variant="gray">
                    <MRadioBox label="灰色1" value="gray1" />
                    <MRadioBox label="灰色2" value="gray2" />
                    <MRadioBox label="灰色3" value="gray3" />
                </MRadioBoxGroup>
            </div>

            <!-- 整组禁用 -->
            <p style="margin-top: 16px">整组禁用</p>
            <MRadioBoxGroup v-model="radioValue15" type="button" variant="primary" disabled>
                <MRadioBox label="选项A" value="optionA" />
                <MRadioBox label="选项B" value="optionB" />
                <MRadioBox label="选项C" value="optionC" />
            </MRadioBoxGroup>
        </MCard>

        <!-- MRating -->
        <MCard title="MRating - 评分">
            <p>评分组件，支持自定义最大值（0-10），默认最大值为5颗星。</p>

            <!-- 基础用法 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">基础用法</h4>
                <div class="actions">
                    <MRating v-model="ratingValue1" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前评分: {{ ratingValue1 }} / 10 ({{ ratingValue1 / 2 }} 星)</p>
            </div>

            <!-- 可清空 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">可清空（再次点击已选中的星星可取消评分）</h4>
                <div class="actions">
                    <MRating v-model="ratingValue2" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前评分: {{ ratingValue2 }} / 10</p>
            </div>

            <!-- 自定义颜色 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">自定义颜色</h4>
                <div class="actions" style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
                    <MRating v-model="ratingValue3" color="#ef4444" />
                    <MRating v-model="ratingValue3" color="#8b5cf6" />
                    <MRating v-model="ratingValue3" color="#10b981" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前评分: {{ ratingValue3 }} / 10</p>
            </div>

            <!-- 只读与禁用 -->
            <div>
                <h4 style="margin: 0 0 16px">只读模式与禁用模式</h4>
                <div class="actions" style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
                    <div>
                        <span style="margin-right: 8px; color: #606266">只读:</span>
                        <MRating v-model="ratingValue4" readonly />
                    </div>
                    <div>
                        <span style="margin-right: 8px; color: #606266">禁用:</span>
                        <MRating v-model="ratingValue4" disabled />
                    </div>
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前评分: {{ ratingValue4 }} / 10</p>
            </div>
        </MCard>

        <!-- MSelect -->
        <MCard title="MSelect - 下拉框">
            <p>下拉框支持单选、多选、可清空、多种尺寸和全选功能。</p>

            <!-- 基础用法 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">基础用法</h4>
                <div class="actions">
                    <MSelect v-model="selectValue1" placeholder="请选择一个选项">
                        <MOption label="选项一" :value="1"></MOption>
                        <MOption label="选项二" :value="2"></MOption>
                        <MOption label="选项三" :value="3"></MOption>
                        <MOption label="选项四" :value="4"></MOption>
                    </MSelect>
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ selectValue1 ?? "未选择" }}</p>
            </div>

            <!-- 可清空 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">可清空</h4>
                <div class="actions">
                    <MSelect v-model="selectValue2" clearable placeholder="选择水果（可清空）">
                        <MOption label="苹果" value="apple" />
                        <MOption label="香蕉" value="banana" />
                        <MOption label="橙子" value="orange" />
                        <MOption label="葡萄" value="grape" />
                    </MSelect>
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ selectValue2 || "未选择" }}</p>
            </div>

            <!-- 不同尺寸 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">不同尺寸</h4>
                <div class="actions">
                    <MSelect v-model="selectValue3" size="small" placeholder="小尺寸">
                        <MOption label="选项A" value="a" />
                        <MOption label="选项B" value="b" />
                    </MSelect>
                    <MSelect v-model="selectValue3" size="medium" placeholder="中尺寸">
                        <MOption label="选项A" value="a" />
                        <MOption label="选项B" value="b" />
                    </MSelect>
                    <MSelect v-model="selectValue3" size="large" placeholder="大尺寸">
                        <MOption label="选项A" value="a" />
                        <MOption label="选项B" value="b" />
                    </MSelect>
                </div>
            </div>

            <!-- 禁用状态 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">禁用状态</h4>
                <div class="actions">
                    <MSelect v-model="selectValue4" disabled placeholder="禁用的下拉框">
                        <MOption label="禁用状态项" value="disabled" />
                    </MSelect>
                </div>
            </div>

            <!-- 多选模式 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">多选模式</h4>
                <div class="actions">
                    <MSelect v-model="selectList1" multiple :width="350" placeholder="多选模式" clearable>
                        <MOption label="前端开发" value="frontend" />
                        <MOption label="后端开发" value="backend" />
                        <MOption label="移动开发" value="mobile" />
                        <MOption label="运维开发" value="devops" />
                        <MOption label="测试开发" value="testing" />
                    </MSelect>
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择: {{ selectList1.length ? selectList1.join(", ") : "未选择" }}</p>
            </div>

            <!-- 全选 + 多选 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">全选 + 多选</h4>
                <div class="actions">
                    <MSelect v-model="selectList2" multiple has-select-all :width="350" placeholder="带全选的多选">
                        <MOption label="JavaScript" value="js" />
                        <MOption label="TypeScript" value="ts" />
                        <MOption label="Vue" value="vue" />
                        <MOption label="React" value="react" />
                        <MOption label="Angular" value="angular" />
                    </MSelect>
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择: {{ selectList2.length ? selectList2.join(", ") : "未选择" }}</p>
            </div>

            <!-- 带前缀图标 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">带前缀图标</h4>
                <div class="actions">
                    <MSelect v-model="selectValue5" prefix-icon="mdi:magnify" placeholder="搜索文件类型">
                        <MOption label="文档" value="doc" />
                        <MOption label="图片" value="image" />
                        <MOption label="视频" value="video" />
                        <MOption label="音频" value="audio" />
                    </MSelect>
                </div>
            </div>

            <!-- 块级布局 -->
            <div>
                <h4 style="margin: 0 0 16px">块级布局</h4>
                <MSelect v-model="selectValue6" block placeholder="块级下拉框，宽度100%">
                    <MOption label="选项一" value="1" />
                    <MOption label="选项二" value="2" />
                    <MOption label="选项三" value="3" />
                </MSelect>
            </div>
        </MCard>

        <!-- MNumberInput -->
        <MCard title="MNumberInput - 数字输入框">
            <p>数字输入框，支持限制范围、精度控制、步长调节等功能。</p>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">基础用法</h4>
                <div class="actions">
                    <MNumberInput v-model="numberValue1" placeholder="请输入数字" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前值: {{ numberValue1 }}</p>
            </div>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">限制范围（最小0，最大100）</h4>
                <div class="actions">
                    <MNumberInput v-model="numberValue2" :min="0" :max="100" placeholder="0-100" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前值: {{ numberValue2 }} (范围: 0-100)</p>
            </div>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">精度控制（小数点后2位）</h4>
                <div class="actions">
                    <MNumberInput v-model="numberValue3" :precision="2" :step="0.1" placeholder="精度2位小数" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前值: {{ numberValue3 }}</p>
            </div>

            <div>
                <h4 style="margin: 0 0 16px">步长与前缀</h4>
                <div class="actions">
                    <MNumberInput v-model="numberValue4" :step="10" :min="0" :max="200" placeholder="步长为10" prefix-text="¥" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前值: {{ numberValue4 }} (步长: 10)</p>
            </div>
        </MCard>

        <!-- MInputTag -->
        <MCard title="MInputTag - 标签输入框">
            <p>标签输入框，支持键盘输入创建标签、最大标签数限制、可清空等功能。</p>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">基础用法（输入后按 Enter 键确认标签）</h4>
                <div class="actions">
                    <MInputTag v-model="tags1" placeholder="输入内容后按 Enter 确认" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前标签: {{ tags1.join(", ") || "无" }}</p>
            </div>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">最大标签数（超出后显示+N折叠）</h4>
                <div class="actions">
                    <MInputTag v-model="tags2" :max-count="3" placeholder="最多3个标签" :width="400" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">标签数量: {{ tags2.length }}</p>
            </div>

            <div>
                <h4 style="margin: 0 0 16px">块级布局 + 可清空</h4>
                <div class="actions">
                    <MInputTag v-model="tags3" block clearable placeholder="块级布局，宽度100%" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前标签: {{ tags3.join(", ") || "无" }}</p>
            </div>
        </MCard>

        <!-- DatePicker -->
        <MCard title="DatePicker - 日期选择器">
            <p>日期选择器，支持多选、可清空、不同尺寸等功能。</p>

            <!-- 基础用法 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">基础用法</h4>
                <div class="actions">
                    <MDatePicker v-model="dateValue1" placeholder="请选择日期" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选日期: {{ dateValue1 || "未选择" }}</p>
            </div>

            <!-- 可清空 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">可清空</h4>
                <div class="actions">
                    <MDatePicker v-model="dateValue2" clearable placeholder="选择日期（点击×清空）" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选日期: {{ dateValue2 || "未选择" }}</p>
            </div>

            <!-- 不同尺寸 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">不同尺寸</h4>
                <div class="actions">
                    <MDatePicker v-model="dateValue3" size="small" placeholder="小尺寸" />
                    <MDatePicker v-model="dateValue3" size="medium" placeholder="中尺寸" />
                    <MDatePicker v-model="dateValue3" size="large" placeholder="大尺寸" />
                </div>
            </div>

            <!-- 禁用状态 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">禁用状态</h4>
                <div class="actions">
                    <MDatePicker v-model="dateValue4" disabled placeholder="禁用的日期框" />
                </div>
            </div>

            <!-- 多选模式 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">多选模式</h4>
                <div class="actions">
                    <MDatePicker v-model="dateValues" multiple placeholder="可选择多个日期" :width="300" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选日期: {{ dateValues.length ? dateValues.join(", ") : "未选择" }}</p>
            </div>

            <!-- 自定义格式 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">自定义格式</h4>
                <div class="actions">
                    <MDatePicker v-model="dateValue5" format="YYYY/MM/DD" placeholder="YYYY/MM/DD 格式" />
                    <MDatePicker v-model="dateValue6" format="MM-DD-YYYY" placeholder="MM-DD-YYYY 格式" />
                </div>
            </div>

            <!-- 块级布局 -->
            <div>
                <h4 style="margin: 0 0 16px">块级布局</h4>
                <MDatePicker v-model="dateValue7" block placeholder="块级布局，宽度100%" />
            </div>
        </MCard>
        <!-- MTimeSelect -->
        <MCard title="MTimeSelect - 时间选择器">
            <p>时间选择器，支持时间、年份、月份、周的选择，可设置步长和范围限制。</p>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">基础用法</h4>
                <div class="actions">
                    <MTimeSelect v-model="timeValue1" placeholder="请选择时间" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选时间: {{ timeValue1 ?? "未选择" }}</p>
            </div>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">自定义步长（15 分钟间隔）和时间格式</h4>
                <div class="actions">
                    <MTimeSelect v-model="timeValue2" :step="15" format="HH:mm" placeholder="15分钟间隔" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选时间: {{ timeValue2 ?? "未选择" }}</p>
            </div>

            <div>
                <h4 style="margin: 0 0 16px">设置可选时间范围＋可清空</h4>
                <div class="actions">
                    <MTimeSelect v-model="timeValue3" min="09:00" max="18:00" clearable placeholder="工作时间段" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选时间: {{ timeValue3 ?? "未选择" }}</p>
            </div>
            <div style="margin-top: 16px">
                <h4 style="margin: 0 0 16px">年份选择</h4>
                <div class="actions">
                    <MTimeSelect v-model="timeValue4" type="year" :min="1995" :max="2026" placeholder="选择年份" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选年份: {{ timeValue4 ?? "未选择" }}</p>
            </div>

            <div style="margin-top: 16px">
                <h4 style="margin: 0 0 16px">禁用状态</h4>
                <div class="actions">
                    <MTimeSelect v-model="timeValue5" disabled placeholder="禁用的时间框" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选时间: {{ timeValue5 ?? "未选择" }}</p>
            </div>

            <div style="margin-top: 16px">
                <h4 style="margin: 0 0 16px">块级布局（block）</h4>
                <div class="actions">
                    <MTimeSelect v-model="timeValue6" block placeholder="块级布局" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选时间: {{ timeValue6 ?? "未选择" }}</p>
            </div>
            <div style="margin-top: 16px">
                <h4 style="margin: 0 0 16px">月份选择（month: 1～12月）</h4>
                <div class="actions">
                    <MTimeSelect v-model="timeValueMonth" type="month" placeholder="选择月份" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选月份: {{ timeValueMonth ?? "未选择" }}</p>
            </div>

            <div style="margin-top: 16px">
                <h4 style="margin: 0 0 16px">周选择（week: 序列周数）</h4>
                <div class="actions">
                    <MTimeSelect v-model="timeValueWeek" type="week" placeholder="选择周" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选周: {{ timeValueWeek ?? "未选择" }}</p>
            </div>
        </MCard>
        <!-- MProgress -->
        <MCard title="MProgress - 进度条">
            <p>进度条支持线形和环形两种类型。</p>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">线形 - 基础用法</h4>
                <div class="actions">
                    <MProgress :percentage="progressLine1"></MProgress>
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">百分比: {{ progressLine1 }} / {{ progressLine2 }} / {{ progressLineAnimated }}</p>
            </div>

            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">环形 - 基础用法</h4>
                <div class="actions">
                    <MProgress type="circle" :percentage="progressCircle1"></MProgress>
                    <MProgress type="circle" :percentage="progressCircle2" variant="purple" :width="80"></MProgress>
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">百分比: {{ progressCircle1 }} / {{ progressCircle2 }}</p>
            </div>
        </MCard>

        <!-- MVirtualSelect -->
        <MCard title="MVirtualSelect - 虚拟滚动下拉框">
            <p>虚拟滚动下拉框，适用于超大数据量场景。</p>

            <!-- 基础用法 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">基础用法（1000条数据）</h4>
                <div class="actions">
                    <MVirtualSelect v-model="virtualSelectValue1" :data-source="largeDataSource" placeholder="虚拟滚动，性能极佳" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ virtualSelectValue1 ?? "未选择" }}</p>
            </div>

            <!-- 可清空 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">可清空</h4>
                <div class="actions">
                    <MVirtualSelect v-model="virtualSelectValue2" :data-source="largeDataSource" clearable placeholder="选择后可点击×清空" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ virtualSelectValue2 ?? "未选择" }}</p>
            </div>

            <!-- 不同尺寸 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">不同尺寸</h4>
                <div class="actions">
                    <MVirtualSelect v-model="virtualSelectValue3" :data-source="smallDataSource" size="small" placeholder="小尺寸" />
                    <MVirtualSelect v-model="virtualSelectValue3" :data-source="smallDataSource" size="medium" placeholder="中尺寸" />
                    <MVirtualSelect v-model="virtualSelectValue3" :data-source="smallDataSource" size="large" placeholder="大尺寸" />
                </div>
            </div>

            <!-- 禁用状态 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">禁用状态</h4>
                <div class="actions">
                    <MVirtualSelect v-model="virtualSelectValue4" :data-source="smallDataSource" disabled placeholder="禁用的下拉框" />
                </div>
            </div>

            <!-- 多选模式 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">多选模式（500条数据）</h4>
                <div class="actions">
                    <MVirtualSelect v-model:list="virtualSelectList1" :data-source="mediumDataSource" multiple :width="350" placeholder="多选模式" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择 {{ virtualSelectList1.length }} 项</p>
            </div>

            <!-- 全选 + 多选 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">全选 + 多选（100条数据）</h4>
                <div class="actions">
                    <MVirtualSelect v-model:list="virtualSelectList2" :data-source="smallDataSource" multiple has-select-all :width="350" placeholder="带全选的多选" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择 {{ virtualSelectList2.length }} 项</p>
            </div>

            <!-- 自定义项高度 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">自定义项高度</h4>
                <div class="actions">
                    <MVirtualSelect v-model="virtualSelectValue5" :data-source="largeDataSource" :item-height="50" placeholder="50px 行高" />
                </div>
            </div>

            <!-- 块级布局 -->
            <div>
                <h4 style="margin: 0 0 16px">块级布局</h4>
                <MVirtualSelect v-model="virtualSelectValue6" :data-source="mediumDataSource" block placeholder="块级布局，宽度100%" />
            </div>
        </MCard>

        <!-- MTreeSelect -->
        <MCard title="MTreeSelect - 树形下拉框">
            <p>树形下拉框，支持多选、可清空、同步父子节点选中等功能。</p>

            <!-- 基础用法 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">基础用法</h4>
                <div class="actions">
                    <MTreeSelect v-model="treeSelectValue1" :data="treeSimple" placeholder="请选择一个节点" only-leaf />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ treeSelectValue1 ?? "未选择" }}</p>
            </div>

            <!-- 可清空 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">可清空</h4>
                <div class="actions">
                    <MTreeSelect v-model="treeSelectValue2" :data="treeSimple" clearable placeholder="选择后可清空" />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ treeSelectValue2 ?? "未选择" }}</p>
            </div>

            <!-- 禁用状态 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">禁用状态</h4>
                <div class="actions">
                    <MTreeSelect v-model="treeSelectValue3" :data="treeSimple" disabled placeholder="禁用的树形选择" />
                </div>
            </div>

            <!-- 多选模式 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">多选模式（中等深度树）</h4>
                <div class="actions">
                    <MTreeSelect v-model:list="treeSelectList1" :data="treeMedium" multiple :width="350" placeholder="多选模式" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择 {{ treeSelectList1.length }} 项</p>
            </div>

            <!-- 全选 + 多选 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">全选 + 多选</h4>
                <div class="actions">
                    <MTreeSelect v-model:list="treeSelectList2" :data="treeSmall" multiple has-select-all sync-parent-with-children :width="350" placeholder="带全选的多选" clearable />
                </div>
                <p style="margin: 8px 0 0; color: #909399; font-size: 14px">已选择 {{ treeSelectList2.length }} 项</p>
            </div>

            <!-- 不同尺寸 -->
            <div style="margin-bottom: 24px">
                <h4 style="margin: 0 0 16px">不同尺寸</h4>
                <div class="actions">
                    <MTreeSelect v-model="treeSelectValue4" :data="treeSmall" size="small" placeholder="小尺寸" />
                    <MTreeSelect v-model="treeSelectValue4" :data="treeSmall" size="medium" placeholder="中尺寸" />
                    <MTreeSelect v-model="treeSelectValue4" :data="treeSmall" size="large" placeholder="大尺寸" />
                </div>
            </div>

            <!-- 块级布局 -->
            <div>
                <h4 style="margin: 0 0 16px">块级布局</h4>
                <MTreeSelect v-model="treeSelectValue5" :data="treeMedium" block placeholder="块级布局，宽度100%" />
            </div>
        </MCard>
        <!-- MSwitch -->
        <MCard title="MSwitch - 开关">
            <p>基础开关</p>
            <div class="actions">
                <MSwitch v-model="switchValue1" />
            </div>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前开关状态: {{ switchValue1 ? "开启" : "关闭" }}</p>

            <p style="margin-top: 16px">禁用状态</p>
            <div class="actions">
                <MSwitch v-model="switchValue2" disabled />
            </div>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前开关状态: {{ switchValue2 ? "开启" : "关闭" }}</p>

            <p style="margin-top: 16px">主题模式</p>
            <div class="actions">
                <MSwitch v-model="switchValue3" theme-mode />
            </div>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前开关状态: {{ switchValue3 ? "开启" : "关闭" }}</p>

            <p style="margin-top: 16px">多种颜色</p>
            <div class="actions" style="display: flex; flex-direction: row; gap: 12px">
                <MSwitch v-model="switchValue4" variant="primary" />
                <MSwitch v-model="switchValue5" variant="success" />
                <MSwitch v-model="switchValue6" variant="warning" />
                <MSwitch v-model="switchValue7" variant="danger" />
                <MSwitch v-model="switchValue8" variant="info" />
                <MSwitch v-model="switchValue7" variant="pink" />
                <MSwitch v-model="switchValue7" variant="purple" />
                <MSwitch v-model="switchValue7" variant="gray" />
            </div>
        </MCard>

        <!-- MUpload -->
        <MCard title="MUpload - 上传">
            <p>拖拽上传（最多5个文件）</p>
            <MUpload droppable :limit="5"></MUpload>
            <p>头像上传</p>
            <MUpload :limit="1" list-style="gallery" circle></MUpload>
        </MCard>
        <!-- MSegmented -->
        <MCard title="MSegmented - 分段控制器">
            <p>基础用法</p>
            <div class="actions">
                <MSegmented v-model="segValue1" :options="segOpts1" />
            </div>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">当前选中: {{ segValue1 }}</p>

            <p style="margin-top: 16px">不同尺寸</p>
            <div class="actions" style="flex-direction: column; align-items: flex-start">
                <MSegmented v-model="segValue2" :options="segOpts1" size="small" />
                <MSegmented v-model="segValue2" :options="segOpts1" size="medium" />
                <MSegmented v-model="segValue2" :options="segOpts1" size="large" />
            </div>

            <p style="margin-top: 16px">多种颜色</p>
            <div class="actions" style="flex-direction: column; align-items: flex-start">
                <MSegmented v-model="segValue3" :options="segOpts1" variant="primary" />
                <MSegmented v-model="segValue3" :options="segOpts1" variant="success" />
                <MSegmented v-model="segValue3" :options="segOpts1" variant="warning" />
                <MSegmented v-model="segValue3" :options="segOpts1" variant="danger" />
                <MSegmented v-model="segValue3" :options="segOpts1" variant="purple" />
                <MSegmented v-model="segValue3" :options="segOpts1" variant="pink" />
            </div>

            <p style="margin-top: 16px">带图标</p>
            <div class="actions">
                <MSegmented v-model="segValue4" :options="segOptsIcon" variant="primary" />
            </div>

            <p style="margin-top: 16px">仅显示图标</p>
            <div class="actions">
                <MSegmented v-model="segValue4" :options="segOptsIcon" variant="primary" icon-only />
            </div>

            <p style="margin-top: 16px">块级布局</p>
            <MSegmented v-model="segValue5" :options="segOpts1" block variant="primary" />

            <p style="margin-top: 16px">含禁用选项</p>
            <div class="actions">
                <MSegmented v-model="segValue6" :options="segOptsDisabled" variant="info" />
            </div>

            <p style="margin-top: 16px">整体禁用</p>
            <div class="actions">
                <MSegmented v-model="segValue1" :options="segOpts1" disabled />
            </div>
        </MCard>

        <!-- MForm -->
        <MCard title="MForm - 表单">
            <p>基础表单，支持验证、重置、多种布局。</p>

            <!-- 基础水平布局 -->
            <p style="margin-top: 16px">基础水平布局</p>
            <MForm :model="formBasic" :rules="formBasicRules" ref="formBasicRef" label-position="top">
                <MFlex :gap="30" aligns="end">
                    <MFormItem label="用户名" prop="username">
                        <MInput v-model="formBasic.username" placeholder="请输入用户名" :width="200" />
                    </MFormItem>
                    <MFormItem label="密码" prop="password">
                        <MInput v-model="formBasic.password" show-password placeholder="请输入密码" :width="200" />
                    </MFormItem>
                    <MFormItem label="邮箱" prop="email">
                        <MInput v-model="formBasic.email" placeholder="请输入邮箱" :width="200" />
                    </MFormItem>
                    <MFlex :gap="10">
                        <MButton variant="primary" @click="handleFormBasicSubmit">提交</MButton>
                        <MButton variant="default" @click="handleFormBasicReset">重置</MButton>
                    </MFlex>
                </MFlex>
            </MForm>
            <p style="margin: 15px 0 0; color: #909399; font-size: 14px">提交结果: {{ formBasicResult }}</p>

            <!-- 垂直布局 -->
            <p style="margin-top: 24px">垂直布局</p>
            <MForm :model="formVertical" :rules="formVerticalRules" ref="formVerticalRef" :label-width="60">
                <MFlex vertical :gap="15">
                    <MFormItem label="昵称" prop="nickname" block>
                        <MInput v-model="formVertical.nickname" placeholder="请输入昵称" />
                    </MFormItem>
                    <MFormItem label="年龄" prop="age" block>
                        <MNumberInput v-model="formVertical.age" :min="1" :max="120" />
                    </MFormItem>
                    <MFormItem label="个人简介" prop="bio" block required>
                        <MInput v-model="formVertical.bio" placeholder="请输入个人简介（10-200字）" />
                    </MFormItem>
                    <MFlex :gap="8" justify="center">
                        <MButton variant="primary" @click="handleFormVerticalSubmit">提交</MButton>
                        <MButton variant="default" @click="handleFormVerticalReset">重置</MButton>
                    </MFlex>
                </MFlex>
            </MForm>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px">提交结果: {{ formVerticalResult }}</p>

            <!-- 不同尺寸 -->
            <p style="margin-top: 24px">表单尺寸</p>
            <MFlex vertical :gap="24" aligns="start">
                <MFlex vertical :gap="8" aligns="start">
                    <p style="margin: 0; font-size: 13px; color: #606266">Small</p>
                    <MForm :model="formSize" size="small">
                        <MFlex vertical :gap="4" style="width: 500px">
                            <MFormItem label="姓名" prop="name" space>
                                <MInput v-model="formSize.name" placeholder="请输入" />
                            </MFormItem>
                            <MFormItem label="备注" prop="remark">
                                <MInput v-model="formSize.remark" placeholder="请输入" />
                            </MFormItem>
                        </MFlex>
                    </MForm>
                </MFlex>
                <MFlex vertical :gap="8" aligns="start">
                    <p style="margin: 0; font-size: 13px; color: #606266">Medium（默认）</p>
                    <MForm :model="formSize" size="medium">
                        <MFlex vertical :gap="4">
                            <MFormItem label="姓名" prop="name">
                                <MInput v-model="formSize.name" placeholder="请输入" />
                            </MFormItem>
                            <MFormItem label="备注" prop="remark">
                                <MInput v-model="formSize.remark" placeholder="请输入" />
                            </MFormItem>
                        </MFlex>
                    </MForm>
                </MFlex>
                <MFlex vertical :gap="8" aligns="start">
                    <p style="margin: 0; font-size: 13px; color: #606266">Large</p>
                    <MForm :model="formSize" size="large">
                        <MFlex vertical :gap="4">
                            <MFormItem label="姓名" prop="name">
                                <MInput v-model="formSize.name" placeholder="请输入" />
                            </MFormItem>
                            <MFormItem label="备注" prop="remark">
                                <MInput v-model="formSize.remark" placeholder="请输入" />
                            </MFormItem>
                        </MFlex>
                    </MForm>
                </MFlex>
            </MFlex>

            <!-- 自定义验证 -->
            <p style="margin-top: 24px">自定义验证器</p>
            <MForm :model="formCustom" :rules="formCustomRules" ref="formCustomRef" :label-width="60">
                <MFlex vertical :gap="20">
                    <MFormItem label="手机号" prop="phone">
                        <MInput v-model="formCustom.phone" placeholder="请输入11位手机号" />
                    </MFormItem>
                    <MFormItem label="确认密码" prop="confirmPwd">
                        <MInput v-model="formCustom.confirmPwd" show-password placeholder="请再次输入密码" />
                    </MFormItem>
                    <MFormItem>
                        <MButton variant="primary" @click="handleFormCustomSubmit">验证</MButton>
                    </MFormItem>
                </MFlex>
            </MForm>
        </MCard>
    </div>
</template>

<script lang="ts" setup>
import type { MCheckBoxGroupInstance, MFormInstance } from "@/components";
import {
    MButton,
    MCard,
    MCheckBox,
    MCheckBoxGroup,
    MDatePicker,
    MFlex,
    MForm,
    MFormItem,
    MInput,
    MInputTag,
    MNumberInput,
    MOption,
    MProgress,
    MRadioBox,
    MRadioBoxGroup,
    MRating,
    MSegmented,
    MSelect,
    MSwitch,
    MTimeSelect,
    MTreeSelect,
    MUpload,
    MVirtualSelect
} from "@/components";
import { ref, useTemplateRef } from "vue";
// 多选框状态变量
const checkboxGroup9 = useTemplateRef<MCheckBoxGroupInstance>("checkboxGroup9");
const checkboxValues1 = ref<Array<string | number>>(["apple"]);
const checkboxValues2 = ref<Array<string | number>>(["monday"]);
const checkboxValues3 = ref<Array<string | number>>(["beijing", "shanghai"]);
const checkboxValues4 = ref<Array<string | number>>([]);
const checkboxValues5 = ref<Array<string | number>>(["email", "notification"]);
const checkboxValues6 = ref<Array<string | number>>(["option1", "disabled2"]);
const checkboxValues7 = ref<Array<string | number>>(["warn1"]);
const checkboxValues8 = ref<Array<string | number>>([]);
const checkboxValues9 = ref<Array<string | number>>(["frontend", "backend"]);

// RadioBox状态
const radioValue1 = ref("option1");
const radioValue2 = ref("disabled2");
const radioValue3 = ref("beijing");
const radioValue4 = ref("success1");
const radioValue5 = ref("warning2");
const radioValue6 = ref("danger1");
const radioValue7 = ref("info2");
const radioValue8 = ref("small1");
const radioValue9 = ref("medium2");
const radioValue10 = ref("large1");
const radioValue11 = ref("frontend");

// MSelect状态
const selectValue1 = ref<string | number>("");
const selectValue2 = ref<string>("");
const selectValue3 = ref<string>("");
const selectValue4 = ref<string>("disabled");
const selectValue5 = ref<string>("");
const selectValue6 = ref<string>("");
const selectList1 = ref<Array<string | number>>([]);
const selectList2 = ref<Array<string | number>>(["js", "vue"]);
const radioValue12 = ref("purple2");
const radioValue13 = ref("pink1");
const radioValue14 = ref("gray2");
const radioValue15 = ref("optionA");

// Rating评分状态
const ratingValue1 = ref<number>(6);
const ratingValue2 = ref<number>(0);
const ratingValue3 = ref<number>(8);
const ratingValue4 = ref<number>(5);

// 全选/取消全选
const selectAll = () => {
    checkboxGroup9.value?.checkAll();
};

const clearAll = () => {
    checkboxGroup9.value?.uncheckAll();
};

// DatePicker
const dateValue1 = ref("");
const dateValue2 = ref("");
const dateValue3 = ref("");
const dateValue4 = ref("2026-02-12");
const dateValue5 = ref("");
const dateValue6 = ref("");
const dateValue7 = ref("");
const dateValues = ref<string[]>([]);

// MNumberInput
const numberValue1 = ref<number>(0);
const numberValue2 = ref<number>(50);
const numberValue3 = ref<number>(10.5);
const numberValue4 = ref<number>(100);

// MInputTag
const tags1 = ref<string[]>(["Vue", "React"]);
const tags2 = ref<string[]>(["JavaScript", "TypeScript", "Python", "Java", "Go"]);
const tags3 = ref<string[]>([]);

// MVirtualSelect 数据源生成
const generateDataSource = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        label: `选项${i + 1}`,
        value: i + 1
    }));
};

const smallDataSource = generateDataSource(200); // 200条数据
const mediumDataSource = generateDataSource(500); // 500条数据
const largeDataSource = generateDataSource(1000); // 1000条数据
// MVirtualSelect 状态
const virtualSelectValue1 = ref<number>();
const virtualSelectValue2 = ref<number>();
const virtualSelectValue3 = ref<number>();
const virtualSelectValue4 = ref<number>(100);
const virtualSelectValue5 = ref<number>();
const virtualSelectValue6 = ref<number>();
const virtualSelectList1 = ref<Array<number>>([]);
const virtualSelectList2 = ref<Array<number>>([]);

// MTreeSelect 树形数据生成
const generateTree = (parents: number, childrenPerParent: number) => {
    return Array.from({ length: parents }, (_, i) => ({
        id: i + 1,
        label: `父节点${i + 1}`,
        children: Array.from({ length: childrenPerParent }, (_, j) => ({
            id: (i + 1) * 100 + j + 1,
            label: `子节点${i + 1}-${j + 1}`
        }))
    }));
};

const treeSmall = generateTree(5, 3); // 小型树
const treeSimple = [
    {
        id: 1,
        label: "节点1",
        children: [
            { id: 11, label: "节点1-1" },
            { id: 12, label: "节点1-2" }
        ]
    },
    { id: 2, label: "节点2", children: [{ id: 21, label: "节点2-1" }] },
    { id: 3, label: "节点3" }
];
const treeMedium = generateTree(10, 5); // 中型树
// MTreeSelect 状态
const treeSelectValue1 = ref<number>();
const treeSelectValue2 = ref<number>();
const treeSelectValue3 = ref<number>();
const treeSelectValue4 = ref<number>();
const treeSelectValue5 = ref<number>();
const treeSelectList1 = ref<Array<number>>([]);
const treeSelectList2 = ref<Array<number>>([]);

// MProgress 进度条数据
const progressLine1 = ref<number>(30);
const progressLine2 = ref<number>(65);
const progressLineAnimated = ref<number>(45);
const progressCircle1 = ref<number>(42);
const progressCircle2 = ref<number>(78);

// MTimeSelect 时间选择数据
const timeValue1 = ref<string>();
const timeValue2 = ref<string>();
const timeValue3 = ref<string>();
const timeValue4 = ref<string | number>();
const timeValue5 = ref<string | number>();
const timeValue6 = ref<string | number>();
const timeValueMonth = ref<string | number>();
const timeValueWeek = ref<string | number>();

// MSwitch 状态
const switchValue1 = ref(0);
const switchValue2 = ref(0);
const switchValue3 = ref(0);
const switchValue4 = ref(0);
const switchValue5 = ref(0);
const switchValue6 = ref(0);
const switchValue7 = ref(0);
const switchValue8 = ref(0);

// MForm - 基础水平表单
const formBasicRef = useTemplateRef<MFormInstance>("formBasicRef");
const formBasic = ref({ username: "", password: "", email: "" });
const formBasicRules = {
    username: [
        { required: true, message: "用户名不能为空" },
        { minLength: 3, maxLength: 20, message: "用户名长度为 3~20 个字符" }
    ],
    password: [
        { required: true, message: "密码不能为空" },
        { minLength: 6, message: "密码至少 6 个字符" }
    ],
    email: [{ pattern: /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i, message: "请输入有效的邮箱地址" }]
};
const formBasicResult = ref("");
const handleFormBasicSubmit = async () => {
    const ok = await formBasicRef.value?.validateFields();
    formBasicResult.value = ok ? `提交成功：${JSON.stringify(formBasic.value)}` : "验证失败，请检查表单";
};
const handleFormBasicReset = () => {
    formBasicRef.value?.resetFields();
    formBasic.value = { username: "", password: "", email: "" };
    formBasicResult.value = "";
};

// MForm - 垂直布局表单
const formVerticalRef = useTemplateRef<MFormInstance>("formVerticalRef");
const formVertical = ref({ nickname: "", age: 18, bio: "" });
const formVerticalRules = {
    nickname: [{ required: true, message: "昵称不能为空" }],
    age: [
        { required: true, message: "年龄不能为空" },
        { min: 1, max: 120, message: "年龄须在 1~120 之间" }
    ],
    bio: [{ minLength: 10, maxLength: 200, message: "简介长度为 10~200 个字符" }]
};
const formVerticalResult = ref("");
const handleFormVerticalSubmit = async () => {
    const ok = await formVerticalRef.value?.validateFields();
    formVerticalResult.value = ok ? `提交成功：${JSON.stringify(formVertical.value)}` : "验证失败，请检查表单";
};
const handleFormVerticalReset = () => {
    formVerticalRef.value?.resetFields();
    formVerticalResult.value = "";
};

// MForm - 尺寸演示
const formSize = ref({ name: "", remark: "" });

// MForm - 自定义验证
const formCustomRef = useTemplateRef<MFormInstance>("formCustomRef");
const formCustomPwd = ref("Abc123");
const formCustom = ref({ phone: "", confirmPwd: "" });
const formCustomRules = {
    phone: [
        { required: true, message: "手机号不能为空" },
        {
            validator: async () => /^1[3-9]\d{9}$/.test(formCustom.value.phone),
            message: "请输入正确的 11 位手机号"
        }
    ],
    confirmPwd: [
        { required: true, message: "确认密码不能为空" },
        {
            validator: async () => formCustom.value.confirmPwd === formCustomPwd.value,
            message: "两次密码输入不一致"
        }
    ]
};
const handleFormCustomSubmit = async () => {
    await formCustomRef.value?.validateFields();
};

// MSegmented
const segValue1 = ref<string | number>("day");
const segValue2 = ref<string | number>("day");
const segValue3 = ref<string | number>("day");
const segValue4 = ref<string | number>("list");
const segValue5 = ref<string | number>("day");
const segValue6 = ref<string | number>("all");
const segOpts1 = [
    { label: "日", value: "day" },
    { label: "周", value: "week" },
    { label: "月", value: "month" },
    { label: "年", value: "year" }
];
const segOptsIcon = [
    { label: "列表", value: "list", icon: "mdi:view-list" },
    { label: "宫格", value: "grid", icon: "mdi:view-grid" },
    { label: "看板", value: "board", icon: "mdi:view-column" }
];
const segOptsDisabled = [
    { label: "全部", value: "all" },
    { label: "进行中", value: "active" },
    { label: "已完成", value: "done" },
    { label: "已归档", value: "archived", disabled: true }
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

.actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    width: 100%;
}
</style>
