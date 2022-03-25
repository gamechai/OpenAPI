const https = require('https')
const express = require('express')

const app = express()

const appPort = 8080;


app.get('/', (req, res) => {
  res.send('Hello World of Node.js by Gamechai')
})

app.get('/hello/:name', (req, res) => {
  res.send("Hello "+req.params.name+", Nice to meet you")
})

app.get('/bot/exchange-rate', (req, res) => {
  res.send("/bot/exchange-rate")

  // API of Bank of Thailand
  const clientId = "509b1f6f-c93a-45ea-b068-84009ebdd108";
  const periodStart = "2022-03-21";
  const periodEnd = "2022-03-21";
  const currency = "JPY";
  const pathUri = "/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/?start_period="+periodStart + "&end_period="+periodEnd+"&currency="+currency;

  process.stdout.write("@ Client ID = "+ clientId+"\r\n");
  console.log("Client ID = "+ clientId);

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

  req = https.request(options, res => {

    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', d => {
      process.stdout.write("\n\r >>>>>> "+d);
      // res.send(d)

      // myJSON = JSON.stringify(d);
      // myJSON = JSON.parse(d);
      // process.stdout.write("\n\r >>>>>> "+myJSON.result.data.data_detail);

      // process.stdout.write(d.result)

      // process.stdout.write( ${res.result.data} )
    })


    console.log(`*** Res Data : \r\n${res.data_detail}`);

  })

  req.on('error', error => {
    console.error(error);
  })

  req.end();

})





// -----------------------------------------------

app.listen(appPort, () => {
  console.log('Start server at port '+appPort)
})
