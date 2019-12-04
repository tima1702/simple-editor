const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', function(req, res) {
  res.status(200).sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function () {
  console.log('App run on 3000');
});


