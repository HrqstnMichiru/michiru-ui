<template>
    <form
        class="m-form"
        @submit.prevent
        :class="{
            'm-form--vertical': vertical
        }">
        <slot></slot>
    </form>
</template>

<script lang="ts" setup>
import { provide, shallowReactive } from "vue";
import type { FormContext, FormInstance, FormProps } from "./types";
import { FormContextKey } from "./types";

defineOptions({
    name: "MForm"
});
const props = withDefaults(defineProps<FormProps>(), {
    vertical: false
});

const validatorMap = shallowReactive(new Map<string, () => Promise<void>>());
const registerValidator = (prop: string, validator: () => Promise<void>) => {
    validatorMap.set(prop, validator);
};
const resetHandlerMap = shallowReactive(new Map<string, () => void>());
const registerResetHandler = (prop: string, handler: () => void) => {
    resetHandlerMap.set(prop, handler);
};
const validateFields = async () => {
    try {
        await Promise.all([...validatorMap.values()].map(fn => fn()));
        return true;
    } catch (error) {
        return false;
    }
};
const validateField = async (prop: string) => {
    const validator = validatorMap.get(prop);
    if (validator) {
        validator();
    }
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

provide<FormContext>(FormContextKey, {
    registerValidator,
    registerResetHandler,
    rules: props.rules,
    model: props.model
});

defineExpose<FormInstance>({
    validateFields,
    validateField,
    resetFields,
    resetField
});
</script>

<style lang="scss" scoped>
.m-form {
    display: flex;
    flex-direction: row;
    align-items: center;
    &.m-form--vertical {
        flex-direction: column;
    }
}
</style>
