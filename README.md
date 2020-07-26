## Music

Background music form : [Bensound](https://www.bensound.com).

## Programming

Design blueprint form : [ProcessOn](https://www.processon.com/view/link/5f09d7781e08530ca80ff028).

### 逻辑草稿

city-change 更新内容：

城市有三阶层居民、政府和一家粮食公司

每个 Point 类，有“食物总量”变量，有“食物批次记录”数组。
每个 Company 类，。

1 回合
原料企业生产出食物（批次“标记生产时间1 + 产量”，纳入食物总量）
检测食物（移除“生产时间过期”的标记信息，扣除食物总量）

2 回合
原料企业生产出食物（批次“标记生产时间2 + 产量”，纳入食物总量）
居民购买了食物（扣除食物总量，平均扣除“标记生产时间 + 产量”，添加金钱，移除“产量为 0”的标记信息）
检测食物（移除“生产时间过期”的标记信息，扣除食物总量）
