const puppeteer = require('puppeteer-extra');
const amazonpuppeteer = require('puppeteer');
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const scrapeProduct = async (productlink) => {
  if (productlink.includes('nordstrom')) {
    const res = await NodestormScraper(productlink);
    return res;
  } else if (productlink.includes('bloomingdales')) {
    const res = await bloomingdalescrapeProduct(productlink);
    return res;
  } else if (productlink.includes('amazon')) {
    const res = await AmazonScraper(productlink);
    return res;
  } else return 'unknown source';
};

async function AmazonScraper(product_link) {
  const browser = await amazonpuppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();

    await page.goto(product_link);
    await new Promise((r) => setTimeout(r, 2000));

    const product_title = await page.evaluate(() => {
      const spanElement = document.querySelector('span#productTitle');
      return spanElement.innerText;
    });

    const product_image = await page.evaluate(() => {
      const imgElement = document.querySelector('img#landingImage');
      return imgElement.getAttribute('src');
    });

    const product_rating = await page.evaluate(() => {
      const spanElement = document.querySelector('span.reviewCountTextLinkedHistogram');
      return spanElement.getAttribute('title');
    });

    const product_price = await page.evaluate(() => {
      let spanElement = document.querySelector('span.a-offscreen');
      console.log(spanElement);
      if (spanElement === null) {
        spanElement = document.querySelector('span.a-price');
        const spanPriceElement = spanElement.querySelector('span');
        return spanPriceElement.innerText;
      }

      return spanElement.innerText;
    });

    const product_description = await page.evaluate(() => {
      const descripitonDivElement = document.querySelector('div#productDescription');
      let featuresDivElement = document.querySelector('div#feature-bullets');

      if (featuresDivElement === null) {
        featuresDivElement = document.querySelector('div.a-expander-content');
      }

      if (descripitonDivElement !== null && featuresDivElement !== null) {
        return descripitonDivElement.innerText + ' ' + featuresDivElement.innerText;
      }

      if (featuresDivElement !== null && descripitonDivElement === null) {
        return featuresDivElement.innerText;
      }

      if (featuresDivElement === null && descripitonDivElement !== null) {
        return descripitonDivElement.innerText;
      }

      if (featuresDivElement === null && descripitonDivElement === null) {
        return null;
      }
    });

    await browser.close();

    return {
      source: 'amazon',
      title: product_title,
      image: product_image,
      link: product_link,
      rating: Number(product_rating.split(' ')[0].trim()),
      price: Number(product_price.replace('$', '').trim()) || Number(product_price.replace('US$', '').trim()),
      description: (product_title + ' ' + product_description)
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/\n/g, '')
        .toLowerCase()
        .trim(),
    };
  } catch (error) {
    await browser.close();
    return null;
  }
}

const bloomingdalescrapeProduct = async (product_link) => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  console.log('browser started');
  try {
    const page = await browser.newPage();
    const response = await page.goto(product_link, { waitUntil: 'load', timeout: 0 });
    const textgetter = async (tagname) => {
      const element = await page.$(tagname);
      return (await element?.evaluate((el) => el.textContent.trim())) ?? null;
    };

    const sourcegetter = async (tagname) => {
      const element = await page.$(tagname);
      return (await element?.evaluate((el) => el.src)) ?? null;
    };

    const product_title = await textgetter('.brand-name-container');
    const product_details = await textgetter('.details-content');
    let product_price = await textgetter('.price-lg');
    if (!product_price) {
      product_price = await textgetter('.final-price');
    }
    const product_image = await sourcegetter('picture[class="main-picture"] > img[src]');

    let product_rating = await textgetter('.product-header-reviews-count');
    console.log('rating', product_rating);
    let containsNumber = /\d/.test(product_rating);
    if (!containsNumber) {
      product_rating = '0.0 rating';
    }
    if (!product_rating || product_rating == null) {
      product_rating = '0.0 rating';
    }
    console.log('rating', product_rating);
    await browser.close();
    console.log({
      title: product_title
        ?.replace(/\s+/g, ' ')
        ?.replace(/[^\w\s]/g, '')
        ?.replace(/\n/g, '')
        ?.trim(),
      price: product_price,
      image: product_image,
      link: product_link,
      description: (product_title + ' ' + product_details)
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/\n/g, '')
        .toLowerCase()
        .trim(),
    });
    return {
      source: 'bloomingdale',
      title: product_title
        ?.replace(/\s+/g, ' ')
        ?.replace(/[^\w\s]/g, '')
        ?.replace(/\n/g, '')
        ?.trim(),
      price: parseFloat(product_price?.replace(/[^0-9.-]+/g, '')),
      image: product_image,
      link: product_link,
      rating: Number(product_rating?.split(' ')[0]?.trim()),
      description: (product_title + ' ' + product_details)
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/\n/g, '')
        .toLowerCase()
        .trim(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const NodestormScraper = async (product_link) => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    console.log(product_link);
    const page = await browser.newPage();

    await page.goto(product_link, { waitUntil: 'networkidle0', timeout: 0 });
    const textgetter = async (tagname) => {
      const element = await page.$(tagname);
      return (await element?.evaluate((el) => el)) ?? null;
    };

    const sourcegetter = async (tagname) => {
      const element = await page.$(tagname);
      return (await element?.evaluate((el) => el.src)) ?? null;
    };

    const product_title = await textgetter('.dls-t8nrr7');

    const product_details = await textgetter('.dls-1n7v84y');
    const product_care = await textgetter('.d13vj');
    let product_price = await textgetter('.qHz0a');
    if (!product_price) {
      product_price = await textgetter('.final-price');
    }
    const product_image = await sourcegetter('img[class="LUNts qlmAV"] > img[src]');

    const product_rating = await textgetter('.dls-1n7v84y');
    await browser.close();
    return {
      title: product_title
        ?.replace(/\s+/g, ' ')
        ?.replace(/[^\w\s]/g, '')
        ?.replace(/\n/g, '')
        ?.trim(),
      price: product_price,
      image: product_image,
      link: product_link,
      rating: product_rating,
      description: (product_title + ' ' + product_details)
        ?.replace(/\s+/g, ' ')
        ?.replace(/[^\w\s]/g, '')
        ?.replace(/\n/g, '')
        ?.toLowerCase()
        ?.trim(),
    };
  } catch (error) {
    await browser.close();
    console.log(error);
    return null;
  }
};

module.exports = { AmazonScraper, bloomingdalescrapeProduct, NodestormScraper, scrapeProduct };
