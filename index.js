require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  return res.json({ greeting: 'hello API' });
});


const originalUrls = []
const shortUrls = []

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url
  const foundindex = originalUrls.indexOf(url)

  if (!url.includes('http://') && !url.includes('https://')) {
    res.json({ error: 'invalid url' });
  }

  if (foundindex < 0) {
    originalUrls.push(url)
    shortUrls.push(shortUrls.length)

    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1
    })
  }

  return res.json({
    original_url: url,
      short_url: shortUrls[foundindex]
  })

});

app.get('/api/shorturl/:shorturl', function (req, res) {
  const shorturl = parseInt(req.params.shorturl)
  const foundindex = shortUrls.indexOf(shorturl)

  if (foundindex < 0) {
    return res.json({
      "error": "No Short Url found for given input"
    })
  }

  res.redirect(originalUrls[foundindex])

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
