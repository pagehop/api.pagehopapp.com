title: 3rd party Recipes and Tools
permalink: 3rd-party-recipes-and-tools/
---
Although, we like the initial set of recipes and tools, we believe the true value of Pagehop, is coming from the ability to use **3rd party Recipes and Tools**. It's pretty easy to develop some yourself - you only need to know JavaScript and the minimalistic API of Pagehop - check the [Development](/development-overview/) section.

## Install

Using 3rd-party recipes and tools is as simple as placing a folder in a specific location on the disk.

### Create dirs

To install a new recipe and/or tool, you need to ensure there is an appropriate dir structure expected by Pagehop.

In your user dir, there should be a dir named *.pagehop* with 2 subdirs, like this:

{% raw %}
<figure class="highlight"><pre>~
	.pagehop
		recipes
		tools</pre></figure>
{% endraw %}

In other words, you need to ensure these 2 dirs get created:

`~/.pagehop/recipes/`

`~/.pagehop/tools/`

The above paths are relative to your user directory. For example if your user is named "johndoe", the absolute path to the 3rd party recipes would be:

`/Users/johndoe/.pagehop/recipes/`

### Copy recipe/tool

The 2nd and final step is to copy the recipe/tool in the dir you just made sure exists (`.../.pagehop/recipes/` or `.../.pagehop/tools/`).

It has to be in a directory - **don't copy just files there**. For example if you want to install *the new IMDB recipe*, at the end, your recipe will be in the dir:

`~/.pagehop/recipes/imdb/`

### Newer versions override older ones

But only in the cache.

Pagehop *compiles* recipes and tools and caches them. It's more like it *combines* them with dependencies, so recipes and tools become independent entities, which can be directly executed.

When you install a newer version of a recipe, which already is in the default set (comes with Pagehop's installation), it gets overriden in the cache.

#### Revert to older version

To revert to an older version, you need to delete the new recipe/tool from `~/.pagehop/` and to delete Pagehop's cache, located here:

`~/Library/Application Support/Pagehop/cache/`

Finally, log-off + log-in or restart your computer so the cache is redone.

## CLI tool is comming your way

The process of installing a recipe or tool isn't too hard, but still can be made a lot easier with a CLI tool, you can use in the Terminal.

Sometime during v1's (Pagehop 1.0.0's) lifecycle, we plan to release a CLI tool, that will help with the **install** and the **development** of recipes and tools.