title: page-loop.js
permalink: page-loop-js/
---
# What does it do?

The page-loop, as the name suggests, is primarily responsible for determining which urls should be scraped (as a main approach for obtaining data).

Once the page-loop determines a url for scraping, it can execute the scrape.js script on this url, using the pagehop.scrape(...) method.

Page-loop might not use a scrape script. If you don't need to load the page in a browser (you don't need any scripts to load, content to show-up on an ajax call etc.), you can make requests from the page-loop as well as parse the returned html and scrape results.

If you consume a service - **even better**. Just make the calls from your page-loop.js.

# How to use external libs

We've built the project structure mimicking the npm module.

As any other module you can use all npm modules as devDependencies for testing purposes (your tests will practically be executed in NodeJS).

**Browserify** is used *under the hood*, so you can take advantage of the increasingly growing range of npm modules that "play well" with browserify, and use these packages as **actual dependencies, inside your scripts**. If you haven't done that already, please, go through the documentation of [browserify](http://browserify.org/) to see what you can('t) do in such a script.

Besides using node packages, page-loop has an access to the **pagehop** global object, which tells you what options did the user selected of your recipe, what was her/his query, how many results can you return and so on.

Before running the page-loop script, the `pagehop` global object is created, which is similar for both of the scripts (page-loop.js and scrape.js), yet, a bit different.

# How long can it run?

Your recipe will timeout after 30 seconds. Scrape can't go for longer than 10 seconds (including loading the url), if it does, the callback will return an error with a `type` prop (saying "timeout") and a `message` prop.

If your recipe (page-loop.js being the entry point) times-out, you will see the error in the UI.

# What if it fails?

If page-loop.js has a syntax error or fails during runtime, your recipe will fail and you will see the error in the UI.

# Examples

Here is an example for a recipe **scraping multiple pages** (BingSearch).

This page-loop script starts **n** scrapes, where n = maxCount / 100, maxCount being the max number of results your recipe should return (as in Pagehop->Settings).

Whenever a scrape finishes:
- it checks for error:
	- if there is one - pagehop.finishWithError( error )
- if not:
	- process the results
- check if all pages have finished
	- if they have - pagehop.finish( allResults )
	- if not - pagehop.updateResults( allResults )

```javascript
'use strict';

var util = require('util'),
	deepEqual = require('deep-equal');

var flattenResults = function( results ) {...};
var cleanDuplicates = function(items) {...};

// Query, query, startAt (1 => 101 => 201 => 301...), itemsAtPage
var urlTemplate = 'http://www.bing.com/search?q=%s&pq=%s&first=%s&count=%s',
	startAt = 1,
	itemsAtPage = 100,
	max = pagehop.getMaxCount(),
	iterationsCount = Math.ceil( max / itemsAtPage ),
	query = pagehop.getQuery(),
	results = new Array( iterationsCount ),
	asyncCount = iterationsCount;

if ( query ) {
	for ( var i = 0; i < iterationsCount; i++ ) {
		var url = util.format(
			urlTemplate,
			encodeURIComponent( query ),
			encodeURIComponent( query.toLowerCase() ),
			startAt,
			itemsAtPage
		);
		// clojure to preserve i for every result
		(function() {
		var index = i;
		pagehop.scrape( url, function(error, result) {
			if ( error ) {
				pagehop.finishWithError( error );
				return;
			}
			if ( result ) {
				results[ index ] = result;
			}
			var allResults = cleanDuplicates( flattenResults( results ) );
			if ( --asyncCount === 0 ) {
				pagehop.finish( allResults );
			} else {
				pagehop.updateResults( allResults );
			}
		} );
		})();
		startAt += itemsAtPage;
	}
} else {
	pagehop.finish( [] );
}
```

And here is another example of a page-loop (NPMSearch), but this time, consuming a REST-ful JSON API:

```javascript
'use strict';

var util = require('util'),
	$ = window.$;

// for tests (to be able to mock jQuery)
if ( !$ ) {
	var $ = require('jquery-browserify');
}

// Params:
//
//	rows
//	q (query)
var searchUrlTemplate = 'http://npmsearch.com/query?pretty=true&fl=name,description,version,author,license&rows=%s&sort=rating+desc&q=%s',
	searchUrlTemplateWithHomePage = 'http://npmsearch.com/query?pretty=true&fl=name,description,homepage,version,author,license&rows=%s&sort=rating+desc&q=%s';

var addressUrlTemplate = 'https://www.npmjs.org/package/%s',
	max = pagehop.getMaxCount(),
	query = pagehop.getQuery(),
	options = pagehop.getOptions(),
	isHomePage = ( options !== null ) && ( options.indexOf( ":h" ) !== -1 ),
	results = [];

var parseItem = function(rawItem) {
	var address;
	if ( isHomePage ) {
		address = rawItem.homepage;
	} else {
		address = util.format(
			addressUrlTemplate,
			rawItem.name
		);
	}
	var displayAddress = [
		"by " + rawItem.author,
		rawItem.version,
		rawItem.license.length ? rawItem.license.join(", ") : "no-license"
	].join( " | " );

	var result = {
		text: rawItem.name + " (" + rawItem.description + ")",
		displayText: "<b>" + rawItem.name + "</b>" + " (" + rawItem.description + ")",
		address: address,
		displayAddress: displayAddress
	};

	return result;
};

if ( !query ) {
	pagehop.finish( [] );
} else {
	var url = util.format(
		isHomePage ? searchUrlTemplateWithHomePage : searchUrlTemplate,
		max,
		encodeURIComponent( query )
	);

	$.getJSON( url )
		.done(function( json ) {
			var items = json.results;
			if ( items && items.length ) {
				results = items.map( parseItem );
			}
			pagehop.finish( results );
		})
		.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
			pagehop.finishWithError( error );
		});
}
```

In this case, only 1 call to this REST API is enough to get our search results.

There is another significant difference in this example, too - the recipe defines an option - :h (to return results pointing to the homepage of the project instead the default page on npmjs.org).

You can check all available in the API of the `pagehop` object, bellow.

# pagehop API (page-loop.js)

## pagehop.init(query, options, max, scrapeScript, systemMeta, hops)

This method is used by Pagehop, to preset the environment for running your page-loop.js

You can use this method only in your tests, where the test framework doesn't call init automatically.

Lets go through the params:
- **query** - **string**, recipe's query as parsed by Pagehop.
- **options** - **array**, holding all options parsed from the pagehop query.
- **max** - integer, >=10, the maximal number of results that can be returned by the recipe.
- **scrapeScript** - **string**, Pagehop executes recipes producing a single script which is the page-loop.js with all of it's dependencies and the scrape script (if any), which is executed in a separate isolated environment upon calling pagehop.scrape() from your page-loop. Since you only should use pagehop.init() in tests, and since these tests should only test the page-loop.js, **never** the scrape.js (it's separately tested), you don't need to pass actual script in here, because it shouldn't get executed.
- **systemMeta** - **object** with 2 fields (arrays) - **recipes**, **tools**. This is usually used by recipes that provide some system information about Pagehop (AllRecipes list the available recipes and AllTools list the tools).
- **hops** - **MUTABLE array** of objects specifying addresses the user had "hopped of". Here is the format of the hop objects:

```javascript
{
	text: "text",
	address: "address"
}
```

## pagehop.getMaxCount()

Returns an **integer**. Your pageLoop scripts should get this, in order to find out the limit of the number of returned results they should confirm to.

## pagehop.getQuery()

Returns a **string**. Returns the recipe query as parsed by Pagehop.

This doesn't include the whole pagehop query - e.g. in `g <this is the query> :r $.*^` the parsed query will be `<this is the query>`.

## pagehop.getOptions()

Returns an **array** of strings.

Tools or non-recognized options will not be passed in here - e.g. `h :s :asdf` will produce only [":s"] for options (":s" is for Show HN posts with HackerNews recipe).

## pagehop.getSystemMeta()

Returns an **object** with 2 fields (arrays) - **recipes**, **tools**. Recipe objects look like this (comments show where does the data come from):

```javascript
{
	id: /* package.json:pagehop.id */,
	description: /* package.json:description */,
	version: /* package.json:version */,
	homepage: /* package.json:homepage */,
	options: /* package.json:pagehop.options */
} 
```

Tool objects look like this:

```javascript
{
	id: /* package.json:pagehop.id */,
	description: /* package.json:description */,
	version: /* package.json:version */,
	homepage: /* package.json:homepage */,
	keyword: /* package.json:pagehop.keyword */
} 
```

## pagehop.getHops()

Returns a **MUTABLE array** of objects specifying addresses the user had "hopped of". Recipes are usually using the hops array for a visual notification of which recipe is being used. Here is how you should use the hops array and how the objects in it look like:

```javascript
pagehop.getHops().push( {
	text: "RecipeId",
	address: "http://some.url.com/will/produce/same/results/but/in-browser"
} );
```

## pagehop.scrape( url, callback )

- **url** - **string** pointing to a file or a page on the web. Pagehop automatically will use the scrape.js script in a separate, also isolated, environment (browser), where it will first navigate to the page and then run scrape.js.
- **callback** - function accepting 2 arguments - **error** and **result**. If the scrape produced an error (syntax error in scrape.js, or runtime error, or timeout), you will get an error in the callback and no result. Error is of this structure:

```javascript
{
	type: /* string */,
	message: /* string */
}
```

The result object is always entirely up to your scrape script.

## (experimental) pagehop.updateResults( results )

- **results** - **array** of objects with this structure:

```javascript
{
	text: /* required, string */,
	address: /* string, url */,
	displayText: /* string that can contain html formatting */,
	displayAddress: /* string that can contain html formatting */,
	tooltip: /* string */
}
```

This is not yet used by official builds of Pagehop, but we are trying to see if we can show intermediate results before the recipe is finished. So far the tests don't show too promising results, so we advice you not to use the method. Most likely we will try to replace this with something like % progress API, where you will tell Pagehop, what % of the scrapes/loads/generations of results are ready, so we can visualize it and notify the user.

If you decide to use it, anyway, you should call it in cases where you have called scrape in a synchronous loop. This way every time one of the scrapes is ready, it will notify Pagehop of the new results. **Always return ALL of the results so far, not just these that you get on this callback from scrape**

## pagehop.finishWithError( error )

If your recipe is prevented by an obstacle that it cannot overcome you can fail gracefully with pagehop.finishWithError().

Error object must be with this structure:

```javascript
{
	type: /* string */,
	message: /* string */
}
```

## pagehop.finish( results )

- **results** - **array** of result objects.

When your recipe is ready, you can return the results it has obtained/produced with pagehop.finish( results ).

Here is how your result objects should look like:

```javascript
{
	text: /* required, string */,
	address: /* string, url */,
	displayText: /* string that can contain html formatting */,
	displayAddress: /* string that can contain html formatting */,
	tooltip: /* string */,
	preview: /* string (html) */
}
```

If you provide, both, text and displayText, displayText will be shown as the first row of your Pagehop result, but text will still be the field used for searches (:r will not use the displayText to match against and the produced results will have their displayText fields redone with the formatting highlighting the matched parts). If only text is present, then it will be displayed on the first row.

If you provide, both, address and displayAddress, only displayAddress will be shown, on the second row.

By default, address is show in a tooltip on long-hover on items in the UI. You can pass a different tooltip text to replace it.

Starting from ver1.2, you can optionally supply a preview html to be loaded in Pagehop's UI. Recipes such as DefineWord, CodeSearch and others use it. Local resources you reffer from this html should assume the recipe's root dir as / (web root).