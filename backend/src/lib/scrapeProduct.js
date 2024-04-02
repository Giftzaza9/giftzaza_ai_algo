const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// plugin to use defaults (all tricks to hide puppeteer usage)
puppeteer.use(StealthPlugin());

// plugin to block all ads and trackers (saves bandwidth)
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdBlockerPlugin({ blockTrackers: true }));

const scrapeProduct = async (productLink, userId) => {
  if (productLink.includes('nordstrom')) {
    const res = await NodestormScraper(productLink);
    return res;
  } else if (productLink.includes('bloomingdales')) {
    const res = await bloomingdaleScrapeProduct(productLink, userId);
    return res;
  } else if (productLink.includes('amazon')) {
    const res = await AmazonScraper(productLink, userId);
    return res;
  } else return 'unknown source';
};

async function AmazonScraper(product_link, userId) {
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();

    await page.goto(product_link, { waitUntil: 'domcontentloaded' });

    const product_title = await page.evaluate(() => {
      const spanElement = document.querySelector('span#productTitle');
      return spanElement?.innerText;
    });

    const thumbnails = await page.evaluate(() => {
      const imgContainer = document.querySelector('#main-image-container');
      const imgElements = imgContainer.querySelectorAll('img');
      const imgSrcArray = Array.from(imgElements).map((imgElement) => imgElement.getAttribute('src'));
      return imgSrcArray;
    });

    console.log(thumbnails)

    const product_image = await page.evaluate(() => {
      const imgElement = document.querySelector('img#landingImage');
      return imgElement?.getAttribute('src');
    });

    const product_rating = await page.evaluate(() => {
      const spanElement = document.querySelector('span.reviewCountTextLinkedHistogram');
      return spanElement?.getAttribute('title');
    });

    const product_price_currency = await page.evaluate(() => {
      const inputElement = document.querySelector('input#currencyOfPreference');
      if (inputElement) return inputElement?.getAttribute('value');
      const spanElement = document.querySelector('a#icp-touch-link-cop > span.icp-color-base');
      if (spanElement) return spanElement?.textContent?.split(' ')?.[0];
      return null;
    });

    const product_price = await page.evaluate(() => {
      let spanElement = document.querySelector('div#corePrice_feature_div span.a-offscreen');
      if (!spanElement) spanElement = document.querySelector('div#corePrice_desktop span.a-offscreen');
      return spanElement?.textContent || null;
    });

    const product_description = await page.evaluate(() => {
      const descriptionDivElement = document.querySelector('div#productDescription');
      let featuresDivElement = document.querySelector('div#feature-bullets');

      if (featuresDivElement === null) {
        featuresDivElement = document.querySelector('div.a-expander-content');
      }

      if (descriptionDivElement !== null && featuresDivElement !== null) {
        return descriptionDivElement?.innerText + ' ' + featuresDivElement?.innerText;
      }

      if (featuresDivElement !== null && descriptionDivElement === null) {
        return featuresDivElement?.innerText;
      }

      if (featuresDivElement === null && descriptionDivElement !== null) {
        return descriptionDivElement?.innerText;
      }

      if (featuresDivElement === null && descriptionDivElement === null) {
        return null;
      }
    });
    console.log('🚀 ~ constproduct_description=awaitpage.evaluate ~ product_description:', product_description)

    await browser.close();

    return {
      source: 'amazon',
      title: product_title,
      image: product_image,
      link: product_link,
      rating: Number(product_rating?.split(' ')?.[0]?.trim()),
      price: Number(product_price?.replace('$', '')?.trim()) || Number(product_price?.replace('US$', '')?.trim()) || -1,
      description: product_description
        ?.replace(/\s+/g, ' ')
        ?.replace(/[^\w\s]/g, '')
        ?.replace(/\n/g, '')
        ?.toLowerCase()
        ?.trim(),
      price_currency: product_price_currency,
      added_by: userId,
    };
  } catch (error) {
    console.error(error);
    await browser.close();
    return null;
  }
}

const bloomingdaleScrapeProduct = async (product_link, userId) => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto(product_link, { waitUntil: 'load', timeout: 0 });
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
    let product_price_currency = await textgetter('.links-rail-currency');
    if (!product_price) {
      product_price = await textgetter('.final-price');
    }
    const product_image = await sourcegetter('picture[class="main-picture"] > img[src]');

    let product_rating = await textgetter('.product-header-reviews-count');

    const thumbnails = await page.evaluate(() => {
      const isUniqueNumber = (link) => {
        const uniqueNumbers = [];
        const match = link.match(/optimized\/(\d+)_fpx/);
        return match && !uniqueNumbers.includes(match[1]);
      }
      const getUniqueLinks = (imgSrcArray) => {
        const uniqueLinks = [];
        imgSrcArray.forEach((src) => {
          if (src && !uniqueLinks.includes(src) && isUniqueNumber(src)) {
            uniqueLinks.push(src);
          }
        });
        return uniqueLinks;
      }
      const imgElements = document.querySelectorAll('picture.main-picture > img');
      const imgSrcArray = Array.from(imgElements).map((imgElement) => imgElement.getAttribute('data-lazy-src'));
      return getUniqueLinks(imgSrcArray)
    });

    let containsNumber = /\d/.test(product_rating);
    if (!containsNumber) {
      product_rating = '0.0 rating';
    }
    if (!product_rating || product_rating == null) {
      product_rating = '0.0 rating';
    }

    await browser.close();

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
      price_currency: product_price_currency,
      added_by: userId,
      thumbnails: thumbnails
    };
  } catch (error) {
    console.error(error)
    return null;
  }
};


const NodestormScraper = async (product_link) => {
  // NOTE: Not working,
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  try {
    const page = await browser.newPage();

    await page.goto(product_link, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1.dls-t8nrr7', { timeout: 5000 });

    const product_title = await page.evaluate(() => {
      const h1Element = document.querySelector('h1.dls-t8nrr7');
      if (h1Element) {
        // Get the text content of the <h1> element
        let titleText = h1Element.textContent.trim();

        // Include the text content of each <sup> element in the title
        const supElements = h1Element.querySelectorAll('sup');
        if (supElements.length > 0) {
          supElements.forEach((supElement) => {
            titleText = titleText.replace(supElement.outerHTML, supElement.textContent.trim());
          });
        }

        return titleText;
      }
      return null;
    });

    const product_description = await page.evaluate(() => {
      const descriptionContainer = document.querySelector('.yI6jf');
      if (descriptionContainer) {
        // Get text content from <p> elements
        const paragraphs = Array.from(descriptionContainer.querySelectorAll('p'));
        const paragraphText = paragraphs.map((p) => p.textContent.trim()).join(' ');

        // Get text content from <li> elements with <span>
        const listItems = Array.from(descriptionContainer.querySelectorAll('.d13vj li.qRRG_ span'));
        const listItemText = listItems.map((span) => span.textContent.trim()).join('\n');

        return `${paragraphText}\n${listItemText}`;
      }
      return null;
    });

    // // const product_care = await textgetter('.d13vj');
    const product_price = await page.evaluate(async () => {
      const priceContainer = document.querySelector('div.yoYiG');
      if (priceContainer) {
        // Get text content from the <span> with class qHz0a
        const spanElement = priceContainer.querySelector('span.qHz0a');
        const priceText = spanElement?.textContent.trim() || null;

        return priceText;
      }
      return null;
    });

    const product_image = await page.evaluate(() => {
      let imageContainer = document.querySelector('img[class="LUNts qlmAV"]');
      if (!imageContainer) imageContainer = document.querySelector('div#gallery-item-container-zoom-0 img');
      if (imageContainer) return imageContainer?.getAttribute('src');
      return null;
    });

    const product_rating = await page.evaluate(() => {
      const ratingContainer = document.querySelector('div#product-page-review-stars');
      if (ratingContainer) {
        // Get text content from the <span> with class dls-1n7v84y
        const spanElement = ratingContainer.querySelector('span.dls-1n7v84y');
        const ratingText = spanElement?.textContent.trim() || null;

        // Extract the rating text without brackets
        const matches = ratingText.match(/\(([\d.]+)\)/);
        return matches ? matches[1] : null;
      }
      return null;
    });

    await browser.close();

    return {
      source: 'nodestorm',
      title: product_title,
      price: product_price,
      image: product_image,
      link: product_link,
      rating: product_rating,
      description: product_description,
    };
  } catch (error) {
    console.error(error);
    await browser.close();
    return null;
  }
};

module.exports = { AmazonScraper, bloomingdaleScrapeProduct, NodestormScraper, scrapeProduct };
