const axios = require('axios');
const cheerio = require('cheerio');

async function testFunc() {
    const response = await axios.get(`https://jav.land/tw/id_search.php`, {
        params: { keys: 'mide-932' }
    });

    const $ = cheerio.load(response.data);
    const contentID = $('.table-hover tr:nth-child(1) td+ td').text();
    const firstLetter = contentID[0];
    const firstToThirdLetter = `${contentID[0]}${contentID[1]}${contentID[2]}`;
    const previewVidPattern = `${contentID.match(/.+[a-z]+/g)}${contentID.match(/\d{3}$/g)}`;
    const previewVidURL = `https://videos.vpdmm.cc/litevideo/freepv/${firstLetter}/${firstToThirdLetter}/${previewVidPattern}/${previewVidPattern}_dm_w.mp4`;
    console.log(previewVidURL);
    console.log(contentID);
}

testFunc();