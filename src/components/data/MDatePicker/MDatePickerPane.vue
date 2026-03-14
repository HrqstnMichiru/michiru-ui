<template>
    <div class="panel">
        <slot name="prefix"></slot>
        <div class="header">
            <div class="year">{{ current.year }}</div>
            <div class="month">{{ months[current.month] }}</div>
            <MIcon class="prev-year" name="line-md:chevron-double-left" @click.stop="prevYear"></MIcon>
            <MIcon class="next-year" name="line-md:chevron-double-right" @click="nextYear"></MIcon>
            <MIcon class="prev-month" name="material-symbols:arrow-back-ios-new" @click="prevMonth"></MIcon>
            <MIcon class="next-month" name="material-symbols:arrow-forward-ios" @click="nextMonth"></MIcon>
        </div>
        <div class="calendar">
            <table>
                <thead>
                    <tr>
                        <td v-for="week in weeks" :key="week">
                            <span>{{ week }}</span>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in days" :key="rowIndex">
                        <td
                            v-for="(day, colIndex) in row"
                            :key="colIndex"
                            :class="{
                                'current-day': day.date.isSame(dayjs(), 'date'),
                                'other-month': day.other,
                                'selected-day': selectValueMap.has(day.date.format(format))
                            }"
                            @click="selectDate(day.date)">
                            <span>
                                {{ day.date.date() }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="ring-left"></div>
            <div class="ring-right"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import dayjs from "dayjs";
import { computed, reactive, shallowReactive } from "vue";
import type { MDatePickerPanelEmits, MDatePickerPanelInstance, MDatePickerPanelProps } from "./types";

defineOptions({
    name: "MDatePickerPanel"
});
const props = withDefaults(defineProps<MDatePickerPanelProps>(), {
    format: "YYYY-MM-DD",
    multiple: false
});
const emits = defineEmits<MDatePickerPanelEmits>();

const modelValue = defineModel<string | string[]>("modelValue"); // 选择的值
const selectValueMap = shallowReactive<Set<string>>(new Set()); // 选中的日期字符串

// 当前面板的年月
const current = reactive({
    year: 0,
    month: 0
});

// 星期数组
const weeks = ["日", "一", "二", "三", "四", "五", "六"];
const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const days = computed(() => {
    const first = dayjs().year(current.year).month(current.month).date(1); // 当月第一天
    const firstDay = first.day(); // 星期几（0-6，0=周日）

    const flatResult: { date: dayjs.Dayjs; other: boolean }[] = [];

    // ---------------------
    // 上月补齐
    // ---------------------
    for (let i = (firstDay + 6) % 7; i >= 0; i--) {
        const d = first.subtract(i + 1, "day"); // 往前补
        flatResult.push({ date: d, other: true });
    }

    // ---------------------
    // 本月日期
    // ---------------------
    const last = first.endOf("month"); // 本月最后一天
    const daysInMonth = last.date(); // 本月天数
    for (let i = 1; i <= daysInMonth; i++) {
        const d = first.date(i);
        flatResult.push({ date: d, other: false });
    }

    // ---------------------
    // 下月补齐到 6 行（共 42 个格子）
    // ---------------------
    while (flatResult.length < 42) {
        const d = last.add(flatResult.length - (firstDay + daysInMonth) + 1, "day");
        flatResult.push({ date: d, other: true });
    }

    // 转换为 6 行 7 列的二维数组
    const result: { date: dayjs.Dayjs; other: boolean }[][] = [];
    for (let i = 0; i < 6; i++) {
        result.push(flatResult.slice(i * 7, (i + 1) * 7));
    }

    return result;
});

// 上一年
const prevYear = () => {
    current.year!--;
};

// 下一年
const nextYear = () => {
    current.year!++;
};

// 上一个月
const prevMonth = () => {
    if (current.month === 0) {
        current.year!--;
        current.month = 11;
    } else {
        current.month!--;
    }
};

// 下一个月
const nextMonth = () => {
    if (current.month === 11) {
        current.year!++;
        current.month = 0;
    } else {
        current.month!++;
    }
};

const selectDate = (date: dayjs.Dayjs) => {
    if (props.multiple) {
        const dateStr = date.format(props.format);
        const result = selectValueMap.has(dateStr); // 是否已选中
        if (result) {
            // 已选中，移除
            selectValueMap.delete(dateStr);
        } else {
            // 未选中，添加
            selectValueMap.add(dateStr);
        }
        const currentValues = Array.from(selectValueMap);
        modelValue.value = currentValues;
        emits("change"); // 通知外部变化
    } else {
        const dateStr = date.format(props.format);
        modelValue.value = dateStr;
        emits("change"); // 通知外部变化
        emits("click");
    }
};

const resetPanel = () => {
    let dt: dayjs.Dayjs = dayjs();
    if (props.multiple) {
        if (modelValue.value && (modelValue.value as string[]).length > 0) {
            dt = dayjs((modelValue.value as string[])[0]);
        }
    } else {
        if (modelValue.value) {
            dt = dayjs(modelValue.value as string);
        }
    }
    current.year = dt.year();
    current.month = dt.month();
};

const clearSelection = () => {
    selectValueMap.clear();
    if (props.multiple) {
        modelValue.value = [];
    } else {
        modelValue.value = "";
    }
    emits("change");
};

const deleteSelection = (index: number) => {
    if (!props.multiple) return;
    const dateStr = (modelValue.value as string[])[index];
    if (dateStr) {
        selectValueMap.delete(dateStr);
    }
    const newValues = [...(modelValue.value as string[])];
    newValues.splice(index, 1);
    modelValue.value = newValues;
    emits("change");
};

defineExpose<MDatePickerPanelInstance>({
    resetPanel,
    clearSelection,
    deleteSelection
});

(() => {
    if (props.multiple && modelValue.value) {
        (modelValue.value as string[]).forEach(dateStr => {
            selectValueMap.add(dateStr);
        });
    }
    resetPanel();
})();
</script>

<style lang="scss" scoped>
.panel {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 2;
    width: 340px;
    background-color: #fff;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    .header {
        color: #fff;
        padding: 2.5em 1em 1.2em 1em;
        background-image: url("@/assets/image/转天3.webp");
        background-size: cover;
        display: flex;
        flex-direction: column;
        background-color: transparent;
        position: relative;
        overflow: hidden;
        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.2);
            z-index: 0;
        }
        .year {
            font-size: 3em;
            font-weight: bold;
            line-height: 1em;
            z-index: 1;
        }
        .month {
            font-size: 2em;
            line-height: 1em;
            text-transform: lowercase;
            z-index: 1;
        }
        .prev-year {
            position: absolute;
            top: 0.3em;
            left: 0.3em;
            font-size: 1.8em;
            cursor: pointer;
            z-index: 1;
        }
        .next-year {
            position: absolute;
            top: 0.3em;
            right: 0.3em;
            font-size: 1.8em;
            cursor: pointer;
            z-index: 1;
        }
        .prev-month {
            position: absolute;
            top: 0.55em;
            left: 1.8em;
            font-size: 1.4em;
            cursor: pointer;
            z-index: 1;
        }
        .next-month {
            position: absolute;
            top: 0.55em;
            right: 1.8em;
            font-size: 1.4em;
            cursor: pointer;
            z-index: 1;
        }
    }
    .calendar {
        padding: 8px;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        table {
            height: 100%;
            color: #333;
            border-collapse: collapse;
            thead {
                color: #c74545;
                font-weight: 700;
                text-transform: uppercase;
            }
            td {
                padding: 0 4px;
                font-size: 14px;
                font-weight: 600;
                span {
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    display: inline-block;
                    line-height: 30px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    transition: all 0.3s;
                }
                &.current-day {
                    color: #c74545;
                    font-weight: bold;
                }
                &.other-month {
                    color: #cacaca;
                }
                &.selected-day span {
                    background-color: #ff6f91;
                    color: #fff;
                    font-weight: 600;
                    font-size: 17px;
                }
            }
            tbody td span:hover {
                background-color: #da89a2;
                color: #fff;
                font-weight: 600;
                font-size: 17px;
            }
        }
        .ring-left,
        .ring-right {
            position: absolute;
            top: -18px;
        }
        .ring-left {
            left: 0.3em;
        }
        .ring-right {
            right: 0.3em;
        }
        .ring-left::before,
        .ring-right::before {
            background-color: #fff;
            border-radius: 4px;
            box-shadow:
                0 3px 1px rgba(0, 0, 0, 0.3),
                0 -1px 1px rgba(0, 0, 0, 0.2);
            content: "";
            display: inline-block;
            margin: 8px;
            height: 32px;
            width: 8px;
        }
    }
}
</style>
