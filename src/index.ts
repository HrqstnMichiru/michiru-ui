import type { App, Plugin } from "vue";

// 导入样式
import "@/assets/style/base.css";
import "@/assets/style/ripple.css";

// 导入所有组件（用于全局安装）
import * as components from "./components";
import loading from "./directives/loading";
import ripple from "./directives/ripple";

// 定义 install 函数，支持全局安装
const MichiruUI: Plugin = {
    install(app: App, ...options: any[]) {
        // 注册指令
        app.directive("loading", loading);
        app.directive("ripple", ripple);

        // 注册组件
        Object.values(components).forEach((component) => {
            app.use(component as Plugin);
        });
    }
};

// 导出所有组件
export * from "./components";
export default MichiruUI;
