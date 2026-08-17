---
name: impeccable
description: Execution-quality bar for any UI work in this project — state coverage, focus and keyboard access, spacing rhythm, responsive integrity, and motion hygiene. Use when building or changing a component, a page, or anything a user sees or clicks. Pairs with `taste`, which governs judgement; this skill governs correctness.
---

# Impeccable

Taste decides *what* to build. This decides whether it was built *properly*.
A screen is impeccable when nothing about it is accidental — every state exists,
every interactive thing is reachable, and nothing shifts, clips, or flickers.

Work through this before calling any interface change done.

## 1. Every state exists

Most UI bugs are missing states, not broken ones. For anything interactive, confirm
all of these are designed — not defaulted:

- **Rest** — the normal case.
- **Hover** — pointer only. Never the *only* signal that something is interactive.
- **Focus** — keyboard. Must be visible against the surface behind it. Never `outline: none`
  without a replacement.
- **Active/pressed** — confirms the tap landed, especially on touch where there's no hover.
- **Disabled** — visibly inert *and* actually non-submitting. Dim alone is not enough.
- **Loading** — anything awaiting the network. The control must not accept a second click.
- **Empty** — a list with nothing in it says what to do next, not just "no results".
- **Error** — says what went wrong and how to fix it. No apologies, no raw exception text.

For data-bearing views, the empty and error states are the ones that ship broken most often,
because they're the ones nobody looks at while building.

## 2. Keyboard and assistive access

- Every control reachable by `Tab`, in an order that matches the visual layout.
- An icon-only button carries `aria-label`. An icon beside text does not — it's decorative,
  so `aria-hidden`.
- Images earn real `alt` text, or `alt=""` when purely decorative. Never the filename.
- One `h1` per page; heading levels descend without skipping.
- Colour is never the sole carrier of meaning — pair it with text, weight, or a mark.
- Body text meets 4.5:1 contrast; large text and UI edges meet 3:1. Check the dim
  "muted" greys, which is where this usually fails.

## 3. Spacing and alignment

- Space comes from a scale, not from whatever number looked right. Reuse the project's
  existing steps rather than introducing a new value.
- Sibling groups get their rhythm from flex/grid `gap`, not per-element margins that
  collapse or double unpredictably.
- Optical alignment beats mathematical alignment when they disagree — a circular icon
  next to square text usually needs a nudge.
- Related things sit closer than unrelated things. If everything is evenly spaced,
  the layout is telling the reader nothing.

## 4. Responsive integrity

- Nothing scrolls the page sideways. Wide content — tables, code, diagrams — scrolls
  inside its own `overflow-x: auto` container.
- Test the narrow end properly (≈360px). Most breakage lives there, not at tablet size.
- Tap targets stay ≥44px on touch, including icon buttons that look fine with a mouse.
- Text set in viewport units still has a floor and a ceiling — `clamp()`, not raw `vw`.
- Long unbroken strings (emails, URLs, product SKUs) wrap or truncate deliberately.

## 5. Motion hygiene

- Animate `transform` and `opacity`. Animating layout properties — width, height, top —
  costs a reflow per frame.
- Motion is fast enough to feel like feedback, not choreography: 150–300ms for most
  interface transitions.
- Honour `prefers-reduced-motion`. Reduce or remove; don't just shorten.
- Nothing animates on entry that the user is trying to read immediately.

## 6. Loading without layout shift

- Media has known dimensions or a reserved aspect ratio before it loads.
- Above-the-fold imagery is eager and prioritised; everything below is lazy.
- Skeletons match the shape of what replaces them, or don't use skeletons.
- Fonts don't reflow the page when they swap in.

## Before you call it done

Read the diff back and ask, honestly:

1. Which state did I not build? (There's usually one.)
2. Can I operate this entire screen with only a keyboard?
3. Does it hold at 360px wide, and in both light and dark?
4. Did I introduce a spacing or colour value that exists nowhere else in the project?

A "yes" to the last one isn't automatically wrong — but it needs a reason.
