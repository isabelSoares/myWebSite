# UI Contract: Keep Flower Browser Tab Icon

## Browser tab

- The browser tab continues to display the existing flower icon (`flower.ico`).
- The same icon is used on `/`, `/resume`, `/projects`, and `/hobbies`, including direct route loads and refreshes.
- The icon resource resolves when the site is served under `/myWebSite`.
- The tab icon is visual identity only and is not treated as a clickable homepage control.

## Header home action

- The header displays the existing `IS.` mark.
- Activating the mark from any main route returns to the homepage in one action.
- Retaining the flower tab icon does not alter the button's mouse or keyboard behavior.

## Asset metadata

- The document's icon reference resolves to the existing public flower asset.
- Any browser metadata path that participates in the tab icon must not advertise a missing asset that overrides or contradicts the explicit flower icon.
