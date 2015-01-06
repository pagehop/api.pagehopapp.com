title: Overview
permalink: overview/
---
After you install Pagehop, you will notice a new icon in your MenuBar.

![](/overview-resources/menu-bar-icon.png)

## Open Pagehop

To open Pagehop, you need to press the key shortcut (default is **Ctrl + ⌥ + Space**) or open it from the menu in the MenuBar.

OK, after you know what the shortcut is - press it, and you should get something like this:

![](/overview-resources/pagehop.png)

Now, you can begin exploring the default *recipes* bundled-up with the app. As the placeholder text suggest you could write *"sys :r"*. You should see something like this:

![](/overview-resources/all-recipes.png)

## Recipes and Tools

![](/common-resources/pagehop-query-syntax.png)

A *recipe*, in Pagehop's terminology, is the initial source of results. Searching in Google is done by a recipe, searching in StackOverflow, too.

*Tool*, on the other hand, can only be used for post-processing of results.

## Using recipes

Whenever you want to use a specific recipe, you need to follow this procedure:
1. Identify which recipe you want to use by writing its name (Recipe Lexeme in the diagram above) (no spaces allowed in the name) or such part of it, that Pagehop will display it as a first option in the results bellow;
2. Write the recipe option(s) (if any) which you want to use; **(optional)**
3. Write a query (if the recipe accepts one). **(optional)**

All of these parts are delimited with " " (whitespace).

Most of the recipes don't provide options, but **accept query** (all of the searches). For example here is a search with Google with query *"web development"*:

![](/overview-resources/google-search.png)

### Default recipe is GoogleSearch

If no recipe is recognized, Pagehop will perform a search in Google.

![](/overview-resources/default-recipe.png)

Check how awesome do queries look on [Docs browsing, when making a Google search without specifying the recipe](/docs-browsing/#Navigating_through_static_websites).

### Recipe options

Options are boolean type (true/false) of flags. They start with a **:** sign and end with an alphanumeric value (**":option"** is a valid option name, but "option:", "option", ":$", ":-" etc. aren't).

For example, the NPMSearch recipe - it has an option called :h, which stands for *"Homepage"* and gives results pointing to the homepages of the found NodeJS packages instead of their pages on the npmjs.org website. So if we want to search for a package, but go to its home page, we can do this by specifying the option :h before writing the search query (**check the tooltip**):

![](/overview-resources/npm-search-option.png)

And if we haven't used the :h (Homepage), check where does the result points now - **npmjs.org**:

![](/overview-resources/npm-search.png)

### Recipes without a query

Some recipes' purpose is to provide a specific set of results (news for example), and don't accept a query.

Here is an example with the HackerNews recipe - writing "h" will pull the latest news as listed on (http://news.ycombinator.com):

![](/overview-resources/hacker-news.png)

Similar to [tools without arguments](#Tools_without_an_argument) everything written as a recipe query, when recipe doesn't accept one, is considered as fuzzy matching (the same as writing ":f stringtomatch").

Here is an example:

![](/overview-resources/recipe-without-query.png)

is the same as:

![](/overview-resources/recipe-without-query-and-fuzzy.png)

This is made for convenience, since we noticed that we were constantly making a fuzzy matching in such scenarios. 

## Using Tools

You probably have noticed the ":sel 4" at the end of the previous section. This is a system tool (Select) which controls which item in the current results is selected. Yes, you can control even the selection of the results through your Pagehop query.

":sel 4" basically says "Select the 5th (starting from 0) element in the results.".

This tool is an example of a **tool accepting argument**. But there are tools that don't need arguments (unchangeable single purpose without a need for any further refinement).

### Tools with an argument

Whenever you get many results, from a recipe it's nice to be able to filter those results locally.

In the last primer, we could use a filter to find the exact string "express" in the result titles. We can do this using the **:r** (Regex) tool. Here is how:

![](/overview-resources/regex.png)

This gets us closer to the desired result (it's now on the second row), but in this case, it's more convenient to use is another tool - **:f** Fuzzy (fuzzy matching) instead of Regex. Here is how we can directly select what we want:

![](/overview-resources/fuzzy.png)

### Tools without an argument

Sometimes you need to perform a task on the current results that we've got without specifying nothing, but the task itself. That's there are tools that don't accept an argument.

If we continue on the last example, but scrap the local filtering (fuzzy or regex) and we want to see the actual urls that the results are pointing to, we can do this using the **:a** (Addresses) tool.

![](/overview-resources/addresses.png)

But we could still add an argument at the end... You wonder why? It's really simple, actually - we have found it very convenient whenever something doesn't accept an argument, the next thing written (before the next tool definition) is considered a search (fuzzy) in the current results. This means that if we can filter the results fuzzy matching on their urls, here it is:

![](/overview-resources/addresses-with-fuzzy.png)

### Piping tools

In the last example, probably didn't take the best approach to get to the desired result, but when you got so close to the result is better not to start over, but just use another tool to get to this address. As we can see, it's impossible to position the current second result on first place using :f (Fuzzy). If we can somehow say "get the results **ending** with '/express'"... You know what - we can! We can use a regex for this. Here we pipe the :r tool after the :a tool:

![](/overview-resources/piping.png)

In the language of Regular Expressions, the **$** sign means "end of input", which in our case (single-line string) means exactly **"end of string"**.

## Settings

To check what is the default shortcut (or change it), go to Settings from the MenuBar.

![](/overview-resources/menu-settings.png)

You should get a window like this one:

![](/overview-resources/settings-window.png)