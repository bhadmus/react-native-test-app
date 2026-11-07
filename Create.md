ROLE
You are a senior React Native engineer building an open-source training app for QA automation students. The app exists to be tested with Appium, Maestro, and Detox. Deterministic behavior matters more than visual polish.

As of 2026-11-06 the current stable React Native is 0.88.x. Re-check the React Native compatibility matrix and the Detox support matrix on the day you build. From 0.82 onward the New Architecture is the only architecture: `newArchEnabled=false` and `RCT_NEW_ARCH_ENABLED=0` are ignored. Do not describe that as a setting you turned on.

DELIVERABLE
One repository named `qa-training-app-react-native`. The React Native app lives at the repository root (`package.json` beside `android/` and `ios/`). Do not create a nested project folder.

- React Native CLI app. Not Expo. Scaffold with `npx @react-native-community/cli init` (the `react-native init` command is gone). Use npm (`--pm npm`).
- TypeScript, `"strict": true`. No deep imports of React Native internals.
- Display name `QA Training app, designed by Ademola Bhadmus`. Android applicationId and iOS bundle id: `com.qatraining.rnapp`. URL scheme: `qatraining`.
- Hermes stays on (the template default). Do not add JSC.
- Portrait only. Ignore the system font scale: every `Text` and `TextInput` goes through a local wrapper with `allowFontScaling={false}` and `maxFontSizeMultiplier={1}`. Do not use `Text.defaultProps`.
- Pin every direct dependency to an exact version. `package.json` must contain no `^` and no `~`. Install with `npm install --save-exact`. Commit `package-lock.json`. Add `.nvmrc` and `package.json` `engines.node` using a Node version the matrix allows for the pinned React Native (0.88 requires Node 22.13+, 24.3+, or 26+).
- JDK 17 for Android. iOS uses the minimum Xcode from the matrix (Xcode 26+ for 0.88).

Allowed libraries beyond the CLI template:
- `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`
- `react-native-gesture-handler` (import it on the first line of the entry file) and `react-native-reanimated` (its Babel plugin is listed last)
- `react-native-webview`
- `@react-native-async-storage/async-storage`
- `@react-native-community/datetimepicker`
- `react-native-permissions` (camera, location-when-in-use, notifications only)

Anything else requires a written justification in the version note before you add it. Do not add an i18n library, a networking library, a UI kit, a picker library, analytics, or Expo. The dropdown is an in-app modal, not a native picker.

HARD CONSTRAINTS
- Build without a paid Apple or Google account.
- Android student artifact: debug build type, minify off, signed with the template `android/app/debug.keystore`. In the `react { }` block set `debuggableVariants = []` so Gradle embeds the JS bundle. Also turn developer support off on the host the template actually calls. On current templates that is `useDevSupport = false` passed to `getDefaultReactHost`. Overriding only the legacy `ReactNativeHost.getUseDeveloperSupport()` is not enough when that host is unused. A normal `assembleDebug` loads from Metro; that artifact is not acceptable. Do not switch the student APK to a minify-enabled release build.
- iOS student artifact: Release configuration for the simulator, which embeds `main.jsbundle` and does not start Metro. Command shape: `xcodebuild -workspace ios/<name>.xcworkspace -scheme <scheme> -configuration Release -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO`. `FORCE_BUNDLING` on a Debug build is not sufficient, because a Debug host still points at Metro.
- On versions that ship an iOS SceneDelegate (0.88 does), handle `qatraining://` in the scene lifecycle as well as the app delegate.
- No network calls. The WebView HTML is bundled and contains no `http` or `https` URL, no remote script, and no remote image. Do not add cleartext-traffic exceptions.
- No analytics and no secrets. Keep the public debug keystore. Do not generate a release keystore. Do not commit built APKs or zips.
- Prove the artifacts are standalone: with Metro not running, install the APK and cold-start it. A redbox or a hang on the packager means the build is wrong.

NAVIGATION
Auth flow is a native stack. Login is the only route shown when logged out. After login, a bottom tab navigator is the stack's main route. Item detail, Flaky, and Bad Locators are stack screens pushed over the tabs.

Tabs, in this order: Items, Forms, Gestures, WebView, Permissions, Settings.

Cold start with a stored session opens Items. Cold start without a session opens Login. Android back from Login leaves the app. Back from a pushed screen pops it. Logout replaces the stack with Login.

Unprotected routes: Login, and the deep link `qatraining://login`. Every other route requires a session. An unauthenticated link to a protected route stores that route, shows Login, and navigates there after a successful login. A `qatraining://login` link clears any stored route.

STATE AND FAKE API
All persistence is AsyncStorage. There is no other store.

`reset` (deep link `resetState=1`, and the Settings "Reset app data" action) clears storage and memory, then restores: logged out, English, light theme, known bug off, latency 0, OS-independent animations enabled, flaky seed 1, all 200 items present, no pending route.

Logout clears the session only. Deleted items, language, theme, latency, seed, and the known-bug flag survive logout.

Global latency defaults to 0. It applies only to fake-API functions. Each call waits `latencyMs` and then returns. Responses carry an incrementing request id; the UI applies a response only when its id is the latest for that call site. Page appends are idempotent: ignore a page whose ids are already present (React Strict Mode must not duplicate rows).

Catalog, fixed:
- 200 items. `id` is the integer 1 through 200. `title` is `Item 001` style, zero-padded to 3 digits. `subtitle` is `Category N` where `N` is `((id - 1) % 5) + 1`.
- `getItems({ page, pageSize, query })` with `pageSize` 20. Search runs against the full catalog, then paginates the matches. Deleted ids are absent until reset.
- Query matching is case-insensitive substring of `title`, including when the query is empty (empty returns the full remaining catalog). No debounce.
- Known bug, when the Settings flag is on: the query is compared to the decimal id string only, exact match. `1` returns Item 001. `Item` returns nothing. Document this behavior in `docs/KNOWN_BUG.md`. The README says the toggle is a bug-report exercise and that `docs/KNOWN_BUG.md` is the answer key.

Login credentials, exact, with no attempt counter and no format check beyond non-empty fields:
- `student@example.com` / `Password123!` stores a session and navigates to the pending route, or Items.
- `locked@example.com` plus any non-empty password shows `Account locked`.
- Any other non-empty pair shows `Invalid credentials`.

The fake API is a plain TypeScript module. UI code does not invent a second data source.

TEST HOOKS
Settings includes a Test controls group, in every build, including the standalone artifacts. There is no `__DEV__`-only screen.

Deep links (query string may be attached to any of these paths):

- `qatraining://login`
- `qatraining://item/<id>`
- `qatraining://flaky`
- `qatraining://bad-locators`
- `qatraining://settings`

Apply the query before navigating, in this order: `resetState`, then the other keys. Keys:

- `resetState=1`
- `latencyMs=<integer >= 0>`
- `disableAnimations=1` turns off JS navigation transitions, layout animation, and toast animation. It does not skip the Flaky screen delay and it cannot change OS animator scale. The README documents the `adb shell settings put global` animator, transition, and window scales, and the equivalent Simulator steps.
- `flakySeed=<integer>`
- `knownBug=0` or `1`
- `lang=en` or `fr`

Unknown item ids open the detail screen in its missing state. They do not crash.

`disableAnimations`, a stored session, and the other flags still work on a cold start from a killed process.

LOCATORS
Every interactive element and every asserted text node has a stable `testID` of the form `<screen>.<element>`, unique in the whole app. The value is that string on both platforms. Do not prefix the Android `testID` with the applicationId: Detox `by.id` and Maestro `id` use the raw value.

Platform mapping, which the README must state:
- iOS: `testID` becomes the accessibility identifier. Maestro `id` and Appium `accessibility id` use it.
- Android: `testID` becomes the raw `resource-id`, with no `com.qatraining.rnapp:id/` prefix. Appium's default `id` strategy prepends that prefix and will not match. The Appium reference tests set `disableIdLocatorAutocompletion` to true and then use `id=<testID>`. Also document `//*[@resource-id="<testID>"]` and `new UiSelector().resourceId("<testID>")`.
- `accessibilityLabel` is the visible purpose of inputs, buttons, and the login error banner. It is not the locator. Reference tests do not locate by visible text, except on Bad Locators.

Bad Locators is the only screen without testIDs.

Required testIDs and English copy:

Login
- `login.emailInput`, `login.passwordInput`, `login.passwordToggle`, `login.submitButton` (label `Log in`), `login.errorBanner`
- Submit with an empty email shows `Email is required`. Empty password shows `Password is required`. Both can appear together.
- The banner clears when either field changes. The button is disabled while the request is in flight.
- French for the button is `Connexion`. Every other user-visible string has an `en` and `fr` entry in one hand-written map. A missing key throws. No i18n library. Reference tests stay in English.

Items
- `items.searchInput`, `items.searchClear`, `items.list`, `items.empty` (text `No items`), `items.loadingMore`, `items.row.<id>`, `items.delete.<id>`
- Typing updates the query immediately and reloads from page 1. Clear restores the unfiltered catalog.
- The first page renders 20 rows. Reaching the end loads the next 20. The footer shows only while that request is in flight. After the last match, the footer stays hidden.
- Pull-to-refresh reloads page 1 of the current query and keeps deletions.
- Swipe reveals `items.delete.<id>`; activating it removes the row until reset.
- Tap opens detail.

Item detail
- `itemDetail.back`, `itemDetail.title`, `itemDetail.id`
- Missing id: `itemDetail.missing` with text `Item not found`.

Forms
Submit validates. Fixing a field clears that field's error. A valid submit shows the modal and does not persist the form. Dismissing the modal clears the fields.
- `forms.nameInput` required.
- `forms.emailInput` required and must contain `@`.
- `forms.quantityInput` required integer from 1 to 10.
- `forms.dateButton` opens the native picker. `forms.dateValue` shows `YYYY-MM-DD` built from the picker year, month, and day. Do not format with `toISOString()`.
- `forms.countrySelect` opens a modal list: Canada, France, Japan. `forms.country.<value>` on each option. Required. `forms.countryValue` shows the selection.
- `forms.termsCheckbox` required.
- `forms.planBasic` and `forms.planPro`, none selected initially, one required.
- `forms.newsletterSwitch` optional, default off.
- `forms.ratingSlider` default 5, range 0 to 10. `forms.ratingValue` shows the integer.
- `forms.submitButton`. Errors: `forms.error.name`, `forms.error.email`, `forms.error.quantity`, `forms.error.date`, `forms.error.country`, `forms.error.terms`, `forms.error.plan`.
- `forms.successModal` text `Form saved`, `forms.successOk` dismisses it.
- Android date picker is the system dialog. iOS is the native picker. Document that platform difference. Tests can assert `forms.dateValue` after the dialog.

Gestures, each with a visible result:
- `gestures.swipeCard`. After a completed swipe, `gestures.swipeResult` reads `Swiped`.
- `gestures.longPressTarget`. A press of 800ms sets `gestures.longPressResult` to `Long pressed`.
- `gestures.doubleTapTarget`. A second tap within 300ms sets `gestures.doubleTapResult` to `Double tapped`. One tap leaves `Idle`.
- `gestures.dragSource`, `gestures.dropZoneA`, `gestures.dropZoneB`. `gestures.dropResult` is `none`, then `A` or `B`.
- `gestures.zoomImage` uses a PNG committed in the repo. `gestures.zoomScale` starts at `1.0` and shows one decimal place.
- `gestures.scrollView` has a tall spacer and then `gestures.hiddenTarget` with text `Hidden target`.

WebView
- Container `webview.container`.
- Bundled document ids: `web-name`, `web-email`, `web-submit`, `web-result`, `web-link`, `web-link-result`.
- Submit stays on the page and sets `web-result` to `Web form sent`.
- The link is an in-page `#more` anchor and reveals `web-link-result` text `Link opened`.
- `tests/appium/README.md` explains `NATIVE_APP` versus `WEBVIEW` context switching using these DOM ids. The reference test does not have to drive the WebView.

Permissions
Request the permission and show the status. Do not open a camera preview, read GPS, or schedule a notification.
- `permissions.cameraButton`, `permissions.locationButton`, `permissions.notificationsButton`
- Matching `permissions.cameraStatus`, `permissions.locationStatus`, `permissions.notificationsStatus`
- Before the first tap the text is `unknown`. After the tap it is exactly one of `granted`, `denied`, `blocked`, `unavailable`.
- iOS usage strings are non-empty. The Podfile permission handler includes only these three. Android manifest includes `CAMERA`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, and `POST_NOTIFICATIONS`. No background location.
- `unavailable` on a simulator is a valid result.

Flaky
The delay is a pure function of the seed, in milliseconds: `1000 + (abs(seed) % 5) * 1000`. Default seed 1 waits 2 seconds. The same seed always produces the same delay. A toast covers `flaky.coveredButton` when `abs(seed) % 2 === 0`, and does not cover it otherwise.
- `flaky.delayButton` shows `flaky.spinner` for that delay, then `flaky.result` reads `Flaky result`.
- `flaky.coveredButton`, `flaky.toast`, `flaky.toastDismiss`.
- `disableAnimations=1` makes the toast appear and disappear without animation. It does not shorten the delay.

Bad Locators
Reachable from Settings and from `qatraining://bad-locators`. Deliberately hostile, and the README says so:
- two buttons whose visible text is `Submit`, with no testID
- two labels whose text is `Duplicate`
- a control labeled `OK` nested inside six `View`s
- no testIDs anywhere on this screen

Settings
- `settings.themeSwitch`. Default light. Dark mode changes colors only. It does not change structure, copy, or testIDs.
- `settings.languageEn`, `settings.languageFr`. Default English.
- `settings.logoutButton`, `settings.resetButton`, confirm `settings.resetConfirm`, cancel `settings.resetCancel`.
- `settings.knownBugSwitch`.
- `settings.flakyLink`, `settings.badLocatorsLink`.
- `settings.latencyInput`, `settings.applyLatencyButton`, `settings.latencyError` (text `Enter a latency of 0 or more`), `settings.flakySeedInput`, `settings.applySeedButton`.

SCREENS CHECK
The tab titles are the English names above. Theme and language wrap the whole tree, including Login.

REFERENCE TESTS
Unit tests use the template Jest preset (`@react-native/jest-preset` on current RN) and `@testing-library/react-native`. Cover the fake API (paging, search, known-bug mode, stale response ignored, latency via fake timers), Login (empty fields, success, locked, invalid), and Items (first page, search replaces rows). No real timers and no network.

End-to-end reference tests launch this URL and then act:

`qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0`

- `tests/appium`: its own `package.json`, WebdriverIO, TypeScript. A login smoke test and an items test. The items test logs in, asserts `Item 001`, searches `Item 021`, asserts that row is visible and `Item 001` is not, opens it, and asserts the detail title. README covers setup, the Android id-locator setting, and WebView contexts. Appium 2 and the UiAutomator2 and XCUITest drivers are installed by the student; pin the driver majors you verified in the README.
- `tests/maestro`: YAML for the same two flows, with a README. Maestro `id` uses the raw testID.
- Detox: `.detoxrc.js` plus one login test under `tests/detox`. Configurations are `android.emu.debug` and `ios.sim.release`, both pointed at the standalone binaries, and neither starts Metro. Detox's official matrix currently stops at RN 0.84 and says newer versions are untested. Do not downgrade React Native to chase Detox. If Detox cannot build or the login test cannot run, leave the config in place and mark it unverified.

CI does not start an emulator or simulator and does not run Appium, Maestro, or Detox.

CI
`ci.yml` runs on `pull_request` and on `push` to `main`. It does not run on tags. Use `pull_request`, never `pull_request_target`, and do not check out pull-request code under a write token. Set `permissions: contents: read`. Cancel superseded runs.

Jobs, and these exact names are the required status checks:
- `lint` (`npm run lint`)
- `typecheck` (`tsc --noEmit`)
- `unit-tests` (`npm test`)
- `android-debug` on `ubuntu-latest`: JDK 17, Node from `.nvmrc`, `assembleDebug`. Upload `app-debug.apk`.
- `ios-simulator` on a macOS runner whose Xcode meets the matrix: `pod install`, then the Release simulator `xcodebuild` above. Zip the `.app` and upload it.

Cache npm through `actions/setup-node`, cache Gradle, and cache CocoaPods from `Podfile.lock`. Do not cache `node_modules`. Use official GitHub actions. Any other action must be named in the README with the reason. Follow the React Native docs for the Android SDK setup on CI for the pinned version.

If no hosted runner provides the required Xcode, keep the iOS job correct and say in the checklist that it could not be verified.

RELEASE
`release.yml` runs on tags `v*`. `permissions: contents: write` is set on that job only.

Attach:
- `qa-training-app-rn-<tag>.apk` (the bundled debug APK; the tag includes the `v`)
- `qa-training-app-rn-<tag>-ios-simulator.zip` (the `.app` at the root of the zip)
- `checksums.sha256` covering both files

The README explains why the apps embed the bundle: students install them and run without Metro or a dev server. Install commands: `adb install -r <apk>` and, after unzip, `xcrun simctl install booted <App>.app`.

STUDENT-FACING DOCS
Write these for a QA student who has not used React Native, Appium, or Git remotes. Second person, numbered steps, and an expected result after every step. Define fork, emulator, Metro, testID, and deep link the first time they appear. Use the real applicationId `com.qatraining.rnapp`, the scheme `qatraining`, the credentials, and the testIDs from this spec. Where a command differs, show PowerShell, cmd.exe, and bash. Any URL that contains `&` is quoted in all three, with one sentence on why an unquoted `&` splits the command.

The first session uses the GitHub Release artifacts only. It does not require Node, JDK, a local Gradle or Xcode build, CocoaPods, or Metro. It does require Android Studio, so the student can create and start a virtual device, or a phone with USB debugging turned on. Building from source is a later, optional section. Call the download "the APK from the GitHub Release," not a release build: the file is a debug APK with the bundle embedded.

`README.md` opens with the student path, in this order:
1. One paragraph: this is a practice app for mobile test automation, the data is fake, and the installed app does not need a dev server.
2. "Start here" — the shortest Android path, copied from `docs/STUDENT_GUIDE.md`: fork, download the upstream Release, install, log in, reset. Each step is a command plus what the student should see. End with "You are ready when": `adb devices` shows one device, the app opens on Login with no red error screen, the reset link returns to Login, and `student@example.com` / `Password123!` shows `Item 001`.
3. Links, each with one line on when to open it: `docs/STUDENT_GUIDE.md`, `docs/exercises.md`, `docs/LOCATORS.md`, `tests/maestro/README.md`, `tests/appium/README.md`, `tests/detox/README.md`.
4. A "Skip these unless you are the instructor" list: `docs/REPO_SETUP.md`, `docs/KNOWN_BUG.md`, `scripts/protect-main.sh`.
5. After that, the maintainer reference: navigation, locator contract, Android `id` prefix trap, deep-link grammar, flaky-seed formula, why the bundle is embedded, and that Appium, Maestro, and Detox run on the student's machine and are not in CI.

`docs/STUDENT_GUIDE.md` contains these sections and these facts:

Who this is for, and the two ways to work. Day one is the prebuilt app. Building the repo is optional and comes last.

Fork, do not work in the upstream clone.
- On the course repo page, click Fork.
- `git clone` the fork, not the upstream URL.
- `git remote add upstream <course repo url>` and show `git remote -v`: `origin` is the student's fork, `upstream` is the course repo.
- `git push` goes to `origin` only. A rejected push to `upstream` means the protection is working. Do not force-push.
- Releases are published on the upstream repo. The fork's Releases page is empty until the student publishes one. Download the APK, the iOS zip, and `checksums.sha256` from the upstream Release `v1.0.0` (or the latest `v*`).

Install Android and confirm the phone.
- Install Android Studio, then a virtual device. State the API level this app was built with.
- Add `platform-tools` to `PATH`. Show the Windows and macOS `ANDROID_HOME` values.
- Start the virtual device, or plug in a phone with USB debugging on and accept the authorization prompt. `adb devices` prints one line ending in `device`. If the list is empty, stop and say the later commands cannot work.
- Turn off OS animations with the three `adb shell settings put global` commands for `animator_duration_scale`, `transition_animation_scale`, and `window_animation_scale`, each set to `0`. Say that the in-app `disableAnimations=1` flag does not do this.

Install the app without Metro.
- Check the SHA-256. PowerShell uses `Get-FileHash -Algorithm SHA256`. bash uses `shasum -a 256`. The hash must match the matching line in `checksums.sha256`.
- `adb install -r <apk>`.
- Launch with the activity name from `AndroidManifest.xml`, written as a full `component` name.
- Metro is a dev server. Students do not start it. A red screen that mentions Metro or a bundle means they installed a development build. Uninstall `com.qatraining.rnapp` and install the APK from the GitHub Release again.

iOS, marked macOS only.
- Install Xcode, open it once, boot an iPhone simulator with `xcrun simctl boot` and `open -a Simulator`.
- Unzip the artifact. Tell them the real `.app` bundle name from the build, which may differ from the display name `QA Training app, designed by Ademola Bhadmus`.
- `xcrun simctl install booted <ThatName>.app`.
- The simulator must already be booted. Building the iOS app is not part of this path.

Log in by hand, then put the app back to a known state.
- Email `student@example.com`, password `Password123!`, button `Log in`. The Items tab shows `Item 001`.
- `locked@example.com` and any password shows `Account locked`. An empty field shows `Email is required` or `Password is required`. Any other pair shows `Invalid credentials`.
- Settings → Reset app data → confirm returns to Login and restores all 200 items.
- Logout returns to Login and keeps deletions, language, theme, and the known-bug toggle. Say this so a "dirty" list is not a mystery.
- The reset deep link, quoted for PowerShell, cmd, and bash: `qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0`, passed to `adb shell am start -W -a android.intent.action.VIEW -d <url> com.qatraining.rnapp` and to `xcrun simctl openurl booted <url>`.
- Run that link before every test session. Expected result: Login, English, light theme, no known bug, no extra wait.

What each screen is for. One short paragraph each, plus where it is (tab, Settings link, or deep link) and the first thing to try:
- Login: valid, locked, empty, and wrong credentials.
- Items: scroll to load more than 20, search `Item 021`, clear search, swipe a row and delete it, open a row.
- Item detail: title matches the row. `qatraining://item/9999` shows `Item not found`.
- Forms: submit empty and read the errors, then fill every required field and expect `Form saved`. Mention the Android system date dialog versus the iOS picker, and that `forms.dateValue` shows `YYYY-MM-DD`.
- Gestures: swipe, long-press about a second, double-tap, drag into a zone, pinch the image, scroll until `Hidden target` is visible.
- WebView: the form and the link stay inside the app. There is no website to load. Context switching is an Appium exercise, using the DOM ids.
- Permissions: tap each button. The status leaves `unknown` and becomes `granted`, `denied`, `blocked`, or `unavailable`. `unavailable` on a simulator is a pass, not a broken phone.
- Flaky: same seed, same wait, using the formula. Open it from Settings. Dismiss the toast when it covers the button.
- Bad Locators: practice only. The screen has no testIDs on purpose.
- Settings: language changes `Log in` to `Connexion` after logout; dark mode changes colors only; the known-bug switch is an exercise.

Write a test of your own.
- Open `docs/LOCATORS.md`, copy one id, and say which tool uses which strategy: Maestro `id`, Detox `by.id`, Appium iOS accessibility id, Appium Android `id` only after `disableIdLocatorAutocompletion` is true.
- Put new Maestro flows and Appium specs on the student's fork. Do not add them to upstream unless the exercise says to open a pull request.
- A pull request is opened from the fork against the course repo. The student cannot merge it.

Tool setup points at the tool README and states what "passing" looks like. CI being green does not mean the end-to-end tests ran.

Building from source, optional and last.
- Required tools and how to print their versions: Node from `.nvmrc` (`node -v`), JDK 17 (`java -version`), Android SDK, and on macOS the Xcode from the compatibility matrix.
- `npm ci` at the repo root.
- Android: `gradlew.bat assembleDebug` on Windows, `./gradlew assembleDebug` elsewhere, then install `android/app/build/outputs/apk/debug/app-debug.apk`.
- iOS: the Release simulator `xcodebuild` from this spec, then install the `.app`.
- Repeat the "you are ready when" checks. If the app asks for Metro, the local build is the wrong one; uninstall it and go back to the APK from the GitHub Release.

Troubleshooting, as a table of symptom → cause → what to run:
- Red screen naming Metro or "could not connect" → development build → uninstall `com.qatraining.rnapp`, install the APK from the GitHub Release, and do not start Metro.
- `adb` is not recognized → `platform-tools` is not on `PATH` → set `ANDROID_HOME` and open a new terminal.
- `adb devices` is empty → the emulator is not running.
- Android cannot find `login.emailInput` → Appium prefixed the package → set `disableIdLocatorAutocompletion` true, as in `tests/appium`.
- The second test fails because the list is already changed → run the reset deep link first. Logout is not a full reset.
- Search for `Item 001` returns nothing → the known-bug switch is on → reset, or turn it off in Settings.
- A tap misses → OS animations are still on → rerun the three `settings put` commands.
- Login assertions fail in French → the deep link omitted `lang=en`.
- The deep link does nothing → the app is not installed, or the URL was split at `&`.
- Permission stays `unavailable` → expected on many emulators.
- The fork has no Release assets → download them from upstream.
- `git push upstream` is rejected → that remote is read-only.

`docs/LOCATORS.md` is a table the student can copy from: testID, screen, what the user sees, Maestro locator, Appium Android locator, Appium iOS locator, Detox locator. Include every required testID from this spec, the row pattern `items.row.<id>`, and the WebView DOM ids in a second table that says they exist only inside the WebView context. State the Bad Locators exception there.

`docs/exercises.md` is the workbook, in this order. Each exercise has a goal, the reset link, numbered steps, and "Done when". Do not put the known-bug explanation in this file.
1. Install and log in by hand.
2. Reset with the deep link and log in again.
3. Run the Maestro login flow using the command from `tests/maestro/README.md`.
4. Run the Appium items flow the same way.
5. On the student's fork, add a Maestro flow that searches `Item 021`, opens it, and asserts the detail title. Run it.
6. Fill the form until `Form saved` appears. Automate that path in Maestro or Appium.
7. Scroll to `Hidden target` and assert its text.
8. In Appium, switch into the WebView, submit the bundled form, and assert `Web form sent`. Use `tests/appium/README.md` for the context switch.
9. Tap each permission button and record the status word.
10. Set `flakySeed` to `1`, tap the delay button, and wait for `Flaky result`. Record the wait. Repeat with the same seed and show the wait matches. Then use an even seed, dismiss the toast, and tap the covered button.
11. On Bad Locators, find the nested `OK` and both `Submit` buttons. Write which locator was used and why it would break if the text changed.
12. Turn on "Enable known bug", try Items search, and write `exercises/notes/bug-report.md` on the fork describing what search does. Only then open `docs/KNOWN_BUG.md` and add a sentence on how the report compares. The sample tests must launch with `knownBug=0` so they do not trip this exercise.

`tests/maestro/README.md`, `tests/appium/README.md`, and `tests/detox/README.md` are runbooks: install the tool, the working directory, the exact command the builder ran, and the output that means the run passed. Appium's runbook includes driver install, starting the Appium server, one device only, and the Android id setting. If Detox was not verified on the pinned React Native, the Detox runbook says students skip Detox and use Maestro and Appium. It does not leave them a command that hangs.

`CONTRIBUTING.md` points students at `docs/STUDENT_GUIDE.md` for using the app. The git rules stay: the upstream is read-only, experiments stay on the fork, and the owner reviews any pull request.

REPO HYGIENE
- MIT `LICENSE`, the CLI `.gitignore`, and `.gitattributes` forcing `*.sh` to LF.
- `README.md`, `docs/STUDENT_GUIDE.md`, `docs/LOCATORS.md`, `docs/exercises.md`, and the three test runbooks, as specified in STUDENT-FACING DOCS.
- `CONTRIBUTING.md`: students have read-only access to the upstream and fork to experiment. The owner reviews PRs. The file points to `docs/STUDENT_GUIDE.md`.
- `CODEOWNERS` assigns `*` to `@OWNER_USERNAME`.
- `docs/REPO_SETUP.md`: create the public repo, turn Allow forking on, set default workflow permissions to read-only, require approval for first-time fork contributors, replace `@OWNER_USERNAME` with a real user who can review, push `main`, then run the script. Tell the solo owner that admin bypass is how they merge their own branches, and that students must not be given write or admin on the upstream.
- `scripts/protect-main.sh`: bash, `set -euo pipefail`, arguments `OWNER` and `REPO`, reject any argument that is not `^[A-Za-z0-9_.-]+$`. Use `gh api` to create one active branch ruleset on the default branch: pull request with at least 1 approval, code-owner review, no force pushes, no deletion. Require `lint`, `typecheck`, `unit-tests`, and `android-debug`. Add `ios-simulator` only when that job has passed once on the hosted runner; until then `docs/REPO_SETUP.md` says to leave it out, because a required check that never reports will block every merge. The only bypass actor is the repository admin role; look up that role id in the current ruleset API and print it. If a ruleset of the same name already exists, exit non-zero instead of creating a second one. Print the payload and the API response. Do not print tokens.

Do not run the script. Do not push. Do not change git config. If `user.name` or `user.email` is unset, stop and ask.

GIT HISTORY
Initialize git locally. Make these conventional commits, in order, and tag the last one `v1.0.0`:
1. `chore: scaffold the React Native app`
2. `feat: add the fake API and persisted session`
3. `feat: add the training screens`
4. `test: add unit and reference end-to-end tests`
5. `ci: add pull request and release workflows`
6. `docs: add the student guide and repository policy`

PROCESS
1. Before writing product code, print the exact versions you will pin, the Node and Xcode minimums, the Detox support gap if any, and every assumption. Then continue in the same run.
2. Build in the commit order above.
3. Verify on this machine: lint, typecheck, Jest, `assembleDebug`, and a Metro-free cold start if an emulator or device is attached. On Windows use `gradlew.bat`. If the host is not macOS, say so and mark iOS and Detox-on-iOS unverified. If Detox does not support the pinned React Native, mark Detox unverified. Then read `docs/STUDENT_GUIDE.md` as a student on this operating system. Every command in the Android first-session path must be one you ran, or mark that step unverified. Check that Release files are described as downloads from the upstream repo, that URLs containing `&` are quoted, and that the Detox runbook does not send students into an unverified command.
4. End with a checklist: verified, unverified, and the exact commands for the owner to create the GitHub repo, replace `CODEOWNERS`, push `main`, push the tag `v1.0.0`, and run `scripts/protect-main.sh`.

OUT OF SCOPE
Visual design, a component library, Storybook, screenshot baselines, a real backend, maps, a camera preview, push-token registration, crash reporting, Play Store or App Store submission, and running end-to-end tests in CI.
