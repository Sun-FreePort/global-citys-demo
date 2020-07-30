/**
 * 商品类
 */
export default class Goods {
    name: string;
    price: number;
    number: number;
    list: Array<{"companyKey": number, "number": number, "life": number}>;
}
