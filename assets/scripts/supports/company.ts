import Base from "./base";

/**
 * 公司类
 * 货物为公司库存货物
 */
export default class Company extends Base {
    // 公司
    goodwill: number;
    cost: {
        waste: number, // 浪费成本
        deposit: number, // 库存成本，上架成本不计入
    };
    product: number; // 标准产量，用于和人力、效率等因素折算
    employee: {
        worker: number,
        manager: number,
        leader: number,
    };

    constructor (data: {
        name: string,
        goodwill: number,
        employee: {
            worker: number,
            manager: number,
            leader: number,
        },
        money?: number,
        goods?: {
            foodstuffs?: number,
            foodstuffsMax?: number,
            foodstuffsPrice?: number,
            coalOre?: number,
            coalOreMax?: number,
            coalOrePrice?: number,
            ironOre?: number,
            ironOreMax?: number,
            ironOrePrice?: number,
            copperOre?: number,
            copperOreMax?: number,
            copperOrePrice?: number,
            ironIngot?: number,
            ironIngotMax?: number,
            ironIngotPrice?: number,
            copperIngot?: number,
            copperIngotMax?: number,
            copperIngotPrice?: number,
            farmTool?: number,
            farmToolMax?: number,
            farmToolPrice?: number,
            brewery?: number,
            breweryMax?: number,
            breweryPrice?: number,
            tobacco?: number,
            tobaccoMax?: number,
            tobaccoPrice?: number,
            watchmaker?: number,
            watchmakerMax?: number,
            watchmakerPrice?: number,
        };
    }) {
        super(data);

        this.goodwill = data.goodwill || 0;
        this.employee = {
            worker: data.employee.worker,
            manager: data.employee.manager,
            leader: data.employee.leader,
        };
    }
}
