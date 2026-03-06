import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    root: path.resolve(__dirname, "examples"),
    publicDir: "../public",
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    // 开发服务器配置
    server: {
        hmr: true,
        port: 6753
    },
    // 库模式打包配置
    build: {
        outDir: path.resolve(__dirname, "dist"),
        emptyOutDir: true,
        lib: {
            // 库的入口文件
            entry: path.resolve(__dirname, "src/index.ts"),
            //打包后的全局变量名（主要用于 UMD 模式）。当用户通过 <script> 标签引入你的库时，可以通过 window.MichiruUI 访问到它。
            name: "MichiruUI",
            // 生成文件的命名规则
            fileName: format => `michiru-ui.${format}.js`,
            formats: ["es", "umd"]
        },
        cssCodeSplit: false,
        sourcemap: true,
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ["vue", "dayjs", "lodash-es", "smooth-scrollbar", "nanoid", "vue-router", "@iconify/vue"],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: "Vue",
                    dayjs: "dayjs",
                    "lodash-es": "_",
                    "smooth-scrollbar": "Scrollbar",
                    nanoid: "nanoid",
                    "vue-router": "VueRouter",
                    "@iconify/vue": "IconifyVue"
                },
                exports: "named",
                assetFileNames: assetInfo => {
                    const assetName = assetInfo.names[0];
                    if (!assetName) return "assets/[name]-[hash][extname]";
                    if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetName)) {
                        return `assets/medias/[name]-[hash][extname]`;
                    }
                    if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetName)) {
                        return `assets/images/[name]-[hash][extname]`;
                    }
                    if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetName)) {
                        return `assets/fonts/[name]-[hash][extname]`;
                    }
                    if (assetName.endsWith(".css")) {
                        return `michiru-ui[extname]`;
                    }
                    return `assets/[name]-[hash][extname]`;
                }
            }
        }
    }
});
