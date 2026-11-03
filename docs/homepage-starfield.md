# Homepage starfield

The homepage introduction uses a local starfield image and three staggered CSS meteor animations. The header, recent articles and other pages retain their existing layouts and theme colors.

- Template override: `layouts/partials/home/landing.html`; no theme submodule changes.
- Image source: `assets/img/home-starfield.png`; Hugo builds 768px and 1536px WebP variants.
- Appearance: scoped styles in `assets/css/custom.css`, with light text and a dark gradient overlay in both themes.
- Motion: `assets/js/home-starfield.js` provides pause/play and stops animations offscreen or when the tab is hidden. `prefers-reduced-motion: reduce` hides decorative motion and its control.
- Decoration is excluded from the accessibility tree and cannot intercept pointer events.

The user-supplied `星空图片.jpg` remains untouched in the project root. The cleaned derivative was edited using built-in image_gen. Prompt: Remove ONLY the white watermark at bottom-left and the small copyright/ID watermark panel at bottom-right, reconstructing the underlying sky naturally. Preserve the original photograph composition, blue stars, Milky Way position, subtle pink-orange cloud on lower-right, color palette and texture. No other changes, no new objects, no text or marks. Landscape photograph for a personal blog hero background.

Validation: Hugo production build and internal link/resource checks; desktop 1440x1000 and mobile 390x844 in both themes; pause/play state; reduced-motion media preference; no mobile horizontal overflow; no starfield nodes on article pages; no browser console errors.
