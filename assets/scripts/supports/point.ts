import Base from "./base";

/**
 * 地点类
 * 货物为本地上架货物
 */
export default class Point extends Base {
    // 自然
    x: number;
    y: number;
    height: number;
    landforms: number;
    farmland: number; // 农田（每月产出上限）
    coalMine: number; // 煤矿（每月产出上限）
    ironMine: number; // 铁矿（每月产出上限）
    copperMine: number; // 铜矿（每月产出上限）
    name: string;
    // 城市
    people: number;
    level: number;
    marketShelf: number; // 本地货架（摆放上限）
    state: {
        famine: number,  // 饥荒
    };
    money: number;
    history: Array<string>;

    node?: cc.Node;  // 城市节点

    constructor (data: {
        x: number;
        y: number;
        height: number,
        landforms: number,
        people?: number,
        level?: number,  // 城市等级
        node?: cc.Node,  // 城市节点
        marketShelf?: number,
        farmland?: number; // 农田（每月产出上限）
        coalMine?: number; // 煤矿（每月产出上限）
        ironMine?: number; // 铁矿（每月产出上限）
        copperMine?: number; // 铜矿（每月产出上限）

        name: string,
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
        this.node = data.node || null;

        this.farmland = data.farmland || 600; // 农田（每月产出上限）
        this.coalMine = data.coalMine || 0; // 煤矿（每月产出上限）
        this.ironMine = data.ironMine || 0; // 铁矿（每月产出上限）
        this.copperMine = data.copperMine || 0; // 铜矿（每月产出上限）

        this.marketShelf = data.marketShelf || 1000;

        this.marketShelf = data.marketShelf || 1000;
        this.x = data.x;
        this.y = data.y;
        this.height = data.height;
        this.landforms = data.landforms;
        this.people = data.people || 0;
        this.level = data.level || 0;
        this.history = [];
        this.state = {
            famine: 0,
        };
    }
}
