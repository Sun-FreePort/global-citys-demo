declare global {
    interface Window {
        resources: {
            terrains: Array<cc.SpriteFrame>,
            cities: Array<cc.SpriteFrame>,
            audios: Array<cc.SpriteFrame>,
        },
        ENV: string,
        support: Support,
        config: {
            citiesSize: Array<number>
        },
        data: {
            maps: Array<
                Array<{
                    "height": number,
                    "landform": number,

                    "name": string,
                    "people": number,
                    "level": number,  // 城市等级

                    "node"?: cc.Node,  // 城市节点
                }>
            >,
            time: {
                year: number,
                month: number,
                day: number,
            },
        },
    }
}

export default class Support {
    checkType (values: object, path: string = 'Unknow path.') {
        for (var key in values) {
            switch (typeof values[key]) {
                case "number":
                    values[key] = this.checkNaN(values[key], path);
                    break;

                case "string":
                    // TODO: ???
                    break;

                case "object":
                    this.checkType(values[key], path);
                    break;

                default:
                    cc.warn("Error type of: " + typeof values[key]);
                    return;
            }
        }
    }

    protected checkNaN (value: number, path: string = 'Unknow path.'): number {
        if (isNaN(value)) {
            cc.error(path)
            // TODO: Send error validate to server

            return 0;
        }

        return value;
    }
}
