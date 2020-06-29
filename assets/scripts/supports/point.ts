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
    };

    node?: cc.Node;  // 城市节点

    constructor (data: {
        x: number;
        y: number;
        "height": number,
        "landform": number,
        "name": string,
        "people": number,
        "level": number,  // 城市等级
        "node"?: cc.Node,  // 城市节点
        goods?: {
            foodstuffs?: number,
            foodstuffsMax?: number,
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
            foodstuffsMax: 100,
        };
        if (data.goods) {
            this.goods.foodstuffs = data.goods.foodstuffs || 0;
            this.goods.foodstuffsMax = data.goods.foodstuffsMax || 0;
        }
    }
}
