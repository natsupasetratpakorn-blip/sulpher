# Runtime Config Guide

This project is currently running primarily from direct edits in the built bundle (`assets/index-D6D3wxNf.js`).
The config files below are optional helpers if you re-enable runtime overrides later.

## Files

- `config/app.config.js`: edit this file to change content and metadata.
- `config/dom-overrides.js`: runtime logic for branding, meta, text, links, and badge.
- `config/server-status.js`: runtime logic for live player count panel.
- `data/Sulpher-smp-db.yml`: lightweight YAML data source with admin credentials, branding defaults, and local storage keys.

## What you can change

### Branding

In `branding`:

- `siteName`
- `pageTitle`
- `logoUrl`

### Server

In `server`:

- `host`
- `port`
- `address`
- `version`
- `statusApi`
- `refreshMs`

### SEO and embeds

In `seo`:

- Open Graph values (`openGraph`)
- Twitter card values (`twitter`)
- Browser UI color (`themeColor`)

### Theme variables

In `theme.cssVariables`:

- Any CSS variable key/value pair.

### Text and links

In `content`:

- `textReplacements`: replace visible text across the page.
- `linkReplacements`: replace parts of links in all anchor tags.

## Notes

- Direct bundle edits are active right now.
- Admin quick login is set to `admin` / `admin` in the current bundle logic.
- If the app changes DOM dynamically, replacements are re-applied automatically.
- Keep replacements specific to avoid accidental global text changes.
- Place your provided logo image at `config/sulpher-logo.png` so the new badge and social image can use it.
