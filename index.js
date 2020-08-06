const cheerio = require('cheerio');
const request = require('request');
const colors = require('colors');

let location = "Bologna"

request({
    method: 'GET',
    url: `https://www.meteo.it/meteo/${location}-37006`
}, (err, res, body) => {

    if (err) return console.error(err);

    let $ = cheerio.load(body);

    let tomorrow = $('.icons').map(function (i, el) {
        if (i == 1) {
            return $(el).text();
        }
    }).get()[0];

    tomorrow = tomorrow.split("°");
    tomorrow[0] = ((tomorrow[0] > 0 ? `+${tomorrow[0]}` : `-${tomorrow[0]}`) + "°").brightCyan
    tomorrow[1] = ((tomorrow[1] > 0 ? `+${tomorrow[1]}` : `-${tomorrow[1]}`) + "°").brightRed

    let now = $('.near_icon').first().text();
    now = ((now > 0 ? `+`.brightWhite + `${now}°`.brightYellow : `-${now}°`.brightYellow) + "C".brightWhite);

    let icon = toIcon($('span > img').attr().alt);

    location = (location.underline + ":").brightWhite;

    console.log((` ${location} ${icon} ${now}  ➡️   ` + `[`.brightWhite + `${tomorrow[0]}` + `,`.brightWhite + `${tomorrow[1]}` + `]`.brightWhite).bold);
});


function toIcon(img) {
    switch (img) {
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

        default:
        // code block
    }

    return img;
}