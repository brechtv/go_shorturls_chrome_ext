var presets_file_location;
var settings = [],
    preset_settings = [],
    custom_settings = []

loadApp()

function loadApp() {
    presets_file_location = localStorage.getItem('short_urls_preset_file')
    $.getJSON(presets_file_location, {
            format: "json"
        })
        .done(function(data) {
            preset_settings = data
            settings.push.apply(settings, preset_settings)
            if (localStorage.getItem('short_urls') == undefined ||
                localStorage.getItem('short_urls') == "[]") {
                custom_settings = [{
                    "short_url": "go/tryme",
                    "url": "https://www.google.com"
                }]
                settings.push.apply(settings, custom_settings)
            } else {
                custom_settings = JSON.parse(localStorage.getItem('short_urls'))
                settings.push.apply(settings, custom_settings)
            }
        })
        .fail(function() {
            if (localStorage.getItem('short_urls') == undefined ||
                localStorage.getItem('short_urls') == "[]") {
                custom_settings = [{
                    "short_url": "go/tryme",
                    "url": "https://www.google.com"
                }]
                settings.push.apply(settings, custom_settings)
            } else {
                custom_settings = JSON.parse(localStorage.getItem('short_urls'))
                settings.push.apply(settings, custom_settings)
            }
        })
        .always(function() {
            $(".shorturls").empty()
            console.log(preset_settings)

            if (preset_settings) {
                for (setting in preset_settings) {
                    var el = presetsTemplate(
                        preset_settings[setting].short_url,
                        preset_settings[setting].url
                    )
                    $("#presetsDiv").append($(el))
                }
            }


            for (setting in custom_settings) {
                var el = shortURLTemplate(
                    custom_settings[setting].short_url,
                    custom_settings[setting].url
                )
                $(".shorturls").append($(el))
            }
            // add listeners
            $(".remove-this-shorturl").click(function() {
                removeThisURLDiv($(this))
            })
            $("#add-shorturl").click(function() {
                addShortURLDiv()
            })
            $('#click').click(function() {
                saveSettings()
            })
            $(".preset-save").click(function() {
                console.log('hallo')
                updatePresetFile($(".preset-location").val())
            })
        })
}


// whenever we save, save to local storage
function saveSettings() {
    var custom_settings = []
    $(".shorturl").each(function(i, v) {
        var label = $($(v).find(".shorturl-label")[0]).val().trim()
        var value = $($(v).find(".shorturl-value")[0]).val().trim()
        if (label != "" && value != "")
            custom_settings.push({
                "short_url": label,
                "url": value
            })
        console.log(custom_settings)
    })
    localStorage.setItem('short_urls', JSON.stringify(custom_settings))
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

// HANDLERS
// custom shortlinks add remove handlers
function addShortURLDiv() {
    $(".shorturls").append(shortURLTemplate("", ""))
    $(".remove-this-shorturl").click(function() {
        removeThisURLDiv($(this))
    })
}

function removeThisURLDiv(el) {
    $(el).parent().remove()
    saveSettings()
}

function updatePresetFile(location) {
    localStorage.setItem('short_urls_preset_file', location)
    // reload the app with the file updated
    loadApp()
}

function resetUI() {
    settings = [],
    preset_settings = [],
    custom_settings = []
    $(".clear-on-refresh ").remove()
    $('html *').off()
}

// TEMPLATES
// simple template to add label value pairs for short urls

// simple template to add label value pairs for short urls
var presetsTemplate = function(label, value) {
    var template = `
    <li class="clear-on-refresh list-group-item d-flex justify-content-between align-items-center">
        ` + label + `
        <span class="badge badge-outline-secondary badge-pill">` + value.substring(0, 25) + ` [...] </span>
    </li>`
    return template
}

// simple template to add label value pairs for short urls
var shortURLTemplate = function(label, value) {
    var template = `
    <div class="clear-on-refresh shorturl">
        <div class="form-row">
            <div class="col">
                <input type="text" class="shorturl-label form-control" placeholder="Short URL" value="` + label + `">
            </div>
            <div class="col">
                <input type="text" class="shorturl-value form-control" placeholder="URL" value="` + value + `">
            </div>
        </div>
        <button class="btn btn-link btn-sm remove-this-shorturl">Remove this URL</button>
    </div>`
    return template
}