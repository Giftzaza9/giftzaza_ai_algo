import time
import pandas as pd
import itertools
import re
import requests
import json
import math
from playwright.sync_api import sync_playwright, Playwright


def clean_amazon_link(link):
    p_id = re.search(r"\/dp\/(\w{10})|\/gp\/product\/(\w{10})", link)
    if p_id:
        p_id = p_id.groups()
        asin = p_id[0] if p_id[0] else p_id[1]
        return f"https://www.amazon.com/dp/{asin}/"
    return None


def get_dep_name(link):
    dep_name = re.search(r"amazon\.com\/(.*)\/zgbs", link)
    if dep_name:
        dep_name = str(dep_name.groups()[0])
    else:
        dep_name = "not_captured"
    return dep_name


def scrape_bestseller_departement(page, url):
    page.goto(url)
    time.sleep(2)
    page.goto(url)
    dep_group = page.query_selector_all('div[role="group"]')
    all_links = []
    for i in dep_group:
        div_link = i.query_selector_all('div[role="treeitem"]')
    for i in div_link:
        all_links.append(i.query_selector("a").get_attribute("href"))
    main_web = "https://www.amazon.com"
    all_links = list(map(lambda each: main_web + each, all_links))
    df = pd.DataFrame(all_links, columns=["dep_links"])
    df["dep_names"] = df["dep_links"].apply(lambda each_link: get_dep_name(each_link))
    return df


def scrape_department_products(page, df, affiliate_id=""):
    each_dep = []
    dep_prod_links = {}
    main_web = "https://www.amazon.com"
    affiliate_tag = f"tag={affiliate_id}"
    for idx in range(df.shape[0]):
        page.goto(df.iloc[idx]["dep_links"])
        time.sleep(2)
        page.reload()
        time.sleep(2)
        prod_div = page.query_selector_all("div[id='gridItemRoot']")
        for i in range(5):  # make the range as long as needed
            page.mouse.wheel(0, 15000)
            time.sleep(2)
        time.sleep(2)
        prod_links = []
        for i in prod_div:
            prod_links.append(i.query_selector("a[role='link']").get_attribute("href"))
        prod_links = list(map(lambda each: main_web + each, prod_links))
        print(prod_links)
        print("\n", len(prod_links))
        # prod_links = list(map(clean_amazon_link, prod_links))
        prod_links = list(filter(lambda each_link: each_link != None, prod_links))
        if bool(affiliate_id):
            add_affiliate = lambda each_link: (
                each_link + "&" + affiliate_tag
                if each_link.find("?") != -1
                else each_link + "?" + affiliate_tag
            )
            prod_links = list(map(add_affiliate, prod_links))
        each_dep.append(prod_links)
        dep_prod_links.update({df.iloc[idx]["dep_names"]: prod_links})
    amazon_links = list(itertools.chain(*each_dep))
    return amazon_links, dep_prod_links


if __name__ == "__main__":
    playwright = sync_playwright().start()
    browser_instance = playwright.chromium
    browser = browser_instance.launch(headless=False)
    page = browser.new_page()
    bestseller_url = "https://www.amazon.com/Best-Sellers/zgbs?ref=CG_ac_ss_230713_Inspiration_bestsellers"
    affiliate_id = "giftalia-20"
    considered_dep = [
        "Best-Sellers-Arts-Crafts-Sewing",
        "Best-Sellers-Audible-Books-Originals",
        "Best-Sellers-Beauty-Personal-Care",
        "best-sellers-books-Amazon",
        "best-sellers-camera-photo",
        "best-sellers-music-albums",
        "Best-Sellers-Clothing-Shoes-Jewelry",
        "Best-Sellers-Collectible-Coins",
        "Best-Sellers-Digital-Music",
        "Best-Sellers-Electronics",
        "Best-Sellers-Entertainment-Collectibles",
        "Best-Sellers-Gift-Cards",
        "Best-Sellers-Grocery-Gourmet-Food",
        "Best-Sellers-Handmade-Products",
        "Best-Sellers-Health-Household",
        "Best-Sellers-Home-Kitchen",
        "Best-Sellers-Kitchen-Dining",
        "best-sellers-movies-TV-DVD-Blu-ray",
        "Best-Sellers-Musical-Instruments",
        "Best-Sellers-Patio-Lawn-Garden",
        "Best-Sellers-Sports-Outdoors",
        "Best-Sellers-Sports-Collectibles",
        "Best-Sellers-Tools-Home-Improvement",
        "Best-Sellers-Toys-Games",
        "Best-Sellers-Unique-Finds",
        "best-sellers-video-games",
    ]
    df = scrape_bestseller_departement(page=page, url=bestseller_url)
    df = df[df["dep_names"].isin(considered_dep)]
    df.reset_index(drop=True, inplace=True)
    all_product_links, dep_product_links = scrape_department_products(
        page, df, affiliate_id=affiliate_id
    )
    with open("amazon_all_product_links.json", "w", encoding="utf-8") as fw:
        json.dump(all_product_links, fw)
    with open("amazon_dep_product_links.json", "w", encoding="utf-8") as fw:
        json.dump(dep_product_links, fw)

    ### Posting request to server to add products to collection
    n = 15
    for key in dep_product_links:
        all_product_links = dep_product_links[key]
        for idx in range(math.ceil(len(all_product_links) / n)):
            loc = idx * n
            list_prod_links = all_product_links[loc : loc + 15]
            print(list_prod_links)
            post_product_url = "https://app.giftalia.ai/api/v1/products/analysis"
            payload = json.dumps({"product_links": all_product_links})
            Bearer_token = "Bearer " + ""
            headers = {
                "Authorization": Bearer_token,
                "Content-Type": "application/json",
            }
            response = requests.request("POST", post_product_url, headers=headers, data=payload)
            print(response.text)
