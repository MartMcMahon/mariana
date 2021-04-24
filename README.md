# Mariana

Dropped your phone into the ocean! Good thing this old-timey diving suit & harpoon are on board. Now you can go retrieve it while not getting killed by the many dangerous, spooky fish.

## How to run it

Make sure you have [`npm`](https://www.npmjs.com/) installed.

First run `npm install`, then:

- Use `npm run start` to start the development server at [http://localhost:1234].
- Use `npm run build` to output a production build to `dist/`.
- Use `npm run tsc` to run the type checker.

## What's in all the folders?

`/` — Mostly config files that you shouldn't need to worry about
`/node_modules` — where dependencies get installed, don't touch
`/resources` — where all the assets go, i.e. audio, sprites, fonts
`/src` — where all the code is
`/src/core` — all the engine code, probably don't need to touch too often
`/src/mariana` — all the code that's specific to this game. This is where 99% of the coding will be done.
`/src/mariana/main.ts` — The entry point for the game

## What libraries does this use?

The physics engine is [p2](https://github.com/schteppe/p2.js)
The graphics engine is [pixi](https://github.com/pixijs/pixi.js)

## Working With Assets

### Where should I put assets?

See the `resources` folder for completed assets.
`resources/audio` for sound files.
`resources/fonts` for fonts.
`resources/images` for images.

For intermediate assets that are used to generate the final assets (think photoshop documents instead of completed assets), use `resources/intermediate`.

### What file types are supported?

Images should be `.png`.
Audio should probably be `.mp3` or `.ogg` or `.wav` I think.
Fonts should be whatever the web supports, I think `.otf` and `.ttf` are good.

### Generating type definitions for assets

- How to use assets in code
