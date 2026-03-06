import fs from "fs/promises";
import { imageSizeFromFile } from "image-size/fromFile";
import path from "path";
import type { WaterFallItem } from "./types";

const generateImageData = async (targetDir: string): Promise<WaterFallItem[]> => {
    try {
        const files = await fs.readdir(targetDir); // 读取目录下的所有文件
        const promises = files.map(async file => {
            const filePath = path.join(targetDir, file);
            try {
                const dimensions = await imageSizeFromFile(filePath);
                return {
                    url: `${file}`,
                    width: dimensions.width,
                    height: dimensions.height
                };
            } catch (error) {
                console.log(`无法读取图片尺寸：${file}`, error);
                return null;
            }
        });

        // 并发执行所有解析任务，并过滤掉无效的结果
        const results = await Promise.all(promises);
        return results.filter((item): item is WaterFallItem => item !== null);
    } catch (error) {
        console.error("读取目录失败：", error);
        return [];
    }
};

const isExists = async (path: string): Promise<boolean> => {
    try {
        await fs.access(path, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

const imageFolder = path.join(import.meta.dirname, "../images"); // 图片文件夹路径
const outputFolder = path.join(import.meta.dirname, "../results"); // 输出文件路径
if (!(await isExists(outputFolder))) {
    await fs.mkdir(outputFolder); // 如果输出文件夹不存在，则创建它
}
const outputPath = path.join(outputFolder, "data.json"); // 输出文件完整路径

try {
    const fileList = await generateImageData(imageFolder);
    await fs.writeFile(outputPath, JSON.stringify(fileList, null, 4), "utf-8"); // 4表示缩进
    console.log(`处理完成，图片总数: ${fileList.length}`);
    console.log(`文件已保存至: ${outputPath}`);
} catch (error) {
    console.log("生成 JSON 失败！", error);
}
