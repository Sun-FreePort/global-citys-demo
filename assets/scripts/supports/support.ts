import Point from "./point";

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
            maps: Array<Array<Point>>,
            time: {
                year: number,
                month: number,
                day: number,
                turn: number,
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

    public createHistoryText (text?: string, time?: string) {
        time = time || window.data.time.year + window.data.time.month + window.data.time.day + '';
        if (!text) {
            const EVENT_LIST = [
                '在本地的山谷附近，一队路过的行商听到了诡异女巫的呼嚎声。',
                '有人在水塘深处发现了一具孩子的尸体。',
                '有游客发现数百老鼠离奇投湖自尽，吓得他们匆匆离开。',
                '有游客发现数百老鼠离奇投湖自尽，吓得他匆匆离开。但当地居民表示此人是卖老鼠药的。',
            ];
            text = '';
        }

        return `${time}，${text}。`
    }

    public deepClone (obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
}
