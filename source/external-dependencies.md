title: External Dependencies
permalink: external-dependencies/
---
This article sheds light on referring external to your root recipe & tool files (page-loop.js, scrape.js and tool.js) file dependencies.

## Load images, scripts, styles from result's preview html

Since 1.2 recipes and tools can produce results having an html preview.

```javascript
{
	text: /* required, string */,
	address: /* string, url */,
	displayText: /* string that can contain html formatting */,
	displayAddress: /* string that can contain html formatting */,
	tooltip: /* string */,
	preview: /* string (html) THAT'S THE ONE */
}
```

In this html you can load images, scripts or styles. You should always consider the root of your recipe/tool as a root in the html.

For example in this recipe structure:

```
recipe-name
	img
		logo.png
	src
		template.html
	page-loop.js
	scrape.js
	package.json
```

If your *template.html* wants to load the *logo.png* file, it can refer to it like this:

```html
	<img src="img/logo.png">
```

## Loading private packages

Or loading NodeJS modules which aren't published on the NPM. These are simply referred to as with any regular NodeJS project.

{% note warn Your tool/recipe isn't a regular NodeJS package - it should be browserifiable! %}
At the end, it's executed in a headless browser. Don't forget this when writing your code or picking dependencies - it all should be browserifiable.
{% endnote %}

Here is an example of loading a utils.js package located in a 'src' dir placed in the root of a recipe:

```
recipe-name
	src
		utils.js
	page-loop.js
	scrape.js
	package.json
```

```javascript
var utils = require("./src/utils");
```

Both page-loop.js and scrape.js are able to load the package this way.

## Loading textual resources through fs.readFileSync()

You can load templates or other textual resources in your recipes and tools, using the fs module's readFileSync (**available starting from Pagehop 1.2**).

At compile time, calls to readFileSync are replaced with the actual content of the files (you can check the [brfs](https://www.npmjs.com/package/brfs) npm module for more info). 

{% note warn Don't use comma separated statements for require fs, path and for loading resources with readFileSync! %}
The parsing brfs does in order to replace the statements, is **very delicate** and **easily breaks**, but if you require fs and path in two separate var-statements and load the file in a third, you will be fine.
{% endnote %}

Here is an example which will work fine:

```javascript
var path = require('path');
var fs = require('fs');
var htmlTemplate = fs.readFileSync( path.resolve( __dirname, "template.html" ), "utf-8" );
```

This will **NOT** work:

```javascript
var path = require('path'),
	fs = require('fs'),
	htmlTemplate = fs.readFileSync( path.resolve( __dirname, "template.html" ), "utf-8" );
```

{% note warn Don't minify/uglify recipes and tools which use fs %}
Minificators usually combine statements into comma-separated statements (the example above), and this breaks the parsing of brfs.
{% endnote %}