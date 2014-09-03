title: Recipe's package.json
permalink: package-json-recipe/
---
# What does it do?

package.json is required by every npm NodeJS package. It's a configuration file, specifying the package's unique id, version, description, etc.

We decided to "step on the shoulders of giants" reusing this standard and we've built the project structure mimicking the npm module.

As any other module you can use all npm modules as devDependencies for testing purposes (your tests will practically be executed in NodeJS). And since we use browserify under the hood, you can use the increasingly growing range of npm modules that "play well" with browserify as **actual dependencies, inside your scripts**.

Besides fields specified by the npm standard, we add an additional section in it (pagehop) with system settings for Pagehop's loading and execution of the recipe.

But Pagehop doesn't rely only on this section - it reuses the already existing props like version, description and homepage.

# Spec

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

## description

String property containing a synopsis of what the recipe does.

## version

String, npm-compliant version number (as specified for NodeJS modules) to specify the version of the recipe.
If you have 2 recipes with the same pagehop.id in the package.json, the newer version will be loaded.

Whenever you change a recipe that is publicly used, you need to bump-up the version number, otherwise, people that already use your recipe, will not be able to update to the newer one (at least, not without deleting the recipe cache).

## homepage

String, url, pointing to a reference for your recipe. Pagehop's users will search for a reference to see how to use your recipe by writing `allr [your-recipe-id]`. Recipes should always have a help reference (usually README.md file in the root of the recipe). Use the README.md's of the recipes in the [public repository](https://github.com/pagehop/recipes) for a template.

## pagehop

This is a config section.

### pagehop.id

The unique ID of the recipe. The CLI tool (pagehop) should be checking for uniqueness in future releases, but for now, please, browse through the recipe dir names in the [public repository](https://github.com/pagehop/recipes) to make sure there will not be a duplication.

{% note warn pagehop.id validation %}
pagehop.id should be in PascalCase (exceptions such as *"jQuery"* are allowed) without spaces or special characters - only letters and numbers, always starting with letter.
{% endnote %}

{% note warn pagehop.id duplication %}
To avoid duplication of id's, name the dirs of your recipes the same as the pagehop.id, but everything with lowercased chars and "-"'s for a word separator. For example pagehop.id="HackerNews" => dirName="hacker-news".
{% endnote %}

### pagehop.options

Array of recipe options. Recipe options are boolean flags and are specified by **keyword** (string) that follow the same syntax as a tool name:

`:toolName1`

... and a **description** (string), which simply explains what will the option change in the behavior of the recipe.

### pagehop.hasQuery

Boolean, setting whether Pagehop should use everything after recipe's id and options in the Pagehop query, as an argument for a local search in the returned by the recipe results (HackerNews recipe, for example, doesn't use a query, so with this Pagehop query `hack local search`, knowing that HN's package.json:pagehop.hasQuery=false, it will execute this instead `hack :f local search`).