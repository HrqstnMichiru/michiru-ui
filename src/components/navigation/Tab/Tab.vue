<script lang="ts" setup>
import { inject } from "vue";
import type { TabContext, TabPanelProps } from "./types";
import { TabContextKey } from "./types";

defineOptions({
    name: "MTab"
});
const props = defineProps<TabPanelProps>();
const tabContext = inject<TabContext>(TabContextKey);
if (tabContext) {
    tabContext.register({ ...props });
}
</script>
