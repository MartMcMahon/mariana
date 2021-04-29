# Mariana

Dropped your phone into the ocean! Good thing this old-timey diving suit & harpoon are on board. Now you can go retrieve it while not getting killed by the many dangerous, spooky fish.

## How to run it

Make sure you have [`npm`](https://www.npmjs.com/) installed.

First run `npm install`, then:

- Use `npm run start` to start the development server at [http://localhost:1234].
- Use `npm run tsc-watch` to run the type checker continuously.
  I recommend running this whenever you're developing so you can spot errors early.
- Use `npm run tsc` to run the type checker once.
- Use `npm run build` to output a production build to `dist/`.
- Use `npm run prettier` to autoformat all source files

## What's in all the folders?

`/` — Mostly config files that you shouldn't need to worry about
`/node_modules` — where dependencies get installed, don't touch
`/resources` — where all the assets go, i.e. audio, sprites, fonts
`/src` — where all the code is
`/src/core` — all the engine code, probably don't need to touch too often
`/src/mariana` — all the code that's specific to this game. This is where 99% of the coding will be done.
`/src/mariana/main.ts` — The entry point for the game

## What libraries does this use?

The physics engine is [p2](https://github.com/schteppe/p2.js) with some modifications for improved performance.
The graphics engine is [pixi](https://github.com/pixijs/pixi.js).

## Concepts from the library to understand

### The Game Object

There's always one main game object that's job is to keep the game loop going, keep track of entities, and call event handlers.

You can access the game object from an entity through `this.entity`.

`game.io` gives you access to input state like which keys are down and where the mouse is.

`game.entities` gives you access to the entities in the game. It has a few ways of getting this entities you want:
`game.entities.all` gives you all the entities.
`game.entities.getById('diver')` gets you the entity with a specific id.
See `EntityList.ts` for more options.

### Entities

An entity is basically anything in the game that has state.
You define an entity by creating a class that extends `BaseEntity` and implements `Entity`.

Inside an entity you can access the game through `this.entity`.

Define an `id` on an entity to be able to find it easily from other entities.

Define a `sprite` on an entity if you want the entity to have a graphical component.

Define a `body` on an entity if you want the entity to interact with the physics world.

Define an `onTick` method to do something every physics step.

Define an `onRender` method to do something right before each frame is rendered.

### Events

Events are a nice way to pass messages between entities.
They are a good way to implement control flow.

You can fire custom events by calling

```typescript
game.dispatch({ type: yourEventTypeHere, ... });
```

You can listen to custom events in any entity you want by adding

```typescript
handlers = {
  yourEventTypeHere: () => {
    /* do something */
  },
};
```

### Vectors

In general, to represent vectors the engine uses the `V2d` type, which is an extension of `[number, number]`.
It has an easy constructor called `V()` that takes an array, a pair of numbers, or an instance of `V2d`.

## Working With Assets

### Where should I put assets/resources?

All assets should live somewhere in the `resources` folder

- `resources/audio` — sound files.
- `resources/fonts` — fonts.
- `resources/images` — images.
- `resources/intermediate` — For intermediate assets that are used to generate the final assets (think photoshop documents instead of completed assets).

### What file types are supported?

Images should be `.png`.
I think `.flac` is the best, but we can also use `.mp3`, `.ogg`, and `.wav`.
Fonts should be whatever the web supports, I think `.otf` and `.ttf` are good.

### Generating type definitions for assets

When you add or remove or rename assets, you should run `npm run generate-asset-types` to update the typescript definitions.

### How to use assets in code

Importing the file of the asset returns the url that you can give to the browser to load that asset.
Before you can actually use an asset, you need to make sure you _preload_ the asset.
This is done by adding going to `preloadImages.ts` or `preloadSounds.ts` or `preloadFonts.ts`, importing the asset, and adding it to the list of urls to load.

```typescript
// sets the sprite for this entity
this.sprite = Sprite.from(img_myImage);

// play a sound
this.game.addEntity(new SoundInstance(snd_mySound), options));

// play a sound at a position
this.game.addEntity(new PositionalSound(snd_mySound), V(10, 20), options));
```

## Code Style

We use `prettier` with all default settings for formatting.
I recommend setting up your editor to use it and to format on save of a file so that we never end up with misformatted files.

## Links

[1D Simulation of Ocean Waves](https://gabrielegiuseppini.wordpress.com/2019/05/12/1d-simulation-of-ocean-waves/)
[https://github.com/pixijs/pixi.js/wiki/v5-Creating-filters]
