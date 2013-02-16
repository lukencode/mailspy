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

    function filter(q) {
        if (!q.length) return;

        socket.emit("update-filter", { query: q });
        emails = {}; //todo somehow parse existing emails? or just wait till mongo and return from db

        targetElement.children("tr").not(".waiting").remove();
        targetElement.children(".waiting").show();
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
            add(mail);
        });        
    }

    function init() {
        targetElement = $("#emails tbody");

        $("#search").keyup(function (e) {
            if (e.keyCode == 13)
                filter($(this).val());
        });
    }

    $(function () {
        init();
        connect();
    });
}