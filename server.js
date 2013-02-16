
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(process.env.port || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

//mail
var mailListener = require('./email/mailListener');
var listener = new mailListener.MailListener(2525);
var filter = require('./email/mailFilter');

//socket io
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    socket.filter = null;

    mailListener.on("mail-received", function (mail) {

        if (filter.matches(socket.filter, mail)) {
            socket.emit('push-mail', mail);
        }

        //todo save it
    });

    socket.on("update-filter", function (data) {
        socket.filter = filter.parse(data.query);
        //todo get matches from db
    });
});

