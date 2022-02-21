const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')

// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(cookieParser())

/**
 * Setting Winner
 * @param winner
 */
app.post('/write-winner', jsonParser, function (req, res) {
  //   console.log(req.body)
  const { winner, position } = req.body
  const processedText = `${position}: ${winner.name} (বই নংঃ ${winner.bookNo}, হিসাব নংঃ ${winner.accountNo})\n`
  // Write data in 'Output.txt' .
  fs.appendFile('Result.txt', processedText, 'utf8', (err) => {
    // In case of a error throw err.
    if (err) throw err
  })
  res.status(200).send('OK')
})

module.exports = {
  path: '/server',
  handler: app,
}
