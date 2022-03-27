const https = require('https');
const crypto = require('crypto');

const express = require('express');
const axios = require('axios');
const qr = require('qr-image');

const app = express();

// let appPort = 8080;
let appPort = process.env.PORT || 1710;

app.use(express.static('public'));

app.get("/hello", (req, res) => {
  // res.send('Hello World of Node.js by Gamechai')
  var respObj = {
    status: true,
    data: {
      text: "Hello World of Node.js by Gamechai"
    }
  }
  res.json(respObj);
});

app.get('/hello/:name', (req, res) => {
  res.send("Hello "+req.params.name+", Nice to meet you")
})

app.get('/qr/:input', function(req, res) {
  var code = qr.image( req.params.input, { type: 'svg' });
  res.type('svg');
  code.pipe(res);
});



app.get('/bot/exchange-rate', (req, res) => {

  console.log("-----------------------------------------------------------------------------------");

  res.send("/bot/exchange-rate")

  // API of Bank of Thailand
  const clientId = "509b1f6f-c93a-45ea-b068-84009ebdd108";
  const periodStart = "2022-03-21";
  const periodEnd = "2022-03-21";
  const currency = "JPY";
  const pathUri = "/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/?start_period="+periodStart+"&end_period="+periodEnd+"&currency="+currency;

  var result = "";

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


  // res.on('data', function (chunk) {
  //     con


  req = https.request(options, res => {

    console.log(">>> in req = https.request(");
    console.log(`@ statusCode: ${res.statusCode}`);

    // let buf = ''

    res.on('data', (d) => {
      result += d.toString;
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


  let buf = ''

  req.on('data', (chunk) => {
    buf += chunk
  })

  req.on('end', () => {
    console.log(`Data is : ${buf}`)
    res.end('Request Accepted \n')
  })


  req.on('error', error => {
    console.error(error);
  })

  console.log(">>> req.end()");
  req.end();

  console.log(">>> result = "+result.toString);
  // res.send( result )
})



// ====================================================

app.get('/scb/qr-payment', (req, res) => {

  const appKey = "l7da6c470225294a60bcf2b36ed859b5c2";
  const appSecret = "5d927c4cbf25451f8a9b92a7e6a0a52d";

  var accessToken = "";
  var qrRawData = "";

  var txnId = "";

  var dt = new Date();

  txnId = dt.getFullYear()+"0"+(dt.getMonth()+1)+""+dt.getDate()+""+dt.getHours()+""+dt.getMinutes()+""+dt.getSeconds();
  console.log("txnId = "+ txnId );

  // Call API to get access token

  const body = {
    'applicationKey' : appKey,
    'applicationSecret' : appSecret,
    'authCode' : ''
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'accept-language': 'EN',
      'resourceOwnerId': appKey,
      'requestUId': crypto.randomBytes(16).toString("hex")
    }
  };

  axios.post('https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token', body, config)
    .then((response) => {

      // const myJSON = JSON.stringify(response.data);
      // console.log("*** myJSON = "+myJSON);

      accessToken = response.data.data.accessToken;
      console.log("*** accessToken = "+accessToken);

      // Call API to get QR Payment Tag 30

      var dt = new Date();

      const body = {
        "qrType": "PP",
        "ppType": "BILLERID",
        "ppId": "170613490315111",
        "amount": dt.getMinutes()+"."+dt.getSeconds(),
        "ref1": txnId,
        "ref2": "REF2",
        "ref3": "SCB"
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer '+accessToken,
          'accept-language': 'EN',
          'resourceOwnerId': appKey,
          'requestUId': crypto.randomBytes(16).toString("hex")
        }
      };

      axios.post('https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create', body, config)
        .then((response) => {
          // const myJSON = JSON.stringify(response.data);
          // console.log("*** myJSON = "+myJSON);

          qrRawData = response.data.data.qrRawData;
          console.log("*** qrRawData = "+qrRawData);

          // var code = qr.image( qrRawData, { type: 'svg' });
          // response.type('svg');
          // code.pipe(response);

          // return qrRawData;
          // this.goal();
        })
        .catch(error => {
          console.error(error);
        });
    });

    // console.log("### qrRawData = "+qrRawData);

    // // var code = qr.image( "000201010212304201151706134903151110211202203270100304REF252047011530376454071710.005802TH5922TestMerchant16455146796007BANGKOK62340523202203271210277910000000703SCB63047737", { type: 'svg' });
    // var code = qr.image( qrRawData, { type: 'svg' });
    // res.type('svg');
    // code.pipe(res);

    res.send( "View QR raw data in the console log" );
    // res.send( "*** qrRawData = "+qrRawData );
})


// function goal(){
//   console.log("Eureka !!");
// }
// -----------------------------------------------

app.listen(appPort, () => {
  console.log("Start server at port "+appPort)
})
