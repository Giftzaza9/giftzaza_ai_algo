import time
import pandas as pd
import itertools
import re
import requests
import json
import math
from playwright.sync_api import sync_playwright, Playwright


def scrape_bloomingdales_pages(
    url="https://www.bloomingdales.com/shop/gifts?id=3948",
    filepath="Bloomingdales_product_links.json",
):
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
        print("Section:", eachsection)
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

        with open(filepath, "w", encoding="utf-8") as fw:
            json.dump(all_gift_links, fw)
        # break  # comment this after testing

    with open(filepath, "w", encoding="utf-8") as fw:
        json.dump(all_gift_links, fw)
    print("All Bloomingdales products are scraped!!")
    return all_gift_links


def get_token():
    url = "https://app.giftalia.ai/api/v1/auth/login"
    payload = json.dumps({"email": "giftzaza1081@gmail.com", "password": ""})
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.request("POST", url, headers=headers, data=payload).json()
        return response["tokens"]["access"]["token"]
    except:
        print("Validate Admin user creds in Mongodb to receive proper token!!")
        return None


def insert_bulk_products(all_gift_links, token, batch):
    for idx in range(math.ceil(len(all_gift_links) / batch)):
        loc = idx * batch
        all_product_links = list(set(all_gift_links[loc : loc + batch]))

        print("input urls:", len(all_product_links))
        post_product_url = "https://app.giftalia.ai/api/v1/products/analysis"
        payload = json.dumps({"product_links": all_product_links})
        Bearer_token = "Bearer " + token
        headers = {
            "Authorization": Bearer_token,
            "Content-Type": "application/json",
        }
        response = requests.request(
            "POST", post_product_url, headers=headers, data=payload
        )
        if response:
            print("insert_bulk_products response: ", response.text)


if __name__ == "__main__":
    filepath = "Bloomingdales_product_links.json"
    all_gift_links = scrape_bloomingdales_pages(
        url="https://www.bloomingdales.com/shop/gifts?id=3948",
        filepath=filepath,
    )
    token = get_token()

    with open(filepath) as json_data:
        all_gift_links = json.load(json_data)

    insert_bulk_products(all_gift_links, token, batch=20)
