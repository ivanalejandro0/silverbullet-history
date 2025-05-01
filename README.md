# History plugin for SilverBullet
A History plugin for [SilverBullet](https://silverbullet.md/). It provides a
version history for pages. This plugin works by getting data from `git` repo,
so if your space doesn't use `git` the plugin won't work for you.

## Installation
The url for the plug is: 

```
github:ivanalejandro0/silverbullet-history-git/dist/history.plug.js
```

Check out the SilverBullet docs on how to install it. Note that it changes on v2.

## Build
To build this plug, make sure you have [SilverBullet installed with
Deno](https://silverbullet.md/Install/Deno).

Above link broken on v2, snippet:

```
deno install --force --name silverbullet --allow-all https://get.silverbullet.md --global
```

Then, build the plug with:

```shell
deno task build
```

Then, copy the resulting `.plug.js` file into your space's `_plug` folder.

SilverBullet will automatically sync and load the new version of the plug, just
watch the logs (browser and server) to see when this happens.

