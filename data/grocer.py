import numpy as np
import pandas as pd
import requests as requests
from bs4 import BeautifulSoup

#Trader Joe's info (from Chicago)
"""url = 'https://traderjoesprices.com/'
page = requests.get(url)

soup = BeautifulSoup(page.content, "html.parser")
prices = soup.find_all('tbody')[1]
results = prices.find_all('tr')

tjData = []
for row in results:
    info = row.find_all('td')
    if info:
        name = info[0].find('a').text.strip()
        price = info[1].text.strip()
        tjData.append(['traderjoes', '2025 Bond St', name, price])

tjDF = pd.DataFrame(tjData, columns=['store', 'address', 'item', 'total_price'])
tjDF.to_csv('traderjoes_pricing.csv', index=False)"""


#Target info

#Walmart info

#Wegman's info

#Kroger and Harris Teeter info
import json

with open('data.json', 'r') as file:
    jsList = file.read()

itemList = json.loads(jsList)
print(itemList)

kgDF = pd.DataFrame(itemList, columns=['store', 'address', 'item', 'total_price'])
kgDF.to_csv('product_pricing/kroger_pricing.csv', index=False)


#Complete info
tjDF = pd.read_csv('product_pricing/traderjoes_pricing.csv')
newkgDF = pd.read_csv('product_pricing/kroger_pricing.csv')

completeDF = pd.concat([newkgDF, tjDF])
completeDF.to_csv('product_pricing/complete_pricing.csv', index=False)

print("Items logged successfully.")