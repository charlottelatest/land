const axios = require('axios');
const cheerio = require('cheerio');
const got = require('got');
const _ = require('lodash');

async function getContentID() {
    // const response = await axios.get(`https://www.dmm.co.jp/search/=/searchstr=SSIS-129`, {
    //     params: { anonymous: true },
    //     headers: { 'User-Agent': 'Axios 0.21.1' }
    // });
    // const $ = cheerio.load(response.data);
    // console.log($('a.play-btn').attr('href'));

    (async () => {
        try {
            const response = await got('https://www.dmm.co.jp/search/=/searchstr=JUL-610', {
                headers: {
                    'user-agent': 'Android'
                }
            });
            const $ = cheerio.load(response.body);
            // console.log($('a.play-btn').attr('href'));
            _.forEach($('a.play-btn'), function(value, key) {
                console.log(value.attribs.href);
            });

            //=> '<!doctype html> ...'
        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
        }
    })();
}

getContentID()
