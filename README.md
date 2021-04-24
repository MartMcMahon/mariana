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

## Concepts from the library to understand

### The Game Object

There's always one main game object that's job is to keep the game loop going, keep track of entities, and call event handlers.

You can access the game object from an entity through `this.entity`.

`game.io` gives you access to input state like which keys are down and where the mouse is.

`game.entities` gives you access to an Entity list which has a few

### Entities

Basically anything in the game that has state.
Defined by extending `BaseEntity` and implementing `Entity`.

Define a `sprite` on an entity if you want the entity to have a graphical component.

Define a `body` on an entity if you want it to interact with the physics world.

Define an `onTick` method to do something every physics step.

Define an `onRender` method to do something right before each frame is rendered.

### Events

You can fire custom events by calling `game.dispatch({ type: yourEventTypeHere, ... })`.
You can listen to custom events in any entity you want by adding `handlers = { yourEventTypeHere: () => { /* do something */}}`.
This is a good way for implementing control flow.

### Vectors

In general, the engine uses an array of 2 numbers to represent a vector.

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

TODO...

# How to use assets in code

TODO...
