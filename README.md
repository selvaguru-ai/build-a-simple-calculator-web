# Simple Calculator

A lightweight, accessible calculator web app built with **Vanilla HTML5**, **CSS3**, and **JavaScript (ES6+)**. No frameworks, no dependencies — just open the file and calculate.

## Features

- Basic arithmetic: addition, subtraction, multiplication, and division
- Decimal number support
- Plus/minus sign toggle
- Backspace to delete the last entered digit
- Clear button to reset the calculator
- Division-by-zero error handling
- Keyboard support (digits, operators, Enter, Backspace, Escape)
- Responsive layout that works on desktop and mobile
- Accessible markup with ARIA labels and live regions

## Project Structure

```
.
├── index.html   # Semantic HTML shell and calculator markup
├── style.css    # CSS custom properties, Grid layout, responsive styles
├── script.js    # ES6 Calculator class with full state management
└── README.md    # This file
```

## Running Locally

No build step or server is required.

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/<your-username>/simple-calculator.git
   ```
2. **Open `index.html`** directly in any modern web browser (Chrome, Firefox, Safari, Edge):
   - Double-click `index.html` in your file explorer, **or**
   - Drag and drop `index.html` onto an open browser window, **or**
   - From the terminal:
     ```bash
     # macOS
     open index.html
     # Linux
     xdg-open index.html
     # Windows (PowerShell)
     Start-Process index.html
     ```
3. The calculator will load instantly — no internet connection needed.

## Keyboard Shortcuts

| Key(s)            | Action                        |
|-------------------|-------------------------------|
| `0` – `9`         | Enter digit                   |
| `.`               | Decimal point                 |
| `+` `-` `*` `/`   | Choose operator               |
| `Enter` or `=`    | Calculate result              |
| `Backspace`       | Delete last digit             |
| `Escape` or `c`   | Clear / reset                 |

## Deployment

The app is deployed automatically to **GitHub Pages** from the `main` branch root directory via a GitHub Actions workflow. Visit the live version at:

```
https://<your-username>.github.io/simple-calculator/
```

## License

MIT — feel free to use, modify, and distribute.
