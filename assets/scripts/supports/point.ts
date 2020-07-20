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
    people: {
        worker: number,
        manager: number,
        leader: number,
    };
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
        people: {
            worker: number,
            manager: number,
            leader: number,
        },
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
        this.people = window.support.deepClone(data.people);
        this.level = data.level || 0;
        this.history = [];
        this.state = {
            famine: 0,
        };
    }

    /**
     * 人口更新
     */
    public upgradePeople () {
        if ((this.people.worker + this.people.manager + this.people.leader) < 1) {
            return false;
        }
        this.goods.foodstuffs -= this.people * 0.40;
        if (this.goods.foodstuffs < 0) {
            this.goods.foodstuffs = 0;

            switch (Math.floor(this.state.famine)) {
                case 0:
                    this.state.famine += 0.2;
                    break;
                case 1:
                    if (this.state.famine === 1) {
                        this.history.push(window.support.createHistoryText('粮食不足的征兆出现了，这是大饥荒的开始，还是命运的恶作剧？'));
                    }
                    this.state.famine += 0.1;
                    this.people.worker *= 0.996;
                    this.people.manager *= 0.997;
                    this.people.leader *= 0.998;
                    break;
                case 2:
                    this.state.famine += 0.1;
                    this.people.worker *= 0.988;
                    this.people.manager *= 0.99;
                    this.people.leader *= 0.992;
                    break;
                case 3:
                default:
                    this.state.famine += 0.1;
                    this.people.worker *= 0.96;
                    this.people.manager *= 0.965;
                    this.people.leader *= 0.97;
                    break;
            }
        } else {
            if (this.state.famine >= 0.1) {
                this.state.famine -= 0.1;
            }
            this.people.worker *= 1.0015;
            this.people.manager *= 1.0013;
            this.people.leader *= 1.001;
        }
    }
}
