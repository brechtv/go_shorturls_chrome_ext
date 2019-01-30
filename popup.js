// load settings from local storage (if there are settings, else load a demo)
if (localStorage.getItem('short_urls') == undefined || localStorage.getItem('short_urls') == "[]") {
	var loaded_settings = [{"short_url": "go/tryme", "url": "https://www.google.com"}]
} else {
	var loaded_settings = JSON.parse(localStorage.getItem('short_urls'))
}
$(".shorturls").empty()
for (setting in loaded_settings) {
    $(".shorturls").append(
    	shortURLTemplate(
    		loaded_settings[setting].short_url,
    		loaded_settings[setting].url
    	)
    )
} 

// to add a short url
$("#add-shorturl").click(function() {
    addShortURLDiv()
})

function addShortURLDiv() {
    $(".shorturls").append(shortURLTemplate("", ""))
}

// to remove this short url
$(".remove-this-shorturl").click(function() {
    removeThisURLDiv($(this))
})

function removeThisURLDiv(el) {
    $(el).parent().remove()
    saveSettings()
}
// to save settings
$('#click').click(function() {
    saveSettings()
})

// whenever we save, save to local storage
function saveSettings() {
    var settings = []
    $(".shorturl").each(function(i, v) {
        var label = $($(v).find(".shorturl-label")[0]).val().trim()
        var value = $($(v).find(".shorturl-value")[0]).val().trim()
        if(label != "" && value != "")
        settings.push({
            "short_url": label,
            "url": value
        })
    })
    localStorage.setItem('short_urls', JSON.stringify(settings))
    applySettings(settings)
}

// send settings to background page
// always done after saving
function applySettings(settings) {
    chrome.runtime.sendMessage(settings,
        function(response) {
            console.log(response)
        });
}

// simple template to add label value pairs for short urls
function shortURLTemplate(label, value) {
	var template = `
	<div class="shorturl">
		<div class="form-row">
			<div class="col">
				<input type="text" class="shorturl-label form-control" placeholder="Short URL" value="`+ label + `">
			</div>
			<div class="col">
				<input type="text" class="shorturl-value form-control" placeholder="URL" value="` + value + `">
			</div>
		</div>
		<button class="btn btn-link btn-sm remove-this-shorturl">Remove this URL</button>
	</div>`
	return template
}