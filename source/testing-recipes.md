title: Testing your recipes
permalink: testing-recipes/
---

# What should be tested?

Simply said - everything.

# How should my tests be structured?

The best advice here, would be to use the pagehop CLI tool ( `npm install -g pagehop` ).

Once you scaffold your project (check the [Scaffold](/scaffold-recipe/) article), you will get a nice example with a few sample tests. You can see how to include test-data (check scrape-test.js, and inspect the test/data dir) and how to order your test cases.

Use this example as a convention for structuring your tests.

{% note tip Use the public repository for Pagehop recipes. %}
You can use any recipe in the [public repo](https://github.com/pagehop/recipes) as a reference. Whenever you wonder how should you approach a problem, you can check if it was already solved by some of the recipes in the public repo (which seem similar to yours'). The repository will gradually grow and its value as a help reference, will too.
{% endnote %}

The convention is:
- Tests and all test data, are placed under a dir named test in the root of the recipe.
- Tests are written in the BDD style.
- Tests use should.js for assertions.
- There should be 1 (if only page-loop is used and no scrape) or 2 test files - page-loop-test.js and scrape-test.js.
- Bulky test-data should be in a separate dir (and **definitely** not in the test files):
	- usually, only scrape-test.js has a bigger-size data
		- test pages to be scraped - should be named with "_" as a word delimiter. Try to keep names descriptive, but short.
		- results.js should export properties named to match the names of the page files - the results of scraping page x_y.html, should be `exports.x_y = [...]`.

# The testing lib.

We've made an effort to simplify your development process, so we crafted a simple framework to help you test your recipes and tools.

You use the framework like this:

```javascript
...
var test = require("pagehop").test;

describe("recipe's pageLoop/scrape",function(){
	before( function(done) {
		test.init( done );
	} );
	// test cases making calls to test.pageLoop() or test.scrape()
	...
	after( function(done) {
		test.finalize( done );
	} );
} );
```

# How to test my page-loop.js?

## Test-cases

Here is how should your page-loop-test.js file roughly look like:

```javascript
'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToRecipe = pathUtils.resolve( pathUtils.join( __dirname, '../' ) );

describe("recipe's pageLoop",function(){
	before( function(done) {
		test.init( done );
	} );
	describe( "number of pages to be scraped", function() {
		it( "scrape 0 pages, if no query", function(done){
			test.pageLoop(
				...
			);
		});
		...
	} );
	describe( "urls of pages to be scraped", function() {
		it( "scrapes the correct urls", function(done){
			test.pageLoop(
				...
			);
		});
		...
	} );
	describe( "error handling", function() {
		it( "fails gracefully", function(done){
			test.pageLoop(
				...
			);
		});
	} );
	after( function(done) {
		test.finalize( done );
	} );
});
```

Try to always have this structure of `describe` branches filled with test cases for your specific recipe, if you get your data through scraping. But even if your recipe uses a web service or REST API, chances are - you will face pagination and you might be making multiple requests to different urls, so this structure still holds.

Of course, every case is unique, so do what you need in yours. These are just guide-lines for the general scenarios, not a manual for every case.

## How to implement test-cases?

For testing your page-loop.js, you can use one of the two overloads of the test.pageLoop() method.

### test.pageLoop()

**test.pageLoop( pathToRecipe, preLoopFunc, callback )**

- **pathToRecipe** - should be an absolute path to the directory of your recipe (usually resolving "../" should be the path).
- **preLoopFunc** - this is a function that will run in the same sandboxed environment as your pageLoop script, but **before** it. In it, you are suppose to predefine the conditions in which the pageLoop will be running. You usually do this, by initializing the pagehop object with data.
- **callback( urls, result )/callback( error )** - the main idea (with the exception when an api is used instead of scraping) of the pageLoop is to select urls to be scraped. In your success test cases, expect `urls` and `result` to be passed. In your error handling tests you can expect only an `error` argument.

Here is a sample success test case:

```javascript
it( "scrape 1 page, if maxCount=30", function(done){
	test.pageLoop(
		pathUtils.resolve( __dirname, '../' ),
		function() {
			var query = "irrelevant",
				options = [],
				max = 30,
				scrapeScript = "irrelevant";
			pagehop.init( query, options, max, scrapeScript );
		},
		function(urls, result) {
			should.exist( urls );
			should.exist( result );
			urls.length.should.equal( 1 );
			result.length.should.equal( 0 );
			done();
		}
	);
});
```

This is what happens here:

1. The preLoopFunc inits pagehop's global object:
	- **query** ("irrelevant", simply is a word game since here in the test case, it's not of any significance);
	- **no options** (recipe options);
	- **maxResultsCount** of 30 (the upper limit of the number of returned results);
	- **scrapeScript** which will never be runned (test.pageLoop internally mocks the pagehop.scrape() method, so no real scrapes are executed).
2. We expect the following in the callback:
	- both urls and result should be sent;
	- urls should hold only 1 item (proving scrape was attempted on only 1 url);
	- results should be an empty array (testing how does test.pageLoop work more than the actual recipe, but just to show you what you should expect)

This method should be used for tests expecting of 0-1 page-scrapes. Here is what you should use for more than 1 scrapes.

Here is an example for an error handling case:

```javascript
it( "finishes with error", function(done){
	test.pageLoop(
		pathToRecipe,
		function() {
			var query = "irrelevant",
				options = [],
				max = 200,
				scrapeScript = "irrelevant";
			pagehop.scrape = function(url, callback) {
				callback( "blowup" );
			};
			pagehop.init( query, options, max, scrapeScript );
		},
		function(error) {
			should.exist( error );
			error.should.equal( "blowup" );
			done();
		}
	);
});
```

**(+overload) test.pageLoop( pathToRecipe, preLoopFunc, intermediateResults, callback )**

- **pathToRecipe** - should be an absolute path to the directory of your recipe (usually resolving "../" should be the path).
- **preLoopFunc** - this is a function that will run in the same sandboxed environment as your pageLoop script, but **before** it. In it, you are suppose to predefine the conditions in which the pageLoop will be running. You usually do this, by initializing the pagehop object with data.
- **intermediateResults** - array holding mocks of results for the pagehop.scrape calls in the form of:

```javascript
[{
	error: { type: "...", message: "..." } /* or undefined */,
	result: /* whatever you sent from scrape.js */
},
...
]
```

- **callback( urls, result )/callback( error )** - the main idea (with the exception when an api is used instead of scraping) of the pageLoop is to select urls to be scraped. In your success test cases, expect `urls` and `result` to be passed. In your error handling tests you can expect only an `error` argument.

Here is a real-life example (HackerNews recipe) using this overload:

```javascript
it( "scrapes the correct urls", function(done){
	var intermediateResults = [
		{
			result: {
				nextUrl: "https://news.ycombinator.com/x?fnid=xwRo27NTrZmxqQK6yDFHnv",
				items: Array( 10 )
			}
		},
		{
			result: {
				nextUrl: "https://news.ycombinator.com/x?fnid=xwRo27NTrZmxqQK6yDFHn2",
				items: Array( 10 )
			}
		},
		{
			result: {
				nextUrl: "https://news.ycombinator.com/x?fnid=xwRo27NTrZmxqQK6yDFHn3",
				items: Array( 10 )
			}
		},
		{
			result: {
				nextUrl: "https://news.ycombinator.com/x?fnid=xwRo27NTrZmxqQK6yDFHn4",
				items: Array( 10 )
			}
		}
	];

	test.pageLoop(
		pathToRecipe,
		function() {
			var query = "irrelevant",
				options = [],
				max = 40,
				scrapeScript = "irrelevant";
			window.pagehop.init( query, options, max, scrapeScript );
		},
		intermediateResults,
		function(urls, result) {
			should.exist( urls );
			should.exist( result );
			urls.should.eql( [ "http://news.ycombinator.com/" ].concat( intermediateResults.map( function(item) {
				return item.result.nextUrl;
			} ).slice( 0, intermediateResults.length - 1 ) ) );
			result.length.should.equal( 40 );
			done();
		}
	);
});
```

In this example we pass intermediate results, which simulates the way that your pageLoop script would be getting results from page scraping.

If you are wondering why we cut the last passed result from the array when we compare for deep equality in the callback - the maxResultsCount is 40, but we practically set for 5-page sequence of scraping (passing 4 as intermediate results + the landing page of hacker news = 5) and 5 * 10 results/page = 50 results. The pageLoop shouldn't continue after getting to 40, therefore the last page isn't scraped.

# How to test my scrape.js?

## Test-cases

Here is how should your scrape-test.js file roughly look like (with some ideas for test cases):

```javascript
'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToRecipe = pathUtils.resolve( pathUtils.join( __dirname, '../' ) );

describe("recipe's scrape",function(){
	before( function(done) {
		test.init( done );
	} );
	it( "scrapes a local page file without results", function(done){
		test.scrape(
			...
		);
	});
	it( "scrapes a local page file with results and link to next page", function(done){
		test.scrape(
			...
		);
	});
	it( "scrapes a local page file ignoring bad results", function(done){
		test.scrape(
			...
		);
	});
	...
	after( function(done) {
		test.finalize( done );
	} );
});
```
These few test cases (check their titles) are probably the most common cases that we have encountered, writing Pagehop's first recipes.

## How to implement test-cases?

For testing your scrape.js, you can use one of the two overloads of the test.scrape() method.

### test.scrape()

**test.scrape( pathToRecipe, pagePath, callback )**

- **pathToRecipe** - should be an absolute path to the directory of your recipe (usually resolving "../" should be the path).
- **pagePath** - url to a test page to be scraped (usually local file, using the file:// protocol). The url should be absolute - test.scrape() will not try to do any further resolution on it.
- **callback( result )/callback( error )** - in your success test cases, expect the `result` parameter to be passed. In your error handling tests you can expect an `error` argument, instead.

Here is a nice example from the template recipe created with `pagehop recipe --init` with the pagehop cli tool:

```javascript
test.scrape(
	pathToRecipe,
	"file://" + pathUtils.resolve( __dirname, "data", pageName ),
	function(results) {
		should.exist( results );
		results.should.eql( expectedResults );
		done();
	}
);
```

**(+overload) test.scrape( pathToRecipe, pagePath, preScrapeFunc, callback )**

- **pathToRecipe** - should be an absolute path to the directory of your recipe (usually resolving "../" should be the path).
- **pagePath** - url to a test page to be scraped (usually local file, using the file:// protocol). The url should be absolute - test.scrape() will not try to do any further resolution on it.
- **preScrapeFunc** - this is a function that will run in the same sandboxed environment as your scrape script, but **before** it. In it, you are suppose to predefine the conditions in which the scrape will be running. You usually do this, by initializing the pagehop object with data and/or settings some global mocks, expected by the scrape script.
- **callback( result )/callback( error )** - in your success test cases, expect the `result` parameter to be passed. In your error handling tests you can expect an `error` argument, instead.

Here is a real example (Hacker News recipe):

```javascript
// scrape-test.js
var testScraping = function( pageName, expectedResults, done ) {
	test.scrape(
		pathToRecipe,
		"file://" + pathUtils.resolve( __dirname, "data", pageName ),
		function() {
			window._pagehopTest = {
				isFirstJobsPage: true,
				isFirstShowPage: true
			};
		},
		function(results) {
			should.exist( results );
			removeFSPath( results ).should.eql( removeFSPath( expectedResults ) );
			done();
		}
	);
};

describe( "hacker-news recipe's scrape", function() {
	before( function(done) {
		test.init( done );
	} );
	it( "scrapes default page with 'More' results", function(done) {
		testScraping(
			"default.html",
			expected.default,
			done
		);
	} );
	...
} );
```

If you wonder about the _pagehopTest prop on window, here is how it connects with the actual code of scrape,js

```javascript
// scrape.js
...
// for tests
if ( window._pagehopTest ) {
	if ( window._pagehopTest.isFirstJobsPage ) {
		isFirstJobsPage = true;
	}
	if ( window._pagehopTest.isFirstShowPage ) {
		isFirstShowPage = true;
	}
}
```

Sometimes this is necessary, that the tested scripts know they are being tested.

For example when they can only derive some condition of the current state by the current url - if you are scraping a local page, this becomes impossible (e.g. "file:///Users/tsenkov/recipes/my-recipe/test/data/wiki_math.html", instead of "http://en.wikipedia.org/wiki/math").

However, this should only be used **as a last resort**.

# Common difficulties with testing

## Saved test pages have local links like "file:///Users/..."

When you save a page from the browser, the local links sometimes get resolved to absolute paths and since the page is on your local drives, urls use the file:// protocol.

This creates issues when comparing expected results with the results scraped from local file page. E.g.:

```
file:///Users/jonhdoe/dev/recipes/hello-pagehop/test/data/test-page.html/inner-link !== /inner-link
```

To get rid of these you can add and use this function in your scrape-test.js

```javascript
var removeFSPath = function(items) {
	var stripFS = function(path) {
		var result = path;
		if ( path && ( path.indexOf( "file://" ) === 0 ) ) {
			result = path.substring( path.lastIndexOf( "/" ) );
		}
		return result;
	};

	for ( var i = 0; i < items.length; i++ ) {
		var item  = items[i];
		if ( item.address ) {
			item.address = stripFS( item.address );
		}
	}
	return items;
};
...
describe( "scrape", function() {
	...
	it ( "works", function() {
		test.scrape(
			pathToRecipe,
			function(results) {
				...
				removeFSPath( results ).should.eql( removeFSPath( expectedResults ) );
			}
		);
	} );
	...
} );
```

Depending on the structure of the results that you return from scrape.js, the function might need to be changed a bit (e.g if other fields have local urls etc.).