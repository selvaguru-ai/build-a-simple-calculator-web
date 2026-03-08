# Calculator

A clean, responsive calculator built with **vanilla HTML5, CSS3, and JavaScript (ES6+)**. No frameworks, no dependencies — just the web platform.

## Features

- **Basic arithmetic** — addition, subtraction, multiplication, division
- **Chained operations** — press an operator after a result to continue calculating
- **Percentage** — converts current value to a percentage (÷ 100)
- **Toggle sign** — flip between positive and negative
- **Decimal support** — safely handles decimal input
- **Backspace** — delete the last digit
- **Error handling** — division by zero and invalid operations show a clear error state
- **Keyboard support** — full keyboard input (digits, operators, Enter, Backspace, Escape)
- **Responsive design** — works on all screen sizes from 320px to 4K
- **Accessible** — ARIA labels, focus-visible outlines, reduced-motion support

## File Structure

```
calculator/
├── index.html   # App shell, semantic markup, button grid
├── style.css    # Layout, theming, responsive design, animations
├── script.js    # Calculator logic, state management, event handling
└── README.md    # This file
```

## Running Locally

No build step required. Simply open `index.html` in any modern browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — serve with a simple HTTP server (avoids any CORS quirks)
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Keyboard Shortcuts

| Key              | Action            |
|------------------|-------------------|
| `0` – `9`        | Input digit       |
| `.`              | Decimal point     |
| `+` `-` `*` `/`  | Operators         |
| `Enter` or `=`   | Equals            |
| `Backspace`      | Delete last digit |
| `Escape` / `Del` | Clear (C)         |
| `%`              | Percent           |

## Deployment to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` folder.
4. Click **Save**.
5. Your calculator will be live at `https://<your-username>.github.io/<repo-name>/`.

## Design Decisions

- **No localStorage** — state is intentionally ephemeral (in-memory only).
- **CSS custom properties** — all colors, sizes, and radii are defined as variables at `:root`, making theming trivial.
- **`clamp()` for sizing** — the calculator width and font sizes scale fluidly between breakpoints without media query jumps.
- **Floating-point handling** — `toPrecision(12)` is used to avoid classic JS floating-point noise (e.g. `0.1 + 0.2 = 0.30000000000000004`).
- **Event delegation** — a single click listener on `.button-grid` handles all button presses efficiently.

## Browser Support

All modern browsers (Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+). No IE support.
