title: scrape.js
permalink: scrape-js/
---

# What does it do?

The scrape.js script is responsible for extracting data from pages. The script expects a specific html rendering, from which it extracts search results or another type of data that your recipe produces.

Once the page-loop.js determines a url for scraping, it can execute the scrape.js script on this url, using the pagehop.scrape(...) method. The way this happens is: the url is loaded in a page of the headless (no view rendering) browser, PhantomJS and then the scrape.js script is executed in this same page instance.

Your recipe might not use a scrape script. If you don't need to load the page in a browser (you don't need any scripts to load, content to show-up on an ajax call etc.), you can make requests from the page-loop as well as parse the returned html and scrape results.

Still, you shouldn't forget:

{% note warn Always put a scrape.js file in your recipe %}
Even when it's empty, the scrape.js file is still required to exist. If you use the pagehop CLI tool for scaffolding, you will always get the file created for you.
{% endnote %}

# How to use external libs

We've built the project structure mimicking the npm module.

As any other module you can use all npm modules as devDependencies for testing purposes (your tests will practically be executed in NodeJS).

**Browserify** is used *under the hood*, so you can take advantage of the increasingly growing range of npm modules that "play well" with browserify, and use these packages as **actual dependencies, inside your scripts**. If you haven't done that already, please, go through the documentation of [browserify](http://browserify.org/) to see what you can('t) do in such a script.

Besides using node packages, scrape.js has an access to the **pagehop** global object, which tells you what options did the user selected of your recipe, what was her/his query, how many results can you return and so on.

Before running the scrape.js script, the `pagehop` global object is created, which is similar for both of the scripts (page-loop.js and scrape.js), yet, a bit different.

# How long can it run?

Your recipe will timeout after **30 seconds**. Scrape can't go for longer than **10 seconds** (including loading the url), if it does, the callback in page-loop.js's call to pagehop.scrape() will return an error with type prop "timeout".

# Examples

Here is an example for a scrape.js script. This is from the BingSearch recipe.

```javascript
'use strict';

var getDomain = function(url) {
	var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
	return ( matches && matches[1] ) ? matches[1] : "";
};

var items = document.querySelectorAll("#b_results>li:not(.b_pag)");

var result = [];
for (var i = 0; i < items.length; i++) {
	var item = items[i],
		link = item.querySelector( "h2 a" );
	if ( link ) {
		var displayAddress = item.querySelector(".b_snippet>p") || item.querySelector(".b_caption>p");
		displayAddress = displayAddress ? displayAddress.textContent : link.href;

		result.push( {
			text: link.text + " (" + getDomain( link.href ) + ")",
			address: link.href,
			displayAddress: displayAddress,
			tooltip: displayAddress
		} );
	}
}

pagehop.finish( result );
```

Let's see what is the complete API of the pagehop global object

# pagehop API (scrape.js)

All data obtained from getter methods is immutable.

## pagehop.init(query, options, max)

This method is used by Pagehop, to preset the environment for running your scrape.js

You can use this method only in your tests, where the test framework doesn't call init automatically.

Lets go through the params:
- **query** - **string**, recipe's query as parsed by Pagehop.
- **options** - **array**, holding all options parsed from the pagehop query.
- **max** - integer, >=10, the maximal number of results that can be returned by the recipe.

## pagehop.getMaxCount()

Returns an **integer**. Although page-loop.js has an access to this prop, for convenience, we make it available in scrape.js, too. For example, when you always scrape 1 page (virtual scrolling etc.) you need to know how many items to return in the scrape.js.

## pagehop.getQuery()

Returns a **string**. Returns the recipe query as parsed by Pagehop.

This doesn't include the whole pagehop query - e.g. in `g <this is the query> :r $.*^` the parsed query will be `<this is the query>`.

## pagehop.getOptions()

Returns an **array** of strings.

Tools or non-recognized options will not be passed in here - e.g. `h :s :asdf` will produce only [":s"] for options (":s" is for Show HN posts with HackerNews recipe).

## pagehop.finish( results )

- **results** - **array** of result objects.

When your scrape is ready, you can return the results it has obtained with pagehop.finish( results ).

Result's format is entirely under your control (pagehop.finish( results ) in the page-loop.js should follow a scheme, though. Make sure to check that out).