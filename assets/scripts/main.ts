import url = cc.url;
import Support from "./supports/support"
import Perlin from "./supports/perlin"
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

    @property
    mapXMax: number = 8;

    @property
    mapYMax: number = 8;

    @property
    defaultPeople: number = 400;

    @property
    stepTime: number = 3;

    idle: boolean = false;
    time: number = 0;

    show: number = 4;
    showPoint: {x: number, y: number} = {x: 0, y: 0}
    citiesPool: cc.NodePool = null;

    /**
     * 加载 Main 场景所需资源
     */
    loadAllResource () {
        window.resources = {
            "terrains": [],
            "cities": [],
            "audios": [],
        };

        let self = this;
        let terrainsStatus = false,
            citiesStatus = false;

        // 加载地图 Icon 资源
        cc.resources.loadDir("icons/terrains", cc.SpriteFrame, function (err, assets) {
            for (let asset of assets) {
                window.resources.terrains[asset.name] = asset;
            }

            terrainsStatus = true;
            if (citiesStatus) {
                self.idle = true;
                self.generateMapShow();
            }
        });

        // 加载城市 Icon 资源
        cc.resources.loadDir("icons/cities", cc.SpriteFrame, function (err, assets) {
            for (let asset of assets) {
                window.resources.cities[asset.name] = asset;
            }

            citiesStatus = true;
            if (terrainsStatus) {
                self.idle = true;
                self.generateMapShow();
            }
        });
    }

    /**
     * 游戏存档生成器
     */
    generateData () {
        const TERRAIN = {
            "sea": 0,
            "marsh": 1,
            "plane": 2,
            // "desert": ?,
            "hilly": 3,
            "mountain": 4,
        }

        // 生成地图
        let height = Math.ceil(Math.random() * 10000);
        let noise = new Perlin();

        let mapData = new Array(this.mapYMax);
        for (let mapY = 0; mapY < this.mapYMax; mapY++) {
            mapData[mapY] = new Array(this.mapXMax);
        }

        for (let mapX = 0; mapX < this.mapXMax; mapX++) {
            for (let mapY = 0; mapY < this.mapXMax; mapY++) {
                let value = noise.perlin3(mapX / 50, mapY / 50, height);
                value = (1 + value) * 1.1 * 128;

                let step = 53;
                let landform = null;
                if (value < 60) {
                    landform = TERRAIN.sea;
                } else if (value < 60 + step) {
                    landform = TERRAIN.marsh;
                } else if (value < 60 + step * 2) {
                    landform = TERRAIN.plane;
                } else if (value < 60 + step * 3) {
                    landform = TERRAIN.hilly;
                } else {
                    landform = TERRAIN.mountain;
                }

                mapData[mapY][mapX] = new Point({
                    "x": mapX,
                    "y": mapY,
                    "height": value,
                    "landform": landform,
                    "name": this.placeBox(landform),
                    "people": 0,
                    "level": 0,
                })
            }
        }

        // 生成时间
        let time = {
            year: 30 + Math.round(Math.random() * 5),
            month: 3 + Math.round(Math.random() * 3),
            day: 1 + Math.round(Math.random() * 20),
        }

        // 生成城市
        mapData[2][2].name = '青羽村';
        mapData[2][2].people = this.defaultPeople;

        let level = 0;
        for (let limit of window.config.citiesSize) {
            if (mapData[2][2].people < limit) {
                break;
            }
            level++;
        }
        mapData[2][2].level = level;

        // TODO: 生成历史

        return {
            "maps": mapData,
            "time": time,
            // "history": time,
        }
    }

    /**
     * 地名生成器
     *
     * @param landform
     * @param config
     */
    placeBox (landform: number, config: {sizeMax?: number, sizeMin?: number} = {}) {
        let datas = {
            "landform": landform,
            "config": config,
        };
        window.support.checkType(datas, 'placeBox');
        landform = datas.landform;
        config = datas.config;

        // 名称表
        let WORD = ['天', '鸟', '风', '桦', '叶', '青', '灵', '枫', '云', '雾', '北', '东', '西', '南', '门', '玉', '石', '瀑', '滨', '安', '临', '京', '华', '温', '新', '黄', '平', '州', '赤', '水', '巨', '洛', '浦', '权', '阳', '邯', '暑', '促', '紫', '橙', '绿', '蓝', '金', '英', '美', '意', '德', '日', '韩', '苗', '银', '铜', '铁', '锡', '漫', '雷', '雨', '雪'];

        // 后缀表
        const NAME = [[  // sea
            '洋', '湖', '海', '池', '潭'
        ], [  // marsh
            '泽', '沼', '地'
        ], [  // plane
            '原', '谷', '岗', '林', '丘'
        ], [  // hilly
            '陵', '岭', '林', '山'
        ], [  // mountain
            '山', '峡'
        ]];

        let prefix = '';
        let suffix = 'Unknow';

        // 生成器
        if (config.sizeMin < 2 || config.sizeMin > 10) {
            return 'Error Info: SizeError with placeBox'
        }
        if (config.sizeMin === undefined) {
            config.sizeMin = 2;
        }
        if (config.sizeMax === undefined) {
            config.sizeMax = 3;
        }
        let nameLength = config.sizeMin + Math.round(Math.random() * (config.sizeMax - config.sizeMin) + 0.05);

        let length = WORD.length;
        while (nameLength-- > 1) {
            prefix += WORD[Math.floor(Math.random() * length)];
        }

        length = NAME[landform].length;
        suffix = NAME[landform][Math.floor(Math.random() * length)];

        return prefix + suffix;
    }

    /**
     * TODO: 城市名生成器
     * @param people
     * @param config
     */
    cityBox (level: number, config: {sizeMax?: number, sizeMin?: number} = {}) {
        // 名称表
        let WORD = ['天', '鸟', '风', '桦', '叶', '青', '灵', '枫', '云', '雾', '北', '东', '西', '南', '门', '玉', '石', '瀑', '滨', '安', '临', '京', '华', '温', '新', '黄', '平', '州', '赤', '水', '巨', '洛', '浦', '权', '阳', '邯'];

        // 后缀表
        const NAME = [[  // 微型城市
            '村', '寨', '镇', '县', '乡', '庄'
        ], [  // 小型城市
            '古城', '堡', '县',
        ], [  // 中型城市
            '城', '塞', '道'
        ], [  // 大型城市
            '大城', '郡城', '州府'
        ], [  // 巨大城市
            '圣城', '省', '都'
        ]];

        let prefix = 'Unknow';
        let suffix = 'Unknow';

        let length = NAME[level].length;
        suffix = NAME[level][Math.floor(Math.random() * length)];

        return prefix + suffix;
    }

    /**
     * 生成地图默认显示的节点
     *
     * @param show 地图上要展示的节点数量（一般为次方值）
     * @param x
     * @param y
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

    changeMapShow (event: any, arrow: string) {
        let x = this.showPoint.x,
          y = this.showPoint.y;
        switch (arrow) {
            case "1":  // Left
                if (!window.data.maps[y] || !window.data.maps[y][x - this.show]) {
                    // TODO: 每次渲染完检查一次，灰掉相关的按钮
                    cc.log('!')
                    return false;
                }

                this.showPoint.x -= this.show;
                break;

            case "2":  // Top
                if (!window.data.maps[y + this.show] || !window.data.maps[y + this.show][x]) {
                    // TODO: 每次渲染完检查一次，灰掉相关的按钮
                    cc.log('!')
                    return false;
                }

                this.showPoint.y += this.show;
                break;

            case "3":  // Right
                if (!window.data.maps[y] || !window.data.maps[y][x + this.show]) {
                    // TODO: 每次渲染完检查一次，灰掉相关的按钮
                    cc.log('!')
                    return false;
                }

                this.showPoint.x += this.show;
                break;

            case "4":  // Botton
                if (!window.data.maps[y - this.show] || !window.data.maps[y - this.show][x]) {
                    // TODO: 每次渲染完检查一次，灰掉相关的按钮
                    cc.log('!')
                    return false;
                }

                this.showPoint.y -= this.show;
                break;

            default:
                // code...
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
                    window.data.maps[iy + this.showPoint.y][ix + this.showPoint.x])

                window.data.maps[iy + this.showPoint.y][ix + this.showPoint.x].node = city;
            }
        }
    }

    showError () {

    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        window.ENV = "dev";
        window.support = new Support();
        window.config = {
            "citiesSize": [
                50,  // 不稳定聚落
                500,  // 微型城市
                1950,  // 小型城市
                13000,  // 中型城市
                60000,  // 大型城市
                320000,  // 巨大城市
            ],
        };

        // 资源“未加载”
        if (!window.resources) {
            this.loadAllResource();
        }

        // 检查“无存档”
        let data = cc.sys.localStorage.getItem("data");
        if (!data) {
            data = this.generateData();

            // 保存存档
            // cc.sys.localStorage.setItem("data", data);
        }
        // 读取存档到 window 对象
        window.data = data;

        // 初始化地图节点
        // TODO: 增加 Index 场景后，提供即时加载
        // this.generateMapShow();
    }

    update (dt: number) {
        this.time += dt;

        if (this.time > this.stepTime) {
            this.time = 0;

            this.upgradeTime();  // 时间更新

            // 地点更新
            for (let y in window.data.maps) {
                for (let x in window.data.maps[y]) {
                    // 地点：window.data.maps[y][x] 的更新
                    let point = window.data.maps[y][x];
                    this.upgradePeople(point);
                    this.upgradeProduct(point);
                }
            }
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
        point.goods.foodstuffs += point.people * 0.432;
        if (point.goods.foodstuffsMax < point.goods.foodstuffs) {
            point.goods.foodstuffs = point.goods.foodstuffsMax;
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
                    // TODO: 记录历史，饥荒开始
                    point.state.famine += 0.1;
                    point.people *= 0.98;
                    break;
                case 2:
                    point.state.famine += 0.1;
                    point.people *= 0.96;
                    break;
                case 3:
                    point.state.famine += 0.1;
                    point.people *= 0.93;
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
                    "level": level
                });
            }
        }
    }
}
