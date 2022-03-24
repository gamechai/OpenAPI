var http = require("http");
//var https = require('https');
var url = require("url");

const crypto = require("crypto")
const express = require("express");
// const Joi = require('joi'); //used for validation
const app = express();

app.use(express.json());

const apiKey = "l7da6c470225294a60bcf2b36ed859b5c2";
const apiSecret = "5d927c4cbf25451f8a9b92a7e6a0a52d";


http.createServer(function (req, res) {

  res.writeHead(200, {"Content-Type": "text/html"});

  res.write("oAuth 2.0 <br>");
  res.write( Date() + "<br>");

  var requestUId = crypto.randomBytes(16).toString("hex");

  res.write("Req. Unique ID = " + requestUId + "<br>");


    const data = JSON.stringify({
      todo: 'Buy the milk'
    })


// https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token

    var options = {
      hostname: 'api-sandbox.partners.scb',
      port: 443,
      path: '/partners/sandbox/v1/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'accept-language': 'EN',
        'resourceOwnerId': apiKey,
        'requestUId': requestUId
      },
      body: {
        "applicationKey" : apiKey,
        "applicationSecret" : apiSecret,
        "authCode" : ""
      }
    }

    // req.write( options );
    // console.console.log( options );


    req = http.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      res.on('data', d => {
        process.stdout.write(d);
      })
    })

    req.on('error', error => {
      console.error(error);
    })

    req.write(data);
    req.end();

  // res.write("URL = "+ req.url + "<br>");
  //
  // var q = url.parse( req.url, true ).query;
  //
  // var txt = "";
  //
  // txt = "<b>" + q.year + " " + q.month + "</b><br>";
  // txt = "HTML Form = " + q.fname + " " + q.lname + "<br>";
  //
  // res.write( txt + '<br>' );
  //
  // res.write( "<a href='file:///Users/Gamechai/gamechai.html'><< Back</a>" );
  //
  // res.end();

}).listen(8080);
