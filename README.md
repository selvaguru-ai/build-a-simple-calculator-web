# Calculator Web App

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://username.github.io/calculator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A clean, responsive calculator web app built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no dependencies, no build step.

🔗 **Live Demo:** [username.github.io/calculator](https://username.github.io/calculator)

---

## Screenshot

![Calculator Web App Screenshot](./screenshot.png)

> _A minimal, dark-themed calculator with a responsive button grid, expression display, and smooth button animations._

---

## Features

- ➕ **Basic arithmetic** — addition, subtraction, multiplication, and division
- 🔢 **Decimal support** — safely handles floating-point input with a single decimal point guard
- ♾️ **Chained operations** — evaluate mid-chain without pressing equals first
- ⌫ **Backspace** — delete the last entered digit one at a time
- ± **Toggle sign** — flip the current number between positive and negative
- % **Percentage** — convert the current value to a percentage (÷ 100)
- 🖥️ **Dual-line display** — shows the current expression on one line and the live result on another
- ⌨️ **Full keyboard support** — every calculator action is mapped to a keyboard shortcut
- 📱 **Responsive design** — mobile-first layout that scales fluidly from 320 px to 400 px+
- 🎨 **Smooth animations** — subtle button press feedback via CSS transitions
- 🚫 **Error handling** — graceful display of `Error` on invalid operations (e.g., division by zero)
- 🔄 **No dependencies** — zero npm packages, zero build tools required

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Markup     | HTML5 (semantic elements)         |
| Styling    | CSS3 (Grid, Flexbox, custom props, `clamp()`) |
| Logic      | Vanilla JavaScript ES6+           |
| Deployment | GitHub Pages (static hosting)     |
| Build tool | _None — open the file and go_     |

---

## Getting Started (Local Development)

No Node.js, no npm, no build step — just a browser.

### 1. Clone the repository

```bash
git clone https://github.com/username/calculator.git
cd calculator
```

### 2. Open in your browser

**Option A — double-click:**
Open `index.html` directly in any modern browser (Chrome, Firefox, Safari, Edge).

**Option B — VS Code Live Server:**
If you use VS Code, install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), right-click `index.html`, and select **"Open with Live Server"**.

**Option C — Python quick server:**
```bash
# Python 3
python -m http.server 8080
# then visit http://localhost:8080
```

That's it — no `npm install`, no `.env` files, no configuration needed.

---

## Keyboard Shortcuts

Every button on the calculator has a corresponding keyboard shortcut:

| Key(s)                  | Action                          |
|-------------------------|---------------------------------|
| `0` – `9`               | Input digit                     |
| `.`                     | Decimal point                   |
| `+`                     | Addition operator               |
| `-`                     | Subtraction operator            |
| `*`                     | Multiplication operator         |
| `/`                     | Division operator               |
| `Enter` or `=`          | Evaluate / equals               |
| `Backspace`             | Delete last character           |
| `Escape` or `c`         | Clear / reset (AC)              |
| `%`                     | Percentage (÷ 100)              |
| `F9`                    | Toggle positive / negative sign |

> **Tip:** The keyboard listener is attached to the `window` object, so it works as long as the page is focused — no need to click a specific element first.

---

## Deployment to GitHub Pages

GitHub Pages serves static files directly from your repository — perfect for this project.

### Step-by-step guide

#### a. Push your code to the `main` branch

```bash
git add .
git commit -m "feat: initial calculator implementation"
git push origin main
```

#### b. Open your repository settings

1. Navigate to your repository on GitHub: `https://github.com/username/calculator`
2. Click the **Settings** tab (top navigation bar)

#### c. Configure GitHub Pages

1. In the left sidebar, scroll down and click **Pages** (under _Code and automation_)
2. Under **Build and deployment → Source**, select **Deploy from a branch**
3. Under **Branch**, choose:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**

#### d. Wait for deployment

GitHub will trigger a deployment workflow. Within **~60 seconds** your site will be live at:

```
https://username.github.io/calculator
```

You can monitor the deployment status under the **Actions** tab of your repository.

> **Note:** Replace `username` with your actual GitHub username.

#### e. Optional — Custom domain

To use a custom domain (e.g., `calc.yourdomain.com`):

1. **Create a `CNAME` file** in the repository root containing only your domain:
   ```
   calc.yourdomain.com
   ```
2. **Configure your DNS provider** — add a `CNAME` record:
   | Type  | Name   | Value                        |
   |-------|--------|------------------------------|
   | CNAME | `calc` | `username.github.io`         |
3. Back in **Settings → Pages**, enter your custom domain and click **Save**
4. Check **Enforce HTTPS** once the certificate is provisioned (usually within a few minutes)

---

## Project Structure

```
calculator/
├── index.html    # App shell — semantic HTML markup and button grid layout
├── style.css     # All styling — layout, theming, responsive design, animations
├── script.js     # Calculator logic, state management, and event handling
└── README.md     # Project documentation and deployment guide (this file)
```

### File responsibilities

| File         | Responsibility |
|--------------|----------------|
| `index.html` | Defines the DOM structure: `#app` wrapper, `.calculator` container, `.display` with dual lines, and the `.button-grid` with all 19 buttons using `data-digit`, `data-operator`, and `data-action` attributes |
| `style.css`  | Mobile-first CSS using custom properties for theming, CSS Grid for the button layout, `clamp()` for fluid sizing, and transition animations for button feedback |
| `script.js`  | Manages a plain JS state object (`currentInput`, `previousInput`, `operator`, `shouldResetDisplay`), exposes handler functions for each action, and wires up both click and keyboard events |
| `README.md`  | Project overview, feature list, local dev setup, keyboard shortcuts, GitHub Pages deployment guide, and license |

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 username

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Built with ❤️ using plain HTML, CSS, and JavaScript — no frameworks harmed.
</p>
