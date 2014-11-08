/**
 * Myrror entry point.
 */
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.send('MYRROR!')
});

app.listen(app.get('port'), function() {
    console.log("MYRROR Node app is running at localhost: " + app.get('port'))
});
