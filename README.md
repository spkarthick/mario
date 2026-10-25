# Desktop Adventure

A complete keyboard platformer on an oversized work desk. Meet Pip, a tiny explorer with an acorn-green hat and a saffron scarf. Cross stationery, scale a stack of books, and find the glowing USB drive beyond the keyboard.

## Run

Requires Node.js 20 or newer. No production dependencies, build step, asset downloads, or credentials.

```sh
npm start
```

Open `http://localhost:3000`. Set `PORT` to change the port. All art is drawn locally with Canvas 2D; sound is synthesized with Web Audio after interaction. The game works without network access once the server is running.

## Controls

- A/D or left/right arrows: move; pushing against an eraser moves it.
- Space, W, or up arrow: jump. Hold for height; release for a shorter hop.
- Escape: pause/resume. Losing focus also pauses.
- R: restart the whole adventure.
- Enter: start or replay from the victory screen.

Jump on enemies, avoid coffee, and collect golden paper clips. Binder clips launch Pip higher. Rulers tilt under his weight. Two checkpoints restore health and save your respawn location. Losing all three hearts immediately returns you to the latest checkpoint with fresh health. Clips stay collected through a respawn. Look above the ordinary route for six secret clips. Reaching the USB drive completes the adventure; collecting every clip is optional.

## Validation

```sh
npm ci
npm start                 # keep running in a separate terminal
npm test
```

The test suite uses Playwright Core and a local Chromium installation (`/usr/bin/chromium` by default; set `CHROMIUM_PATH` to override). It checks running, friction, variable jumping, buffering, coyote time, solid collisions, eraser pushing, seesaws, spring boosts, both enemy stomps, coffee, health/invulnerability, checkpoints, falls, death, pause, restart, sound, victory, and replay. It also performs an input-driven continuous traversal of all three chapters to victory without teleporting or overriding health. Screenshots are written under `/tmp/desktop-adventure-*.png`. The deterministic simulation API is exposed only with `?test=1`.

## Structure

- `src/player.js`: fixed-step movement and collision physics.
- `src/level.js`: three connected chapters, interactive objects, collectibles, enemies.
- `src/game.js`: state, input, checkpoints, enemies, feedback, UI.
- `src/render.js`: procedural layered illustration, parallax, character animation.
- `src/audio.js`: sound effects and a quiet synthesized music loop.
- `src/style.css`: desktop layout, HUD, menus.

The world uses a 1280 × 720 logical canvas scaled to the available space. Keyboard only; there are no touch controls. Progress lasts for the current session, and R intentionally resets it. No external image or font URLs are used. First-run time varies with exploration and retries; an automated optimal traversal takes about 48 seconds, so experienced players can finish faster than the intended casual 3–5 minute session.
