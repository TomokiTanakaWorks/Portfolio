# Tomoki Tanaka | Portfolio (2026)

Modern static redesign for GitHub Pages. No JavaScript frameworks, build-time bundlers, remote fonts, or external image CDN.

## What's preserved

- All **24** original project entries including titles, roles, dates, media URLs, software icons and descriptions, preserved in `js/projects.js` with the original `discription` key for compatibility.
- The original disclaimer and the agree/disagree gate.
- Original biography and 11 archived skill entries. Tool-experience durations are explicitly marked as historic.
- The original Google Forms contact endpoint.
- The original, full-resolution `img/` directory (untouched).

## Performance strategy

The old page rendered every hidden modal (all project gallery images and YouTube iframes) at initial load. The redesign renders only project-card images at page load. Work details, their gallery images and YouTube players are created on demand. Videos are created only when the video play control is clicked.

`scripts/optimize_images.py` generates first-party WebP previews under `assets/optimized/`, retaining originals for download. For normal static images it creates a maximum-1440px WebP preview and, for the 24 project thumbnails, a maximum-640px `.thumb.webp` thumbnail. Animated GIFs and preexisting AVIF files remain unchanged, with lazy loading in the detail viewer.

```sh
python -m pip install "Pillow>=11,<13"
python scripts/optimize_images.py
```

The GitHub Actions workflow runs on pushes to main and the redesign branch and checks in generated previews. If repository Actions has no write permissions, generate locally and commit `assets/optimized/`. The UI automatically falls back to the originals until optimized files are present.

## Publish

The site uses relative URL paths, so it works as a GitHub Pages project site at `/Portfolio/`. Merge the redesign branch into the site's existing Pages publishing branch, usually `main`. No build step is required on GitHub Pages.

## Review notes

- Confirm that the original permission to publish employed/third-party works still applies before promoting an older gallery to a newly public-facing portfolio.
- Verify that the embedded Google Form still accepts responses.
- JavaScript features assume evergreen browsers with `HTMLDialogElement`, `replaceChildren` and optional chaining.
