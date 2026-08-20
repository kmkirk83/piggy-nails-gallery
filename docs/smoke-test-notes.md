# Local Smoke-Test Notes

The first local visit to `/subscribe` rendered a blank page because `getLoginUrl()` attempted to construct a URL from unset OAuth environment variables during `useAuth()` initialization. The implementation was changed so missing OAuth settings no longer crash public storefront routes; deployed environments still require configured OAuth variables for authentication and checkout access.

## Subscription Builder Verification

After the OAuth fallback fix, `/subscribe` rendered successfully in a local browser. Selecting **Chrome Dreams** updated the builder from `0 of 3 selected` to `1 of 3 selected`, added the product to the box summary, and reduced the call-to-action requirement from three remaining kits to two. This confirms the custom-selection state and summary update work interactively.

The same local session was switched to **Curate it for me**. The builder replaced custom-choice controls with the seasonal-edit panel, showed seasonal examples, and enabled the secure-checkout call to action. This verifies the required seasonal choice and no-seasonal-choice paths both render correctly.
