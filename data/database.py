#set up database
import sqlite3

conn = sqlite3.connect('./product_pricing.db')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS product_pricing (
        id INTEGER PRIMARY KEY,
        store TEXT,
        location TEXT,
        name TEXT,
        embedding TEXT,
        price FLOAT
    )''')



#process existing data from csv files
import pandas as pd

data = pd.read_csv('./product_pricing/complete_pricing.csv').values

n = len(data)
print(n, len(data[0]))


import tensorflow as tf
import tensorflow_hub as hub
import json

model = hub.load('https://tfhub.dev/google/universal-sentence-encoder/4')

embeddings = model([data[i][2] for i in range(n)]).numpy()

print(data[0][2])
for i in range(len(data)):
    row = (i, data[i][0], data[i][1], data[i][2], json.dumps(embeddings[i].tolist()), float(data[i][3]))
    cursor.execute('''INSERT INTO product_pricing 
                (id, store, location, name, embedding, price)
                VALUES (?, ?, ?, ?, ?, ?)''', row)
    
conn.commit()
conn.close()




