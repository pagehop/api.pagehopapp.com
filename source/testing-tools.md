title: Testing your tools
permalink: testing-tools/
---

# What should be tested?

Simply said - everything.

# How should my tests be structured?

The best advice here, would be to use the pagehop CLI tool ( `npm install -g pagehop` ).

Once you scaffold your project (check the [Scaffold](/scaffold-tool/) article), you will get a nice example with a few sample tests.

Use this example as a convention for structuring your tests.

{% note tip Use the public repository for Pagehop tools. %}
You can use any tool in the [public repo](https://github.com/pagehop/tools) as a reference. Whenever you wonder how should you approach a problem, you can check if it was already solved by some of the tools in the public repo (which tool seems similar to yours?). The repository will gradually grow and its value as a help reference, will too.
{% endnote %}

The convention is:
- Tests and all test data, are placed under a dir named test in the root of the tool.
- Tests are written in the BDD style.
- Tests use should.js for assertions.
- There should be 1 test file - tool-test.js. Tools should have a single purpose and therefore should be kept simple without too many variable cases.
- Bulky test-data should be in a separate dir test/data (and **definitely** not in the test file(s))

# The testing lib.

We've made an effort to simplify your development process, so we crafted a simple framework to help you test your recipes and tools.

You use the framework like this:

```javascript
...
var test = require("pagehop").test;

describe("tool",function() {
	before( function(done) {
		test.init( done );
	} );
	// test cases making calls to test.tool()
	...
	after( function(done) {
		test.finalize( done );
	} );
} );
```

# How to test my tool.js?

## Test-cases

Here is how should your tool-test.js file roughly look like:

```javascript
'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToTool = pathUtils.resolve( pathUtils.join( __dirname, '../' ) );

describe("tool",function() {
	before( function(done) {
		test.init( done );
	} );
	it( "should return an empty array if no results", function(done){
		test.tool(
			...
		);
	} );
	it( "it should add to the hops array", function(done){
		test.tool(
			...
		);
	} );
	...
	after( function(done) {
		test.finalize( done );
	} );
});
```

These are just 2 sample cases and there is no requirement to have these exact cases in your test - just an idea. Probably the first one is pretty much universal, but the second one - not all tools change the hops array.

## How to implement test-cases?

For testing your tool.js, you can use the test.tool() method.

**test.tool( pathToTool, preToolFunc, callback )**

- **pathToTool** - should be an absolute path to the directory of your tool (usually resolving "../" should be the path).
- **preToolFunc** - this is a function that will run in the same sandboxed environment as your tool script, but **before** it. In it, you are suppose to predefine the conditions in which the tool will be running. You usually do this, by initializing the pagehop object with data and/or settings some global mocks, expected by the tool script.
- **callback( result )/callback( error )** - in your success test cases, expect the `result` parameter to be passed. In your error handling tests you can expect an `error` argument, instead.

Here is a sample success case from the sample tool created on `pagehop tool --init` with the pagehop cli tool:

```javascript
var pathToTool = pathUtils.resolve( __dirname, '../' );
...
it( "should set items to empty array if no results", function(done){
	test.tool(
		pathToTool,
		function() {
			var currentResults = [],
				hops = [],
				argument = "irrelevant",
				selection = 0,
				pagehop = window.pagehop;

			pagehop.init( currentResults, hops, argument, selection );
		},
		function(results) {
			should.exist( results );
			results.should.eql( {
				items: [],
				hops: [],
				selection: 0
			} );
			done();
		}
	);
} );
```