title: Scaffold Recipe
permalink: scaffold-recipe/
---
# What is a recipe?

Recipes are the primary source of web urls for Pagehop. Mostly, recipes are used to make searches or acquire content, usually doing so by either scraping pages, or using web services.

# Recipe's file structure (scaffold)

Every recipe is required to have these 3 files:

```
package.json
page-loop.js
scrape.js
```

Pagehop will not be able to load a recipe, that doesn't have any of these files.

# Scaffold a new recipe with the pagehop CLI

If you haven't set your development environment, yet, check the [Development Overview](/development-overview/) to see how to do that.

To init a new recipe in the current dir, you simply run:

```bash
$ pagehop recipe --init
```

or

```bash
$ pagehop recipe -i
```

You can (optionally) specify a path:

```bash
$ pagehop recipe -i -p /Users/tsenkov/pagehop-my-great-recipe/
```

After the project files are created, run this in the root of the project:

```bash
$ npm install
```

This way, all dependencies (only devDependencies are added by default - inspect the created package.json) are installed.

If you want to run the tests (there **are** few actual tests on the sample recipe) and lint (jsHint is used) the code, run this (there should be no errors):

```bash
$ grunt
```

# Validate project structure and package.json

To validate the structure of your recipe (including package.json's required properties' presence and type):

```bash
$ pagehop recipe --validate
```

or

```bash
$ pagehop recipe -v
```

And again, you can specify a path:

```bash
$ pagehop recipe -v -p /Users/tsenkov/pagehop-my-great-recipe/
```

# How does it work?

In a nut-shell, page-loop.js and scrape.js are scripts that can use all node packages compliant with [browserify](http://browserify.org/), specified as dependencies in the package.json, and your recipe project can use absolutely all node packages for testing (devDependencies in the package.json).

Pagehop "compiles" (more like links) page-loop and scrape using browserify, producing self-contained (no external dependencies) scripts.

Let's see how should these files look and why.

## package.json

The minimal accepted (for loading by Pagehop) package.json looks like this:

```javascript
{
  "description": "System recipe, showing a list with all available recipes.",
  "version": "0.1.0",

  "homepage": "https://github.com/pagehop/recipes/tree/master/all-recipes",

  "pagehop": {
    "id": "AllRecipes",
    "options": [],
    "hasQuery": false
  }
}
```

In this file, you specify the settings of your recipe.

Here is how the actual package.json of this recipe (AllRecipes) looks like:

```javascript
{
  "name": "pagehop-all-recipes-recipe",
  "description": "System recipe, showing a list with all available recipes.",
  "version": "0.1.0",

  "homepage": "https://github.com/pagehop/recipes/tree/master/all-recipes",
  "author": {
    "name": "nicroto",
    "email": "nikolay@tsenkov.net",
    "url": "about.me/tsenkov"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/pagehop/recipes.git"
  },
  "bugs": {
    "url": "https://github.com/pagehop/recipes/issues"
  },
  "licenses": [],
  "engines": {
    "node": ">= 0.8.0"
  },
  "scripts": {
    "test": "mocha"
  },
  "dependencies": {
  },
  "devDependencies": {
    "grunt": "~0.4.1",
    "grunt-contrib-jshint": "~0.6.4",
    "grunt-simple-mocha": "~0.4.0",
    "mocha": "~1.13.0",
    "should": "~3.1.2",
    "pagehop": "^1.0.2"
  },
  "private": true,
  "keywords": [],

  "pagehop": {
    "id": "AllRecipes",
    "options": [],
    "hasQuery": false
  }
}
```

{% note tip See dependencies? %}
As you can see, this recipe doesn't have any dependencies. It has devDependencies, which are packages used in test.
{% endnote %}

And this is a sample with recipe options present:

```javascript
{
  "name": "pagehop-npm-search-recipe",
  "description": "Recipe for searching the NPM (Node Package Manager) registry.",
  "version": "0.1.0",

  "homepage": "https://github.com/pagehop/recipes/tree/master/npm-search",
  ...
  "pagehop": {
    "id": "NPMSearch",
    "options": [
      {
        "keyword": ":h",
        "description": "Uses homepage instead of npmjs.org for navigation."
      }
    ],
    "hasQuery": true
  }
}
```

Let's go through all of the properties.

### description

String property containing a synopsis of what the recipe does.

### version

String, npm-compliant version number (as specified for NodeJS modules) to specify the version of the recipe.
If you have 2 recipes with the same pagehop.id in the package.json, the newer version will be loaded.

Whenever you change a recipe that is publicly used, you need to bump-up the version number, otherwise, people that already use your recipe, will not be able to update to the newer one (at least, not without deleting the recipe cache).

### homepage

String, url, pointing to a reference for your recipe. Pagehop's users will search for a reference to see how to use your recipe by writing `allr [your-recipe-id]`. Recipes should always have a help reference (usually README.md file in the root of the recipe). Use the README.md's of the recipes in the [public repository](https://github.com/pagehop/recipes) for a template.

### pagehop

This is a config section.

#### pagehop.id

The unique ID of the recipe. The CLI tool (pagehop) should be checking for uniqueness in future releases, but for now, please, browse through the recipe dir names in the [public repository](https://github.com/pagehop/recipes) to make sure there will not be a duplication.

{% note warn pagehop.id validation %}
pagehop.id should be in PascalCase (exceptions such as *"jQuery"* are allowed) without spaces or special characters - only letters and numbers, always starting with letter.
{% endnote %}

{% note warn pagehop.id duplication %}
To avoid duplication of id's, name the dirs of your recipes the same as the pagehop.id, but everything with lowercased chars and "-"'s for a word separator. For example pagehop.id="HackerNews" => dirName="hacker-news".
{% endnote %}

#### pagehop.options

Array of recipe options. Recipe options are boolean flags and are specified by **keyword** (string) that follow the same syntax as a tool name:

`:toolName1`

... and a **description** (string), which simply explains what will the option change in the behavior of the recipe.

#### pagehop.hasQuery

Boolean, setting whether Pagehop should use everything after recipe's id and options in the Pagehop query, as an argument for a local search in the returned by the recipe results (HackerNews recipe, for example, doesn't use a query, so with this Pagehop query `hack local search`, knowing that HN's package.json:pagehop.hasQuery=false, it will execute this instead `hack :f local search`).

## page-loop.js

If you haven't done that already, please, go through the documentation of [browserify](http://browserify.org/) to see what you can('t) do in such a script.

Besides using node packages, page-loop has an access to the **pagehop** object, which tells you what options did the user selected of your recipe, what was her/his query, how many results can you return and so on. Check the [Recipe API article](/recipe-api/).

The page-loop, as we hope the name suggests, is responsible primarily for determining which urls should be scraped (as a main approach for obtaining data).

Once page-loop determines a url for scraping, it can execute the scrape.js script on this url, using the pagehop.scrape(...) method.

Page-loop might not use a scrape script. If you don't need to load the page in a browser (you don't need any scripts to load, content to show-up on an ajax call etc.), you can make requests from the page-loop as well as parse the returned html and scrape results.

If you consume a service - **even better**. Just make the calls from your page-loop.js.

{% note warn Always put a scrape.js file in your recipe %}
Even when it's empty, the scrape.js file is still required to exist.
{% endnote %}

Check the [Recipe API article](/recipe-api/) for a complete reference.

## scrape.js

For people that got directly here, without reading the above - if you haven't done that already, please, go through the documentation of [browserify](http://browserify.org/) to see what you can('t) do in such a script.

scrape.js is linked to all the libs (packages) that it uses and when the page-loop makes a call to pagehop.scrape(...), a headless (no-view) browser page loads the url to-be-scraped and after it's loaded scrape.js is injected on the page.

This way you can scrape any page content, static and dynamic.