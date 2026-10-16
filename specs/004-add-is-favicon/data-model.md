# Data Model: Keep Flower Browser Tab Icon

This feature introduces no application data or persistence. It concerns the existing static browser identity and an existing navigation action.

## Browser Site Identity

| Field | Type | Description | Constraints / source |
|---|---|---|---|
| tabIconAsset | static image reference | Image the browser displays in its tab for the portfolio. | Must remain `flower.ico`, available under the deployed `/myWebSite` path. |
| documentIconReference | static resource location | The resource advertised by the site's HTML document. | Must resolve from the homepage and all direct nested routes. |
| deploymentBasePath | path | Public prefix used by the deployed portfolio. | Existing value: `/myWebSite`. |

## Homepage Navigation

| Field | Type | Description | Constraints / source |
|---|---|---|---|
| label | text | Visible header brand mark. | Existing value: `IS.` |
| destination | route | Homepage destination when the header mark is activated. | Existing value: `/` within the app's configured base path. |

## Relationship

The tab icon identifies the site but is not interactive. The header `IS.` mark is a separate action that navigates to the homepage. This feature retains both identities and changes neither user data nor persistence.
