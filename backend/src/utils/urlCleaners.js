/**
 * Removes extra info from the URL and truncates to a standard URL
 * @param {string} originalURL URL that needs to be truncated
 * @returns truncated URL
 */
function amazonUrlCleaner(originalURL) {
  try {
    const url = new URL(originalURL);

    // Check if the hostname is amazon.com
    if (url.hostname === 'www.amazon.com' || url.hostname === 'amazon.com') {
      // Check if the pathname contains "/dp/" or "/gp/product/"
      if (url.pathname.includes('/dp/') || url.pathname.includes('/gp/product/')) {
        // Extract ASIN from the pathname
        const asinMatch = url.pathname.match(/\/dp\/(\w{10})|\/gp\/product\/(\w{10})/);
        const asin = asinMatch ? asinMatch[1] || asinMatch[2] : null;
        const affiliate = url.pathname.includes('?') ? "&tag=giftalia-20" : "?tag=giftalia-20";

        // Return the reconstructed Amazon URL
        if (asin) {
          return `https://www.amazon.com/dp/${asin}${affiliate}`;
        }
      }
    }
  } catch (error) {
    // Handle invalid URLs or other errors
    console.error('Error extracting Amazon URL:', error.message);
  }
}

/**
 * Removes extra info from the URL and truncates to a standard URL
 * @param {string} originalURL URL that needs to be truncated
 * @returns truncated URL
 */
function bloomingdaleUrlCleaner(originalURL) {
  try {
    const urlObject = new URL(originalURL);
    const searchParams = new URLSearchParams(urlObject.search);

    // Check if the "ID" parameter is present in the URL
    if (searchParams.has('ID')) {
      // Create a new URL with only the protocol, host, pathname, and the "ID" parameter
      const truncatedUrl = `${urlObject.origin}${urlObject.pathname}?ID=${searchParams.get('ID')}`;
      return truncatedUrl;
    } else {
      // If "ID" parameter is not present, return the original URL
      return originalURL;
    }
  } catch (error) {
    // Handle invalid URLs
    console.error('Invalid URL:', error.message);
    return null;
  }
}

module.exports = { amazonUrlCleaner, bloomingdaleUrlCleaner };
