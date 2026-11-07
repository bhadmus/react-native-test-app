# Locators

Copy one cell. Do not locate the sample tests by visible text, except on Bad Locators.

Bad Locators is the only screen without testIDs. It has two buttons labeled `Submit`, two labels reading `Duplicate`, and an `OK` control nested in six views.

Android `id` works only after `disableIdLocatorAutocompletion` is true. The same testID is also `//*[@resource-id="TESTID"]` and `android=new UiSelector().resourceId("TESTID")`, with the testID in place of `TESTID`.

| testID | Screen | What you see | Maestro | Appium Android | Appium iOS | Detox |
| --- | --- | --- | --- | --- | --- | --- |
| `app.loading` | App | Blank view while saved data loads | `id: "app.loading"` | `id=app.loading` | accessibility id `app.loading` | `by.id('app.loading')` |
| `login.emailInput` | Login | Email field | `id: "login.emailInput"` | `id=login.emailInput` | accessibility id `login.emailInput` | `by.id('login.emailInput')` |
| `login.passwordInput` | Login | Password field | `id: "login.passwordInput"` | `id=login.passwordInput` | accessibility id `login.passwordInput` | `by.id('login.passwordInput')` |
| `login.passwordToggle` | Login | Show password / Hide password | `id: "login.passwordToggle"` | `id=login.passwordToggle` | accessibility id `login.passwordToggle` | `by.id('login.passwordToggle')` |
| `login.submitButton` | Login | Log in, or Connexion in French | `id: "login.submitButton"` | `id=login.submitButton` | accessibility id `login.submitButton` | `by.id('login.submitButton')` |
| `login.errorBanner` | Login | Email is required, Password is required, Account locked, or Invalid credentials | `id: "login.errorBanner"` | `id=login.errorBanner` | accessibility id `login.errorBanner` | `by.id('login.errorBanner')` |
| `login.signupLink` | Login | Create an account | `id: "login.signupLink"` | `id=login.signupLink` | accessibility id `login.signupLink` | `by.id('login.signupLink')` |
| `signup.emailInput` | Signup | Email field | `id: "signup.emailInput"` | `id=signup.emailInput` | accessibility id `signup.emailInput` | `by.id('signup.emailInput')` |
| `signup.passwordInput` | Signup | Password field | `id: "signup.passwordInput"` | `id=signup.passwordInput` | accessibility id `signup.passwordInput` | `by.id('signup.passwordInput')` |
| `signup.confirmInput` | Signup | Confirm password | `id: "signup.confirmInput"` | `id=signup.confirmInput` | accessibility id `signup.confirmInput` | `by.id('signup.confirmInput')` |
| `signup.passwordToggle` | Signup | Show password / Hide password | `id: "signup.passwordToggle"` | `id=signup.passwordToggle` | accessibility id `signup.passwordToggle` | `by.id('signup.passwordToggle')` |
| `signup.submitButton` | Signup | Create account | `id: "signup.submitButton"` | `id=signup.submitButton` | accessibility id `signup.submitButton` | `by.id('signup.submitButton')` |
| `signup.errorBanner` | Signup | Validation, reserved email, or duplicate email | `id: "signup.errorBanner"` | `id=signup.errorBanner` | accessibility id `signup.errorBanner` | `by.id('signup.errorBanner')` |
| `signup.loginLink` | Signup | Log in instead | `id: "signup.loginLink"` | `id=signup.loginLink` | accessibility id `signup.loginLink` | `by.id('signup.loginLink')` |
| `items.searchInput` | Items | Search items | `id: "items.searchInput"` | `id=items.searchInput` | accessibility id `items.searchInput` | `by.id('items.searchInput')` |
| `items.searchClear` | Items | Clear search | `id: "items.searchClear"` | `id=items.searchClear` | accessibility id `items.searchClear` | `by.id('items.searchClear')` |
| `items.list` | Items | The scrolling list | `id: "items.list"` | `id=items.list` | accessibility id `items.list` | `by.id('items.list')` |
| `items.empty` | Items | No items | `id: "items.empty"` | `id=items.empty` | accessibility id `items.empty` | `by.id('items.empty')` |
| `items.loadingMore` | Items | Loading more | `id: "items.loadingMore"` | `id=items.loadingMore` | accessibility id `items.loadingMore` | `by.id('items.loadingMore')` |
| `items.row.<id>` | Items | One row. Item 001 is items.row.1 | `id: "items.row.<id>"` | `id=items.row.<id>` | accessibility id `items.row.<id>` | `by.id('items.row.<id>')` |
| `items.delete.<id>` | Items | Delete, after a swipe. Item 001 is items.delete.1 | `id: "items.delete.<id>"` | `id=items.delete.<id>` | accessibility id `items.delete.<id>` | `by.id('items.delete.<id>')` |
| `itemDetail.back` | Item detail | Back | `id: "itemDetail.back"` | `id=itemDetail.back` | accessibility id `itemDetail.back` | `by.id('itemDetail.back')` |
| `itemDetail.title` | Item detail | Item 001 | `id: "itemDetail.title"` | `id=itemDetail.title` | accessibility id `itemDetail.title` | `by.id('itemDetail.title')` |
| `itemDetail.id` | Item detail | The numeric id | `id: "itemDetail.id"` | `id=itemDetail.id` | accessibility id `itemDetail.id` | `by.id('itemDetail.id')` |
| `itemDetail.missing` | Item detail | Item not found | `id: "itemDetail.missing"` | `id=itemDetail.missing` | accessibility id `itemDetail.missing` | `by.id('itemDetail.missing')` |
| `forms.nameInput` | Forms | Name | `id: "forms.nameInput"` | `id=forms.nameInput` | accessibility id `forms.nameInput` | `by.id('forms.nameInput')` |
| `forms.emailInput` | Forms | Email | `id: "forms.emailInput"` | `id=forms.emailInput` | accessibility id `forms.emailInput` | `by.id('forms.emailInput')` |
| `forms.quantityInput` | Forms | Quantity | `id: "forms.quantityInput"` | `id=forms.quantityInput` | accessibility id `forms.quantityInput` | `by.id('forms.quantityInput')` |
| `forms.dateButton` | Forms | Choose date | `id: "forms.dateButton"` | `id=forms.dateButton` | accessibility id `forms.dateButton` | `by.id('forms.dateButton')` |
| `forms.dateValue` | Forms | YYYY-MM-DD or empty | `id: "forms.dateValue"` | `id=forms.dateValue` | accessibility id `forms.dateValue` | `by.id('forms.dateValue')` |
| `forms.countrySelect` | Forms | Country | `id: "forms.countrySelect"` | `id=forms.countrySelect` | accessibility id `forms.countrySelect` | `by.id('forms.countrySelect')` |
| `forms.countryValue` | Forms | Canada, France, or Japan | `id: "forms.countryValue"` | `id=forms.countryValue` | accessibility id `forms.countryValue` | `by.id('forms.countryValue')` |
| `forms.country.Canada` | Forms | Canada option | `id: "forms.country.Canada"` | `id=forms.country.Canada` | accessibility id `forms.country.Canada` | `by.id('forms.country.Canada')` |
| `forms.country.France` | Forms | France option | `id: "forms.country.France"` | `id=forms.country.France` | accessibility id `forms.country.France` | `by.id('forms.country.France')` |
| `forms.country.Japan` | Forms | Japan option | `id: "forms.country.Japan"` | `id=forms.country.Japan` | accessibility id `forms.country.Japan` | `by.id('forms.country.Japan')` |
| `forms.termsCheckbox` | Forms | I accept the terms | `id: "forms.termsCheckbox"` | `id=forms.termsCheckbox` | accessibility id `forms.termsCheckbox` | `by.id('forms.termsCheckbox')` |
| `forms.planBasic` | Forms | Basic | `id: "forms.planBasic"` | `id=forms.planBasic` | accessibility id `forms.planBasic` | `by.id('forms.planBasic')` |
| `forms.planPro` | Forms | Pro | `id: "forms.planPro"` | `id=forms.planPro` | accessibility id `forms.planPro` | `by.id('forms.planPro')` |
| `forms.newsletterSwitch` | Forms | Newsletter | `id: "forms.newsletterSwitch"` | `id=forms.newsletterSwitch` | accessibility id `forms.newsletterSwitch` | `by.id('forms.newsletterSwitch')` |
| `forms.ratingSlider` | Forms | Rating track, 0 to 10 | `id: "forms.ratingSlider"` | `id=forms.ratingSlider` | accessibility id `forms.ratingSlider` | `by.id('forms.ratingSlider')` |
| `forms.ratingValue` | Forms | The rating integer | `id: "forms.ratingValue"` | `id=forms.ratingValue` | accessibility id `forms.ratingValue` | `by.id('forms.ratingValue')` |
| `forms.submitButton` | Forms | Submit | `id: "forms.submitButton"` | `id=forms.submitButton` | accessibility id `forms.submitButton` | `by.id('forms.submitButton')` |
| `forms.error.name` | Forms | Name is required | `id: "forms.error.name"` | `id=forms.error.name` | accessibility id `forms.error.name` | `by.id('forms.error.name')` |
| `forms.error.email` | Forms | Enter an email containing @ | `id: "forms.error.email"` | `id=forms.error.email` | accessibility id `forms.error.email` | `by.id('forms.error.email')` |
| `forms.error.quantity` | Forms | Enter a whole number from 1 to 10 | `id: "forms.error.quantity"` | `id=forms.error.quantity` | accessibility id `forms.error.quantity` | `by.id('forms.error.quantity')` |
| `forms.error.date` | Forms | Date is required | `id: "forms.error.date"` | `id=forms.error.date` | accessibility id `forms.error.date` | `by.id('forms.error.date')` |
| `forms.error.country` | Forms | Country is required | `id: "forms.error.country"` | `id=forms.error.country` | accessibility id `forms.error.country` | `by.id('forms.error.country')` |
| `forms.error.terms` | Forms | Accept the terms to continue | `id: "forms.error.terms"` | `id=forms.error.terms` | accessibility id `forms.error.terms` | `by.id('forms.error.terms')` |
| `forms.error.plan` | Forms | Choose a plan | `id: "forms.error.plan"` | `id=forms.error.plan` | accessibility id `forms.error.plan` | `by.id('forms.error.plan')` |
| `forms.successModal` | Forms | Form saved | `id: "forms.successModal"` | `id=forms.successModal` | accessibility id `forms.successModal` | `by.id('forms.successModal')` |
| `forms.successOk` | Forms | OK | `id: "forms.successOk"` | `id=forms.successOk` | accessibility id `forms.successOk` | `by.id('forms.successOk')` |
| `gestures.swipeCard` | Gestures | Swipe the card | `id: "gestures.swipeCard"` | `id=gestures.swipeCard` | accessibility id `gestures.swipeCard` | `by.id('gestures.swipeCard')` |
| `gestures.swipeResult` | Gestures | Idle, then Swiped | `id: "gestures.swipeResult"` | `id=gestures.swipeResult` | accessibility id `gestures.swipeResult` | `by.id('gestures.swipeResult')` |
| `gestures.longPressTarget` | Gestures | Press and hold | `id: "gestures.longPressTarget"` | `id=gestures.longPressTarget` | accessibility id `gestures.longPressTarget` | `by.id('gestures.longPressTarget')` |
| `gestures.longPressResult` | Gestures | Idle, then Long pressed after 800ms | `id: "gestures.longPressResult"` | `id=gestures.longPressResult` | accessibility id `gestures.longPressResult` | `by.id('gestures.longPressResult')` |
| `gestures.doubleTapTarget` | Gestures | Double tap | `id: "gestures.doubleTapTarget"` | `id=gestures.doubleTapTarget` | accessibility id `gestures.doubleTapTarget` | `by.id('gestures.doubleTapTarget')` |
| `gestures.doubleTapResult` | Gestures | Idle, then Double tapped within 300ms | `id: "gestures.doubleTapResult"` | `id=gestures.doubleTapResult` | accessibility id `gestures.doubleTapResult` | `by.id('gestures.doubleTapResult')` |
| `gestures.dragSource` | Gestures | Drag me | `id: "gestures.dragSource"` | `id=gestures.dragSource` | accessibility id `gestures.dragSource` | `by.id('gestures.dragSource')` |
| `gestures.dropZoneA` | Gestures | Zone A | `id: "gestures.dropZoneA"` | `id=gestures.dropZoneA` | accessibility id `gestures.dropZoneA` | `by.id('gestures.dropZoneA')` |
| `gestures.dropZoneB` | Gestures | Zone B | `id: "gestures.dropZoneB"` | `id=gestures.dropZoneB` | accessibility id `gestures.dropZoneB` | `by.id('gestures.dropZoneB')` |
| `gestures.dropResult` | Gestures | none, A, or B | `id: "gestures.dropResult"` | `id=gestures.dropResult` | accessibility id `gestures.dropResult` | `by.id('gestures.dropResult')` |
| `gestures.zoomImage` | Gestures | The bundled blue image | `id: "gestures.zoomImage"` | `id=gestures.zoomImage` | accessibility id `gestures.zoomImage` | `by.id('gestures.zoomImage')` |
| `gestures.zoomScale` | Gestures | 1.0 until you pinch | `id: "gestures.zoomScale"` | `id=gestures.zoomScale` | accessibility id `gestures.zoomScale` | `by.id('gestures.zoomScale')` |
| `gestures.scrollView` | Gestures | The long scrolling page | `id: "gestures.scrollView"` | `id=gestures.scrollView` | accessibility id `gestures.scrollView` | `by.id('gestures.scrollView')` |
| `gestures.hiddenTarget` | Gestures | Hidden target | `id: "gestures.hiddenTarget"` | `id=gestures.hiddenTarget` | accessibility id `gestures.hiddenTarget` | `by.id('gestures.hiddenTarget')` |
| `webview.container` | WebView | The native WebView | `id: "webview.container"` | `id=webview.container` | accessibility id `webview.container` | `by.id('webview.container')` |
| `permissions.cameraButton` | Permissions | Request camera | `id: "permissions.cameraButton"` | `id=permissions.cameraButton` | accessibility id `permissions.cameraButton` | `by.id('permissions.cameraButton')` |
| `permissions.cameraStatus` | Permissions | unknown, then granted, denied, blocked, or unavailable | `id: "permissions.cameraStatus"` | `id=permissions.cameraStatus` | accessibility id `permissions.cameraStatus` | `by.id('permissions.cameraStatus')` |
| `permissions.locationButton` | Permissions | Request location | `id: "permissions.locationButton"` | `id=permissions.locationButton` | accessibility id `permissions.locationButton` | `by.id('permissions.locationButton')` |
| `permissions.locationStatus` | Permissions | Same status words | `id: "permissions.locationStatus"` | `id=permissions.locationStatus` | accessibility id `permissions.locationStatus` | `by.id('permissions.locationStatus')` |
| `permissions.notificationsButton` | Permissions | Request notifications | `id: "permissions.notificationsButton"` | `id=permissions.notificationsButton` | accessibility id `permissions.notificationsButton` | `by.id('permissions.notificationsButton')` |
| `permissions.notificationsStatus` | Permissions | Same status words | `id: "permissions.notificationsStatus"` | `id=permissions.notificationsStatus` | accessibility id `permissions.notificationsStatus` | `by.id('permissions.notificationsStatus')` |
| `flaky.delayButton` | Flaky | Run delayed action | `id: "flaky.delayButton"` | `id=flaky.delayButton` | accessibility id `flaky.delayButton` | `by.id('flaky.delayButton')` |
| `flaky.spinner` | Flaky | Loading more, while the seed delay runs | `id: "flaky.spinner"` | `id=flaky.spinner` | accessibility id `flaky.spinner` | `by.id('flaky.spinner')` |
| `flaky.result` | Flaky | Flaky result after the delay | `id: "flaky.result"` | `id=flaky.result` | accessibility id `flaky.result` | `by.id('flaky.result')` |
| `flaky.coveredButton` | Flaky | Covered button | `id: "flaky.coveredButton"` | `id=flaky.coveredButton` | accessibility id `flaky.coveredButton` | `by.id('flaky.coveredButton')` |
| `flaky.toast` | Flaky | Present only when the seed is even | `id: "flaky.toast"` | `id=flaky.toast` | accessibility id `flaky.toast` | `by.id('flaky.toast')` |
| `flaky.toastDismiss` | Flaky | Dismiss toast | `id: "flaky.toastDismiss"` | `id=flaky.toastDismiss` | accessibility id `flaky.toastDismiss` | `by.id('flaky.toastDismiss')` |
| `settings.themeSwitch` | Settings | Dark mode | `id: "settings.themeSwitch"` | `id=settings.themeSwitch` | accessibility id `settings.themeSwitch` | `by.id('settings.themeSwitch')` |
| `settings.languageEn` | Settings | English | `id: "settings.languageEn"` | `id=settings.languageEn` | accessibility id `settings.languageEn` | `by.id('settings.languageEn')` |
| `settings.languageFr` | Settings | French | `id: "settings.languageFr"` | `id=settings.languageFr` | accessibility id `settings.languageFr` | `by.id('settings.languageFr')` |
| `settings.logoutButton` | Settings | Log out | `id: "settings.logoutButton"` | `id=settings.logoutButton` | accessibility id `settings.logoutButton` | `by.id('settings.logoutButton')` |
| `settings.resetButton` | Settings | Reset app data | `id: "settings.resetButton"` | `id=settings.resetButton` | accessibility id `settings.resetButton` | `by.id('settings.resetButton')` |
| `settings.resetConfirm` | Settings | Confirm | `id: "settings.resetConfirm"` | `id=settings.resetConfirm` | accessibility id `settings.resetConfirm` | `by.id('settings.resetConfirm')` |
| `settings.resetCancel` | Settings | Cancel | `id: "settings.resetCancel"` | `id=settings.resetCancel` | accessibility id `settings.resetCancel` | `by.id('settings.resetCancel')` |
| `settings.knownBugSwitch` | Settings | Enable known bug | `id: "settings.knownBugSwitch"` | `id=settings.knownBugSwitch` | accessibility id `settings.knownBugSwitch` | `by.id('settings.knownBugSwitch')` |
| `settings.flakyLink` | Settings | Flaky screen | `id: "settings.flakyLink"` | `id=settings.flakyLink` | accessibility id `settings.flakyLink` | `by.id('settings.flakyLink')` |
| `settings.badLocatorsLink` | Settings | Bad locators | `id: "settings.badLocatorsLink"` | `id=settings.badLocatorsLink` | accessibility id `settings.badLocatorsLink` | `by.id('settings.badLocatorsLink')` |
| `settings.latencyInput` | Settings | Latency in milliseconds | `id: "settings.latencyInput"` | `id=settings.latencyInput` | accessibility id `settings.latencyInput` | `by.id('settings.latencyInput')` |
| `settings.applyLatencyButton` | Settings | Apply latency | `id: "settings.applyLatencyButton"` | `id=settings.applyLatencyButton` | accessibility id `settings.applyLatencyButton` | `by.id('settings.applyLatencyButton')` |
| `settings.latencyError` | Settings | Enter a latency of 0 or more | `id: "settings.latencyError"` | `id=settings.latencyError` | accessibility id `settings.latencyError` | `by.id('settings.latencyError')` |
| `settings.flakySeedInput` | Settings | Flaky seed | `id: "settings.flakySeedInput"` | `id=settings.flakySeedInput` | accessibility id `settings.flakySeedInput` | `by.id('settings.flakySeedInput')` |
| `settings.applySeedButton` | Settings | Apply seed | `id: "settings.applySeedButton"` | `id=settings.applySeedButton` | accessibility id `settings.applySeedButton` | `by.id('settings.applySeedButton')` |
| `settings.seedError` | Settings | Enter a whole number | `id: "settings.seedError"` | `id=settings.seedError` | accessibility id `settings.seedError` | `by.id('settings.seedError')` |

## WebView DOM ids

These ids exist only after you switch into the WebView context. They are not React Native testIDs. The native container is `webview.container`.

| DOM id | What it does | Appium, inside the WebView |
| --- | --- | --- |
| `web-name` | Name field | `#web-name` |
| `web-email` | Email field | `#web-email` |
| `web-submit` | Sets `web-result` to `Web form sent` | `#web-submit` |
| `web-result` | Empty until submit | `#web-result` |
| `web-link` | In-page link | `#web-link` |
| `web-link-result` | `Link opened` after the link | `#web-link-result` |
