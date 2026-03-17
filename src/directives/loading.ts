import type { DirectiveBinding } from "vue";
import { h, render } from "vue";
import MLoading from "../components/feedback/MLoading/MLoading.vue";
import type { MLoadingInstance, MLoadingProps } from "../components/feedback/MLoading/types";

type LoadingDirectiveState = {
    instance: MLoadingInstance;
    originalPosition?: string;
};

const states = new WeakMap<HTMLElement, LoadingDirectiveState>();

const patchRelativePosition = (el: HTMLElement): string | undefined => {
    if (getComputedStyle(el).position !== "static") return undefined;
    const originalPosition = el.style.position;
    el.style.position = "relative";
    return originalPosition;
};

const restorePosition = (el: HTMLElement, originalPosition?: string) => {
    if (originalPosition === undefined) return;
    el.style.position = originalPosition;
};

const createLoading = (target: HTMLElement): MLoadingInstance => {
    const container = document.createElement("div");
    const props: MLoadingProps = {
        onDestroy: () => {
            render(null, container);
            container.remove();
            states.delete(target);
        },
        target
    };

    const vnode = h(MLoading, props);
    render(vnode, container);

    const instance: MLoadingInstance = {
        destroy: () => {
            const vm = vnode?.component;
            if (vm?.exposed?.close) {
                vm.exposed.close();
            }
        },
        vm: vnode.component!
    };

    return instance;
};

const mountLoading = (el: HTMLElement) => {
    if (states.has(el)) return;
    const originalPosition = patchRelativePosition(el);
    const instance = createLoading(el);
    states.set(el, {
        instance,
        originalPosition
    });
};

const unmountLoading = (el: HTMLElement) => {
    const state = states.get(el);
    if (!state) return;
    state.instance.destroy();
    restorePosition(el, state.originalPosition);
};

const loading = {
    mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
        if (binding.value) {
            mountLoading(el);
        }
    },
    updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
        if (binding.value) {
            mountLoading(el);
        } else {
            unmountLoading(el);
        }
    },
    unmounted(el: HTMLElement) {
        unmountLoading(el);
    }
};

export default loading;
