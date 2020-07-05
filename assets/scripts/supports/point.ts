export default class Point {
    // 自然
    x: number;
    y: number;
    height: number;
    landforms: number;
    name: string;
    // 城市
    people: number;
    level: number;
    state: {
        famine: number;  // 饥荒
    };
    money: number;
    goods: {
        foodstuffs: number,
        foodstuffsMax: number,
        foodstuffsPrice: number,

        tools: number,
        toolsMax: number,
        toolsPrice: number,

        luxury: number,
        luxuryMax: number,
        luxuryPrice: number,
    };
    history: Array<string>;

    node?: cc.Node;  // 城市节点

    constructor (data: {
        x: number;
        y: number;
        height: number,
        landforms: number,
        name: string,
        people?: number,
        money?: number,
        level?: number,  // 城市等级
        node?: cc.Node,  // 城市节点
        goods?: {
            foodstuffs?: number,
            foodstuffsMax?: number,
            foodstuffsPrice?: number,
            tools?: number,
            toolsMax?: number,
            toolsPrice?: number,
            luxury?: number,
            luxuryMax?: number,
            luxuryPrice?: number,
        };
    }) {
        this.x = data.x;
        this.y = data.y;
        this.height = data.height;
        this.landforms = data.landforms;

        this.name = data.name;
        this.people = data.people || 0;
        this.level = data.level || 0;
        this.money = data.money || Math.random() * 100;

        this.node = data.node || null;

        this.history = [];
        this.goods = {
            foodstuffs: 0,
            foodstuffsMax: 50,
            foodstuffsPrice: 1,
            tools: 0,
            toolsMax: 0,
            toolsPrice: 10,
            luxury: 0,
            luxuryMax: 0,
            luxuryPrice: 100,
        };
        if (data.goods) {
            this.goods.foodstuffs = data.goods.foodstuffs || 0;
            this.goods.foodstuffsMax = data.goods.foodstuffsMax || 50;
            this.goods.foodstuffs = data.goods.tools || 0;
            this.goods.foodstuffsMax = data.goods.toolsMax || 0;
            this.goods.luxury = data.goods.luxury || 0;
            this.goods.luxuryMax = data.goods.luxuryMax || 0;
        }
    }
}
