const puppeteer = require('puppeteer-extra');
// import puppeteer from 'puppeteer-extra';
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');

// plugin to use defaults (all tricks to hide puppeteer usage)
puppeteer.use(StealthPlugin());

// plugin to block all ads and trackers (saves bandwidth)
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
const { cookieSetterBD } = require('../utils/cookieSetterBD');
const { reorderThumbnail } = require('../utils/reorderThumbnail');
puppeteer.use(AdBlockerPlugin({ blockTrackers: true }));

const scrapeProduct = async (productLink, userId) => {
  // if (productLink.includes('nordstrom')) {
  //   const res = await NodestormScraper(productLink);
  //   return res;
  // } else
  if (productLink?.includes('bloomingdales')) {
    const res = await bloomingdaleScrapeProduct(productLink, userId);
    return res;
  } else if (productLink?.includes('amazon')) {
    const res = await AmazonScraper(productLink, userId);
    return res;
  } else return 'unknown source';
};

async function AmazonScraper(product_link, userId) {
  // const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  let blocked = false;
  try {
    const page = await browser.newPage();

    // Set a random user agent
    const userAgent = randomUseragent.getRandom();
    await page.setUserAgent(userAgent);

    await page.goto(product_link, { waitUntil: ['domcontentloaded', 'networkidle2'] });

    await page.waitForTimeout(1000);

    // Interact with the page
    await page.mouse.move(100, 100);
    await page.waitForTimeout(200);
    await page.mouse.move(200, 200);
    await page.waitForTimeout(500);

    blocked = await page.evaluate(() => {
      return document.body.innerText.includes('Type the characters you see in this image:');
    });
    // Try to reload the page
    if (blocked) {
      await page.waitForTimeout(2500);
      await page.mouse.move(100, 100);
      await page.waitForTimeout(200);
      await page.mouse.move(200, 200);
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyR');
      await page.keyboard.up('Control');
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle2'] });
    }
    blocked = await page.evaluate(() => {
      return document.body.innerText.includes('Type the characters you see in this image:');
    });
    // If blocked again throw error
    if (blocked) throw new Error('Amazon has found this activity as suspicious activity, please try again later.');

    let product_price = await page.evaluate(() => {
      let spanElement = document.querySelector('div#corePrice_feature_div span.a-offscreen');
      if (!spanElement) spanElement = document.querySelector('div#corePrice_desktop span.a-offscreen');
      if (!spanElement) spanElement = document.querySelector('div#corePrice_desktop span.aok-offscreen');
      if (!spanElement) spanElement = document.querySelector('div#corePriceDisplay_desktop_feature_div span.a-offscreen');
      if (!spanElement) spanElement = document.querySelector('div#corePriceDisplay_desktop_feature_div span.aok-offscreen');
      if (!spanElement)
        spanElement =
          document.querySelector('div#corePrice_desktop span.a-price-whole') +
          '.' +
          document.querySelector('div#corePrice_desktop span.a-price-fraction');
      return spanElement?.textContent || null;
    });

    if (!product_price) {
      // Wait for the location element to be visible and click it
      const locationButtonSelector = '#nav-global-location-popover-link';
      try {
        await page.waitForSelector(locationButtonSelector, { visible: true });
        await page.click(locationButtonSelector);
      } catch (error) {
        console.error(`Error finding or clicking location button: ${error}`);
        await browser.close();
        return;
      }

      // Wait for the input to appear and type in the new location
      const zipInputSelector = '#GLUXZipUpdateInput';
      try {
        await page.waitForSelector(zipInputSelector, { visible: true });
        await page.type(zipInputSelector, '90210'); // Example ZIP code
      } catch (error) {
        console.error(`Error finding or typing into zip code input: ${error}`);
        await browser.close();
        return;
      }

      // Click the apply button to set the new location
      const applyButtonSelector = '#GLUXZipUpdate';
      try {
        await page.click(applyButtonSelector);
      } catch (error) {
        console.error(`Error clicking the apply button: ${error}`);
        await browser.close();
        return;
      }

      // Wait for the update to complete
      await page.waitForTimeout(5000);

      product_price = await page.evaluate(() => {
        let spanElement = document.querySelector('div#corePrice_feature_div span.a-offscreen');
        if (!spanElement) spanElement = document.querySelector('div#corePrice_desktop span.a-offscreen');
        if (!spanElement) spanElement = document.querySelector('div#corePrice_desktop span.aok-offscreen');
        if (!spanElement) spanElement = document.querySelector('div#corePriceDisplay_desktop_feature_div span.a-offscreen');
        if (!spanElement)
          spanElement = document.querySelector('div#corePriceDisplay_desktop_feature_div span.aok-offscreen');
        if (!spanElement)
          spanElement =
            document.querySelector('div#corePrice_desktop span.a-price-whole') +
            '.' +
            document.querySelector('div#corePrice_desktop span.a-price-fraction');
        return spanElement?.textContent || null;
      });
    }

    if (!product_price) throw new Error('Unable to find the price, please try again later.');

    let isAmazonLuxury = false;

    let product_title = await page.evaluate(() => {
      const spanElement = document.querySelector('span#productTitle');
      return spanElement?.innerText;
    });

    if (!product_title) {
      product_title = await page.evaluate(() => {
        const spanElement = document.querySelector('span#productTitle');
        return spanElement?.innerText;
      });
    }

    // product_title will be undefined, if amazon luxury
    if (!product_title) {
      isAmazonLuxury = true;
      product_title = await page.evaluate(() => {
        brand = document.querySelector('a#bond-byLine-desktop');
        const spanElement = document.querySelector('span#bond-title-desktop');
        return brand && spanElement
          ? `${brand?.textContent} - ${spanElement?.textContent}`
          : spanElement
          ? spanElement?.innerText
          : null;
      });
    }

    // const thumbnails = await page.evaluate(() => {
    //   // good quality thumbnails are unavailable
    //   const imgs = Array.from(document.querySelectorAll('li > span > span > span > span > img'));
    //   return imgs.map((img) => img.getAttribute('src'));
    // });

    // await page.evaluate(() => {
    //   const imgContainer = document.querySelector('#main-image-container');
    //   const imgElements = imgContainer.querySelectorAll('img');
    //   const imgSrcArray = Array.from(imgElements).map((imgElement) => imgElement.getAttribute('src'));
    //   return imgSrcArray;
    // });

    const product_image = await page.evaluate(() => {
      const imgElement = document.querySelector('img#landingImage');
      return imgElement?.getAttribute('src');
    });

    const product_rating = await page.evaluate(() => {
      const spanElement = document.querySelector('span.reviewCountTextLinkedHistogram');
      return spanElement?.getAttribute('title') || null;
    });

    // const reviewCount = await page.evaluate(() => {
    //   const spanElement = document.querySelector('#acrCustomerReviewText')
    //   return Number(spanElement?.innerText?.replace(/[^0-9]/g,'')?.trim());
    // });

    const product_price_currency = await page.evaluate(() => {
      const inputElement = document.querySelector('input#currencyOfPreference');
      if (inputElement) return inputElement?.getAttribute('value');
      const spanElement = document.querySelector('a#icp-touch-link-cop > span.icp-color-base');
      if (spanElement) return spanElement?.textContent?.split(' ')?.[0];
      const divElement = document.querySelector('div#bundles_feature_div #bundles-card-state');
      if (divElement) return divElement?.getAttribute('data-currencyofpreference');
      return null;
    });

    const product_features = isAmazonLuxury
      ? await page.evaluate(() => {
          const bpEls = Array.from(document.querySelectorAll('div#bond-feature-bullets-desktop>ul>li>span>span'));
          return bpEls?.map((el) => el?.textContent);
        })
      : await page.evaluate(() => {
          let bpEls = Array.from(document.querySelectorAll('div#feature-bullets li span'));
          if (!bpEls?.length) bpEls = Array.from(document.querySelectorAll('div#productFactsDesktopExpander li span'));
          return bpEls?.map((el) => el?.textContent);
        });

    const product_description = isAmazonLuxury
      ? await page.evaluate(() => {
          const spanElement = document.querySelector('span.a-size-base.bondExpanderText');
          return spanElement?.textContent || null;
        })
      : await page.evaluate(() => {
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

    await browser.close();

    return {
      source: 'amazon',
      title: product_title,
      image: product_image,
      link: product_link,
      rating: product_rating ? Number(product_rating?.split(' ')?.[0]?.trim()) : 0,
      price:
        Number(product_price?.replace('$', '')?.replace(',', '')?.trim()) ||
        Number(product_price?.replace('US$', '')?.replace(',', '')?.trim()) ||
        -1,
      description: product_description,
      features: product_features,
      price_currency: product_price_currency ? product_price_currency : '',
      added_by: userId,
      thumbnails: [], // UNABLE TO ADD quality thumbnails
      blocked: blocked,
    };
  } catch (error) {
    console.error(error);
    await browser.close();
    if (blocked) return { blocked };
    return null;
  }
}

const bloomingdaleScrapeProduct = async (product_link, userId) => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    let page = await browser.newPage();
    await page.goto(product_link, { waitUntil: 'load', timeout: 0 });
    page = await cookieSetterBD(page);

    const textgetter = async (tagname) => {
      const element = await page.$(tagname);
      return (await element?.evaluate((el) => el.textContent.trim())) ?? null;
    };

    const sourcegetter = async (tagname) => {
      const element = await page.$(tagname);
      return (await element?.evaluate((el) => el.src)) ?? null;
    };

    const product_title = await textgetter('.brand-name-container');
    const product_description = await textgetter(
      `div.details-container div.details-content p[data-auto="product-description"]`
    );
    const product_features = await page.evaluate(() => {
      const bpEls = Array.from(document.querySelectorAll('div.details-container div.details-content li'));
      return bpEls?.map((el) => el?.textContent);
    });

    let product_price = await textgetter('.price-lg');
    let product_price_currency = await textgetter('.links-rail-currency');
    if (!product_price) {
      product_price = await textgetter('.final-price');
    }
    const product_image = await sourcegetter('picture[class="main-picture"] > img[src]');

    let product_rating = await textgetter('.product-header-reviews-count');
    // const review_count =
    //   Number((await textgetter('.product-header-reviews-container .link-body'))?.split(' ')?.[0]);

    let thumbnails = await page.evaluate(() => {
      const isUniqueNumber = (link) => {
        const uniqueNumbers = [];
        const match = link.match(/optimized\/(\d+)_fpx/);
        return match && !uniqueNumbers.includes(match[1]);
      };
      const getUniqueLinks = (imgSrcArray) => {
        const uniqueLinks = [];
        imgSrcArray.forEach((src) => {
          if (src && !uniqueLinks.includes(src) && isUniqueNumber(src)) {
            uniqueLinks.push(src);
          }
        });
        return uniqueLinks;
      };
      const imgElements = document.querySelectorAll('picture.main-picture > img');
      const imgSrcArray = Array.from(imgElements).map((imgElement) => imgElement.getAttribute('data-lazy-src'));
      return getUniqueLinks(imgSrcArray);
    });

    let containsNumber = /\d/.test(product_rating);
    if (!containsNumber) {
      product_rating = '0.0 rating';
    }
    if (!product_rating || product_rating == null) {
      product_rating = '0.0 rating';
    }

    if (product_image && thumbnails?.length > 0) thumbnails = reorderThumbnail(product_image, thumbnails);

    await browser.close();

    return {
      source: 'bloomingdales',
      title: product_title
        ?.replace(/\s+/g, ' ')
        ?.replace(/[^\w\s]/g, '')
        ?.replace(/\n/g, '')
        ?.trim(),
      price: parseFloat(product_price?.replace(/[^0-9.-]+/g, '')),
      image: product_image,
      link: product_link,
      rating: Number(product_rating?.split(' ')[0]?.trim()),
      description: product_description,
      features: product_features,
      price_currency: product_price_currency,
      added_by: userId,
      thumbnails: thumbnails,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

// const NodestormScraper = async (product_link) => {
//   // NOTE: Not working,
//   const browser = await puppeteer.launch({
//     headless: 'new',
//   });
//   try {
//     const page = await browser.newPage();

//     await page.goto(product_link, { waitUntil: 'domcontentloaded' });
//     await page.waitForSelector('h1.dls-t8nrr7', { timeout: 5000 });

//     const product_title = await page.evaluate(() => {
//       const h1Element = document.querySelector('h1.dls-t8nrr7');
//       if (h1Element) {
//         // Get the text content of the <h1> element
//         let titleText = h1Element.textContent.trim();

//         // Include the text content of each <sup> element in the title
//         const supElements = h1Element.querySelectorAll('sup');
//         if (supElements.length > 0) {
//           supElements.forEach((supElement) => {
//             titleText = titleText.replace(supElement.outerHTML, supElement.textContent.trim());
//           });
//         }

//         return titleText;
//       }
//       return null;
//     });

//     const product_description = await page.evaluate(() => {
//       const descriptionContainer = document.querySelector('.yI6jf');
//       if (descriptionContainer) {
//         // Get text content from <p> elements
//         const paragraphs = Array.from(descriptionContainer.querySelectorAll('p'));
//         const paragraphText = paragraphs.map((p) => p.textContent.trim()).join(' ');

//         // Get text content from <li> elements with <span>
//         const listItems = Array.from(descriptionContainer.querySelectorAll('.d13vj li.qRRG_ span'));
//         const listItemText = listItems.map((span) => span.textContent.trim()).join('\n');

//         return `${paragraphText}\n${listItemText}`;
//       }
//       return null;
//     });

//     // // const product_care = await textgetter('.d13vj');
//     const product_price = await page.evaluate(async () => {
//       const priceContainer = document.querySelector('div.yoYiG');
//       if (priceContainer) {
//         // Get text content from the <span> with class qHz0a
//         const spanElement = priceContainer.querySelector('span.qHz0a');
//         const priceText = spanElement?.textContent.trim() || null;

//         return priceText;
//       }
//       return null;
//     });

//     const product_image = await page.evaluate(() => {
//       let imageContainer = document.querySelector('img[class="LUNts qlmAV"]');
//       if (!imageContainer) imageContainer = document.querySelector('div#gallery-item-container-zoom-0 img');
//       if (imageContainer) return imageContainer?.getAttribute('src');
//       return null;
//     });

//     const product_rating = await page.evaluate(() => {
//       const ratingContainer = document.querySelector('div#product-page-review-stars');
//       if (ratingContainer) {
//         // Get text content from the <span> with class dls-1n7v84y
//         const spanElement = ratingContainer.querySelector('span.dls-1n7v84y');
//         const ratingText = spanElement?.textContent.trim() || null;

//         // Extract the rating text without brackets
//         const matches = ratingText.match(/\(([\d.]+)\)/);
//         return matches ? matches[1] : null;
//       }
//       return null;
//     });

//     await browser.close();

//     return {
//       source: 'nodestorm',
//       title: product_title,
//       price: product_price,
//       image: product_image,
//       link: product_link,
//       rating: product_rating,
//       description: product_description,
//       content: product_description,
//       addedBy: '',
//       thumbnails: [],
//       price_currency: '',
//     };
//   } catch (error) {
//     console.error(error);
//     await browser.close();
//     return null;
//   }
// };

async function AmazonLinkScraper(link) {
  const launchOptions = {
    args: [
      '--no-sandbox',
      '--disable-infobars',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--disable-features=site-per-process',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
    // headless: false,
  };
  const browser = await puppeteer.launch(launchOptions);
  try {
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    await page.reload();

    const product_links = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('a.a-link-normal.s-no-outline'));
      return els?.map((el) => el?.href)?.filter((href) => href);
    });

    await browser.close();

    return {
      product_links,
    };
  } catch (error) {
    console.error(error);
    await browser.close();
    return null;
  }
}

module.exports = { AmazonScraper, bloomingdaleScrapeProduct, scrapeProduct, AmazonLinkScraper };
