<template>
    <MVirtualSelect
        v-bind="props"
        :data-source="dataSource"
        v-model="selectedTime"
        :multiple="false"
        :has-select-all="false"
        prefix-icon="material-symbols:alarm-outline"
        @change="onChange"></MVirtualSelect>
</template>

<script lang="ts" setup>
import { MVirtualSelect } from "@/components";
import dayjs from "dayjs";
import { computed } from "vue";
import type { TimeSelectEmits, TimeSelectProps } from "./types";

defineOptions({
    name: "MTimeSelect"
});
const props = withDefaults(defineProps<TimeSelectProps>(), {
    placement: "bottom",
    disabled: false,
    width: 250,
    placeholder: "璇烽€夋嫨鏃堕棿",
    clearable: false,
    size: "medium",
    borderAlways: false,
    block: false,
    hideAfterClick: true,
    itemHeight: 36,
    bufferSize: 5,
    maxCount: 6,
    type: "time",
    step: 30,
    format: "HH:mm"
});
const emits = defineEmits<TimeSelectEmits>();

const dataSource = computed(() => {
    if (props.type === "year") {
        const years: Array<{ label: string; value: number }> = [];
        const minYear = (props.min as number) ?? 1990;
        const maxYear = (props.max as number) ?? dayjs().year();
        for (let year = maxYear; year >= minYear; year--) {
            years.push({ label: `${year}年`, value: year });
        }
        return years;
    } else if (props.type === "month") {
        const months: Array<{ label: string; value: number }> = [];
        for (let m = 1; m <= 12; m++) {
            months.push({ label: `${m}月`, value: m });
        }
        return months;
    } else if (props.type === "week") {
        const weeks: Array<{ label: string; value: number }> = [
            { label: "星期一", value: 1 },
            { label: "星期二", value: 2 },
            { label: "星期三", value: 3 },
            { label: "星期四", value: 4 },
            { label: "星期五", value: 5 },
            { label: "星期六", value: 6 },
            { label: "星期日", value: 7 }
        ];
        return weeks;
    } else {
        const times: Array<{ label: string; value: string }> = [];
        const baseDate = "2000-01-01";
        const minTime = (props.min as string) ?? "00:00";
        const maxTime = (props.max as string) ?? "23:30";
        let current = dayjs(`${baseDate} ${minTime}`);
        const end = dayjs(`${baseDate} ${maxTime}`);
        while (current.isBefore(end) || current.isSame(end)) {
            const time = current.format(props.format);
            times.push({ label: time, value: time });
            current = current.add(props.step, "minute");
        }
        return times;
    }
});
const onChange = () => {
    emits("change");
};

const selectedTime = defineModel<string | number>("modelValue");
</script>

<style lang="scss" scoped></style>
