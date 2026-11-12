# Episode 01 — visual asset pipeline

This document defines how to move from the current procedural SVG preview to a polished Remotion episode with generated artwork.

## Current state

The episode currently uses procedural SVG scenes and animated character illustrations in `src/Episode.tsx`. This is a working visual direction, not a set of finished AI-generated frames. No voice track or final MP4 has been produced yet.

## Asset order

Build assets in this order to reduce continuity problems:

1. **Character reference sheets** — Artem, Lera, and Kirill. Approve face, hair, clothing, proportions, and accessories before generating scenes.
2. **Location backgrounds** — classroom, hallway, library, and Artem's evening room.
3. **Story props** — the window sketch and blank note-paper textures.
4. **Shot artwork** — only after the references are stable, generate the 15 scene compositions using the shot prompts in `docs/shot-prompts-episode-01.md`.

## File contract

Store final files in `public/assets/`. Use the exact filenames listed in `public/assets/README.md`.

| Asset | Format | Target size | Notes |
|---|---|---:|---|
| Character cutouts | PNG | 1600 px tall canvas | Transparent background |
| Location backgrounds | JPG or PNG | 1920×1080 | 16:9, no text |
| Sketchbook art | PNG | 1600 px wide | Keep drawing separate from lettering |
| Note textures | PNG | 1200×800 | Blank paper; typeset text in Remotion |

## Remotion integration rules

- Use `staticFile("assets/filename.ext")` for files under `public/assets/`.
- Keep dialogue, subtitles, dates, and handwritten-note wording as editable Remotion text. Image models often produce unreliable lettering.
- Use character cutouts as separate layers when a shot needs independent movement.
- Use full-frame generated illustrations only for shots where layered character movement is not needed.
- Keep a single approved reference image per character and reuse it for every shot.
- Add a gentle camera push or parallax only when it does not distort faces or important props.

## Continuity checklist

- Artem: dark tousled hair, dark navy school jacket, sketchbook.
- Lera: long chestnut hair, lilac cardigan, star hair clip.
- Kirill: short black hair, burgundy hoodie, silver chain.
- Preserve the same clothing, hair silhouette, eye color, and accessories between scenes.
- Keep the classroom, corridor, library, and bedroom layouts spatially consistent.
- The final note must remain legible and must read: “Если ты это читаешь — значит, Лера всё-таки вернулась”.

## Quality gate before import

For every generated file, check:
- correct character identity and outfit;
- hands and face are clean and plausible;
- no extra people or duplicated limbs;
- composition leaves safe space for subtitles;
- no accidental text, watermark, signature, or logo;
- image is sharp at 1920×1080 playback size.

Do not switch the Remotion composition to missing asset paths. Integrate each asset only after the file has actually been added to the repository.
