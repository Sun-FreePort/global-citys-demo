import url = cc.url;
import Support from "./supports/support"
import Perlin from "./supports/perlin"

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
    mapXMax: number = 100;

    @property
    mapYMax: number = 100;

    /**
     * 加载 Main 场景所需资源
     */
    loadAllResource () {
        window.resources = {
            "terrains": null,
            "citys": null,
        };

        // 加载地图 Icon 资源
        cc.resources.loadDir("icons/terrains", cc.SpriteFrame, function (err, assets) {
            for (let asset of assets) {
                window.resources.terrains[asset.name] = asset;
            }
        });

        // 加载城市 Icon 资源
        cc.resources.loadDir("icons/citys", cc.SpriteFrame, function (err, assets) {
            for (let asset of assets) {
                window.resources.citys[asset.name] = asset;
            }
        });
    }

    generateData () {
        const TERRAIN = {
            "sea": 0,
            "marsh": 1,
            "plane": 2,
            // "desert": 2,
            "hilly": 3,
        }

        // 生成地图
        var height = Math.ceil(Math.random() * 10000);
        let noise = new Perlin();

// FIXME: Remove
let max = -Infinity, min = Infinity;
        let mapData = new Array(this.mapXMax);
        for (let mapX = 0; mapX < this.mapXMax; mapX++) {
            mapData[mapX] = new Array(this.mapYMax);
            for (let mapY = 0; mapY < this.mapXMax; mapY++) {
                let value = noise.perlin3(mapX / 50, mapY / 50, height);
                value = (1 + value) * 1.1 * 128;

// FIXME: Remove
if (value > max) {
    max = value;
} else if (value < min) {
    min = value;
}
                let landform = null;
                if (value < 1) {
                    landform = TERRAIN.sea;
                } else if (value < 2) {
                    landform = TERRAIN.marsh;
                } else if (value < 3) {
                    landform = TERRAIN.plane;
                } else if (value < 4) {
                    landform = TERRAIN.hilly;
                }

                mapData[mapX][mapY] = {
                    "height": value,
                    "landform": landform,
                }
            }
        }
        console.info(mapData);
// FIXME: Remove
console.info(max, min);

        // 生成城市

        // 生成时间

        // 生成历史
    }

    /**
     * 生成地图默认显示的节点
     *
     * @param show 地图上要展示的节点数量（一般为次方值）
     * @param leftX
     * @param topY
     */
    generateMapShowNode (show: number = 10, leftX: number = 0, topY: number = 0) {
        let datas = {
            "show": show,
            "leftX": leftX,
            "topY": topY,
        };
        window.support.checkType(datas, 'generateMapShowNode');

        // 重置地图节点
        this.mapNodes.destroyAllChildren();

        // for ()
        // 生成一个新节点
        let newCity = cc.instantiate(this.cityPrefab);
        this.mapNodes.addChild(newCity);

        // 设置位置
        let randX = leftX * 40;
        let randY = topY * 40;

        newCity.setPosition(cc.v2(randX, randY));
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        window.support = new Support();

        // 资源“未加载”
        if (!window.resources) {
            this.loadAllResource();
        }

        // 检查“无存档”
        let data = cc.sys.localStorage.getItem("data");
        if (!data) {
            let data = this.generateData();

            // 保存存档
            // cc.sys.localStorage.setItem("data", data);
        }
        // 读取存档到 window 对象
        window.data = data;

        // 初始化地图节点
        // this.generateMapShowNode()
    }

    // update (dt) {}
}
