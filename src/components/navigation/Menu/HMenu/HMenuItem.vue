<script lang="ts" setup>
import { computed, inject, onMounted } from "vue";
import type { HMenuContext, HMenuItemModel, HMenuItemProps, HSubMenuContext } from "./types";
import { HMenuContextKey, HSubMenuContextKey } from "./types";

defineOptions({
    name: "MHMenuItem"
});
const props = defineProps<HMenuItemProps>();
const context = inject<HSubMenuContext | null>(HSubMenuContextKey, null);
const menuContext = inject<HMenuContext>(HMenuContextKey);
const isActive = computed(() => {
    if (!menuContext) return false;
    return menuContext.isActive(props.name);
});

onMounted(() => {
    const currentItem: HMenuItemModel = {
        data: props,
        parentName: context?.parentName,
        get active() {
            return isActive.value;
        }
    };
    if (context) {
        context.registerState(currentItem);
    } else if (menuContext) {
        menuContext.registerState(currentItem);
    }
    menuContext?.registerNode(currentItem);
});
</script>
