<template>
    <div class="m-upload" :class="[`m-upload--${listStyle}`]">
        <input ref="inputRef" type="file" :accept="accept" :multiple="multiple" style="display: none" @change="handleFileChange" />
        <template v-if="listStyle === 'normal'">
            <div @click="selectFile" @dragover.prevent @drop.prevent="handleDrop">
                <slot name="trigger">
                    <div class="m-upload__trigger">
                        <MIcon :name="placeIcon || 'icon-park-outline:upload-one'" :size="72"></MIcon>
                        <div class="m-upload__trigger-text">{{ placeholder || "点击或拖拽文件到此处上传" }}</div>
                    </div>
                </slot>
            </div>
            <div class="m-upload__tip">
                {{ tip }}
            </div>
            <ul class="m-upload__list">
                <li
                    class="m-upload__item"
                    v-for="(uploadFile, index) in uploadFileList"
                    :key="uploadFile.fid"
                    @click="previewFile(uploadFile)"
                    @mouseover="uploadFile.visible = true"
                    @mouseleave="uploadFile.visible = false">
                    <div class="m-upload__item-thumb">
                        <img v-if="uploadFile.url" :src="thumbnailUrlFormat(uploadFile.url)" class="m-upload__item-img" @dragstart.prevent />
                        <img v-else-if="uploadFile.thumbnailUrl" :src="uploadFile.thumbnailUrl" class="m-upload__item-img" @dragstart.prevent />
                        <MIcon v-else name="material-symbols:lab-profile-outline" :size="32" class="m-upload__item-file-icon"></MIcon>
                    </div>
                    <div
                        class="m-upload__item-body"
                        :style="{
                            justifyContent: uploadFile.status === 'ready' ? 'center' : 'space-between'
                        }">
                        <span class="file-name">{{ uploadFile.name }}</span>
                        <div v-if="uploadFile.status === 'uploading'" class="m-upload__progress">
                            <div class="m-upload__progress-track">
                                <div class="m-upload__progress-fill" :style="{ width: `${uploadFile.percent}%` }"></div>
                            </div>
                            <span class="m-upload__progress-text">{{ uploadFile.percent }}%</span>
                        </div>
                        <div v-else-if="uploadFile.status !== 'ready'" class="status-text">
                            <span v-if="uploadFile.status === 'done'" class="success-text">上传成功</span>
                            <span v-else class="error-text">{{ uploadFile.errorMessage }}</span>
                        </div>
                    </div>
                    <Transition name="fade" mode="out-in">
                        <div class="m-upload__item-actions" v-if="uploadFile.visible">
                            <span class="action-item" v-if="uploadFile.status === 'upload-error'" @click.stop="reUploadFile(uploadFile)">
                                <MIcon name="meteor-icons:arrow-rotate" :size="20"></MIcon>
                            </span>
                            <span class="action-item" @click.stop="removeFile(index)">
                                <MIcon name="ri:close-large-line" :size="20"></MIcon>
                            </span>
                        </div>
                        <span class="file-size" v-else>{{ formatSize(uploadFile.size) }}</span>
                    </Transition>
                </li>
            </ul>
        </template>
        <template v-else-if="listStyle === 'gallery'">
            <div
                v-for="(uploadFile, index) in uploadFileList"
                :key="uploadFile.fid"
                class="m-gallery__item"
                :style="{ width: `${width || size}px`, height: `${height || size}px`, borderRadius: circle ? '50%' : '8px', flex: limit === 1 && !width && !size ? '1 1 0' : 'initial' }">
                <img v-if="uploadFile.url" :src="urlFormat(uploadFile.url)" class="m-gallery__item-img" @dragstart.prevent />
                <img v-else-if="uploadFile.thumbnailUrl" :src="uploadFile.thumbnailUrl" class="m-gallery__item-img" />
                <div v-if="uploadFile.status === 'uploading'" class="m-gallery__item-mask mask--uploading">
                    <svg class="m-gallery__ring" viewBox="0 0 36 36">
                        <circle class="m-gallery__ring-track" cx="18" cy="18" r="14" />
                        <circle class="m-gallery__ring-fill" cx="18" cy="18" r="14" :stroke-dasharray="87.96" :stroke-dashoffset="87.96 * (1 - (uploadFile.percent || 0) / 100)" />
                    </svg>
                    <span class="m-gallery__percent">{{ uploadFile.percent || 0 }}%</span>
                </div>
                <div v-else-if="uploadFile.status.endsWith('error')" class="m-gallery__item-mask mask--error">
                    <div class="error-icons">
                        <MIcon name="fa7-solid:rotate-forward" :size="30" @click.stop="reUploadFile(uploadFile)" v-if="uploadFile.status === 'upload-error'" />
                        <MIcon name="material-symbols:delete-outline" :size="30" @click.stop="removeFile(index)" />
                    </div>
                    <span class="m-gallery__error-msg">{{ uploadFile.errorMessage || "上传失败" }}</span>
                </div>
                <div v-else class="m-gallery__item-overlay">
                    <MIcon name="octicon:zoom-in-16" :size="30" @click.stop="previewFile(uploadFile)" />
                    <MIcon name="ri:delete-bin-line" :size="30" @click.stop="removeFile(index)" />
                </div>
            </div>
            <div
                v-if="uploadFileList.length < limit"
                class="m-gallery__trigger"
                @click="selectFile"
                @dragover.prevent
                @drop.prevent="handleDrop"
                :style="{ width: `${width || size}px`, height: `${height || size}px`, borderRadius: circle ? '50%' : '8px', flex: limit === 1 && !width && !size ? '1 1 0' : 'initial' }">
                <MIcon :name="placeIcon || 'icon-park-outline:upload-picture'" :size="48" />
                <span class="m-gallery__trigger-text">{{ placeholder || "上传图片" }}</span>
            </div>
        </template>
        <MImagePreview ref="imagePreviewRef" :src="displaySrc"></MImagePreview>
    </div>
</template>

<script lang="ts" setup>
import type { MImagePreviewInstance } from "@/components";
import { MIcon, MImagePreview } from "@/components";
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { nanoid } from "nanoid";
import { computed, inject, onBeforeMount, reactive, ref, useTemplateRef } from "vue";
import type { MUploadEmits, MUploadFile, MUploadInstance, MUploadProps } from "./types";

defineOptions({
    name: "MUpload"
});
const props = withDefaults(defineProps<MUploadProps>(), {
    accept: "",
    limit: 2,
    autoUpload: false,
    droppable: false,
    errorStrategy: "keep",
    enqueueStrategy: "replace",
    listStyle: "normal",
    urlFormat: (url: string) => url,
    thumbnailUrlFormat: (url: string) => url
});
const emits = defineEmits<MUploadEmits>();
const accept = computed(() => {
    if (props.listStyle === "gallery") {
        return props.accept || "image/*";
    }
    return props.accept;
});

const inputRef = useTemplateRef<HTMLInputElement>("inputRef");
const imagePreviewRef = useTemplateRef<MImagePreviewInstance>("imagePreviewRef");
const uploadFileList = reactive<MUploadFile[]>([]);
const modelValue = defineModel<string[] | string>("modelValue", {
    default: () => []
});
const formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
const formContext = inject<MFormContext | null>(MFormContextKey, null);
if (formItemContext && formItemContext.prop) {
    formContext?.registerResetHandler(formItemContext.prop, () => {
        clearFiles();
    });
}
const tip = computed(() => {
    const tips = [];
    if (props.accept) {
        tips.push(`支持上传的文件类型为 ${props.accept}`);
    }
    if (props.maxSize) {
        tips.push(`支持上传的文件大小不超过 ${props.maxSize} MB`);
    }
    if (props.limit > 1) {
        tips.push(`最多可上传 ${props.limit} 个文件`);
    }
    return tips.join("，");
});
const multiple = computed(() => props.limit > 1);
const displaySrc = ref<string>("");

const selectFile = () => {
    inputRef.value?.click();
};

const formatSize = (sizeMB: number | undefined): string => {
    if (!sizeMB) return "";
    if (sizeMB < 1 / 1024) return `${(sizeMB * 1024 * 1024).toFixed(0)} B`;
    if (sizeMB < 1) return `${(sizeMB * 1024).toFixed(1)} KB`;
    return `${sizeMB.toFixed(2)} MB`;
};

const validateFileType = (file: File) => {
    if (!props.accept) return true;
    const acceptedTypes = props.accept.split(",").map(type => type.trim());
    return acceptedTypes.some(type => {
        if (type === "*/*") return true;
        if (type.endsWith("/*")) {
            const prefix = type.slice(0, -2);
            return file.type.startsWith(prefix + "/");
        }
        if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type;
    });
};
const validateFileSize = (file: File) => {
    if (!props.maxSize) return true;
    const sizeInMB = file.size / 1024 / 1024;
    return sizeInMB <= props.maxSize;
};
const validateFile = (file: File): { valid: boolean; error?: string } => {
    const { type } = file;
    if (props.listStyle === "gallery" && !type.startsWith("image/")) {
        return { valid: false, error: "仅支持上传图片文件" };
    }
    if (props.listStyle === "normal" && !validateFileType(file)) {
        return { valid: false, error: "不支持的文件类型" };
    }
    if (props.maxSize && !validateFileSize(file)) {
        return { valid: false, error: `文件大小超过限制（最大 ${props.maxSize} MB）` };
    }
    return { valid: true };
};

const uploadFile = (file: MUploadFile) => {
    if (!props.request || !file.file) return;
    file.status = "uploading";
    file.errorMessage = undefined;
    props.request(file.file).then(response => {
        if (response.status === "success") {
            if (response.percent === undefined) {
                response.percent = 100;
            }
            file.percent = response.percent;
            if (response.percent === 100) {
                file.file = undefined;
                file.url = response.url;
                file.status = "done";
                if (file.type.startsWith("image/")) {
                    file.thumbnailUrl = undefined;
                }
                if (props.listStyle === "gallery") {
                    if (Array.isArray(modelValue.value)) {
                        modelValue.value = uploadFileList.filter(f => f.url).map(f => f.url!);
                    } else {
                        modelValue.value = "";
                    }
                }
            }
        } else {
            file.status = "upload-error";
            file.errorMessage = "上传失败";
        }
    });
};

const appendFiles = (files: File[]) => {
    if (files.length + uploadFileList.length > props.limit) {
        if (props.enqueueStrategy === "ignore") {
            const allowedCount = props.limit - uploadFileList.length;
            files.splice(allowedCount);
        } else {
            const excessCount = files.length + uploadFileList.length - props.limit;
            uploadFileList.splice(0, excessCount);
        }
    }
    files.forEach(file => {
        const fid = nanoid(10);
        const size = file.size / 1024 / 1024;
        const name = file.name;
        const type = file.type;
        const newFile: MUploadFile = {
            fid,
            name,
            size,
            type,
            status: "ready",
            percent: 50,
            file,
            visible: false
        };
        const result = validateFile(file);
        if (!result.valid) {
            if (props.errorStrategy === "remove") return;
            newFile.status = "validate-error";
            newFile.errorMessage = result.error;
        }
        uploadFileList.push(newFile);
        if (props.autoUpload) {
            uploadFile(newFile);
        } else if (file.type.startsWith("image/")) {
            newFile.thumbnailUrl = URL.createObjectURL(file);
        }
    });
};

const uploadFiles = () => {
    uploadFileList.forEach(file => {
        if (file.status === "ready") {
            uploadFile(file);
        }
    });
};

const handleDrop = async (e: DragEvent) => {
    if (!props.droppable) return;
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    appendFiles(fileList);
    if (inputRef.value) {
        inputRef.value.value = "";
    }
};

const handleFileChange = async () => {
    const files = inputRef.value?.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    appendFiles(fileList);
    inputRef.value.value = "";
};

const removeFile = (index: number) => {
    const file = uploadFileList[index];
    if (!file) return;
    if (file.thumbnailUrl && file.thumbnailUrl.startsWith("blob:")) {
        URL.revokeObjectURL(file.thumbnailUrl);
    }
    uploadFileList.splice(index, 1);
    if (props.listStyle === "gallery") {
        if (Array.isArray(modelValue.value)) {
            modelValue.value = uploadFileList.filter(f => f.url).map(f => f.url!);
        } else {
            modelValue.value = "";
        }
    }
};

const reUploadFile = (file: MUploadFile) => {
    if (file.status === "upload-error") {
        uploadFile(file);
    }
};

const previewFile = (file: MUploadFile) => {
    if (file.type.startsWith("image/")) {
        if (file.url) {
            displaySrc.value = props.urlFormat(file.url);
            imagePreviewRef.value?.previewImage();
            return;
        }
        if (file.thumbnailUrl && file.thumbnailUrl.startsWith("blob:")) {
            displaySrc.value = file.thumbnailUrl;
            imagePreviewRef.value?.previewImage();
        }
    } else {
        emits("item-click", file);
    }
};

const clearFiles = () => {
    uploadFileList.forEach(f => {
        if (f.thumbnailUrl && f.thumbnailUrl.startsWith("blob:")) {
            URL.revokeObjectURL(f.thumbnailUrl);
        }
    });
    uploadFileList.splice(0);
    if (inputRef.value) {
        inputRef.value.value = "";
    }
    if (props.listStyle === "gallery") {
        if (Array.isArray(modelValue.value)) {
            modelValue.value = [];
        } else {
            modelValue.value = "";
        }
    }
};

defineExpose<MUploadInstance>({
    clearFiles,
    selectFile,
    uploadFiles
});

onBeforeMount(() => {
    if (props.listStyle === "gallery" && modelValue.value) {
        if (Array.isArray(modelValue.value)) {
            const initialFiles: MUploadFile[] = modelValue.value.map(url => {
                return {
                    fid: url,
                    type: "image/",
                    status: "done",
                    url
                };
            });
            uploadFileList.push(...initialFiles);
        } else {
            uploadFileList.push({
                fid: modelValue.value,
                type: "image/",
                status: "done",
                url: modelValue.value
            });
        }
    }
});
</script>

<style lang="scss" scoped>
.m-upload {
    display: flex;
    width: 100%;
    &.m-upload--normal {
        flex-direction: column;
        width: 100%;
        .m-upload__trigger {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 2px dashed #d9d9d9;
            border-radius: 8px;
            padding: 40px;
            color: #999;
            transition: border-color 0.3s ease;
            &:hover {
                border-color: #409eff;
            }
            .m-upload__trigger-text {
                margin-top: 8px;
                font-size: 14px;
                color: #666;
            }
        }
        .m-upload__tip {
            text-align: right;
            margin-top: 6px;
            font-size: 12px;
            color: #999;
        }
        .m-upload__list {
            width: 100%;
            margin-top: 6px;
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            position: relative;
            .m-upload__item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 6px 12px;
                background: transparent;
                transition: background-color 0.2s ease;
                .m-upload__item-thumb {
                    flex-shrink: 0;
                    width: 40px;
                    height: 40px;
                    border-radius: 6px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0f0f0;
                    .m-upload__item-img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .m-upload__item-file-icon {
                        color: #999;
                    }
                }
                .m-upload__item-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 40px;
                    gap: 3px;
                    .file-name {
                        font-size: 13px;
                        color: #333;
                        transition: color 0.2s ease;
                    }
                    .status-text {
                        font-size: 12px;
                        line-height: 1;
                        .success-text {
                            color: #67c23a;
                        }
                        .error-text {
                            color: #f56c6c;
                        }
                    }
                    .m-upload__progress {
                        display: flex;
                        align-items: baseline;
                        gap: 8px;
                        .m-upload__progress-track {
                            flex: 1;
                            height: 4px;
                            border-radius: 2px;
                            background: #e0eeff;
                            overflow: hidden;
                            .m-upload__progress-fill {
                                height: 100%;
                                border-radius: 2px;
                                background: #409eff;
                                transition: width 0.3s ease;
                            }
                        }
                        .m-upload__progress-text {
                            flex-shrink: 0;
                            font-size: 12px;
                            color: #333;
                        }
                    }
                }
                .file-size {
                    flex-shrink: 0;
                    font-size: 12px;
                    color: #666;
                }
                .m-upload__item-actions {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    margin-left: 5px;
                    gap: 6px;
                    .action-item {
                        cursor: pointer;
                        padding: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #409eff;
                        transition: opacity 0.2s ease;
                        position: relative;
                        &::after {
                            content: "";
                            position: absolute;
                            inset: 0;
                            background-color: rgba(0, 0, 0, 0.12);
                            opacity: 0;
                            border-radius: 50%;
                        }
                        &:hover::after {
                            opacity: 1;
                        }
                    }
                }
                &:hover {
                    background-color: rgba(0, 0, 0, 0.08);
                    .m-upload__item-body .file-name {
                        color: #409eff;
                    }
                }
            }
        }
    }
    &.m-upload--gallery {
        flex-wrap: wrap;
        gap: 8px;
        .m-gallery__item {
            position: relative;
            overflow: hidden;
            background: #f5f5f5;
            transition:
                border-color 0.2s ease,
                box-shadow 0.2s ease;
            .m-gallery__item-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
            .m-gallery__item-mask {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                &.mask--uploading {
                    background: rgba(0, 0, 0, 0.5);
                    color: #fff;
                    .m-gallery__ring {
                        position: absolute;
                        width: 60px;
                        height: 60px;
                        transform: rotate(-90deg);
                        .m-gallery__ring-track {
                            fill: none;
                            stroke: rgba(255, 255, 255, 0.25);
                            stroke-width: 3;
                        }
                        .m-gallery__ring-fill {
                            fill: none;
                            stroke: #fff;
                            stroke-width: 3;
                            stroke-linecap: round;
                            transition: stroke-dashoffset 0.4s ease;
                        }
                    }
                    .m-gallery__percent {
                        font-size: 12px;
                        font-weight: 600;
                        position: relative;
                    }
                }
                &.mask--error {
                    background: rgba(220, 53, 69, 0.6);
                    color: #fff;
                    .error-icons {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        :deep(.m-icon) {
                            color: #fff;
                            cursor: pointer;
                        }
                    }
                    .m-gallery__error-msg {
                        font-size: 12px;
                        text-align: center;
                        margin-top: 5px;
                    }
                }
            }
            .m-gallery__item-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.45);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.2s ease;
                gap: 8px;
                :deep(.m-icon) {
                    color: #fff;
                    cursor: pointer;
                }
            }
            &:hover .m-gallery__item-overlay {
                opacity: 1;
            }
        }
        .m-gallery__trigger {
            border: 2px dashed #d9d9d9;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #999;
            font-size: 14px;
            transition: all 0.2s ease;
            &.is-single {
                width: 100%;
                height: 100%;
                flex: 1;
            }
            .m-gallery__trigger-text {
                font-size: 14px;
                color: #666;
                transition: color 0.2s ease;
            }
            &:hover {
                border-color: #409eff;
                color: #409eff;
                .m-gallery__trigger-text {
                    color: #409eff;
                }
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
