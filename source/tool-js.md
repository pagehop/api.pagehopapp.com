title: tool-js
permalink: tool-js/
---

# What does it do?

The tool.js holds the implementation of the tool.

It, usually executes in these 3 steps:
- it receives the results produced by the previous piece in the pipeline (another tool or the selected recipe);
- processes the results;
- produces its own results, passing them back to Pagehop.

# How to use external libs

We've built the project structure mimicking the npm module.

As any other module you can use all npm modules as devDependencies for testing purposes (your tests will practically be executed in NodeJS).

**Browserify** is used *under the hood*, so you can take advantage of the increasingly growing range of npm modules that "play well" with browserify, and use these packages as **actual dependencies, inside your script**. If you haven't done that already, please, go through the documentation of [browserify](http://browserify.org/) to see what you can('t) do in such a script.

Besides using node packages, tool.js has an access to the **pagehop** global object, which gives you access to the currentResults, the selected item in these results, the passed argument and the hops (pages in the history/breadcrumb of pages the user hopped from).

Before running the tool.js script, the `pagehop` global object is created.

# How long can it run?

A tool can't run for longer than **10 seconds**, if it does, Pagehop will kill the execution and will continue with the next tool, passing the results it passed to the one that timed-out (unchanged).

# What if it fails?

Same as timeout. (look at the previous section)

# Examples

Here is an example for a tool.js script. This is from the Addresses tool.

```javascript
'use strict';

var currentResults = pagehop.getCurrentResults(),
	results = [];

for ( var i = 0; i < currentResults.length; i++ ) {
	var item = currentResults[i];
	if ( item.address ) {
		item.displayAddress = item.text;
		item.text = item.address;
		delete item.displayText;
		results.push( item );
	}
}

pagehop.finish( results );
```

Let's see what is the complete API of the pagehop global object for tools.

# pagehop API (tool.js)

Not all data obtained from getter methods is immutable (check pagehop.getHops()).

## pagehop.init(currentResults, hops, argument, selection)

This method is used by Pagehop, to preset the environment for running your tool.js

You can use this method only in your tests, where the test framework doesn't call init automatically.

Lets go through the params:
- **currentResults** - **array** of result objects. This array is either produced by a recipe, or by the previous tool on the pipeline.
- **hops** - **MUTABLE array** of objects specifying addresses the user had "hopped of". Here is how the Links tool uses the hops array:

```javascript
pagehop.getHops().push( {
	text: selected.text,
	address: selected.address
} );
```

- **argument** - **string**, the tool's passed argument as parsed from the pagehop query.

Example - in this query `g lets search google :r $[^test] :a :l`, the :r Regex tool will get "$[^test]" as an argument.

- **selection** - **integer**, specifies the index of the selected item in the currentResults.

## pagehop.getCurrentResults()

Returns an **array** with the results as returned by the selected recipe or by the previous tool in the pipeline.

The result objects follow this structure:

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

## pagehop.getHops()

Returns a **MUTABLE array** of objects specifying addresses the user had "hopped of". Here is how the Links tool uses the hops array and how the objects in it look like:

```javascript
pagehop.getHops().push( {
	text: selected.text,
	address: selected.address
} );
```

## pagehop.getArgument()

Returns a **string** - the tool's passed argument as parsed from the pagehop query.

Example - in this query `g lets search google :r $[^test] :a :l`, the :r Regex tool will get "$[^test]" as an argument.

## pagehop.getSelection()

Returns an **integer**, specifies the index of the selected item in the currentResults.

## pagehop.setSelection( value )

- **value** - **integer** setting new selection index for the selected in the results that will be returned by the tool.

## (experimental) pagehop.task( script, callback, url )

- **script** - **string** of a self-calling function (clojure) to be executed in a separate environment/page/thread.
- **callback** - **function** receiving 2 parameters - **error** and **result**.
- **url** - **optional param**, **string**, url to be loaded in the new page, before executing the passed script.

This method is still experimental and we don't recommend you to use it.

The use-case we have in mind is when you need to execute tasks in parallel for faster processing, or when the tool requires data from the web.

```javascript
...
var task = function() {
	...
	window.boxApi.finishTask( result );
};
pagehop.task( "(" + task + ")();", function(error, result) {
	if ( error ) {
		...
	}
	if ( result ) {
		...
	}
}, "http://example.com/some/page/for/tool/reference/" );
```

With this method you can scrape a page in a tool, or execute parallel processing algorithm on the results.

## pagehop.finishWithError( error )

If your tool is prevented by an obstacle that it cannot overcome you can fail gracefully with pagehop.finishWithError().

Error object must be with this structure:

```javascript
{
	type: /* string */,
	message: /* string */
}
```

## pagehop.finish( results )

- **results** - **array** of result objects.

When your tool is ready, you can return the results it has produced with pagehop.finish( results ).

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

The rules for result structure and visualization in the UI remain the same on the pipeline of recipe and tools:

If you provide, both, text and displayText, displayText will be shown as the first row of your Pagehop result, but text will still be the field used for searches (:r will not use the displayText to match against and the produced results will have their displayText fields redone with the formatting highlighting the matched parts). If only text is present, then it will be displayed on the first row.

If you provide, both, address and displayAddress, only displayAddress will be shown, on the second row.

By default, address is show in a tooltip on long-hover on items in the UI. You can pass a different tooltip text to replace it.

Starting from ver1.2, you can optionally supply a preview html to be loaded in Pagehop's UI. Recipes such as DefineWord, CodeSearch and others use it - it can be used in the same manner with tools. Local resources you reffer from this html should assume the tool's root dir as / (web root).

# Keep it simple!

Our final piece of advice, before we move on to [Testing](/testing-tools/) is: **keep your tool simple**!

Every tool should have a single purpose, without many variable subcases.

Whenever you sense that your tool starts handling multiple cases - consider extracting another tool(s) from it as separate project(s).