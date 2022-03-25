const https = require('https')
const express = require('express')
const crypto = require("crypto")

const app = express()

// let appPort = 8080;
let appPort = process.env.PORsT || 1710;

app.use(express.static('public'));

app.get('/hello', (req, res) => {
  res.send('Hello World of Node.js by Gamechai')
})

app.get('/hello/:name', (req, res) => {
  res.send("Hello "+req.params.name+", Nice to meet you")
})

app.get('/bot/exchange-rate', (req, res) => {


  console.log("-----------------------------------------------------------------------------------");

  res.send("/bot/exchange-rate")

  // API of Bank of Thailand
  const clientId = "509b1f6f-c93a-45ea-b068-84009ebdd108";
  const periodStart = "2022-03-21";
  const periodEnd = "2022-03-21";
  const currency = "JPY";
  const pathUri = "/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/?start_period="+periodStart + "&end_period="+periodEnd+"&currency="+currency;

  let result = "";

  process.stdout.write("@ Client ID = "+ clientId+"\r\n");
  // console.log("Client ID = "+ clientId);

  process.stdout.write("@ Path = "+ pathUri+"\r\n");

  const options = {
    hostname: 'apigw1.bot.or.th',
    port: 443,
    path: pathUri,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-IBM-Client-Id': clientId
    }
  }

  console.log(">>> req = https.request(");

  req = https.request(options, res => {

    console.log(">>> in req = https.request(");
    console.log(`@ statusCode: ${res.statusCode}`);

    res.on('data', d => {
      result = d;
      process.stdout.write("\r\nd >>>>>> "+d);


      // console.log(body);

      // myJSON = JSON.stringify(d);

      // var myJSON = JSON.parse(d);

      // process.stdout.write("\n\r >>>>>> "+myJSON.result.data.data_detail);

      // process.stdout.write(d.result)
      //
      // process.stdout.write('${res.result.data}')
    })

    console.log("!!! result = "+result);

    // const jsonResp = res.json()
    // console.log( jsonResp );
    // console.log(`*** Res Data : \r\n${res.data_detail}`);
  })

  req.on('error', error => {
    console.error(error);
  })


  console.log(">>> req.end()");
  req.end();


  console.log(">>> result = "+result);
  // res.send( result )
})

app.get('/scb/qr-payment', (req, res) => {

  let result = ""

  console.log("-----------------------------------------------------------------------------------");
  console.log( Date() );
  console.log("-----------------------------------------------------------------------------------");

  const appKey = "l7da6c470225294a60bcf2b36ed859b5c2";
  const appSecret = "5d927c4cbf25451f8a9b92a7e6a0a52d";

  let jsonResp = "";
  // var data = "";

  let accessToken = "";

  result += "/scb/qr-payment<br><br>"

  result += "POST v1/oauth/token<br>"



  let requestUId = crypto.randomBytes(16).toString("hex");

  process.stdout.write("Request Unique ID = " + requestUId + "\r\n");

  const data = JSON.stringify({
    applicationKey : appKey,
    applicationSecret : appSecret,
    authCode : ""
  })

  var options = {
    hostname: 'api-sandbox.partners.scb',
    port: 443,
    path: '/partners/sandbox/v1/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Length': data.length,
      'accept-language': 'EN',
      'resourceOwnerId': appKey,
      'requestUId': requestUId
    },
    // body: {
    //   "applicationKey" : appKey,
    //   "applicationSecret" : appSecret,
    //   "authCode" : ""
    // }
    body: data
  }

  req = https.request(options, res => {
    // console.log('statusCode: ${res.statusCode}')

    res.on('data', d => {
      process.stdout.write(">>> "+d)
      // jsonResp = res;
      // process.stdout.write(jsonResp)

      // accessToken = data.data;
    })

  })

  req.on('error', error => {
    console.error(error)
  })

  // req.write("\r\n***********\r\n"+data);
  //
  // req.write("\r\n>>>"+data );
  //

  req.end();


  // process.stdout.write(jsonResp);
  // process.stdout.write("Access Token = "+accessToken);


  result += "POST v1/payment/qrcode/create<br>"


  res.send( result )
})

// -----------------------------------------------

app.listen(appPort, () => {
  console.log('Start server at port '+appPort)
})
