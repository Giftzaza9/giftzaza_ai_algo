import time
import pandas as pd
import itertools
import re
import requests
import json
import math
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
    url = "https://www.bloomingdales.com/shop/gifts?id=3948"
    page.goto(url)
    all_gift_section = page.evaluate(
        """() => {
                    links = Array.from(document.querySelector("ul.category-wrapper").querySelectorAll("a")).map((data) => {return data.getAttribute("href")})
                    return links
    }"""
    )
    browser.close()
    all_gift_links = []
    for eachsection in all_gift_section:
        time.sleep(5)
        try:
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
            page.goto(eachsection)
            page.wait_for_selector("ul.items.grid-x.grid-margin-x")
            links = page.evaluate(
                """() => {
                        links = Array.from(document.querySelector("ul.items.grid-x.grid-margin-x")
                        .querySelectorAll("a.productDescLink"))
                        .map((data) => { return "https://www.bloomingdales.com/" + data.getAttribute("href") })
                        return links
            }"""
            )
            all_gift_links.extend(links)
            browser.close()
        except:
            browser.close()
            pass
    with open("Bloomingdales_product_links.json", "w", encoding="utf-8") as fw:
        json.dump(all_gift_links, fw)
    n = 15
    for idx in range(math.ceil(len(all_gift_links) / n)):
        loc = idx * n
        all_product_links = all_gift_links[loc : loc + 15]
        print(all_product_links)
        post_product_url = "https://app.giftalia.ai/api/v1/products/analysis"
        payload = json.dumps({"product_links": all_product_links})
        Bearer_token = "Bearer " + ""
        headers = {
            "Authorization": Bearer_token,
            "Content-Type": "application/json",
        }
        response = requests.request("POST", post_product_url, headers=headers, data=payload)
        print(response.text)
