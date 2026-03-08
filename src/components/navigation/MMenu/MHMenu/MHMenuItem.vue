<script lang="ts" setup>
import { computed, inject, onMounted } from "vue";
import type { MHMenuContext, MHMenuItemModel, MHMenuItemProps, MHSubMenuContext } from "./types";
import { MHMenuContextKey, MHSubMenuContextKey } from "./types";

defineOptions({
    name: "MHMenuItem"
});
const props = defineProps<MHMenuItemProps>();
const context = inject<MHSubMenuContext | null>(MHSubMenuContextKey, null);
const menuContext = inject<MHMenuContext>(MHMenuContextKey);
const isActive = computed(() => {
    if (!menuContext) return false;
    return menuContext.isActive(props.name);
});

onMounted(() => {
    const currentItem: MHMenuItemModel = {
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
