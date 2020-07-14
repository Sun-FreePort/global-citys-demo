export default class Company {
    // 公司
    name: string;
    goodwill: number;
    money: number;
    state: {
        famine: number;  // 饥荒
    };
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
        name: string,
        goodwill: number,
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
        this.name = data.name;
        this.goodwill = data.goodwill || 0;
        this.money = data.money || Math.random() * 100;

        this.node = data.node || null;

        this.history = [];
        this.state = {
            famine: 0,
        };
        this.goods = {
            foodstuffs: 0,
            foodstuffsMax: 50,
            foodstuffsPrice: 3,
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
