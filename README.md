# IBStie generator
This is a angular site generator with coffeescript / jade / stylus / gulp (Patch and rewrite from official version: [generator-angular](https://github.com/yeoman/generator-angular))

## View Cache

The directive generator ```yo IBSite:directive``` will generate cached view automatically. If you won't, add arguments __--no-cache__. Otherwise, if you generate view with ```yo IBSite:view```, add __--cache__ to generate cache view file.

The view files in __views/cached__ folder (and subfolders) will be cached after you build application.