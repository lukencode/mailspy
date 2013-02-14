function listen() {
    var socket;
    var targetElement;

    function addMail(mail) {
        $("#emails .waiting").hide();

        var row = $("<tr />")
                    .append($("<td />", { text: "none" }))
                    .append($("<td />", { text: mail.from[0].address }))
                    .append($("<td />", { text: mail.to[0].address }))
                    .append($("<td />", { text: mail.subject }))
                    .append($("<td />", { text: "-" }));

        targetElement.prepend(row);
    }

    function connect() {
        socket = io.connect('/');
        socket.on('push-mail', function (data) {
            console.log(data);
            addMail(data);
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