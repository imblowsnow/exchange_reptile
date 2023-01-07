
const exchange = async function (value, srcUnit , toUnit){
    let exchanges = require("./exchange.json").data;
    let srcExchangeItem = exchanges.find(item => item.name === srcUnit);
    if (srcUnit === "人民币"){
        srcExchangeItem = {
            price: 1
        }
    }
    if (!srcExchangeItem) return 0;
    // 人民币金额
    let rate = srcExchangeItem.price;
    if (toUnit === "人民币"){
        return value * rate;
    }
    let toExchangeItem = exchanges.find(item => item.name === toUnit);
    if (!toExchangeItem) return 0;
    let price = (value * rate) / toExchangeItem.price;

    return parseFloat(price.toFixed(6))
}

exchange(100,"日元","人民币").then(console.log);
