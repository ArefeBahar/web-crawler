const rp = require('request-promise-native');
const fs = require('fs');
const cheerio = require('cheerio');
const id = 'cIn8pGEAAAAJ';

async function downloadHtml() {
    const uri = `https://scholar.google.com/citations?user=${id}&hl=en&oi=ao&pagesize=999`;
    const filename = `${id}_google_scholar.html`;

    const fileExists = fs.existsSync(filename);
    if (fileExists) {
        console.log(`Skipping download for ${uri} since ${filename} already exists.`);
        return;
    }

    console.log(`Downloading HTML from ${uri}...`);
    const results = await rp({ uri: uri });

    await fs.promises.writeFile(filename, results);
}

async function parse() {
    const htmlFilename = `${id}_google_scholar.html`;
    const html = await fs.promises.readFile(htmlFilename);
    const $ = cheerio.load(html);

    const $img = $('.gs_rimg img').toArray()[0].attribs.src;
    const $name = $('#gsc_prf_in').text();
    const $info = $('.gsc_prf_il').toArray()[0].children.map(child => $(child).children.length ? $(child).text() : $(child)).join();
    const $tags = $('.gsc_prf_inta').toArray().map(child => $(child).text());
    const $articles = $('.gsc_a_tr').toArray().map(tr => {
        const tds = $(tr).find('td').toArray();
        return {
            title: $(tds[0].children[0]).text(),
            authors: $(tds[0].children[1]).text(),
            journal: $(tds[0].children[2]).text(),
            cited_by: $(tds[1].children[0]).text(),
            year: $(tds[2].children[0]).text()
        }
    });

    return {
        img: $img,
        name: $name,
        info: $info,
        tags: $tags,
        articles: $articles
    }
}

async function crawl() {
    console.log('Starting...');
    await downloadHtml();
    const google_scholar = await parse();
    await fs.promises.writeFile(
        `${id}_google_scholar.json`,
        JSON.stringify(google_scholar, null, 2)
    );
    console.log('Done!');
}

crawl();
