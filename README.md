# History plugin for SilverBullet
A History plugin for [SilverBullet](https://silverbullet.md/). It provides a
version history for pages. This plugin works by getting data from `git` repo,
so if your space doesn't use `git` the plugin won't work for you.

I tested this on SilverBullet v0.10.4 and v2, but it's pretty new so you may
find bugs.

The plugin should be safe to use since I purposely didn't add any action or
code that could change your pages, you may find problems here but hopefully
nothing destructive.

## Screenshots

<img src='./screenshots/light-01.png' />
<img src='./screenshots/light-02.png' />
<img src='./screenshots/light-03.png' />
<img src='./screenshots/dark-01.png' />
<img src='./screenshots/dark-02.png' />
<img src='./screenshots/dark-03.png' />

## Installation
The url for the plug is:

```
ghr:ivanalejandro0/silverbullet-history
```

Check out the SilverBullet docs on how to install it. Note that it changes on v2.

## Usage

The plug provides the following commands:

- {[History: view file history]}: opens the versions sidebar and shows the latest version of the current page
- {[History: close]}: closes the versions sidebar and goes to the page we are looking the history of
- {[History: toggle open/close]}: opens the history if closed, closes the history if open

You may want to set [Shortcuts](https://silverbullet.md/Shortcuts) for them.

## Add action button

You can add an action button to show a page history like so:

On your CONFIG file (SilverBullet v2):

```lua
config.set {
  actionButtons = {
    {
      icon = "list",
      description = "History toggle",
      command = "History: toggle open/close",
    }
  }
}
```

On your SETTINGS file (SilverBullet v0.10.4):

```yaml
actionButtons:
- icon: list
  command: "{[History: toggle open/close]}"
  description: "History toggle"
```

# Caveats
* this will only work if your space is in a git repo and only with the files you have versioned.
* the history won't work if you're offline, I haven't tested nor investigated much that use case.
* I haven't yet tested how this behaves with page renames. I don't think it'll show a good history on that use case.
* The history shows a linear history, but git history can be like a tree, this UI is pretty simple and if you do a lot with git you may not get the best picture of the history.
* Commits can have different authors but I'm not showing that information. I imagine most people edit their notes by themselves so showing the author information would be redundant.

## Build
To build this plug, make sure you have [SilverBullet installed with
Deno](https://silverbullet.md/Install/Deno).

Link above broken on v2, snippet:

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

## Acknowledgements
Since there's not a lot of documentation on how to build plugs yet, I took
inspiration by the work of other people that also build plugs, huge thanks to
them.

* [Pomodoro](https://github.com/mirdaki/silverbullet-pomodoro)
* [Grep](https://github.com/Maarrk/silverbullet-grep)
* [Git](https://github.com/silverbulletmd/silverbullet-git)
* [Treeview](https://github.com/joekrill/silverbullet-treeview)
* [SilverBullet built in plugins](https://github.com/silverbulletmd/silverbullet/tree/main/plugs)
