# !pip install gspread

# import the library
import gspread
import csv
from mongo_conn import Mongodb_Obj

collection_name = "giftalia_prod"

products = Mongodb_Obj.get_collection_as_dataframe(collection_name, "products")
print("products", products.shape, products["title"].drop_duplicates().shape)
print(products.columns)
users = Mongodb_Obj.get_collection_as_dataframe(collection_name, "users")
print("users", users.shape)
# users.head(1)

products = products.merge(
    users[["_id", "email"]],
    how="left",
    left_on="added_by",
    right_on="_id",
    suffixes=(None, "_y"),
).drop(columns=["_id_y"])

products = products[products['is_active']==True]
products[
        [
            "_id",
            "source",
            "views",
            "tags",
            "title",
            "price",
            "link",
            "rating",
            "description",
            "gptTagging",
            "curated",
            "updatedAt",
            "hil",
            "createdAt",
            "price_currency",
            "added_by", "email"
        ]
].to_csv("/home/ubuntu/scripts/products.csv", index=False)

# import Google Sheets API credentials
service_account = gspread.service_account(
    filename="/home/ubuntu/scripts/giftzaza-b680aa3961d5.json"
)
# open a spreadsheet by its title
sheet = service_account.open("Giftalia - Data Access")


# reference : https://readthedocs.org/projects/gspread/downloads/pdf/latest/
# first delete and then update (later append can be done based on date)
sheet_name = "Products"
# define the worksheet by its name (in this case "Sheet 1")
try:
    wks = sheet.worksheet(sheet_name)
    sheet.del_worksheet(wks)
except:
    pass

sheet.add_worksheet(sheet_name, 10, 10)
csvFile = "/home/ubuntu/scripts/products.csv"
sheet.values_update(
    sheet_name,
    params={"valueInputOption": "USER_ENTERED"},
    body={"values": list(csv.reader(open(csvFile)))},
)


import warnings

warnings.filterwarnings("ignore")
import pandas as pd

categories = {
    "gender": ["Male", "Female"],
    "age_category": ["Under 12", "12 - 18", "18 - 25", "25 - 45", "45 - 65", "65 +"],
    "interest": [
        "Fitness and Wellness",
        "Tech and Gadgets",
        "Fashion and Accessories",
        "Books and Learning",
        "Travel and Adventure",
        "Food and Cooking",
        "Arts and Crafts",
        "Music and Entertainment",
        "Outdoor and Nature",
        "Beauty and Self-Care",
        "Home and Decor",
        "Sports and Hobbies",
        "Pets and Animal Lovers",
        "Art and Culture",
        "Social Impact and Charity",
        "Spirituality",
    ],
    "occasion": [
        "Birthdays",
        "Anniversaries",
        "Holidays",
        "Promotions and Achievements",
        "Weddings",
        "Newborns",
        "Retirements",
        "Housewarmings",
        "Graduations",
        "Valentine's Day",
        "Appreciation",
        "Get Well Soon",
        "Thank You Gifts",
        "Apologies",
    ],
    "relationship": [
        "Spouse or Significant Other",
        "Girlfriend",
        "Child",
        "Parent",
        "Grand Parent",
        "Friend",
        "Colleague",
    ],
    "style": [
        "Classic and Timeless",
        "Comfortable Yet Stylish",
        "Premium Brands",
        "Minimalistic",
        "Practical",
        "Chill",
        "Bougie",
    ],
}



flatten_categories = list()
for v in categories.values():
    flatten_categories.extend(v)
print(len(flatten_categories))

summary_df = pd.DataFrame(columns=["product_id"] + flatten_categories)
# print(len(summary_df.columns))
cats = len(flatten_categories)

for i in range(len(products)):
    summary_df.loc[i] = [str(products["_id"][i])] + [0] * cats
    for val in products["tags"][i]:
        if val in flatten_categories:
            summary_df[val][i] = 1

csvFile = "/home/ubuntu/scripts/products_summary.csv"
summary_df.to_csv(csvFile, index=False)
# summary_df
summary_df[flatten_categories].sum().reset_index(name="product_count")


# first delete and then update (later append can be done based on date)
sheet_name = "Products_tags"
# define the worksheet by its name (in this case "Sheet 1")
try:
    wks = sheet.worksheet(sheet_name)
    sheet.del_worksheet(wks)
except:
    pass

sheet.add_worksheet(sheet_name, 10, 10)
sheet.values_update(
    sheet_name,
    params={"valueInputOption": "USER_ENTERED"},
    body={"values": list(csv.reader(open(csvFile)))},
)
