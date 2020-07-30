import Base from "./base";
import Company from "./company";
import Worker from "./worker";
import Goods from "./base/goods";

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
    level: number;
    marketShelf: number; // 本地货架（摆放上限）
    state: {
        famine: number,  // 饥荒
    };
    history: Array<string>;

    node?: cc.Node;  // 城市的游戏节点
    company: {};  // 本地企业
    people: {
        worker: Worker,
        manager: Worker,
        leader: Worker,
    };

    constructor (data: {
        x: number;
        y: number;
        height: number,
        landforms: number,
        people: {
            worker: Worker,
            manager: Worker,
            leader: Worker,
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
        goods?: {  // TODO: 添加商品类
            foodstuffs?: number,
            foodstuffsMax?: number,
            foodstuffsPrice?: number,
            foodstuffsList?: Array<{"companyKey": number, "goods": number, "life": number}>,
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
        this.people = window.support.deepClone(data.people);  // TODO: ...
        this.level = data.level || 0;
        this.history = [];
        this.state = {
            famine: 0,
        };
    }

    /**
     * 本地政府行动
     */

    /**
     * 本地企业行动
     */

    /**
     * 上架商品
     */
    marketGoods (goodsKey: string, companyKey: number, number: number, life: number) {
        if (this.company[companyKey].goods[goodsKey].number < 1) {
            return false;
        }
        number = Math.round(number);

        this.company[companyKey].goods[goodsKey].number -= number;
        this.goods[goodsKey] += number;
        this.goods[goodsKey].list.push({"companyKey": companyKey, "number": number, "life": life});
    }

    /**
     * 售出商品
     */
    sellGoods (goodsKey: string, number: number) {
        if (!this.goods[goodsKey].number) {
            return false;
        }

        this.goods[goodsKey].number -= number;
        // 移除具体公司的商品
        let length = this.goods[goodsKey].list.length;
        // todo: 出售逻辑更新，按件出售更合理
        this.goods[goodsKey].list = this.goods[goodsKey].list.map(obj => {
            this.company[obj.companyKey].money += number * this.goods[goodsKey].price / length;  // 增加具体公司的金钱
            obj.number -= number / length;
            return obj;
        });
    }

    /**
     * 丢弃过期商品
     */
    pastDueGoods () {
        for (let name in this.goods) {
            this.goods[name] = this.goods[name].map(goods => {
                goods.list = goods.list.map(obj => {
                    if (obj.life < window.data.time.turn) {
                        return '';
                    }
                }).filter(item => item);
            });
        }
    }

    /**
     * TODO: 更新商品物价
     */
    upgradePrice () {
        const SAVE_RATE = {
            foodstuffs: [{ // 粮食
                rate: 0.9,
                change: -0.19,
            }, {
                rate: 0.8,
                change: -0.1,
            }, {
                rate: 0.25,
                change: 0.1,
            }, {
                rate: 0.1,
                change: 0.22,
            }],
            farmTool: [{ // 农具
                rate: 0.9,
                change: -0.41,
            }, {
                rate: 0.75,
                change: -0.18,
            }, {
                rate: 0.25,
                change: 0.18,
            }, {
                rate: 0.1,
                change: 0.55,
            }],
        };
        for (let key in SAVE_RATE) {
            for (let json of SAVE_RATE[key]) {
                if (this.goods[key] > this.goods[key + 'Max'] * json.rate) {
                    this.goods[key + 'Price'] += json.change;
                    break;
                }
            }
        }
    }
}
