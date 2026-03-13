# Michiru UI

> A Vue 3 UI Component Library — 基于 Vue 3 + TypeScript 的轻量级 UI 组件库

MichiruUI 最初的定位只是我个人博客的一个“小零件库”。本来只想够用就好，但是随着博客需求不断膨胀，组件也越写越深、越写越多，最终形成了现在的规模。

## 更新日志

2026-03-12：

> Update：新增 `MIconButton` 组件
>
> Update：新增 `MTable` 长文本省略功能
>
> Fix：重构 `MTooltip` 组件定位策略，由相对父组件绝对定位改为挂载到 `body` 的固定定位，避免父容器 `overflow: hidden` 导致提示内容被遮挡

2026-03-11：
> Update：新增 `MTable` 固定列和固定表头等功能
>
> Fix：重构 `MTable` 组件，将原先高度耦合的单一组件拆分为 `MTable` + `MTableCol` 双组件结构，并且重新设计了表格的样式
>
> Fix：移除 `MTable` 内置分页逻辑，分页请使用 `MPagination` 组件配合实现

2026-03-10：

> Fix：重构 `MScrollBar` 组件，弃用 `smooth-scrollbar`，改用原生滚动条实现

## 环境要求

| 工具       | 版本                      |
| ---------- | ------------------------- |
| Node.js    | `^20.19.0` 或 `>=22.12.0` |
| Vue        | `>=3.5.0`                 |
| vue-router | `>=4.2.0`                 |

## 本地使用

本项目尚未发布至 npm，如果你想在你的项目中使用，需在本地构建后通过 `npm link` 或 `npm pack` 的方式引入。

#### 方式一：npm link（推荐开发调试）

```bash
# 1. 克隆项目
git clone https://github.com/HrqstnMichiru/michiru-ui.git
cd michiru-ui

# 2. 安装依赖
npm install

# 3. 构建库
npm run build

# 4. 在本项目目录下注册全局链接
npm link

# 5. 在你的目标项目中链接
cd your-project
npm link michiru-ui
```

#### 方式二：npm pack（离线安装）

```bash
# 在本项目目录下打包
npm run build
npm pack
# 生成 michiru-ui-x.x.x.tgz

# 在目标项目中安装
cd your-project
npm install /path/to/michiru-ui-x.x.x.tgz
```

## 依赖说明

在使用本库前，请确保项目中已安装以下依赖：

- `vue`
- `vue-router`

本库采用 **@iconify/vue** 作为图标解决方案，图标名称可以在[Iconify](https://icones.js.org/)中查看和搜索。

## 快速开始

#### 全量注册

```ts
import { createApp } from "vue";
import MichiruUI from "michiru-ui";
import "michiru-ui/style.css";
import App from "./App.vue";

createApp(App).use(MichiruUI).mount("#app");
```

#### 按需导入

```ts
import { MButton, MInput } from "michiru-ui";
import "michiru-ui/style.css";
```

## 组件列表

#### 基础组件 `basic`

| 组件      | 说明         |
| --------- | ------------ |
| Button    | 按钮         |
| Divider   | 分割线       |
| Icon      | 图标         |
| IconButton | 图标按钮     |
| Flex      | 弹性容器     |
| Grid      | 网格容器     |
| ScrollBar | 自定义滚动条 |
| Split     | 分割面板     |

#### 数据录入 `data`

| 组件          | 说明         |
| ------------- | ------------ |
| CheckBox      | 复选框       |
| DatePicker    | 日期选择器   |
| Form          | 表单         |
| Input         | 输入框       |
| InputTag      | 标签输入框   |
| NumberInput   | 数字输入框   |
| RadioBox      | 单选框       |
| Rating        | 评分         |
| Segmented     | 分段控制器   |
| Select        | 下拉选择     |
| Switch        | 开关         |
| TimeSelect    | 时间选择     |
| TreeSelect    | 树形选择     |
| Upload        | 文件上传     |
| VirtualSelect | 虚拟列表选择 |

#### 数据展示 `display`

| 组件            | 说明     |
| --------------- | -------- |
| Card            | 卡片     |
| Collapse        | 折叠面板 |
| Ellipsis        | 文本省略 |
| Empty           | 空状态   |
| Gradient        | 渐变文字 |
| Image           | 图片     |
| Link            | 链接     |
| NumberAnimation | 数字动画 |
| Progress        | 进度条   |
| Statistic       | 统计信息 |
| Table           | 表格     |
| Tag             | 标记     |
| Timeline        | 时间线   |
| Tree            | 树形控件 |
| VirtualList     | 虚拟列表 |
| WaterFall       | 瀑布流   |

#### 反馈 `feedback`

| 组件         | 说明       |
| ------------ | ---------- |
| Alert        | 警告提示   |
| Dialog       | 对话框     |
| Drawer       | 抽屉       |
| Loading      | 加载中     |
| Message      | 全局提示   |
| Modal        | 模态框     |
| Notification | 通知提醒   |
| Overlay      | 遮罩层     |
| Popconfirm   | 气泡确认框 |
| Popover      | 气泡卡片   |
| Result       | 结果页     |
| Tooltip      | 文字提示   |

#### 导航 `navigation`

| 组件       | 说明     |
| ---------- | -------- |
| Breadcrumb | 面包屑   |
| Dropdown   | 下拉菜单 |
| Menu       | 导航菜单 |
| Pagination | 分页     |
| Tab        | 标签页   |

## 预览组件

`examples/` 目录下包含所有组件的预览页面。为避免影响库的构建，该目录**默认不包含在 `tsconfig.app.json` 中**。

若需在浏览器中查看组件效果，请先将 `examples` 文件加入编译范围：

将 [tsconfig.app.json](tsconfig.app.json) 修改为：

```json
{
    "extends": "@vue/tsconfig/tsconfig.dom.json",
    "include": ["env.d.ts", "src/**/*.ts", "src/**/*.vue", "examples/**/*.ts", "examples/**/*.vue"],
    "exclude": ["src/**/__tests__/*", "node_modules", "dist", "docs"],
    "compilerOptions": {
        "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        "declaration": true,
        "emitDeclarationOnly": true,
        "noEmit": false,
        "paths": {
            "@/*": ["./src/*"]
        },
        "outDir": "./dist",
        "noUncheckedIndexedAccess": false
    }
}
```

然后运行：

```bash
# 启动开发服务（默认端口 6754）
npm run dev
```

> **注意**：构建库前请将 `include` 恢复为原始状态，避免将预览文件打包进产物。

### WaterFall 预览说明

本组件库包含瀑布流组件 `WaterFall`。如果需要在预览界面中查看该组件，请先完成以下步骤：

1. 将需要展示的图片放置到 `examples/images` 目录下。
2. 在项目根目录运行以下命令，生成图片信息文件 `data.json`：

```bash
npm run generate
```

生成结果位于 `examples/results/data.json`。

## 预览效果

![1.png](./docs/images/1.png)

![2.png](./docs/images/2.png)

![3.png](./docs/images/3.png)

![4.png](./docs/images/4.png)

![5.png](./docs/images/5.png)

![6.png](./docs/images/6.png)

![7.png](./docs/images/7.png)

![8.png](./docs/images/8.png)

![9.png](./docs/images/9.png)

![10.png](./docs/images/10.png)

## 后续更新计划

### 新增组件

| 组件             | 说明           |
| ---------------- | -------------- |
| Label            | 标签文本       |
| Popselect        | 气泡选择       |
| Popdown          | 气泡下拉       |
| VirtualWaterFall | 虚拟瀑布流     |
| List             | 列表           |
| Anchor           | 锚点导航       |
| Backtop          | 回到顶部       |
| TimePicker       | 时间选择器     |
| DateTimePicker   | 日期时间选择器 |
| Carousel         | 轮播图         |

### 现有组件优化

| 组件                     | 优化内容                                           |
| ------------------------ | -------------------------------------------------- |
| Upload                   | 文件列表缩略图根据文件类型动态变化；添加 CRUD 动画 |
| Tabs                     | 新增 `segmented`、`card` 风格                      |
| Drawer                   | 支持边框拖动调整尺寸                               |
| Breadcrumb               | 路由切换动画                                       |
| Pagination               | 功能拓展（快速跳转、自定义页码、更多尺寸等）       |
| Tree                     | 支持节点拖拽、勾选、懒加载、搜索过滤等操作         |
| Switch                   | 新增切换动画                                       |
| Tree、Table、Collapse 等 | 对部分组件添加懒加载效果支持                       |

> 后续考虑使用 JSX/TSX 重构所有组件，替换现有的 `.vue` SFC 模板。

## 支持本项目

如果这个项目对你有所帮助，欢迎点一个 ⭐ Star，这对我是很大的鼓励！

如果你在使用过程中遇到问题或发现 Bug，欢迎提交 [Issue](../../issues)，我会尽快跟进处理。

也欢迎提交 Pull Request 参与贡献，一起让这个组件库更完善。

## License

本项目基于 [MIT License](./LICENSE) 开源协议发布，你可以自由地使用、修改和分发本项目，但需保留原始版权声明。

Copyright © 2026 Hrqstn Michiru. All rights reserved.
