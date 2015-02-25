title: Release History
permalink: releases/
---
## 1.2 (27th Feb 2015)

Add: Result Preview (load item address in a Web View);
Add: embed NodeJS binaries instead of installing (no dependencies installed anymore);
Add: API: recipe&tool-generated Result Preview (HTML to be loaded in the WebView);
Add: API: recipes to receive and alter the hops array (breadcrumb in the UI);

Add: recipe: DocSearch;
Add: recipe: CodeSearch;
Add: recipe: WolframAlpha;
Add: recipe: Weather;
Add: recipe: Time;

Improve: 4mb smaller binary;
Improve: OS X: update window needs a better title;
Improve: all recipes to use the hops array (adding the initial item in the breadcrumb);
Improve: recipe: DefineWord: to show word definitions in the result preview;
Improve: recipe: Bing: performance;

Fix: OS X: UI process crashes intermittently;
Fix: OS X: searchField flashes white on first show;
Fix: OS X: jerky text resizing of the query;
Fix: OS X: breadcrumb remains longer after results have been replaced;
Fix: OS X: single-line result template's text vertical position is a bit off;
Fix: OS X: main window's invisible frame area is too large (larger screenshots);
Fix: OS X: Caret should be further away from the left side.

## 1.1 (13th Jan 2015)

Add: OS X: new UI design;
Add: OS X: text field is always focused;
Add: OS X: keep last query and results.
Add: OS X: show shortcut in menu;
Add: check for update;
Add: direct navigate to url;
Add: instant recipe execution (no trailing space required);
Add: version prop to the systemMeta passed to recipes&tools;

Fix: OS X: registration window gets lost sometimes;
Fix: OS X: Sometimes Pagehop "grabs" Esc, globally, and doesn't let go;
Fix: OS X: menubar icon not visible on dark mode 10.10;
Fix: OS X: window blinks on startup;
Fix: OS X: window resizes on closing (doesn't snappy disappear);
Fix: OS X: window not positioned well on bigger scale screens;
Fix: OS X: query font resize is jerky after first window opening;
Fix: default recipes' homepages should be the README.md files, not dirs in github;
Fix: recipe: GoogleSearch: results always show google.* as domain in the title;
Fix: recipe: HackerNews: should use the new API;
Fix: tool: fuzzy: shouldn’t take spaces into consideration;
Fix: tool: fuzzy: breaks when called often;
Fix: upgrading old versions of Pagehop fails;

New Recipes:
 - System replaces AllRecipes and AllTools and adds up on them the ability for update check
 - URL to directly navigate to a specific http(s) url


## 1.0 (30th Sept 2014)