//smtp listener
var simplesmtp = require("simplesmtp"),
    MailParser = require("mailparser").MailParser,
    events  = require('events');
    
exports = module.exports = new events.EventEmitter();

exports.MailListner = function (port) {
    console.log("Attempting to create smtp server on port " + port);

    var smtp = simplesmtp.createServer({ disableDNSValidation: true });
    smtp.listen(port, function (err) {
        if (err != null) {
            return logger.error(err);
        }

        smtp.on("startData", function (envelope) {
            envelope.parser = new MailParser({
                defaultCharset: "utf-8"
            });
            return envelope.parser.on("end", function (mail) {
                console.log(mail);
                exports.emit('mail-recieved', mail);
            });
        });

        smtp.on("data", function (envelope, chunk) {
            return envelope.parser.write(chunk);
        });

        smtp.on("dataReady", function (envelope, callback) {
            envelope.parser.end();
            return callback(null);
        });
    });

}




