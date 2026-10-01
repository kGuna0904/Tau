# Tau — Design System Reference

A precise spec sheet to code against. Every value below is meant to be dropped straight into CSS/Tailwind config — nothing here is "approximate."

---

## 1. Color Palette

### Core (dark theme — default)

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0B0F14` | Page/app background |
| `--bg-surface` | `#141A21` | Cards, sidebar, modals, table rows |
| `--bg-surface-raised` | `#1B222B` | Hover state on cards, nested surfaces |
| `--border-default` | `#1F2831` | 1px borders on cards, dividers, inputs |
| `--border-active` | `#00E08A` | Focused input border, active nav indicator |
| `--accent-primary` | `#00E08A` | Primary CTA, positive amounts, active states, logo |
| `--accent-secondary` | `#4C7DF0` | Links, secondary charts, info badges |
| `--accent-negative` | `#FF5C5C` | Expense amounts, errors, destructive actions |
| `--accent-warning` | `#E8B44A` | Pending states, warnings |
| `--accent-violet` | `#8B7BF0` | 5th chart/category color (rounds out the 5-color chart set) |
| `--text-primary` | `#F4F7FA` | Headings, primary values (balance, amounts) |
| `--text-secondary` | `#8A97A6` | Labels, timestamps, muted body text |
| `--text-disabled` | `#5A6472` | Disabled fields, placeholder text |

### Light theme — "Warm Paper" (optional alt/settings toggle)

| Token | Hex |
|---|---|
| `--bg-base` | `#FDFBF7` |
| `--bg-surface` | `#FFFFFF` |
| `--text-primary` | `#101826` |
| `--accent-primary` | `#2F6F4E` |
| `--accent-secondary` | `#E8B44A` |

### Chart-specific 5-color set (donut/category charts, always in this order)
`#00E08A` → `#4C7DF0` → `#FF5C5C` → `#E8B44A` → `#8B7BF0`

---

## 2. Typography

| Role | Font | Weight | Size (desktop) | Line height |
|---|---|---|---|---|
| Page title / H1 | Clash Display | 600 | 28px | 1.2 |
| Section heading / H2 | Clash Display | 600 | 20px | 1.3 |
| Card label / H3 | Inter | 600 | 14px | 1.4 |
| Hero balance figure | Clash Display | 700 | 40–48px | 1.1 |
| Body text | Inter | 400 | 14px | 1.5 |
| Small / muted text | Inter | 400 | 12px | 1.4 |
| Button text | Inter | 600 | 14px | 1 |

Fallback stack: `'Clash Display', 'Space Grotesk', sans-serif` for display; `'Inter', -apple-system, sans-serif` for body.

---

## 3. Spacing & Radius Scale

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |

Base grid: **8px**. All padding/margins should be multiples of it.

| Radius token | Value | Used on |
|---|---|---|
| `--radius-sm` | 8px | Chips, pills, small buttons |
| `--radius-md` | 14px | Inputs, list rows |
| `--radius-lg` | 20px | Standard cards |
| `--radius-xl` | 24px | Hero cards (balance card) |
| `--radius-full` | 999px | Avatar, pill buttons, badges |

---

## 4. Layout (web app)

| Element | Spec |
|---|---|
| Sidebar width | 240px, fixed, full viewport height |
| Top bar height | 64px |
| Content max-width | 1440px, centered on larger screens |
| Content padding | 32px (desktop), 16px (mobile fallback) |
| Grid | 12-column, 24px gutter |
| Card grid gap | 16–24px |
| Breakpoints | `sm: 640px` `md: 768px` `lg: 1024px` `xl: 1280px` |
| Sidebar collapse | Below `lg` (1024px), sidebar collapses to icon-only 72px rail |

**Page anatomy (every screen except login):**
```
[ Sidebar 240px ] [ Top bar — full remaining width, 64px tall ]
                   [ Content area — 32px padding, 12-col grid ]
```

---

## 5. Icon Set

**Style:** Outline/line icons only (no filled icons in nav or lists — reserve filled/solid icon style exclusively for status indicators like the active nav dot).

| Spec | Value |
|---|---|
| Stroke width | 2px |
| Corner style | Rounded caps and joins |
| Grid | 24×24px optical square |
| Default color | `--text-secondary` (#8A97A6) |
| Active/hover color | `--accent-primary` (#00E08A) |
| Icon-in-button color | Inherits button text color |

**Required icon list (24):**
wallet, credit-card, bar-chart, pie-chart, arrow-up, arrow-down, bell, user, settings-gear, search, calendar, receipt, bank-building, target, lock, filter, transfer-arrows, tag, plus-circle, trash, eye, download, currency, dashboard-grid.

Recommended source: **Lucide** (`lucide-react` / `lucide` icon set) — it's already 2px-stroke, rounded, 24×24 by default, and matches this spec with zero customization needed. Use it directly rather than commissioning custom icons unless brand differentiation specifically requires it.

**Icon sizing in context:**
| Context | Size |
|---|---|
| Sidebar nav | 20px |
| Top bar (bell, search, settings) | 20px |
| Inline in text/labels | 16px |
| Empty-state illustrations | 48–64px |
| Bank-sync loader (center icon) | 40px |

---

## 6. Glassmorphism Spec (use sparingly — see rule below)

**Rule:** Max one glass element per screen (two if one is the persistent bottom/floating nav or top bar dropdown). Everything else — lists, tables, sidebars, buttons, chips — stays fully opaque.

```css
.glass-surface {
  background: rgba(20, 26, 33, 0.55);   /* --bg-surface at 55% opacity */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(244, 247, 250, 0.12);  /* text-primary at 12% */
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 224, 138, 0.08); /* faint accent glow */
}
```

Where to apply it: hero balance card, floating bottom/side nav, bottom sheets/modals, one featured "goal" or "insight" card per analytics-style screen, the bank-sync loader circle.

Where to never apply it: transaction/table rows, sidebar background, form inputs, buttons (except a single primary CTA if desired), footer.

---

## 7. Component Quick Reference

| Component | Background | Border | Radius | Notes |
|---|---|---|---|---|
| Standard card | `--bg-surface` | 1px `--border-default` | `--radius-lg` | Fully opaque |
| Hero/balance card | Glass spec above | 1px light @ 12% | `--radius-xl` | One per screen |
| Input field | `--bg-surface` | 1px `--border-default`, `--border-active` on focus | `--radius-md` | Never glass |
| Primary button | `--accent-primary`, dark text | none | `--radius-full` or `--radius-sm` | |
| Table row | `--bg-surface` | 1px bottom `--border-default` | none | Never glass |
| Sidebar | `--bg-surface` | 1px right `--border-default` | none | Never glass |

---

*Keep this file next to your Tailwind/CSS variables config — every token name above is meant to map 1:1 to a CSS custom property or Tailwind theme extension.*
