/**
 * 居民阶层类
 */
import Point from "./point";

export default class PeopleBase {
    people: number; // 居民数
    fertility_rate: number; // 生育率
    starvation_rate: number; // 饥荒死亡率
    money: number; // 资金池
    need_food: number; // 每人消耗食物

    pointInstance: Point;

    /**
     * 人口更新
     */
    public upgradePeople () {
        if (this.people < 1) {
            return false;
        }
        let point = this.pointInstance;
        point.goods.foodstuffs -= this.people * 0.40;
        if (point.goods.foodstuffs < 0 || this.money < 0) {
            return this.people *= this.starvation_rate;
        }

        let starvation_step = 1 / (1 - this.starvation_rate);
        let need_food = this.people * this.need_food;
        if (point.goods.foodstuffs > need_food) { // 上架食物足够
            if (this.money > need_food * point.goods.foodstuffsPrice) { // 库存金钱足够
                this.people *= this.fertility_rate;
                this.money -= need_food * point.goods.foodstuffsPrice;
                point.sellGoods("foodstuffs", need_food);
            } else { // 库存金钱不足
                let buy = this.money / point.goods.foodstuffsPrice;
                this.people *= this.starvation_rate + buy / need_food / starvation_step;
                this.money = 0;
                point.goods.foodstuffs -= buy; // TODO: 使用 Point 的购买方法，以便有效为具体单位付款
            }
            return false;
        }
        // 上架食物不足
        if (this.money > point.goods.foodstuffs * point.goods.foodstuffsPrice) { // 库存金钱足够
            this.people *= this.starvation_rate + point.goods.foodstuffs / need_food / starvation_step;
            this.money -= point.goods.foodstuffs * point.goods.foodstuffsPrice;
            point.goods.foodstuffs = 0; // TODO: 使用 Point 的购买方法，以便有效为具体单位付款
        } else { // 库存金钱不足
            let buy = this.money / point.goods.foodstuffsPrice;
            this.people *= this.starvation_rate + buy / need_food / starvation_step;
            this.money = 0;
            point.goods.foodstuffs -= buy; // TODO: 使用 Point 的购买方法，以便有效为具体单位付款
        }
    }
}
