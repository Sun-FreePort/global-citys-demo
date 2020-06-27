const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    originX: number = 0;
    originY: number = 0;

    onKeyDown (event: cc.Event.EventTouch) {
        let origin = event.getLocation();
        this.originX = origin.x;
        this.originY = origin.y;
    }

    onKeyMove (event: cc.Event.EventTouch) {
        let origin = event.getLocation();

        this.node.x += this.originX - origin.x;
        this.node.y += this.originY - origin.y;

        this.originX = origin.x;
        this.originY = origin.y;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onKeyDown, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onKeyMove, this, true);
    }

    onDestroy () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onKeyDown, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onKeyMove, this);
    }

    // update (dt) {}
}
