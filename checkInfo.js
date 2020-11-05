const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs");
const colors = require('colors');
const { SlowBuffer } = require('buffer');

getTodayPage("Bologna");
async function getMainPage(location) {

    const body = await axios({
        method: 'GET',
        url: `https://www.meteo.it/meteo/${location}-37006`,
    }).then(res => res.data);

    let $ = cheerio.load(body);

    let tomorrow = $('.icons').map(function (i, el) {
        if (i == 1) {
            return $(el).text();
        }
    }).get()[0];

    tomorrow = tomorrow.split("°");
    tomorrow[0] = ((tomorrow[0] > 0 ? `+${tomorrow[0]}` : `-${tomorrow[0]}`) + "°").brightCyan
    tomorrow[1] = ((tomorrow[1] > 0 ? `+${tomorrow[1]}` : `-${tomorrow[1]}`) + "°").brightRed

    let iconTomorrow = toIcon($("a[href='/meteo/bologna-domani-37006'] > div >img").attr().alt)
    console.log("Tempo domani icona=> " + iconTomorrow)
    /*let now = $('.near_icon').first().text();
    now = ((now > 0 ? `+`.brightWhite + `${now}°`.brightYellow : `-${now}°`.brightYellow) + "C".brightWhite);

    let icon = toIcon($('p > span > img').attr().alt);
    const lastUpdate = $(".airportTime > img").attr().alt.split(",")[1];

    location = (lastUpdate + ") " + location.underline + ":").brightWhite;*/
    //console.log((` ${location} ${icon}  ${now}  ➡️   ` + `${iconTomorrow}  [`.brightWhite + `${tomorrow[0]}` + `,`.brightWhite + `${tomorrow[1]}` + `]`.brightWhite).bold);
    return (`➡️   ` + `${iconTomorrow}  [`.brightWhite + `${tomorrow[0]}` + `,`.brightWhite + `${tomorrow[1]}` + `]`.brightWhite).bold;
}


async function getTodayPage(location) {


    const body = await axios({
        method: 'GET',
        url: `https://www.meteo.it/meteo/${location}-oggi-37006`,
    }).then(res => res.data);

    let $ = cheerio.load(body);

    //icona tempo document.querySelectorAll("figure > img").alt
    const icons = $("figure > img").map((i, e) => {
        return toIcon($(e).attr("alt"));
    }).get();
    console.log("Icone => " + icons)

    //Temperatura document.querySelectorAll(".replacedH5Temperature").innerText
    const temps = $(".replacedH5Temperature").map((i, e) => {
        e = $(e).text();
        if (Number(e.substring(0, e.length - 1)) > 0) {
            return e = ` +${e}C`;
        }
        if (Number(e.substring(0, e.length - 1)) < 0) {
            return e += ` -${e}C`;
        }
        return ` ${e}C`;
    }).get();

    console.log("Temperature => " + temps)


    const hours = $(".hour > time").map((i, e) => {
        return $(e).text();
    }).get();

    console.log("Ore => " + hours)

    let displayData = "";
    for (let i = 0; i < 3; i++) {
        if (hours[i])
            displayData += `      [${hours[i]}]`.brightWhite.bold + ` ${icons[i]} ${temps[i]}\n`

    }

    const tomorrow = await getMainPage(location);
    console.log("Domani =>" + tomorrow)

}

function toIcon(img) {
    switch (img.toLowerCase()) {
        case "tempo variabile":
            img = "🌦";
            break;
        case "soleggiato":
            img = "☀️";
            break;
        case "prevalentemente soleggiato":
            img = "🌤";
            break;
        case "cielo in gran parte nuvoloso":
            img = "⛅️";
            break;
        case "cielo coperto":
            img = "☁️";
            break;
        case "nuvoloso con pioggia leggera":
            img = "🌧";
            break;
        case "nuvoloso con temporale":
            img = "⛈";
            break;
        case "sereno notte":
            img = "🌙";
            break;
        case "allarme pioggia":
            img = "⚠️ ☔️";
            break;
        case "pioggia debole":
            img = "🌧 📉";
            break;
        default:
        // code block
    }

    return img;
}
