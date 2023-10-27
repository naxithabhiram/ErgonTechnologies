import requests
from bs4 import BeautifulSoup
import mysql.connector
import schedule
import time

# Define your MySQL database connection
db_connection = mysql.connector.connect(
    host='localHost 3308',
    user='root',
    password='your_mysql_password',
    database='your_database_name'
)

# Create a function to update conversion rates
def update_conversion_rate(cursor, currency1, currency2):
    url = f"https://openexchangerates.org//{currency1}/{currency2}"  # Replace with the actual URL
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        conversion_rate = soup.find('span', {'class': 'rate'}).text
        
        # Update the conversion rate in the MySQL database
        cursor.execute("UPDATE exchange_rates SET conversion_rate = %s WHERE Currency1 = %s AND Currency2 = %s", (conversion_rate, currency1, currency2))
        db_connection.commit()

# Create a function to update all rows
def update_all_conversion_rates(cursor):
    cursor.execute("SELECT Currency1, Currency2 FROM exchange_rates")
    rows = cursor.fetchall()
    for row in rows:
        currency1, currency2 = row
        update_conversion_rate(cursor, currency1, currency2)

# Schedule the update to run every 24 hours
schedule.every(24).hours.do(update_all_conversion_rates, cursor=db_connection.cursor())

while True:
    schedule.run_pending()
    time.sleep(1)

# Close the database connection when done
db_connection.close()
