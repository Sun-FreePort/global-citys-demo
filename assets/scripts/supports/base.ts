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
        this.name = data.name;
        this.money = data.money || Math.random() * 100;

        this.goods = {
            foodstuffs: (data.goods && data.goods.foodstuffs) ? data.goods.foodstuffs : 0,
            foodstuffsMax: (data.goods && data.goods.foodstuffsMax) ? data.goods.foodstuffsMax : 0,
            foodstuffsPrice: (data.goods && data.goods.foodstuffsPrice) ? data.goods.foodstuffsPrice : 0,
            foodstuffsList: [],

            coalOre: (data.goods && data.goods.coalOre) ? data.goods.coalOre : 0,
            coalOreMax: (data.goods && data.goods.coalOreMax) ? data.goods.coalOreMax : 0,
            coalOrePrice: (data.goods && data.goods.coalOrePrice) ? data.goods.coalOrePrice : 0,
            coalOreList: [],

            ironOre: (data.goods && data.goods.ironOre) ? data.goods.ironOre : 0,
            ironOreMax: (data.goods && data.goods.ironOreMax) ? data.goods.ironOreMax : 0,
            ironOrePrice: (data.goods && data.goods.ironOrePrice) ? data.goods.ironOrePrice : 0,
            ironOreList: [],

            copperOre: (data.goods && data.goods.copperOre) ? data.goods.copperOre : 0,
            copperOreMax: (data.goods && data.goods.copperOreMax) ? data.goods.copperOreMax : 0,
            copperOrePrice: (data.goods && data.goods.copperOrePrice) ? data.goods.copperOrePrice : 0,
            copperOreList: [],

            ironIngot: (data.goods && data.goods.ironIngot) ? data.goods.ironIngot : 0,
            ironIngotMax: (data.goods && data.goods.ironIngotMax) ? data.goods.ironIngotMax : 0,
            ironIngotPrice: (data.goods && data.goods.ironIngotPrice) ? data.goods.ironIngotPrice : 0,
            ironIngotList: [],

            copperIngot: (data.goods && data.goods.copperIngot) ? data.goods.copperIngot : 0,
            copperIngotMax: (data.goods && data.goods.copperIngotMax) ? data.goods.copperIngotMax : 0,
            copperIngotPrice: (data.goods && data.goods.copperIngotPrice) ? data.goods.copperIngotPrice : 0,
            copperIngotList: [],

            farmTool: (data.goods && data.goods.farmTool) ? data.goods.farmTool : 0,
            farmToolMax: (data.goods && data.goods.farmToolMax) ? data.goods.farmToolMax : 0,
            farmToolPrice: (data.goods && data.goods.farmToolPrice) ? data.goods.farmToolPrice : 0,
            farmToolList: [],

            brewery: (data.goods && data.goods.brewery) ? data.goods.brewery : 0,
            breweryMax: (data.goods && data.goods.breweryMax) ? data.goods.breweryMax : 0,
            breweryPrice: (data.goods && data.goods.breweryPrice) ? data.goods.breweryPrice : 0,
            breweryList: [],

            tobacco: (data.goods && data.goods.tobacco) ? data.goods.tobacco : 0,
            tobaccoMax: (data.goods && data.goods.tobaccoMax) ? data.goods.tobaccoMax : 0,
            tobaccoPrice: (data.goods && data.goods.tobaccoPrice) ? data.goods.tobaccoPrice : 0,
            tobaccoList: [],

            watchmaker: (data.goods && data.goods.watchmaker) ? data.goods.watchmaker : 0,
            watchmakerMax: (data.goods && data.goods.watchmakerMax) ? data.goods.watchmakerMax : 0,
            watchmakerPrice: (data.goods && data.goods.watchmakerPrice) ? data.goods.watchmakerPrice : 0,
            watchmakerList: [],
        };
    }
}
