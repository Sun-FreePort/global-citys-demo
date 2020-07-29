/**
 * 商品类
 */
export default class Goods {
    name: string;
    price: number;
    list: Array<{"companyID": number, "number": number, "life": number}>;
}
