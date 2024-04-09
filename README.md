# Giftalia

Giftalia is a free, AI-powered copilot tailored to help busy professionals discover thoughtful gifts for their loved ones.

# Components 
- Frontend
- Backend
- AI

## Steps to set-up Frontend.

### Step 1 :

After cloning the directory, add environment variablse in .env file.

```bash
frontend/.env
```

### Step 2 :

After Adding required variables, install the dependencies.

```bash
npm install
```
### OR
```bash
npm install --force
```

### Step 3  :

Run the application using - 
```bash
npm start
```

## Steps to set-up Backend.

### Step 1  :

After cloning the repo, Install the dependencies:

```bash
npm install
```
### OR
```bash
npm install --force
```

### Step 2  :

Set the environment variables, add environment variables in .env file:

```bash
backend/.env
```

### Step 3  :

Running locally:

```bash
yarn run dev
```


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



## Steps to start application on instance.

### Structure :-
```
ubuntu : ls
ai_giftalia  --  AI folder
ubuntu : cd /var/www/giftzaza_ai_algo  -- Frontend,Backend folder
```

### Step 1 : Start Frontend

Go to frontend folder
```
cd/frontend 
tmux ls - check tmux if running then attach that else create new session
rm -rf build - delete current build
npm run build - make new build
serve -s build - run the build
Detech tmux after frontend is runnig
```

### Step 12 : Start Backend

Go to backend folder
```
cd/backend
pm2 status - check if service is running 
pm2 start src/index.js - Run backend if service is not running
pm2 restart 1 - Restarting the backend
```

### Step 3 : Start AI

Go to AI folder after seeing the above structure 
```
ai_giftalia> cd giftzaza_ai_algo - Go to code folder 
docker-compose -f docker-compose.ai.yml up -d - For running AI
```
