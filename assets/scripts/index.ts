import url = cc.url;
import Support from "./supports/support";
import Perlin from "./supports/perlin";
import Point from "./supports/point";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Index extends cc.Component {

    @property(cc.Label)
    labelError: cc.Label = null;

    @property(cc.Sprite)
    spriteNewButton: cc.Sprite = null;

    @property(cc.Sprite)
    spriteContinueButton: cc.Sprite = null;
    continueButtonIsOpen: boolean = false;

    @property
    mapXMax: number = 8;

    @property
    mapYMax: number = 8;

    @property
    defaultPeople: number = 400;

    idle: boolean = false;

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

        let callback = function () {
            if (self.idle) {
                this.unschedule(callback);
            }
            if (terrainsStatus && citiesStatus) {
                self.idle = true;
            }
        };
        this.schedule(callback, 0.2);

        // 加载地图 Icon 资源
        cc.resources.loadDir("icons/terrains", cc.SpriteFrame, function (err, assets) {
            for (let asset of assets) {
                window.resources.terrains[asset.name] = asset;
            }
            terrainsStatus = true;
        });

        // 加载城市 Icon 资源
        cc.resources.loadDir("icons/cities", cc.SpriteFrame, function (err, assets) {
            for (let asset of assets) {
                window.resources.cities[asset.name] = asset;
            }
            citiesStatus = true;
        });
    }

    /**
     * 游戏存档生成器
     */
    generateData () {
        const TERRAIN = {
            "sea": {
                "landforms": 0,
                "farmland": 1700,
            },
            "marsh": {
                "landforms": 1,
                "farmland": 1900,
            },
            "plane": {
                "landforms": 2,
                "farmland": 4200,
            },
            // "desert": ?,
            "hilly": {
                "landforms": 3,
                "farmland": 2700,
            },
            "mountain": {
                "landforms": 4,
                "farmland": 1750,
            },
        };

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
                let landforms = null;
                if (value < 60) {
                    landforms = JSON.parse(JSON.stringify(TERRAIN.sea));
                    landforms.farmland *= 0.75 + Math.random();
                    // TODO: 海洋矿物如何开采
                } else if (value < 60 + step) {
                    landforms = JSON.parse(JSON.stringify(TERRAIN.marsh));
                    landforms.farmland *= 0.75 + Math.random();
                    landforms.coalMine = (Math.random() < 0.22) ? 9500 * Math.random() : 0;
                    landforms.ironMine = (Math.random() < 0.05) ? 3200 * Math.random() : 0;
                    landforms.copperMine = (Math.random() < 0.09) ? 2400 * Math.random() : 0;
                } else if (value < 60 + step * 2) {
                    landforms = JSON.parse(JSON.stringify(TERRAIN.plane));
                    landforms.farmland *= 0.8 + Math.random();
                    landforms.coalMine = (Math.random() < 0.26) ? 12000 * Math.random() : 0;
                    landforms.ironMine = (Math.random() < 0.09) ? 4900 * Math.random() : 0;
                    landforms.copperMine = (Math.random() < 0.11) ? 3200 * Math.random() : 0;
                } else if (value < 60 + step * 3) {
                    landforms = JSON.parse(JSON.stringify(TERRAIN.hilly));
                    landforms.farmland *= 0.6 + Math.random();
                    landforms.coalMine = (Math.random() < 0.09) ? 8800 * Math.random() : 0;
                    landforms.ironMine = (Math.random() < 0.12) ? 5750 * Math.random() : 0;
                    landforms.copperMine = (Math.random() < 0.24) ? 7200 * Math.random() : 0;
                } else {
                    landforms = JSON.parse(JSON.stringify(TERRAIN.mountain));
                    landforms.farmland *= 0.5 + Math.random();
                    landforms.coalMine = (Math.random() < 0.06) ? 7200 * Math.random() : 0;
                    landforms.ironMine = (Math.random() < 0.21) ? 9500 * Math.random() : 0;
                    landforms.copperMine = (Math.random() < 0.10) ? 4200 * Math.random() : 0;
                }

                mapData[mapY][mapX] = new Point(Object.assign({
                    "x": mapX,
                    "y": mapY,
                    "height": value,
                    "name": this.placeBox(landforms),
                }, landforms))
            }
        }
        // 生成时间
        let time = {
            year: 30 + Math.round(Math.random() * 5),
            month: 3 + Math.round(Math.random() * 3),
            day: 1 + Math.round(Math.random() * 20),
        };

        // 生成城市
        mapData[2][2].name = '青羽村';
        mapData[2][2].people = this.defaultPeople;
        mapData[2][2].money = Math.random() * 1000 + 1000;

        let level = 0;
        for (let limit of window.config.citiesSize) {
            if (mapData[2][2].people < limit) {
                break;
            }
            level++;
        }
        mapData[2][2].level = level;
        mapData[2][2].history = ['在那个没有时间的年代，一群原始人类聚集在一起，钻木取火，砸石为器，用鲜血捍卫了族群的领土，一个新的聚落建立了。', window.support.createHistoryText(null, time.year + time.month + time.day + '')];

        return {
            "maps": mapData,
            "time": time,
        }
    }

    /**
     * 点击进入新游戏
     */
    onClickNewGame () {
        let data = this.generateData();
        cc.sys.localStorage.setItem("data", JSON.stringify(this.generateData()));
        window.data = data;

        cc.director.loadScene("main");
    }

    /**
     * 点击加载旧游戏
     */
    onClickContinueGame () {
        if (this.continueButtonIsOpen) {
            cc.director.loadScene("main");
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        window.ENV = "dev";
        window.support = new Support();
        window.config = {
            "citiesSize": [
                50,  // 不稳定聚落，生存物资
                500,  // 微型城市，生存物资
                1950,  // 小型城市，生存物资 + 奢侈品
                13000,  // 中型城市，生存物资 + 奢侈品
                60000,  // 大型城市，奢侈品
                320000,  // 巨大城市，奢侈品
            ],
        };

        // 检查“无存档”
        let data = cc.sys.localStorage.getItem("data");
        if (data) {
            window.data = JSON.parse(data);

            // 开启“继续游戏”按钮
            this.spriteContinueButton.spriteFrame = this.spriteNewButton.spriteFrame;
            this.continueButtonIsOpen = true;
        }

        // 资源“未加载”
        if (!window.resources) {
            this.loadAllResource();
        }
    }

    update (dt: number) {
    }

    /**
     * 地名生成器
     *
     * @param landforms
     * @param config
     */
    placeBox (landforms: number, config: {sizeMax?: number, sizeMin?: number} = {}) {
        let datas = {
            "landforms": landforms,
            "config": config,
        };
        window.support.checkType(datas, 'placeBox');
        landforms = datas.landforms;
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

        length = NAME[landforms].length;
        suffix = NAME[landforms][Math.floor(Math.random() * length)];

        return prefix + suffix;
    }

    /**
     * TODO: 城市名生成器
     * @param level
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
}
