# Calculator

A simple, clean calculator web app built with vanilla HTML5, CSS3, and JavaScript (ES6+).

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Percentage calculation
- Toggle positive/negative sign
- Backspace to correct input
- Keyboard support
- Responsive design (mobile-first)

## Project Structure

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

# Option 2 — serve with a local dev server (e.g. VS Code Live Server, or npx)
npx serve .
```

## Deployment (GitHub Pages)

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` folder.
4. Click **Save**. Your calculator will be live at `https://<username>.github.io/<repo-name>/`.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0`–`9` | Digit input |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Equals |
| `Backspace` | Delete last character |
| `Escape` | Clear all |
| `%` | Percent |
