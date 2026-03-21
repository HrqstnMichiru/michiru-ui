import { ClickScrollPlugin, OverlayScrollbars } from "OverlayScrollbars";
import type { App, Plugin } from "vue";

// 注册 OverlayScrollbars 插件
OverlayScrollbars.plugin(ClickScrollPlugin);

// 导入样式
import "overlayscrollbars/overlayscrollbars.css";
import "./assets/style/base.css";
import "./assets/style/ripple.css";

// 导入所有组件和指令
import * as components from "./components";
import loading from "./directives/loading";
import ripple from "./directives/ripple";

// 定义 install 函数，支持全局安装
const MichiruUI: Plugin = {
    install(app: App) {
        // 注册指令
        app.directive("loading", loading);
        app.directive("ripple", ripple);

        // 注册组件
        const registeredNames = new Set<string>();
        Object.values(components).forEach(component => {
            if ("name" in component && component.name !== undefined && !registeredNames.has(component.name)) {
                app.component(component.name, component);
                registeredNames.add(component.name);
            }
        });
    }
};

// 导出所有组件，用于按需引入
export * from "./components";
// 导出插件，供全局安装
export default MichiruUI;
