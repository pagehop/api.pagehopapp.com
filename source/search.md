title: Search
permalink: search/
---
In this article we will take you through the search capabilities of Pagehop.

## One interface, one set of tools for all searches

Using Pagehop, you no longer depend on the mouse/trackpad, tabbing or key shortcuts specific for every page's implementation in order to navigate through the results of your searches.

No matter if you search horizontally (Google, Bing, DuckDuckGo, etc.) or vertically (querying specific resource like StackOverflow or Wikipedia), you use 1 interface, one set of powerful tools and you can stay on the keyboard, 100% of the time.

## General Search examples

Here at Universless, we believe that, to prove a point, **there is no better argument than results**. That's why this section of the documentation (as many others, too) will contain only examples that should be very useful for you and solve problems you are having with the current state of search engines and The Web as a whole.

### Get more than 10 results on a Google Search and no pages

When you search in Google, most of the time, there are a lot more than 10 results (most of the time results are more than 1000).

But if you want to find a text in the results in the browser (`⌘ + F`), you always get to search only on the 10 results displayed on the current page you are viewing.

Pagehop, by default, returns the first 30 results (configurable for more in the *Settings -> Number of results*). These are the first 3 pages (3 * 10) of results. This covers > 99.7% of searches in Google. That's right. Did you know that less than 1% go to the 3rd page of results - check [this study](http://searchenginewatch.com/article/2049695/Top-Google-Result-Gets-36.4-of-Clicks-Study).

Here is Pagehop configured for 90 results (**9 pages**) searching for "Java web frameworks":

![](/search-resources/search-90-results.png)

### Filter results with regular expression

If we want to filter the results we got in the last example, with, lest say, a regex to match all results having the singular "framework" form all that have the plural "framework**s**", we can do just that using the :r (Regex) tool.

Here is how:

![](/search-resources/regex-filter.png)

### Filter results matching on addresses instead of titles

What if we want to match results pointing to domains of the type [something]framework.[extension].

We can do this by first using the :a (Addresses) tool, to show us the addresses of the results (thus making search on them instead on titles) and then piping a :r filtering at the end:

![](/search-resources/filter-on-url.png)

### Fuzzy matching results as GotoAnywhere in SublimeText

If you use Fuzzy matching somewhere on your computer, you probably know the frustration of going to the browser and searching only through *absolute*-matching of strings.

If you search for a very common personal name in Google, the :f (Fuzzy) tool will be a nice choice to filter the results:

![](/search-resources/fuzzy-matching.png)

## Vertical Search Examples

Although horizontal search is at a pretty descent state, sometimes we know what source we want to get results from. Here are some examples in using vertical search engines with Pagehop.

### Search in Wikipedia

#### The old way
If you use Google (or pretty much any other horizonatal search engine) and you want to search in Wikipedia, what you probably do is:
1. Open up a browser (if not in the browser, yet);
2. Open-up a new tab;
3. Focus the address bar (if not done automatically for you);
4. Write your query ending with " wiki";
5. Press Enter.

#### The new way
In Pagehop you have to:
1. Open-up Pagehop;
2. Write your query starting with "wiki " (right now "w " is enough with the default set of recipes).

Both of these procedures end up with results for your query.

Even if we turn a blind-eye to the awesome tooling (:r, :f, :a, etc.), Pagehop still gives you 2 big advantages:
- You get faster to the results (smaller procedure);
- All results are coming from Wikipedia, not some (potentially none when searching through horizontal engine) all of them.

Here is an example:

![](/search-resources/wiki-search.png)

### Search StackOverflow

You probably guessed that already - writing "s [your-query]" will search in StackOverflow.

![](/search-resources/stack-overflow-search.png)

### Youtube, MDN, jQuery API, NPM and many more to come

There probably isn't a website you search in, where Pagehop wouldn't be an option. We believe that Pagehop's development will explode in a rich set of Recipes, Tools and probably other pieces of beautifully crafted code we haven't even dreamed about, yet.

So, if you use a resource that has no recipe for Pagehop - get onboard, write it yourself and share it with the community (or not).	