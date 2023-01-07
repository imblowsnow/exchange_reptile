const axios = require('axios');
const cheerio = require("cheerio");
const fs = require("fs");
async function build() {
    let currencys = await do_currencys();

    let promises = [];
    for (const name in currencys) {
        promises.push(do_exchange(name,currencys[name]));
    }

    let exchanges = await Promise.all(promises);
    // 过滤空数据
    exchanges = exchanges.filter(e=>e);

    console.log("汇率数据",exchanges.length);

    fs.writeFileSync("./exchange.json", JSON.stringify({
        build_time: new Date().toLocaleString(),
        data: exchanges
    }));
}


async function do_currencys() {
    let res = await axios("https://chl.cn/?huansuan");
    let $ = cheerio.load(res.data);

    let currencys = {};
    $(".hblb1 a").each((i, e) => {
        let href = $(e).attr(`href`);
        href = href.replace("/?","");
        let name = $(e).text();

        currencys[name] = href;
    })

    return currencys;
}

async function do_exchange(name, currency) {

    let res = await axios("https://chl.cn/?" + currency);
    let $ = cheerio.load(res.data);
    let body = $("div.Lt").text()
    let matches = body.match(/=([\d\.]+)元/);
    if (!matches) return null;
    let price = parseFloat(matches[1]);

    console.log(`获取${name}汇率`,price);

    return {
        name,
        currency,
        price
    };
}


build();
