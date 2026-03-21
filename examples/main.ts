import { createApp } from "vue";
import App from "./App.vue";
import { ClickScrollPlugin, OverlayScrollbars } from "OverlayScrollbars";

import "overlayscrollbars/overlayscrollbars.css";
import "@/assets/style/base.css";
import "@/assets/style/ripple.css";

// 注册 OverlayScrollbars 插件
OverlayScrollbars.plugin(ClickScrollPlugin);

const app = createApp(App);
app.mount("#app");
