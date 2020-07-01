export default class Point {
    // 自然
    x: number;
    y: number;
    height: number;
    landform: number;
    name: string;
    // 城市
    people: number;
    level: number;
    state: {
        famine: number;  // 饥荒
    };
    goods: {
        foodstuffs: number,
        foodstuffsMax: number,
        tools: number,
        toolsMax: number,
        luxury: number,
        luxuryMax: number,
    };

    node?: cc.Node;  // 城市节点

    constructor (data: {
        x: number;
        y: number;
        height: number,
        landform: number,
        name: string,
        people: number,
        level: number,  // 城市等级
        node?: cc.Node,  // 城市节点
        goods?: {
            foodstuffs?: number,
            foodstuffsMax?: number,
            tools?: number,
            toolsMax?: number,
            luxury?: number,
            luxuryMax?: number,
        };
    }) {
        this.x = data.x;
        this.y = data.y;
        this.height = data.height;
        this.landform = data.landform;

        this.name = data.name;
        this.people = data.people;
        this.level = data.level;

        this.node = data.node || null;

        this.goods = {
            foodstuffs: 0,
            foodstuffsMax: 50,
            tools: 0,
            toolsMax: 0,
            luxury: 0,
            luxuryMax: 0,
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
