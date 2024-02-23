function amazonUrlCleaner(originalURL) {
    try {
      const url = new URL(originalURL);
      
      // Check if the hostname is amazon.com
      if (url.hostname === "www.amazon.com" || url.hostname === "amazon.com") {
        // Check if the pathname contains "/dp/" or "/gp/product/"
        if (url.pathname.includes("/dp/") || url.pathname.includes("/gp/product/")) {
          // Extract ASIN from the pathname
          const asinMatch = url.pathname.match(/\/dp\/(\w{10})|\/gp\/product\/(\w{10})/);
          const asin = asinMatch ? asinMatch[1] || asinMatch[2] : null;
  
          // Return the reconstructed Amazon URL
          if (asin) {
            return `https://www.amazon.com/dp/${asin}`;
          }
        }
      }
    } catch (error) {
      // Handle invalid URLs or other errors
      console.error("Error extracting Amazon URL:", error.message);
    }
  }

module.exports = amazonUrlCleaner;