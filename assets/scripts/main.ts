import url = cc.url;
import Point from "./supports/point";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab)
    cityPrefab: cc.Prefab = null;

    @property(cc.Node)
    mapNodes: cc.Node = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Sprite)
    mapArrowLeft: cc.Sprite = null;

    @property(cc.Sprite)
    mapArrowRight: cc.Sprite = null;

    @property(cc.Sprite)
    mapArrowTop: cc.Sprite = null;

    @property(cc.Sprite)
    mapArrowBottom: cc.Sprite = null;

    @property
    mapXMax: number = 8;

    @property
    mapYMax: number = 8;

    @property
    defaultPeople: number = 400;

    @property
    stepTime: number = 3;

    idle: boolean = true;
    nowScene: string = 'maps';
    time: number = 0;

    show: number = 4;
    showPoint: {x: number, y: number} = {x: 0, y: 0};
    citiesPool: cc.NodePool = null;

    /**
     * 初始化地图显示的节点
     */
    generateMapShow () {
        // 重置地图节点
        this.mapNodes.destroyAllChildren();
        this.citiesPool = new cc.NodePool();

        let ix = this.show;
        while (ix-- > 0) {
            let iy = this.show;
            while (iy-- > 0) {
                // 生成一个新节点
                let newCity = cc.instantiate(this.cityPrefab);
                this.mapNodes.addChild(newCity);

                // 设置位置
                let randX = (ix - 2) * 240 + 120;
                let randY = (iy - 2) * 240 + 120;

                newCity.setPosition(cc.v2(randX, randY));
                newCity.getComponent('city').init(window.data.maps[iy][ix]);

                window.data.maps[iy][ix].node = newCity;
            }
        }
    }

    /**
     * 更新地图显示的节点
     * @param event
     * @param arrow
     */
    changeMapShow (event: any, arrow: string) {
        let x = this.showPoint.x,
          y = this.showPoint.y;
        switch (arrow) {
            case "1":  // Left
                if (!window.data.maps[y] || !window.data.maps[y][x - this.show]) {
                    this.mapArrowLeft.spriteFrame = null;
                    this.showError('已经到了国境线');
                    return false;
                }
                if (this.mapArrowRight.spriteFrame === null) {
                    this.mapArrowRight.spriteFrame = this.mapArrowLeft.spriteFrame;
                }

                this.showPoint.x -= this.show;
                break;

            case "2":  // Top
                if (!window.data.maps[y + this.show] || !window.data.maps[y + this.show][x]) {
                    this.mapArrowTop = null;
                    this.showError('已经到了国境线');
                    return false;
                }
                if (this.mapArrowBottom.spriteFrame === null) {
                    this.mapArrowBottom.spriteFrame = this.mapArrowTop.spriteFrame;
                }

                this.showPoint.y += this.show;
                break;

            case "3":  // Right
                if (!window.data.maps[y] || !window.data.maps[y][x + this.show]) {
                    this.mapArrowRight.spriteFrame = null;
                    this.showError('已经到了国境线');
                    return false;
                }
                if (this.mapArrowLeft.spriteFrame === null) {
                    this.mapArrowLeft.spriteFrame = this.mapArrowRight.spriteFrame;
                }

                this.showPoint.x += this.show;
                break;

            case "4":  // Botton
                if (!window.data.maps[y - this.show] || !window.data.maps[y - this.show][x]) {
                    this.mapArrowBottom = null;
                    this.showError('已经到了国境线');
                    return false;
                }
                if (this.mapArrowTop.spriteFrame === null) {
                    this.mapArrowTop.spriteFrame = this.mapArrowBottom.spriteFrame;
                }

                this.showPoint.y -= this.show;
                break;

            default:
                this.showError('「未知的地图切换」请在群里反馈一下，谢谢！');
                break;
        }

        for (let city of this.mapNodes.children) {
            let position = city.getComponent('city').getLocal();
            window.data.maps[position.y][position.x].node = undefined;

            this.citiesPool.put(city);
        }

        let ix = this.show;
        while (ix-- > 0) {
            let iy = this.show;

            while (iy-- > 0) {
                let city = null;
                if (this.citiesPool.size() > 0) {
                    city = this.citiesPool.get();
                } else {
                    city = cc.instantiate(this.cityPrefab);
                }
                city.parent = this.mapNodes;

                // 设置位置
                let randX = (ix - 2) * 240 + 120;
                let randY = (iy - 2) * 240 + 120;

                city.setPosition(cc.v2(randX, randY));
                city.getComponent('city').init(
                    window.data.maps[iy + this.showPoint.y][ix + this.showPoint.x]);

                window.data.maps[iy + this.showPoint.y][ix + this.showPoint.x].node = city;
            }
        }
    }

    /**
     * 显示错误提示
     * @param info
     */
    showError (info: string) {

    }

    onClickChangeScene () {
        // TODO: 切换场景
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // 初始化地图节点
        this.generateMapShow();
    }

    update (dt: number) {
        this.time += dt;

        if (this.time > this.stepTime && this.idle) {
            this.time = 0;

            this.upgradeTime();  // 时间更新

            // 地点更新
            for (let y in window.data.maps) {
                for (let x in window.data.maps[y]) {
                    // 地点：window.data.maps[y][x] 的更新
                    let point = window.data.maps[y][x];
                    this.upgradeCityLevel(point);
                    this.upgradePeople(point);
                    this.upgradeProduct(point);
                    this.upgradeRandom(point);
                }
            }
        }
    }

    /**
     * 城市升级自检
     * 当前城市升级策略为：纯人口叠加，未来扩展方向为 GDP
     * @param point
     */
    upgradeCityLevel (point: Point) {
        let level = 0;
        for (let limit of window.config.citiesSize) {
            if (point.people < limit) {
                break;
            }
            level++;
        }
        if (point.level !== level) {
            point.level = level;
            if (point.node) {
                point.node.getComponent('city').upgrade({
                    "level": level,
                });
            }
        }
    }

    /**
     * 与具体函数无关的随机事件
     */
    upgradeRandom (point) {
        // 金币增加 x
        if (point.level > 1 && Math.random() < 0.01) {
            let newMoney = Math.random() * 300;
            point.money += newMoney;

            let maps = ['偏僻的河谷', '荒无人烟的沙滩', '被焚毁的森林遗迹', '古代遗迹的地下'];
            point.history.push(window.support.createHistoryText(`政府的矿物探采部门在一处${maps[Math.floor(Math.random() * maps.length)]}找到了新的金矿，他们将采掘的金矿熔炼为金币，为本地市场增加了${point.money}枚金币。`));
        }

        // 金币损耗 x%
        if (point.level > 1 && Math.random() < 0.01) {
            let rebirth = point.money * (0.9 + Math.random() / 10);
            let destroyMoney = rebirth * point.money;
            point.money -= destroyMoney;

            point.history.push(window.support.createHistoryText(`在进行多次会议后，政府宣布启动重铸破损金币的计划。据悉，大约${destroyMoney}枚劣质金币将从市场上被清除。`));
        }
    }

    /**
     * 时间更新
     */
    upgradeTime () {
        window.data.time.day += 10;
        if (window.data.time.day > 30) {
            window.data.time.day = 1;
            window.data.time.month++;


            if (window.data.time.month > 12) {
                window.data.time.month = 1;
                window.data.time.year++;
            }
        }
    }

    /**
     * 生产物资
     */
    upgradeProduct (point: Point) {
        // 社群能提供 43.2% 的有效生产力
        let product = point.people * 0.432;
        let natureFood = Math.random() * 3 - Math.random() * 3;

        let foodWorker = 1;
        let toolWorker = 0;
        let luxuryWorker = 0;

        switch (point.level) {
            case 1:
                foodWorker = 0.95;
                toolWorker = 0.05;
                break;
            case 2:
                foodWorker = 0.87;
                toolWorker = 0.13;
                break;
            case 3:
                foodWorker = 0.75;
                toolWorker = 0.24;
                luxuryWorker = 0.01;
                break;
            case 4:
                foodWorker = 0.56;
                toolWorker = 0.4;
                luxuryWorker = 0.04;
                break;
            case 5:
                foodWorker = 0.35;
                toolWorker = 0.55;
                luxuryWorker = 0.1;
                break;
            default:
        }
        // 计算工具的效率提升和磨损
        let farmTools = 1;
        if (point.goods.tools > 1) {
            if (point.goods.tools > product * 0.3) {
                point.goods.tools -= product * 0.3;
                farmTools = 1.5
            } else if (point.goods.tools > product * 0.15) {
                point.goods.tools -= product * 0.15;
                farmTools = 1.2
            } else {
                point.goods.tools = 0;
                farmTools += 0.2 * point.goods.tools / (product * 0.15);
            }
        }
        // 具体生产
        point.goods.foodstuffs += product * foodWorker * farmTools + natureFood;
        if (point.goods.foodstuffsMax < point.goods.foodstuffs) {
            point.goods.foodstuffs = point.goods.foodstuffsMax;
        } else if (point.goods.foodstuffsMax < 0) {
            point.goods.foodstuffs = 0;
        }

        point.goods.tools += product * toolWorker;
        if (point.goods.toolsMax < point.goods.tools) {
            point.goods.tools = point.goods.toolsMax;
        }

        point.goods.luxury += product * luxuryWorker;
        if (point.goods.luxuryMax < point.goods.luxury) {
            point.goods.luxury = point.goods.luxuryMax;
        }
    }

    /**
     * 人口更新
     * @param point
     */
    upgradePeople (point: Point) {
        if (point.people < 1) {
            return false;
        }
        point.goods.foodstuffs -= point.people * 0.40;
        if (point.goods.foodstuffs < 0) {
            point.goods.foodstuffs = 0;

            switch (Math.floor(point.state.famine)) {
                case 0:
                    point.state.famine += 0.2;
                    break;
                case 1:
                    if (point.state.famine === 1) {
                        point.history.push(window.support.createHistoryText('粮食不足的征兆出现了，这是大饥荒的开始，还是命运的恶作剧？'));
                    }
                    point.state.famine += 0.1;
                    point.people *= 0.99;
                    break;
                case 2:
                    point.state.famine += 0.1;
                    point.people *= 0.98;
                    break;
                case 3:
                    point.state.famine += 0.1;
                    point.people *= 0.96;
                    break;
            }
            point.people *= 0.99;
        } else {
            point.state.famine -= 0.1;
            if (point.state.famine < 0) {
                point.state.famine = 0;
            }
            point.people *= 1.001;
        }
    }
}
