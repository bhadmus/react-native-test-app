# QA Training app, designed by Ademola Bhadmus

This is a practice app for mobile test automation. The data is fake, the screens are built to be located, and the installed app does not need a dev server.

## Start here

You need Android Studio (for a virtual device) or a phone with USB debugging. You do not need Node, a project build, or Metro for this path.

1. On the course repository page, click **Fork**. A fork is your own copy. Clone that copy, not the course URL:

   ```powershell
   git clone https://github.com/<you>/qa-training-app-react-native.git
   cd qa-training-app-react-native
   git remote add upstream https://github.com/<course-owner>/qa-training-app-react-native.git
   git remote -v
   ```

   `origin` is your fork. `upstream` is the course repo. Push only to `origin`.

2. Download `qa-training-app-rn-v1.0.0.apk` and `checksums.sha256` from the **upstream** Releases page. Your fork's Releases page is empty.

3. Check the file. PowerShell:

   ```powershell
   Get-FileHash .\qa-training-app-rn-v1.0.0.apk -Algorithm SHA256
   ```

   The hash must match the `.apk` line in `checksums.sha256`.

4. Start a virtual device (API 24 through 36; API 36 matches this build) or plug in a phone and accept the USB debugging prompt. `adb devices` must show one line ending in `device`.

5. Turn off operating-system animations:

   ```powershell
   adb shell settings put global animator_duration_scale 0
   adb shell settings put global transition_animation_scale 0
   adb shell settings put global window_animation_scale 0
   ```

6. Install and open the app:

   ```powershell
   adb install -r .\qa-training-app-rn-v1.0.0.apk
   adb shell am start -n com.qatraining.rnapp/.MainActivity
   ```

7. Log in with `student@example.com` / `Password123!`. You should see `Item 001`.

You are ready when `adb devices` shows one device, the app opens on Login with no red screen, the reset link below returns to Login, and the student account shows `Item 001`.

```powershell
adb shell am start -W -a android.intent.action.VIEW -d "qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0" com.qatraining.rnapp
```

Quote the URL. An unquoted `&` splits the command.

## What to open next

- [docs/STUDENT_GUIDE.md](docs/STUDENT_GUIDE.md) — the full how-to, including iOS, troubleshooting, and building from source.
- [docs/exercises.md](docs/exercises.md) — the workbook, in order.
- [docs/LOCATORS.md](docs/LOCATORS.md) — copy a locator from here when you write a test.
- [tests/maestro/README.md](tests/maestro/README.md) — run the sample Maestro flows.
- [tests/appium/README.md](tests/appium/README.md) — run the sample Appium tests.
- [tests/detox/README.md](tests/detox/README.md) — Detox is not part of the student path on this React Native version. Use Maestro and Appium.

## Skip these unless you are the instructor

- [docs/REPO_SETUP.md](docs/REPO_SETUP.md)
- [docs/KNOWN_BUG.md](docs/KNOWN_BUG.md) — the known-bug switch is a bug-report exercise, and this file is the answer key. Open it only after you write the report.
- `scripts/protect-main.sh`

## For instructors and maintainers

Bad Locators is the only screen without testIDs. It has two Submit buttons, two Duplicate labels, and an OK control nested in six views. That screen is for practicing bad locators.

Navigation is a native stack. Login is the only logged-out route. After login, tabs are Items, Forms, Gestures, WebView, Permissions, and Settings. Item detail, Flaky, and Bad Locators are pushed on top of the tabs.

`testID` values are documented in [docs/LOCATORS.md](docs/LOCATORS.md). On Android, `testID` becomes the raw `resource-id` with no `com.qatraining.rnapp:id/` prefix. Appium's default `id` strategy adds that prefix and misses the element. The Appium sample sets `disableIdLocatorAutocompletion` to true. iOS uses the same string as the accessibility identifier. Maestro `id` and Detox `by.id` use the raw `testID`. `accessibilityLabel` is not the locator.

Deep links use the `qatraining` scheme. Query keys are applied before navigation, `resetState` first: `latencyMs`, `disableAnimations`, `flakySeed`, `knownBug`, `lang`. The flaky delay in milliseconds is `1000 + (abs(seed) % 5) * 1000`. Seed `1` waits 2 seconds. An even seed covers a button with a toast. `disableAnimations=1` turns off JavaScript transitions only. It does not change the operating-system animator scale and it does not shorten the flaky delay.

The debug APK embeds the JavaScript bundle (`debuggableVariants = []`, and `useDevSupport = false`) and is signed with the template debug keystore. The iOS artifact is a Release simulator build of `QaTrainingApp.app`. Students install those files and never start Metro. Appium, Maestro, and Detox run on the student's machine. CI does not start an emulator.

CI uses `android-actions/setup-android` because GitHub-hosted Ubuntu does not include the Android SDK. The iOS jobs use `macos-26` because React Native 0.88 needs Xcode 26. `react-native-worklets` is a required peer of Reanimated 4.7 on React Native 0.86–0.88.
