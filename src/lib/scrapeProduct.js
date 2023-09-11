const puppeteer = require('puppeteer');

async function scrapeProduct(product_link) {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();

        await page.goto(product_link);
        await new Promise(r => setTimeout(r, 2000));

        const product_title = await page.evaluate(() => {
            const spanElement = document.querySelector('span#productTitle')
            return spanElement.innerText
        })

        const product_image = await page.evaluate(() => {
            const imgElement = document.querySelector('img#landingImage')
            return imgElement.getAttribute("src")
        })

        const product_rating = await page.evaluate(() => {
            const spanElement = document.querySelector('span.reviewCountTextLinkedHistogram')
            return spanElement.getAttribute("title")
        })

        const product_price = await page.evaluate(() => {
            let spanElement = document.querySelector("span.a-offscreen")

            if (spanElement === null) {
                spanElement = document.querySelector('span.a-price')
                const spanPriceElement = spanElement.querySelector('span')
                return spanPriceElement.innerText
            }

            return spanElement.innerText
        })

        const product_description = await page.evaluate(() => {
            const descripitonDivElement = document.querySelector('div#productDescription')
            let featuresDivElement = document.querySelector("div#feature-bullets")

            if (featuresDivElement === null) {
                featuresDivElement = document.querySelector("div.a-expander-content")
            }

            if (descripitonDivElement !== null && featuresDivElement !== null) {
                return descripitonDivElement.innerText + " " + featuresDivElement.innerText
            }

            if (featuresDivElement !== null && descripitonDivElement === null) {
                return featuresDivElement.innerText
            }

            if (featuresDivElement === null && descripitonDivElement !== null) {
                return descripitonDivElement.innerText
            }

            if (featuresDivElement === null && descripitonDivElement === null) {
                return null
            }
        })

        await browser.close();

        return {
            title: product_title,
            image: product_image,
            link: product_link,
            rating: Number(product_rating.split(" ")[0].trim()),
            price: Number(product_price.replace("$", "").trim()),
            description: (product_title + " " + product_description).replace(/\s+/g, ' ').replace(/[^\w\s]/g, '').replace(/\n/g, '').toLowerCase().trim()
        }
    } catch (error) {
        await browser.close();
        return null
    }
}

module.exports = scrapeProduct