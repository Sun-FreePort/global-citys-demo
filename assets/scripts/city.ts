const {ccclass, property} = cc._decorator;

@ccclass
export default class City extends cc.Component {
    // 地理
    @property(cc.Sprite)
    mapShow: cc.Sprite = null;

    @property
    terrain: number = 1;

    // 城市
    @property(cc.Sprite)
    cityShow: cc.Sprite = null;

    @property(cc.Label)
    cityName: cc.Label = null;

    x: number = 0;
    y: number = 0;

    level: number = 0;
    people: number = 0;

    init (data: {height: number, landform: number, name: string, level: number, people: number, x: number, y: number}) {
        this.cityName.string = data.name;
        // if (window.ENV === "dev") {
        //     this.cityName.string = data.x + '/' + data.y;
        // }

        this.mapShow.spriteFrame = window.resources.terrains[data.landform];
        this.cityShow.spriteFrame = window.resources.cities[data.level];
        
        this.level = data.level;
        this.people = data.people;
        this.x = data.x;
        this.y = data.y;
    }

    upgrade (data: {height?: number, landform?: number, name?: string, level?: number, people?: number, x?: number, y?: number}) {
        if (data.name) {
            this.cityName.string = data.name;
        }

        if (data.level) {
            this.cityShow.spriteFrame = window.resources.cities[data.level];
        }

        if (data.landform) {
            this.mapShow.spriteFrame = window.resources.terrains[data.landform];
        }

        if (data.people) {
            this.people = data.people;
        }

        if (data.level) {
            this.level = data.level;
        }
    }

    getLocal () {
        return {"x": this.x, "y": this.y}
    }

    save () {
        // 参数完整性检查
    }

    onClick (event: object) {
        // 发出消息，通知“打开全局的城市信息面板”
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    // update (dt) {
    // }
}
