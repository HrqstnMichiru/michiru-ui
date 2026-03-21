import MLoading from "@/components/feedback/MLoading/MLoading.vue";
import type { MLoadingInstance, MLoadingProps } from "@/components/feedback/MLoading/types";
import type { DirectiveBinding } from "vue";
import { h, render } from "vue";

interface MLoadingDirectiveOptions {
    loading: boolean;
    duration?: number;
}
type MLoadingDirectiveValue = boolean | MLoadingDirectiveOptions;

const DEFAULT_DURATION = 300;
const states = new WeakMap<HTMLElement, MLoadingInstance>();

const resolveDirectiveValue = (value: MLoadingDirectiveValue): Required<MLoadingDirectiveOptions> => {
    if (typeof value === "boolean") {
        return {
            loading: value,
            duration: DEFAULT_DURATION
        };
    }

    const loading = value.loading;
    const duration = typeof value.duration === "number" ? Math.max(DEFAULT_DURATION, value.duration) : DEFAULT_DURATION;

    return {
        loading,
        duration
    };
};

const createLoading = (target: HTMLElement, duration: number): MLoadingInstance => {
    const container = document.createElement("div");
    const props: MLoadingProps = {
        onDestroy: () => {
            render(null, container);
            container.remove();
            states.delete(target);
        },
        target,
        duration
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

const mountLoading = (el: HTMLElement, duration: number) => {
    if (states.has(el)) return;
    const instance = createLoading(el, duration);
    states.set(el, instance);
};

const unmountLoading = (el: HTMLElement) => {
    const state = states.get(el);
    if (!state) return;
    state.destroy();
};

const loading = {
    mounted(el: HTMLElement, binding: DirectiveBinding<MLoadingDirectiveValue>) {
        const config = resolveDirectiveValue(binding.value);
        if (config.loading) {
            mountLoading(el, config.duration);
        }
    },
    updated(el: HTMLElement, binding: DirectiveBinding<MLoadingDirectiveValue>) {
        const config = resolveDirectiveValue(binding.value);
        if (config.loading) {
            mountLoading(el, config.duration);
        } else {
            unmountLoading(el);
        }
    },
    unmounted(el: HTMLElement) {
        unmountLoading(el);
    }
};

export default loading;
