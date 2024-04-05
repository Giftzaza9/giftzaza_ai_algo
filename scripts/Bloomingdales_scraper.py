import time
import pandas as pd
import itertools
import re
import requests
import json
from playwright.sync_api import sync_playwright, Playwright


if __name__ == "__main__":
    playwright = sync_playwright().start()
    browser_instance = playwright.chromium
    browser = browser_instance.launch(headless=False)
    context = browser.new_context()
    context.add_cookies(
        [
            {
                "name": "shippingCountry",
                "value": "US",
                "domain": ".bloomingdales.com",
                "path": "/",
            },
            {
                "name": "currency",
                "value": "USD",
                "domain": ".bloomingdales.com",
                "path": "/",
            },
        ]
    )
    page = context.new_page()
    url = "https://www.bloomingdales.com/shop/home/best-sellers?id=1002516"
    page.goto(url)
    page.wait_for_selector("ul.items.grid-x.grid-margin-x")
    links = page.evaluate(
        """() => {
                  links = Array.from(document.querySelector("ul.items.grid-x.grid-margin-x")
                  .querySelectorAll("a.productDescLink"))
                  .map((data) => { return "https://www.bloomingdales.com/" + data.getAttribute("href") })
                  return links
    }"""
    )
    with open("Bloomingdales_product_links.json", "w", encoding="utf-8") as fw:
        json.dump(links, fw)
    print(links)
    browser.close()


    post_product_url = "https://app.giftalia.ai/api/v1/products/analysis"
    payload = json.dumps({"product_links": links})
    Bearer_token = None
    headers = {
        "Authorization": Bearer_token,
        "Content-Type": "application/json",
    }
    response = requests.request("POST", post_product_url, headers=headers, data=payload)
    print(response.text)
