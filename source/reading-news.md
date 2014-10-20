title: Reading News
permalink: reading-news/
---
Wouldn't be great to always have todays news, just a few keys away from you, no matter the current application you work with?

## Hacker News

Pagehop 1.0.0 has a recipe HackerNews. Pagehop **0.1.0** had a recipe HackerNews.

It's awesome. It's something, our team can't live without.

You want to check the news on news.ycombinator.com? You just open-up Pagehop and type "h " (with a trailing space) and there it is:

![](/reading-news-resources/hn.png)

You want to see the discussion on some of the news - just add :d (recipe option Discussions) and now all the results will point to the discussions instead.

![](/reading-news-resources/hn-discussions.png)

You've missed couple of days of news and want to see the latest Show HN submissions...
No problem! Your query is `h :s`.

![](/reading-news-resources/hn-show.png)

You also can view the jobs with **:j** and the asked questions (Ask HN: and Poll:) with **:ask**.

And remember :d from earlier? You can use it **everywhere applicable** (e.g. `h :s :d` will give you the discussions on the Show HN posts and so on).

Since this recipe doesn't perform a search (it gets only options, but doesn't accept query), whatever you write after you specify your options will be considered an argument for fuzzy matching.

![](/reading-news-resources/hn-fuzzy.png)

## Open multiple pages without closing Pagehop

The HackerNews recipe probably was the initial reason why we came up with this feature.

Simply, when you open up HN in the morning, you pick up few ("several" is probably more appropriate to say) links, open them up in separate tabs and start reading.

To make this scenario simple enough, we don't close Pagehop if you open results (pressing ⏎ or double-clicking), while holding the **Shift** key.