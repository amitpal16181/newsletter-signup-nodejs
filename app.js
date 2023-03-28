const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();

app.use(express.static("public"));              // set a folder as static and make all static files public making it accessible to the client browser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    // console.log("Server is up and running...");
    res.sendFile(__dirname + "/signup.html");;
});

app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us13.api.mailchimp.com/3.0//lists/{YOUR_UNIQUE_AUDIENCE_ID}";
    const options = {
        method: "POST",
        auth: "{ANY_TEXT}:{YOUR_API_KEY}"               // Read node documentation for http to know working and more.
    };


    const httpsRequest = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    httpsRequest.write(jsonData);
    httpsRequest.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server is up and running on the port " + port);
});