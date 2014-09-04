function getLast(memuse) {
    if (memuse.last) {
        $("tbody tr:first").before("<tr>" + print(memuse.last) + "</tr>");
    }
}

function print(value) {
    var toPrint = "";
    if (value.interaction.links.title) {
        toPrint += "<td class='norm_url'>" + value.interaction.links.title + "</td>"
    } else {
        toPrint += "<td>" + "</td>" 
    }
	 if (value.interaction.links.normalized_url) {
        toPrint += "<td class='norm_url'>" + createNormalizedLinks(value.interaction.links.normalized_url) + "</td>"
    } else {
        toPrint += "<td>" + "</td>" 
    }
	var domain =  getDomain(String(value.interaction.interaction.link)) ;
    return "<td class='date'>" + parseDate(value.interaction.interaction.created_at) + "</td>" + "<td class='domain'><img title="+domain+" src=http://www.google.com/s2/favicons?domain=" +domain+ " ></td>"+ "<td class='tags'>" + value.interaction.interaction.tags + "</td>" + toPrint  + "<td class='content'>" + value.interaction.interaction.content + "</td>";
}

function parseDate(date){
return moment(date).format('HH:mm:ss MM/Do/YY');

}

function createNormalizedLinks(bunch_urls){
console.log( typeof bunch_urls);
console.log( bunch_urls);
var result = "";
 var norm_urls = new String(bunch_urls).split(",");
 for (var i = 0; i < norm_urls.length; i++) {
    result = result + "<a href="+norm_urls[i]+"/a>"+norm_urls[i]+"</br>";
}

return result;
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
