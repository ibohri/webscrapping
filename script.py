# Python program to scrape website
# and save quotes from website
import requests
import sys
from bs4 import BeautifulSoup as soup
search_string = sys.argv[1].replace(" ", "+")
URL = "https://www.etsy.com/in-en/search?q=" + search_string
r = requests.get(URL)

soup = soup(r.content, 'html.parser')

for heading in soup.find_all("li", class_="wt-list-unstyled"):
    product_name = heading.find("h2").get_text().strip()
    number_of_reviews = "0"
    reviews_container = heading.find(
        "span", class_="v2-listing-card__rating").find("span", class_="text-body-smaller")
    if not reviews_container is None:
        number_of_reviews = reviews_container.text

    shop_name = heading.find(
        "div", class_="v2-listing-card__shop").find("p", class_="text-gray-lighter").text.strip()
    price = heading.find("span", "currency-value").text.strip()
    price_symbol = heading.find("span", "currency-symbol").text.strip()
    print(product_name.replace(",", "|") + "," + shop_name.replace(",", "|") + "," +
          number_of_reviews.replace(")", "").replace("(", "").replace(",", "") + "," + price.replace(",", "") + " " + price_symbol)
