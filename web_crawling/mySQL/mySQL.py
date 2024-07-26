import json
import mysql.connector

path = "mySQL/key.json"
f = open(path)
key = json.load(f)

mydb = mysql.connector.connect(
    host = key["host"],
    user = key["user"],
    password = key["password"],
    database = key["database"]
)

# creating database
# mycursor.execute("CREATE DATABASE testdb")

mycursor = mydb.cursor()


mycursor.execute('SHOW DATABASES')

for db in mycursor:
    print(db)


mydb.close()