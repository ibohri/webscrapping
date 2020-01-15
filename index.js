const express = require("express");
const app = express();
const rp = require("request-promise");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname
  });
});

app.get("/data", async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      let data =
        "Product Name, Shop Name, Number of Reviews, Price, Currency Symbol\n";
      const searchedData = await getData(search);
      data = data.concat(searchedData);
      res.attachment(`${search.replace(" ", "_")}.csv`);
      res.send(data);
      return;
    }
    res.send("Search is empty...");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

async function getData(search) {
  const url = `https://www.etsy.com/in-en/search?q=${search}`;
  const response = await rp.get(url);
  const dom = new JSDOM(response);
  const document = dom.window.document;
  let data = [];
  const headings = document.querySelectorAll("li.wt-list-unstyled");
  headings.forEach(heading => {
    const productName = heading.querySelector("h2").textContent.trim();
    let reviews = 0;
    const reviewContainer = heading.querySelector(
      ".v2-listing-card__rating .text-body-smaller"
    );
    if (reviewContainer) {
      reviews = reviewContainer.textContent
        .trim()
        .replace("(", "")
        .replace(")", "")
        .replace(",", "");
    }
    const shopName = heading
      .querySelector(".v2-listing-card__shop .text-gray-lighter")
      .textContent.trim();
    const curreny = heading
      .querySelector("span.currency-value")
      .textContent.trim();
    const currencySymbol = heading
      .querySelector("span.currency-symbol")
      .textContent.trim();
    data.push(
      [productName, shopName, reviews, curreny, currencySymbol]
        .map(item => `${item}`.replace(/,/g, " "))
        .join(",")
    );
  });

  return data.join("\n");
}

// start the server
app.listen(process.env.PORT || 5000, function() {
  console.log("server running on port 5000");
});
