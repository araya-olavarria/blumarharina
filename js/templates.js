// Templates of our example BT app, uses underscore.js templating

var templates = {

    // Single BluetoothDevice using Bootstrap components to
    // display nicely
    device:
        "<div class='panel panel-default'>" +
            "<div class='panel-body'>" +
                "<div class='row'>" +
                    "<div class='col-xs-8'><b><%= templates.name %></b></div>" +
                    "<div class='col-xs-4'>" +
                        "<% if(templates.isConnected) { %>" +
                            "<button type='button' class='btn-bsbt btn-bsbt-danger btn-bsbt-block btn-bsbt-bt btn-bsbt-bt-disconnect'>" +
                                "<span class='glyphicon glyphicon-remove'></span> Desconectar" +
                            "</button>" +
                        "<% } else { %>" +
                            "<button type='button' class='btn-bsbt btn-bsbt-default btn-bsbt-block btn-bsbt-bt btn-bsbt-bt-connect' data-loading-text='Connecting...' >" +
                                "<span class='glyphicon glyphicon-transfer'></span> Conectar" +
                            "</button>" +
                        "<% } %>" +
                    "</div>" +
                "</div>" +
            "</div>" +
        "</div>",
    isConnected:false,
    name:"name"
}
