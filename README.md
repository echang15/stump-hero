# STUMP — Hammer and Nail

An 8-bit browser game about the one thing nobody thinks about when they toss a hammer
in the air: **you have to live with how you catch it.**

Throw the hammer up. It tumbles. Catch it. Whatever angle it was at the instant you
closed your hand is the angle it stays at — you don't get to fix your wrist, roll your
fingers, or choke up on the handle. Then you swing at the nail with exactly that grip.

Catch it true and the face lands square on the nail head. Catch it a quarter turn off
and the head swings wide and buries itself in the wood next to the nail. Catch it
backwards and you drive the nail with the butt of the handle, which does nothing except
waste a swing. Catch it by the *head* and you've caught a metal block with your palm.

No build step, no dependencies. Three static files.

## Play

Open `index.html`, or play the hosted copy on GitHub Pages.

**One button — `Space` (or tap on mobile).**

| | |
|---|---|
| **Hold** | wind up. Longer = a harder throw: more spin, more chances at a true grip, and a heavier blow — but each pass flashes by faster. |
| **Release** | throw. |
| **Press again** | catch. Only counts while the hammer is *falling* and inside the marked corridor. |
| **Press again** | swing, when the sweeping marker is over the lit zone. |
| **Click the mug** | drink a beer. Makes everything harder and the score better. `B` also works. |
| `R` | restart |

The dashed column is how far you can reach. The red dashed line at the bottom is the
deadline — let the hammer cross it and it's in the dirt, and that's a life.

Every throw is guaranteed to turn past a true grip at least once, so a bad catch is
always a timing mistake and never bad luck. If you miss the good moment, you can wait
for the hammer to come round again — but it's falling the whole time.

## The swing is a second bet

Catching it well doesn't drive the nail — it only buys you room to try. A meter sweeps
once across the bottom of the screen, and **your grip decides how much of that bar is
lit.** Stop the marker on the lit zone to connect; stop it on the white core for a flush
hit at full force. Miss the zone entirely and the head comes down on bare wood beside
the nail, which costs you the swing and bends the nail.

A perfect catch leaves a zone so wide you can barely miss it. A backwards one leaves a
sliver a couple of frames across, and you will usually whiff. Roughly how often a player
with about two frames of timing jitter misses the nail outright:

| Grip error | Grade | Lit zone | Whiff rate |
|---|---|---|---|
| ≤ 12° | **PERFECT** — square on the head | 42% of the bar | ~0% |
| ≤ 28° | **SOLID** | 30% | ~0% |
| ≤ 55° | **OFF-TRUE** | 19% | ~2% |
| ≤ 100° | **GLANCING** — bites the wood, bends the nail | 11% | ~12% |
| ≤ 155° | **BACKWARDS** — you swing the handle at it | 5.5% | ~33% |
| > 155° | **caught the head.** Costs a life. | — | — |

Let the marker run off the end without pressing and you flail: same as a miss.

Drive the nail flush to move to the next one. Nails get longer and the hammer spins
faster. Three lives. Consecutive flush hits build a score multiplier.

## Sobriety

There's a beer mug in the bottom-left corner. Click it (or press `B`) and the counter
goes up: **SOBER → BUZZED → TIPSY → MERRY → DRUNK → HAMMERED → BLIND.** Click at six and
you sober up again. It carries across restarts, so you set it once and it sticks.

Each beer does three things:

- **Shrinks the catchable box, hard.** The corridor's ceiling drops 9px per beer. Because
  the hammer is accelerating by then, height costs far more time than it looks: the window
  falls from **107px / 685ms sober to 53px / 200ms at six**, about a fifth of what you
  started with.
- **Narrows what counts as a good grip.** Every grade band tightens by 5%, to a floor
  of 70%.
- **Puts a sway in your swing hand.** The marker on the swing meter stops tracking
  straight and wanders up to 12% of the bar, drifting rather than juddering. Where it
  actually *is* when you press is what counts — so you can read the sway and fight it,
  but not ignore it.

In exchange you score **+15% per beer**, up to +90%.

Measured against a simulated player with two frames of timing jitter, playing perfectly
otherwise:

| Beers | Catch window | Throws offering a usable grip | Lives lost |
|---|---|---|---|
| 0 | 685ms | 96% | 3% |
| 2 | 401ms | 81% | 6% |
| 4 | 284ms | 56% | 26% |
| 6 | 200ms | 28% | 28% |

Sober, a true grip is on the table every single throw and the only question is whether you
take it. At six, most throws simply don't offer one — you take the least-bad angle in a
fifth of a second, or you watch it hit the dirt. It stays *possible*: a great catch at six
beers can still be PERFECT, just rarely.

The corridor is not shrunk any further than this on purpose. Below about ten frames the
catchable moments are spaced so far apart in rotation that no grip near true exists even
for a frame-perfect player, and every catch flattens to the same mediocre grade — brutal
but with no skill in it, which is worse than hard.

## Hosting

Live at **https://echang15.github.io/stump-hero/**

The repository root is the site — there's nothing to compile, so Pages serves it
directly from the branch (**Settings → Pages → Deploy from a branch → `main` → `/ (root)`**).
Pushing to `main` publishes. `.nojekyll` keeps Pages from running the files
through Jekyll.

## Files

| | |
|---|---|
| `index.html` | the page |
| `style.css` | the bezel around the screen |
| `game.js` | everything else |

It renders to a 256×224 canvas — roughly NES resolution — scaled up with nearest-neighbour,
so every pixel stays square. The sprites, the 5×7 font, the stump's growth rings, and the
chiptune blips are all generated in code; there are no image or audio assets to load.

Local preview, if you want a server rather than `file://`:

```bash
python -m http.server 5173
```

## Tinkering

`window.STUMP` exposes `step(n)`, `tick(n)`, `g` (live game state), `down()`, `up()` and
`reset()`, which makes it easy to drive the game frame-by-frame from the console. The
difficulty knobs are the small functions near the top of the state section in `game.js`:
`catchTop`, `spinCap`, `sweepFor` and `depthNeed`. The swing windows are the `win` and
`core` fields on the grade table in `attemptCatch`, and the sweep speed is `frames` in
`armSwing`. Everything the beer counter touches is in `boozeGrip`, `boozeSway`,
`boozeReach` and `boozeBonus` — drop `boozeBonus` to `() => 1` if you'd rather drinking
were pure self-harm.
