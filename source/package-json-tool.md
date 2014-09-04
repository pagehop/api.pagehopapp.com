title: Tool's package.json
permalink: package-json-tool/
---
# What does it do?

package.json is required by every npm NodeJS package. It's a configuration file, specifying the package's unique id, version, description, etc.

We decided to "step on the shoulders of giants" reusing this standard and we've built the project structure mimicking the npm module.

As any other module you can use all npm modules as devDependencies for testing purposes (your tests will practically be executed in NodeJS). And since we use browserify under the hood, you can use the increasingly growing range of npm modules that "play well" with browserify as **actual dependencies, inside your scripts**.

Besides fields specified by the npm standard, we add an additional section in it (pagehop) with system settings for Pagehop's loading and execution of the tool.

But Pagehop doesn't rely only on this section - it reuses the already existing props like version, description and homepage.

# Spec

The minimal accepted (for loading by Pagehop) package.json looks like this:

```javascript
{
  "description": "Converts the results in a list of addresses (for search on address).",
  "version": "0.1.0",

  "homepage": "https://github.com/pagehop/tools/tree/master/addresses",

  "pagehop": {
    "id": "Addresses",
    "keyword": ":a",
    "hasArgument": false
  }
}
```

In this file, you specify the settings of your tool.

Here is how the actual package.json of this tool (Addresses) looks like:

```javascript
{
  "name": "pagehop-addresses-tool",
  "description": "Converts the results in a list of addresses (for search on address).",
  "version": "0.1.0",
  "homepage": "https://github.com/pagehop/tools/tree/master/addresses",
  "author": {
    "name": "nicroto",
    "email": "nikolay@tsenkov.net",
    "url": "about.me/tsenkov"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/pagehop/tools.git"
  },
  "bugs": {
    "url": "https://github.com/pagehop/tools/issues"
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
    "id": "Addresses",
    "keyword": ":a",
    "hasArgument": false
  }
}
```

{% note tip See dependencies? %}
As you can see, this tool doesn't have any dependencies. It has devDependencies, which are packages used in test. Still, you can use dependencies from npm, they just need to support browserify.
{% endnote %}

Let's go through all of the properties.

## description

String property containing a synopsis of what the tool does.

## version

String, npm-compliant version number (as specified for NodeJS modules) to specify the version of the tool.
If you have 2 tools with the same pagehop.id in the package.json, the newer version will be loaded.

Whenever you change a tool that is publicly used, you need to bump-up the version number, otherwise, people that already use your tool, will not be able to update to the newer one (at least, not without deleting the tool cache).

## homepage

String, url, pointing to a reference for your tool. Pagehop's users will search for a reference to see how to use your tool by writing `allt [your-tool-id]`. Tools should always have a help reference (usually README.md file in the root of the tool). Use the README.md's of the tools in the [public repository](https://github.com/pagehop/tools) for a template.

## pagehop

This is a config section.

### pagehop.id

The unique ID of the tool. The CLI tool (pagehop) should be checking for uniqueness in future releases, but for now, please, browse through the tool dir names in the [public repository](https://github.com/pagehop/tools) to make sure there will not be a duplication.

{% note warn pagehop.id validation %}
pagehop.id should be in PascalCase (exceptions such as *"jQuery"* are allowed) without spaces or special characters - only letters and numbers, always starting with letter.
{% endnote %}

{% note warn pagehop.id duplication %}
To avoid duplication of id's, name the dirs of your tools the same as the pagehop.id, but everything with lowercased chars and "-"'s for a word separator. For example pagehop.id="HackerNews" => dirName="hacker-news".
{% endnote %}

### pagehop.keyword

String, following the same syntax as recipe option keyword:

`:optionName1`

{% note warn pagehop.keyword validation %}
Keywords should start with ":", followed by a single literal in camelCase, without spaces or special characters - only letters and numbers, always starting with letter. E.g.:
- `:keyword` is valid
- `:anotherKeyword1`is valid
- `:Keyword` is valid, but doesn't follow the convention
- `:1keyword` isn't valid
- `:$keyword` isn't valid
{% endnote %}

### pagehop.hasArgument

Boolean, setting whether Pagehop should pass anything written between the current and the next tool keywords in the Pagehop query, as an argument to the current tool.

Addresses tool, for example, doesn't accept an argument, so with this Pagehop query:

`google search for this :a local search`

..., knowing that Addresses' package.json:pagehop.hasArgument=false, it will execute this instead:

`google search for this :a :f local search`