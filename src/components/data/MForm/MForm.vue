<template>
    <form @submit.prevent>
        <slot></slot>
    </form>
</template>

<script lang="ts" setup>
import { provide, shallowReactive } from "vue";
import type { MFormContext, MFormInstance, MFormProps } from "./types";
import { MFormContextKey } from "./types";

defineOptions({
    name: "MForm"
});
const props = withDefaults(defineProps<MFormProps>(), {
    labelPosition: "left",
    labelAlign: "left",
    size: "medium"
});

const validatorMap = shallowReactive(new Map<string, () => Promise<boolean>>());
const registerValidator = (prop: string, validator: () => Promise<boolean>) => {
    validatorMap.set(prop, validator);
};
const resetHandlerMap = shallowReactive(new Map<string, () => void>());
const registerResetHandler = (prop: string, handler: () => void) => {
    resetHandlerMap.set(prop, handler);
};
const validateFields = async () => {
    const results = await Promise.all([...validatorMap.values()].map(fn => fn()));
    return results.every(result => result);
};
const validateField = async (prop: string) => {
    const validator = validatorMap.get(prop);
    const result = validator ? await validator() : true;
    return result;
};
const resetFields = () => {
    resetHandlerMap.forEach(handler => {
        handler();
    });
};
const resetField = (prop: string) => {
    const handler = resetHandlerMap.get(prop);
    if (handler) {
        handler();
    }
};

provide<MFormContext>(MFormContextKey, {
    registerValidator,
    registerResetHandler,
    rules: props.rules,
    model: props.model,
    labelPosition: props.labelPosition,
    labelAlign: props.labelAlign,
    labelWidth: props.labelWidth,
    size: props.size
});

defineExpose<MFormInstance>({
    validateFields,
    validateField,
    resetFields,
    resetField
});
</script>
