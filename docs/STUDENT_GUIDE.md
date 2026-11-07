# Student guide

## Who this is for

This guide is for a QA student who has not used React Native. A **fork** is your own GitHub copy of the course repo. An **emulator** is a virtual Android phone. **Metro** is the dev server that a development build uses to load JavaScript. You do not start Metro. A **testID** is the stable name on a control, such as `login.emailInput`. A **deep link** is a URL that opens a screen inside the app, such as `qatraining://login`.

## Two ways to work

Day one uses the prebuilt APK from the course repository's GitHub Release. Building the project is optional and is the last section of this guide.

## Fork, do not work in the upstream clone

1. On the course repo page, click **Fork**. Expected: GitHub opens your copy of the repository.
2. Clone your fork. Replace both placeholders:

   ```bash
   git clone https://github.com/<you>/qa-training-app-react-native.git
   cd qa-training-app-react-native
   git remote add upstream https://github.com/<course-owner>/qa-training-app-react-native.git
   git remote -v
   ```

   Expected: `origin` is your fork and `upstream` is the course repo.
3. `git push` goes to `origin` only. A rejected push to `upstream` means the protection is working. Do not force-push. Expected: a push to `origin` is accepted, and a push to `upstream` is rejected.
4. Releases are published on the upstream repo. The fork's Releases page stays empty until you publish one yourself. Download the APK, the iOS zip if you are on a Mac, and `checksums.sha256` from the upstream Release `v1.0.0` (or the latest `v*`). Expected: those files are on your computer, and your fork's Releases page does not list them.

## Install Android and confirm the phone

1. Install Android Studio. Create a virtual device. This app's minimum API is 24, it targets API 36, and it is compiled with API 37. Use an API 36 image when you have one. Any image from API 24 upward can run the APK. Expected: Android Studio can start that virtual device.
2. Put `platform-tools` on your `PATH`.

   Windows, then open a new terminal:

   ```powershell
   $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
   $env:Path += ";$env:ANDROID_HOME\platform-tools"
   ```

   macOS, in `~/.zshrc`:

   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   Expected: a new terminal prints a version when you run `adb version`.
3. Start the virtual device, or plug in a phone, turn on USB debugging, and accept the prompt. `adb devices` prints one line ending in `device`. If the list is empty, stop. The later commands cannot work.
4. Turn off operating-system animations. The in-app `disableAnimations=1` flag does not do this. Expected: each command finishes without an error.

   ```bash
   adb shell settings put global animator_duration_scale 0
   adb shell settings put global transition_animation_scale 0
   adb shell settings put global window_animation_scale 0
   ```

## Install the app without Metro

1. Check the download.

   PowerShell:

   ```powershell
   Get-FileHash .\qa-training-app-rn-v1.0.0.apk -Algorithm SHA256
   ```

   bash:

   ```bash
   shasum -a 256 qa-training-app-rn-v1.0.0.apk
   ```

   Expected: the hash matches the matching line in `checksums.sha256`.
2. `adb install -r qa-training-app-rn-v1.0.0.apk`. Expected: the command prints `Success`.
3. Launch the activity from `AndroidManifest.xml`:

   ```bash
   adb shell am start -n com.qatraining.rnapp/.MainActivity
   ```

   Expected: the Login screen. Metro is a dev server. Do not start it. A red screen that mentions Metro or a bundle means you installed a development build. Uninstall `com.qatraining.rnapp` and install the APK from the GitHub Release again:

   ```bash
   adb uninstall com.qatraining.rnapp
   adb install -r qa-training-app-rn-v1.0.0.apk
   ```

## iOS, macOS only

1. Install Xcode, open it once so it finishes setup, then boot a simulator:

   ```bash
   xcrun simctl list devices
   xcrun simctl boot "iPhone 16"
   open -a Simulator
   ```

   Expected: Simulator is open and the device shows as Booted. Use an iPhone name that `simctl list` actually prints if `iPhone 16` is missing.
2. Unzip the release zip. Expected: you have a folder named `QaTrainingApp.app`. That name is the Xcode product name. The icon label is `QA Training app, designed by Ademola Bhadmus`.
3. The simulator must already be booted.

   ```bash
   xcrun simctl install booted QaTrainingApp.app
   ```

   Expected: the command finishes without an error and the app icon appears in the simulator. Building the iOS app is not part of this path.

## Log in, then return to a known state

1. Email `student@example.com`, password `Password123!`, button `Log in`. The Items tab shows `Item 001`.
2. On Login, tap `Create an account`. Enter an email that contains `@`, a password, and the same password again. `student@example.com` and `locked@example.com` are reserved. Expected: the new account is logged in and Items shows `Item 001`. Log out, then log in with that same email and password. Reset app data removes created accounts. The student account still works after that reset.
3. `locked@example.com` and any password shows `Account locked`. An empty field shows `Email is required` or `Password is required`. Any other pair that is not a created account shows `Invalid credentials`.
4. Settings, Reset app data, Confirm returns to Login and restores all 200 items. Created accounts are removed.
5. Log out returns to Login and keeps deletions, language, theme, the known-bug toggle, and created accounts. A short list after logout is not a failed install.
6. Run this reset link before every test session. Expected result: Login, English, light theme, no known bug, no extra wait, and no created accounts.

   PowerShell, single quotes so `&` stays inside the URL:

   ```powershell
   adb shell am start -W -a android.intent.action.VIEW -d 'qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0' com.qatraining.rnapp
   ```

   cmd.exe, double quotes:

   ```cmd
   adb shell am start -W -a android.intent.action.VIEW -d "qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0" com.qatraining.rnapp
   ```

   bash:

   ```bash
   adb shell am start -W -a android.intent.action.VIEW -d 'qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0' com.qatraining.rnapp
   xcrun simctl openurl booted 'qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0'
   ```

   An unquoted `&` is a command separator, so the shell never sends the rest of the URL.

## What each screen is for

- **Login** is the first screen. Try the student account, the locked account, an empty form, and a wrong password.
- **Items** is the first tab. Scroll to load more than 20 rows, search `Item 021`, clear the search, swipe a row and delete it, then open a row.
- **Item detail** opens from a row. The title matches the row. `qatraining://item/9999` shows `Item not found`.
- **Forms** is a tab. Submit while empty and read the errors, then fill every required field and expect `Form saved`. Android opens the system date dialog. iOS opens the native picker. `forms.dateValue` shows `YYYY-MM-DD`.
- **Gestures** is a tab. Swipe the card, press and hold for about a second, double-tap, drag into a zone, pinch the image, and scroll until `Hidden target` is visible.
- **WebView** is a tab. The form and the link stay inside the app. There is no website to load. Context switching is an Appium exercise. The DOM ids are in [LOCATORS.md](LOCATORS.md).
- **Permissions** is a tab. Tap each button. The status leaves `unknown` and becomes `granted`, `denied`, `blocked`, or `unavailable`. `unavailable` on a simulator is a pass, not a broken phone.
- **Flaky** opens from Settings. The same seed always waits the same time: `1000 + (abs(seed) % 5) * 1000` milliseconds. Seed `1` waits 2 seconds. Dismiss the toast when it covers the button.
- **Bad Locators** opens from Settings. It is practice only. The screen has no testIDs on purpose.
- **Settings** is a tab. After you switch to French and log out, the button reads `Connexion`. Dark mode changes colors only. The known-bug switch is an exercise.

## Write a test of your own

Open [LOCATORS.md](LOCATORS.md) and copy one id. Maestro uses `id`. Detox uses `by.id`. Appium on iOS uses the accessibility id. Appium on Android uses `id` only after `disableIdLocatorAutocompletion` is true, which the sample config already sets.

Put new Maestro flows and Appium specs on your fork. Do not add them to the course repo unless an exercise tells you to open a pull request. A pull request is opened from your fork against the course repo. You cannot merge it.

## Run the sample tools

Follow [tests/maestro/README.md](../tests/maestro/README.md) and [tests/appium/README.md](../tests/appium/README.md). A passing run prints the spec reporter success line for that tool. A green GitHub check does not mean those tests ran. They run only on your machine.

Skip [tests/detox/README.md](../tests/detox/README.md). Detox officially tests through React Native 0.84, and this app is on 0.88. The config is in the repo for the maintainer. It is not a student exercise.

## Building from source, optional

Print the tools first:

```bash
node -v
java -version
```

`node -v` must satisfy `.nvmrc` (Node 22.13 or newer; this project was verified on 24.14.1). `java -version` must be JDK 17 for a CI-like build. Gradle 9 can also run on newer JDKs, but CI uses 17. On macOS, Xcode must meet the React Native 0.88 matrix (Xcode 26 or newer).

```bash
npm ci
```

Expected: npm finishes without an error.

Android, from the repo root. Expected: Gradle prints `BUILD SUCCESSFUL` and `adb install` prints `Success`.

```powershell
cd android
.\gradlew.bat assembleDebug
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

```bash
cd android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

On Windows, a project path as long as `Documents\TutorialProjects\Mobile\react-native` can make the native build fail with "Filename longer than 260 characters" or "build.ninja still dirty". Copy the repo to a short folder such as `C:\r` and run the same Gradle command there. Expected: `BUILD SUCCESSFUL`, and the APK contains `assets/index.android.bundle`.

iOS:

```bash
cd ios && pod install && cd ..
xcodebuild -workspace ios/QaTrainingApp.xcworkspace -scheme QaTrainingApp -configuration Release -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO -derivedDataPath ios/build
xcrun simctl install booted ios/build/Build/Products/Release-iphonesimulator/QaTrainingApp.app
```

Expected: the simulator install finishes without an error.

Repeat the "you are ready" checks from the README. Expected: Login, no red screen, the reset link returns to Login, and the student account shows `Item 001`. If the app asks for Metro, the local build is the wrong one. Uninstall it and go back to the APK from the GitHub Release.

## Troubleshooting

| What you see | Why | What to run |
| --- | --- | --- |
| Red screen naming Metro or "could not connect" | Development build | `adb uninstall com.qatraining.rnapp`, install the APK from the GitHub Release, and do not start Metro |
| `adb` is not recognized | `platform-tools` is not on `PATH` | Set `ANDROID_HOME` and open a new terminal |
| `adb devices` is empty | The emulator is not running | Start the virtual device or accept the phone prompt |
| Android cannot find `login.emailInput` | Appium prefixed the package | Set `disableIdLocatorAutocompletion` true, as in `tests/appium` |
| The second test fails because the list already changed | The app kept the last session | Run the reset deep link first. Logout is not a full reset |
| Search for `Item 001` returns nothing | The known-bug switch is on | Reset, or turn the switch off in Settings |
| A tap misses | OS animations are still on | Rerun the three `settings put` commands |
| Login assertions fail in French | The deep link omitted `lang=en` | Use the reset link in this guide |
| The deep link does nothing | The app is not installed, or the URL was split at `&` | Install the APK and quote the URL |
| Permission stays `unavailable` | Expected on many emulators | Record `unavailable` and continue |
| The fork has no Release assets | Releases live on the course repo | Download them from upstream |
| `git push upstream` is rejected | That remote is read-only | Push to `origin` |
| Gradle says the filename is longer than 260 characters, or `build.ninja` is still dirty | The project path is too long for Windows | Copy the repo to a short folder such as `C:\r` and run `gradlew.bat assembleDebug` there |
