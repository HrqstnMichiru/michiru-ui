<script lang="ts" setup>
import { inject } from "vue";
import type { MTabsContext, MTabPanelProps } from "./types";
import { MTabContextKey } from "./types";

defineOptions({
    name: "MTab"
});
const props = defineProps<MTabPanelProps>();
const tabContext = inject<MTabsContext>(MTabContextKey);
if (tabContext) {
    tabContext.register({ ...props });
}
</script>
