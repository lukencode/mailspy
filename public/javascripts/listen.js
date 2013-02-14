//todo move me
String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {       
    var reg = new RegExp("\\{" + i + "\\}", "gm");             
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
}


function listen() {
    var socket;
    var targetElement;
    var emails = {};

    function formatAddress(address) {
        return String.format("<span class='address'><span class='email'>{0}</span> <span class='name'>{1}</span></span>", address.address, address.name); 
    }

    function matchesFilter(mail) {
        return true;
    }

    function add(mail) {
        emails[mail.id] = mail;

        $("#emails .waiting").hide();

        var row = $("<tr class='new' />")
                    .append($("<td />", { html: formatAddress(mail.from[0]) }))
                    .append($("<td />", { html: formatAddress(mail.to[0]) }))
                    .append($("<td />", { text: mail.subject }))
                    .append($("<td />", { text: mail.headers["date"] }))
                    .append($("<td />")
                                .append($("<a/>", { text: "view", "data-id": mail.id })));

        targetElement.prepend(row);
    }

    function connect() {
        socket = io.connect('/');
        socket.on('push-mail', function (mail) {
            console.log(mail);
            if(matchesFilter(mail))
                add(mail);
        });        
    }

    function init() {
        targetElement = $("#emails tbody");
    }

    $(function () {
        init();
        connect();
    });
}