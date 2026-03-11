import type { App, Plugin } from "vue";

// 导入样式
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
        Object.values(components).forEach(component => {
            if ("name" in component && component.name !== undefined) {
                app.component(component.name, component);
            }
        });
    }
};

// 导出所有组件，用于按需引入
export * from "./components";
// 导出插件，供全局安装
export default MichiruUI;
