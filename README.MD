# goslash

This is a **demo Chrome extension that allows you to set arbitrary short URLs and redirect them to their full URL equivalent.** For demonstration purposes I've used the `go/foo` format, since that's what Google came up with internally, but you can use any prefix or format, e.g. `who/john_smith` or `where/parking`.

For example, I can set `go/home` to redirect to `https://goo.gl/maps/UYV4osh7p192`, so each time I type `go/home` in my Chrome address bar, it redirects me to my directions home. No server needed.

## How to use

- Download or clone this repository
- Load it as an unpacked extension in your Chrome browser
- Set your short URLs by clicking the Extension icon top right
- To load preset shorturls, click 'presets' and add the path to a valid JSON file.
