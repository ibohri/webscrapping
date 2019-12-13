const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname })
});

app.get("/data", async (req, res) => {
    try {
        const { search } = req.query;
        if (search) {
            let data = "Product Name, Shop Name, Number of Reviews, Price\n";
            const searchedData = await getData(search);
            data = data.concat(searchedData);
            res.attachment(`${search.replace(" ", "_")}.csv`);
            res.send(data);
            return;
        }
        res.send("Search is empty...");
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
})

async function getData(search) {
    return new Promise((resolve, reject) => {
        // Use child_process.spawn method from  
        // child_process module and assign it 
        // to variable spawn 
        const spawn = require("child_process").spawn;

        const process = spawn('python', ["./script.py",
            search]);

        // Takes stdout data from script which executed 
        // with arguments and send this data to res object 
        process.stdout.on('data', (data) => {
            resolve(data.toString());
        })

        process.on('error', (error) => {
            reject(error)
        })
    })
}

// start the server
app.listen(process.env.PORT || 5000, function () {
    console.log('server running on port 5000');
}) 