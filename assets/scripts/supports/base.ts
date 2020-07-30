import Goods from "./base/goods";

export default class Base {
    name: string;
    money: number;
    goods: {  // 货架
        foodstuffs: Goods,
        coalOre: Goods,
        ironOre: Goods,
        copperOre: Goods,
        ironIngot: Goods,
        copperIngot: Goods,
        farmTool: Goods,
        brewery: Goods,
        tobacco: Goods,
        watchmaker: Goods,
    };

    constructor (data: {
        name: string,
        money?: number,
        goods?: {
            foodstuffs: Goods,
            coalOre: Goods,
            ironOre: Goods,
            copperOre: Goods,
            ironIngot: Goods,
            copperIngot: Goods,
            farmTool: Goods,
            brewery: Goods,
            tobacco: Goods,
            watchmaker: Goods,
        };
    }) {
        this.name = data.name;
        this.money = data.money || Math.random() * 100;

        this.goods = {
            foodstuffs: data.goods.foodstuffs,
            coalOre: data.goods.coalOre,
            ironOre: data.goods.ironOre,
            copperOre: data.goods.copperOre,
            ironIngot: data.goods.ironIngot,
            copperIngot: data.goods.copperIngot,
            farmTool: data.goods.farmTool,
            brewery: data.goods.brewery,
            tobacco: data.goods.tobacco,
            watchmaker: data.goods.watchmaker,
        };
    }
}
