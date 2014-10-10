title: Page-hopping
permalink: page-hopping/
---
Isn't search just about all that Pagehop has to offer? This article explains the first feature that Pagehop had - Page-hopping! :)

## Pagehop tackled a single problem, initially

- **navigating through known set of hyperlinks without an actual rendered page, just using the keyboard**.

This is a task, virtually, everyone performs many times a day.

Why **wait for loading of styles and images** every step of a well known way to a resource on The Web? Why **scroll and click**, when this could be done on the keyboard? Why not just **follow the links** without a view, but only by a **textual trail**? And when you are finally there - open up a browser and view the page as it was intended to.

### You might wonder - Why not use bookmarks?

Bookmarks are great. But they don't do well in case of 10's or 100's of pages from a single resource - it becomes a mess to manage and a real chore to search through.

### And if you're thinking - Why not Google it?

Although Google (and the other major horizontal search engines) is awesome, it's not always easier to identify your final destination in a query, than actually navigating through it.

Sometimes pages are not optimized for indexing and aren't easy to search for, sometimes the query is too ambiguous and gives you too much *noise* in the results and sometimes people just feel more comfortable manually going to place they know well, already.

### Page-hopping

Let's see how do we solve this.

To get to the first address of your navigation procedure, you can simply write the first url to visit, or use any of the recipes at your disposal, in order to get it.

{% note tip Shortcut for appending :l %}
If the focus in the results, pressing ⃗ (RightArrow key) will append :l to the end of the query.
{% endnote %}

Having the first address selected in the results, we can get all the hyperlinks on it using the :l (Links) tool. And from there on, we simply pipe :l multiple times until we get where we want.

Here is an example:
- The documentation of Pagehop is powered by the Hexo static site generator. Here is how our staff was getting to Hexo's own documentation and more specifically the Writing article:

![](/page-hopping-resources/hexo-docs-writing.png)

Lets see what's going on in this query `g hexo :l docs :l writin`:
- `g hexo`
	- first we search in Google for "hexo" (you might get different results, since Google uses IP, geo location, language and other factors that make searching the same string to lead to different, personalized results)
- `:l`
	- We *hop* from the first result in the list
- `docs` (after tools without an argument and the next tool in line [everything is considered an argument to a fuzzy matching](/overview/#Tools_without_an_argument))
	- Through the links we get returned we fuzzy match to get the url for documentation on first position
- `:l`
	- We hop from the first matched item:
- 'writin'
	- And finally we fuzzy match the article we need (Writing):

Above the query field, you see a breadcrumb widget (history). It shows the pages we hopped from. It's clickable, too - you can directly navigate to one of the pages from your path.

Here is another query with some color coding (syntax highlighting of the Pagehop queries is in our backlog) with an inline explanation.

![](/common-resources/pagehop-query-syntax.png)