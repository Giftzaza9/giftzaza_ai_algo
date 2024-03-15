module.exports.cookieSetterBD = async (page) => {
  let reloadRequired = false;
  const currentCookies = await page.cookies();
  const cookiesToReplace = [
    { name: 'shippingCountry', value: 'US' },
    { name: 'currency', value: 'USD' },
  ];

  for (const cookie of cookiesToReplace) {
    const matchingCookie = currentCookies.find((c) => c.name === cookie.name && c.value !== cookie.value);
    if (matchingCookie) {
      reloadRequired = true;
      await page.deleteCookie({ name: cookie.name });
      await page.setCookie({
        name: cookie.name,
        value: cookie.value,
        domain: matchingCookie.domain,
        path: matchingCookie.path,
        expires: matchingCookie.expires,
        secure: matchingCookie.secure,
        httpOnly: matchingCookie.httpOnly,
      });
    }
  }
  if (reloadRequired) await page.reload({ waitUntil: 'load', timeout: 0 });
  return page;
};
