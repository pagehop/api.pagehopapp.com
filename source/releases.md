title: Release History
permalink: releases/
---
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