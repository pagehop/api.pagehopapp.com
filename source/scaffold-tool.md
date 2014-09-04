title: Scaffold Tool
permalink: scaffold-tool/
---
# What is a tool?

Tools are the Pagehop extensions for post processing of results derived from a recipe. Usually tools help you to locally filter the results you received from the web (collected by a recipe).

But they are not limitted to local work, only. Tools have the same permissions as recipes for accessing the web. E.g. there could be a tool crossreferencing results with a service, for example, it's possible.

Tools can be piped-up.

# Tool's file structure (scaffold)

Every tool is required to have these 2 files:

```
package.json
tool.js
```

Pagehop will not be able to load a tool, that doesn't have all of these files.

# How does it work?

In a nut-shell, tool.js is a script, which can use all node packages compliant with [browserify](http://browserify.org/), specified as dependencies in the package.json, and your tool project can use absolutely all node packages for testing (devDependencies in the package.json).

Pagehop "compiles" (more like "links") tool.js using browserify, producing self-contained (no external dependencies) script.

To correctly load and execute your tools, Pagehop uses the metadata in the package.json.

When the tool gets executed:
- it receives the results produced by the previous piece in the pipeline (another tool or the selected recipe);
- processes the results;
- produces its own results, passing them back to Pagehop.

If the tool fails, the currentResults will simply remain unchanged and Pagehop will pass the same results to the next tool on the chain (if none - this will be the results, the user will see listed in the UI).

# Scaffold a new tool with the pagehop CLI

If you haven't set your development environment, yet, check the [Development Overview](/development-overview/) to see how to do that.

To init a new tool in the current dir, you simply run:

```bash
$ pagehop tool --init
```

or

```bash
$ pagehop tool -i
```

You can (optionally) specify a path:

```bash
$ pagehop tool -i -p /Users/tsenkov/pagehop-my-great-tool/
```

After the project files are created, run this in the root of the project:

```bash
$ npm install
```

This way, all dependencies (only devDependencies are added by default - inspect the created package.json) are installed.

If you want to run the tests (there **are** few actual tests on the sample tool) and lint (jsHint is used) the code, run this (there should be no errors):

```bash
$ grunt
```

# Validate project structure and package.json

To validate the structure of your tool (including package.json's required properties' presence and type):

```bash
$ pagehop tool --validate
```

or

```bash
$ pagehop tool -v
```

And again, you can specify a path:

```bash
$ pagehop tool -v -p /Users/tsenkov/pagehop-my-great-tool/
```