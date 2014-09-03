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

# How does it work?

In a nut-shell, page-loop.js and scrape.js are scripts that can use all node packages compliant with [browserify](http://browserify.org/), specified as dependencies in the package.json, and your recipe project can use absolutely all node packages for testing (devDependencies in the package.json).

Pagehop "compiles" (more like links) page-loop and scrape using browserify, producing self-contained (no external dependencies) scripts.

To correctly load and execute your recipes, Pagehop uses the metadata in the package.json.

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