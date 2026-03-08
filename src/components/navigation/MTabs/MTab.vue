<script lang="ts" setup>
import { inject } from "vue";
import type { MTabContext, MTabPanelProps } from "./types";
import { MTabContextKey } from "./types";

defineOptions({
    name: "MTab"
});
const props = defineProps<MTabPanelProps>();
const tabContext = inject<MTabContext>(MTabContextKey);
if (tabContext) {
    tabContext.register({ ...props });
}
</script>
