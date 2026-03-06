import type { WaterFallItem } from "./types";

class DataManager {
    private data: WaterFallItem[] = [];

    private constructor(data: WaterFallItem[]) {
        this.data = data;
    }

    public static async create(): Promise<DataManager> {
        const dataUrl = new URL("../results/data.json", import.meta.url).href;
        const response = await fetch(dataUrl);
        const rawData = (await response.json()) as WaterFallItem[];
        const processedData = rawData.map(item => ({
            ...item,
            url: new URL(`../images/${item.url}`, import.meta.url).href
        }));
        return new DataManager(processedData);
    }

    public getPageData(page: number, pageSize: number): WaterFallItem[] {
        const startIndex = (page - 1) * pageSize;
        return this.data.slice(startIndex, startIndex + pageSize);
    }
}

const manager = await DataManager.create();
export default manager;
