title: Development Overview
permalink: development-overview/
---
# Setup

Before you start developing recipes and tools for Pagehop, you need to make a very short setup of your development environment.

## Install PhantomJS

First you need to install PhantomJS v1.9.7. You can check their instructions [here](http://phantomjs.org/download.html).

{% note warn Don't use Homebrew for this %}
Homebrew appear to install a custom build, which currently we don't support. Copy the archive from phantomjs's website, unarchive and place the binary of phantomjs (bin/phantomjs) in the /usr/local/bin/ dir.
{% endnote %}

## Install NodeJS (or just install Pagehop)

If you have Pagehop installed on your development machine, you will have node installed (Pagehop install's it for you).

The version we use is 0.10.28.

{% note warn NodeJS version %}
Pagehop might not work correctly with another version - we have done all of our testing on 0.10.28.
{% endnote %}

If, for some reason, you don't want Pagehop installed on this machine, download the installer from [here](http://nodejs.org/dist/v0.10.28/node-v0.10.28.pkg) and install manually.

## Install Grunt

All Pagehop recipes and tools use Grunt for testing and linting.

Install grunt 

``` bash
$ npm install -g grunt-cli
```

Depending on your setup, you might need to run the previous with `sudo`.

## Install pagehop CLI

We have made a small tool to help you scaffold & validate project structure of recipes and tools.

Install it like this:

``` bash
$ npm install -g pagehop
```

Again, you might need to run this command with `sudo`. Usually, you'll get an EACCESS error, if this is the case.

## ... and that's it!

You're now set to become a Pagehop developer. Check the next section to start developing your awesome recipes. Good luck!