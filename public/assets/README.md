# Episode 01 assets

Place approved visual assets in this directory. Keep filenames stable so the Remotion composition can load them without code changes.

## Planned files

### Characters
- `artem.png` — full-body transparent character render, front three-quarter view.
- `lera.png` — full-body transparent character render, front three-quarter view.
- `kirill.png` — full-body transparent character render, front three-quarter view.

### Backgrounds
- `classroom.jpg` — classroom, morning.
- `hallway.jpg` — quiet school corridor.
- `library.jpg` — school library.
- `artem-room.jpg` — Artem's room, evening, window and desk visible.

### Story props
- `sketchbook-window.png` — window drawing on a clean/transparent background.
- `lera-note.png` — optional paper texture only; render all readable writing as Remotion text.
- `final-note-paper.png` — blank paper texture for the final handwritten note.

## Rules
- Keep the three character designs identical across every shot.
- Character PNGs should have transparent backgrounds and consistent canvas size.
- Backgrounds should be 16:9, ideally 1920×1080.
- Do not bake subtitles, logos, dialogue, or readable notes into generated images.
- Do not rename files without updating the asset manifest and composition.


## Generated episode media

The generation script writes these optional files automatically:
- `audio/scene-01.mp3` through `audio/scene-10.mp3` — Fish Audio Russian narration, one segment per scene.
- `scenes/scene-01.png` through `scenes/scene-10.png` — fal.ai / FLUX cinematic environment backgrounds.

Do not add API keys to this folder or commit them. The Remotion composition loads these files only when the AI render props are enabled.
