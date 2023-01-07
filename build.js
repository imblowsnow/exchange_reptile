const axios = require('axios');
const cheerio = require("cheerio");
const fs = require("fs");
async function build() {
    let currencys = await do_currencys();
    let exchanges = [];

    for (const name in currencys) {
        let price = await do_exchange(currencys[name]);
        console.log("do_exchange",name, price);
        if (!price) continue;

        exchanges.push({
            currency: currencys[name],
            name,
            price
        })
    }

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

async function do_exchange(currency) {
    let res = await axios("https://chl.cn/?" + currency);
    let $ = cheerio.load(res.data);
    let body = $("div.Lt").text()
    let matches = body.match(/=([\d\.]+)元/);
    if (!matches) return 0;

    return parseFloat(matches[1]);
}


build();
