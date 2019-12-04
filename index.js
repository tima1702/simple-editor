const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.status(200).sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
  console.log('App run on 3000');
});


