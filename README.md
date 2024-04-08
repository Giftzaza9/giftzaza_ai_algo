# Giftalia

Giftalia is a free, AI-powered copilot tailored to help busy professionals discover thoughtful gifts for their loved ones.

## Steps to set-up AI.

### Step 1 :

After cloning the directory, edit ._env to .env file in the following folder.

```bash
backend/ai_recommendation/.env
```
Add following environment variables with values, please make sure that given credentials have access to the database.

```python
DATABASE_NAME = ""
DATABASE_USER = ""
DATABASE_PWD  = ""
```

### Step 2 :

After Adding required variables, you can initialize the ai docker container by running the following command from the 'root' - (giftzaza_ai_algo) folder.

using docker-compose :
```
 docker-compose -f docker-compose.ai.yml up --build
```  

## Scripts at root folder.
Scripts at root folder contains the scripts to ingest the products from Amazon abd Bloomingdales by scraping best seller page from "Amazon" and by scraping the gift page from "Bloomingdales".

specify "**url**" in both **Amazon_scraper.py** and **Bloomingdales_scarper.py** from which you want to scrape the products, And also Specify the "**Bearer Token**" for Authorization of API.
