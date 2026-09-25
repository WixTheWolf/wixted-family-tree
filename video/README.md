# Wixted Family Tree — video

A [Remotion](https://www.remotion.dev) video of the Wixted family tree. It reads
the same research data as the website (`../src/data/ancestryLine.json` and
`../src/data/family.json`), so re-rendering picks up data changes.

## Scenes

1. **Title**: The Wixted Family, from Tipperary to California
2. **Tree**: the direct Wixted line, one generation at a time, then a zoomed-out overview
3. **Journey**: Tipperary → Lambeth → Corning → Rochester → Phoenix → Orange County
4. **Branches**: people per family branch
5. **Heritage**: Matthew's heritage breakdown
6. **Outro**

Each scene is also registered as its own composition under `FamilyTree-Scenes`
in the Studio sidebar. The on-screen captions for the tree are in `src/data.ts`.

## Commands

```console
npm i
npm run dev      # open Remotion Studio
npm run render   # writes out/wixted-family-tree.mp4
```

Fonts (Inter and Playfair Display, SIL Open Font License) are bundled in
`public/fonts` so rendering works offline.

Note that for some entities a Remotion company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
