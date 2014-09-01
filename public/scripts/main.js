function getLast(memuse) {
    if (memuse.last) {
        $("tbody tr:first").before("<tr>" + print(memuse.last) + "</tr>");
    }
}

function print(value) {
    var toPrint = "";
    if (value.interaction.links) {
        toPrint += "<td class='title'>" + value.interaction.links.title + "</td>"
        toPrint += "<td class='norm_url'>" + value.interaction.links.normalized_url + "</td>"
    } else {
        toPrint += "<td>" + "</td>" + "<td>" + "</td>"
    }
	var domain =  getDomain(String(value.interaction.interaction.link)) ;
    return "<td class='date'>" + value.interaction.interaction.created_at + "</td>" + "<td class='domain'><img src=http://www.google.com/s2/favicons?domain=" +domain+ " alt><span title="+domain+"></span></td>" + "<td class='content'>" + value.interaction.interaction.content + "</td>" + toPrint + "<td class='tags'>" + value.interaction.interaction.tags + "</td>";
}

function getDomain(url) {
    var trimmed = url.substring(url.indexOf("/", 2) + 2, url.length)
    return trimmed.substring(0, trimmed.indexOf("/", 1));
}

function getAll(memuse) {
    $("#table").append("<tbody></tbody>");
    jQuery.each(memuse.all, function(index, value) {
        $("#table > tbody:last").append("<tr>" + print(value) + "</tr>");
    });
}

var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':8081');
ws.onmessage = function(event) {
    if (event) {
        getLast(JSON.parse(event.data));
        getAll(JSON.parse(event.data));
    }
};

$("#send").click(function() {
    ws.send($("#filter").val());
    $("tbody").children().remove();
});

$('#filter').keypress(function(event) {
    if (event.keyCode == 13) {
        $('#send').click();
    }
});