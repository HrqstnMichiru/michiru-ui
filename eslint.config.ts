import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import { globalIgnores } from "eslint/config";

export default defineConfigWithVueTs(globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]), pluginVue.configs["flat/essential"], vueTsConfigs.recommended, skipFormatting, {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
    rules: {
        "vue/multi-word-component-names": "off", // 关闭组件名称多单词规则
        "@typescript-eslint/no-explicit-any": "off", // 允许any类型
        "@typescript-eslint/no-unused-vars": "off", // 允许未使用的变量
        "vue/no-ref-as-operand": "off" // 允许ref作为操作数
    }
});
