const cheerio = require('cheerio');
const request = require('request');
const colors = require('colors');

let location = "Bologna"

request({
    method: 'GET',
    url: `https://www.meteo.it/meteo/${location}-37006`,
    /*** PARTE HEADER AGGIUNTA DA POCO ***/
    headers: {
        "Host": "www.meteo.it",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    }
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

    let iconTomorrow = toIcon($("a[href='/meteo/bologna-domani-37006'] > div >img").attr().alt)

    let now = $('.near_icon').first().text();
    now = ((now > 0 ? `+`.brightWhite + `${now}°`.brightYellow : `-${now}°`.brightYellow) + "C".brightWhite);

    let icon = toIcon($('p > span > img').attr().alt);
    const lastUpdate = $(".airportTime > img").attr().alt.split(",")[1];

    location = (lastUpdate + ") " + location.underline + ":").brightWhite;
    console.log((` ${location} ${icon}  ${now}  ➡️   ` + `${iconTomorrow}  [`.brightWhite + `${tomorrow[0]}` + `,`.brightWhite + `${tomorrow[1]}` + `]`.brightWhite).bold);
});


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

        default:
        // code block
    }

    return img;
}
