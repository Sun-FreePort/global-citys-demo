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

    @property
    nickname: string = '';

    @property
    level: number = 0;

    @property
    people: number = 0;

    init (data: object) {
        // 参数完整性检查
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

    // update (dt) {}
}
