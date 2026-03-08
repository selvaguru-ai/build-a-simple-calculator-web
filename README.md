# Calculator

A simple, accessible calculator web app built with vanilla HTML5, CSS3, and JavaScript (ES6+).

## Features

- **Basic arithmetic**: addition, subtraction, multiplication, division
- **Additional operations**: percentage, toggle sign, decimal input, backspace
- **Chained calculations**: press an operator after a result to continue computing
- **Keyboard support**: full keyboard input with visual button feedback
- **Accessible**: ARIA roles, live regions, visible focus styles, screen-reader-friendly
- **Responsive**: mobile-first design, scales from 280px to 400px

## Keyboard Shortcuts

| Key(s)          | Action                        |
|-----------------|-------------------------------|
| `0` – `9`       | Input digit                   |
| `+` `-` `*` `/` | Set operator                  |
| `Enter` or `=`  | Evaluate (equals)             |
| `Escape` or `c` | Clear calculator              |
| `Backspace`     | Delete last digit             |
| `.` or `,`      | Decimal point                 |
| `%`             | Percent                       |

> **Note:** Modifier-key combos (e.g. `Ctrl+R`, `Ctrl+C`) are never intercepted — browser defaults are preserved.

## Accessibility

- `role="application"` and `aria-label="Calculator"` on the calculator container
- `aria-live="polite"` and `aria-atomic="true"` on the current display so screen readers announce results
- Visually hidden `<h1>Calculator Application</h1>` for screen reader context
- All buttons have `tabindex="0"` and are reachable via `Tab` key
- Visible focus ring (blue outline) for keyboard-only navigation
- Descriptive `aria-label` on every button

## File Structure

```
calculator/
├── index.html   # Semantic markup, ARIA attributes, button grid
├── style.css    # Layout, theming, responsive design, focus styles
├── script.js    # Calculator logic, keyboard handling, accessibility
└── README.md    # This file
```

## Deployment (GitHub Pages)

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` folder.
4. Click **Save** — your calculator will be live at `https://<username>.github.io/<repo>/`.

## Development

No build step required. Open `index.html` directly in a browser, or serve with any static file server:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```
