declare global {
    interface Window {
        resources: {
            terrains: Array<cc.SpriteFrame>,
            citys: Array<cc.SpriteFrame>,
        },
        support: Support,
        data: {
            maps: Array<
                Array<{
                    "height": boolean,
                    "landform": string,
                    "people": number,
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
                    // TODO: ???
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
