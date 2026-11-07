# Exercises

Run the reset link before every exercise. Expected result: the Login screen in English.

PowerShell:

```powershell
adb shell am start -W -a android.intent.action.VIEW -d 'qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0' com.qatraining.rnapp
```

bash:

```bash
adb shell am start -W -a android.intent.action.VIEW -d 'qatraining://login?resetState=1&latencyMs=0&disableAnimations=1&lang=en&knownBug=0' com.qatraining.rnapp
```

Quote the URL. An unquoted `&` splits the command.

## 1. Install and log in by hand

Goal: the prebuilt app is on a device you can see.

1. Run the reset link at the top of this file. Expected: the Login screen, in English.
2. Follow the README "Start here" path if the app is not installed yet. Expected: Login, with no red screen.
3. Log in with `student@example.com` / `Password123!`.

Done when: the Items tab shows `Item 001`.

## 2. Reset with the deep link

Goal: put the app back to a known state without uninstalling it, then log in again.

1. Change the language or delete a row.
2. Run the reset link at the top of this file. Expected: Login, English, and the known-bug switch off.
3. Log in again with `student@example.com` / `Password123!`.

Done when: `Item 001` is back and the list is full.

## 3. Run the Maestro login flow

Goal: run a test you did not write.

1. Run the reset link at the top of this file. Expected: Login.
2. Follow `tests/maestro/README.md` and run `login.yaml`.

Done when: Maestro prints that the flow passed.

## 4. Run the Appium items flow

Goal: run the WebdriverIO sample.

1. Run the reset link at the top of this file. Expected: Login.
2. Follow `tests/appium/README.md` and run the suite.

Done when: both specs pass and only one device is connected.

## 5. Search and open an item

Goal: add a Maestro flow on your fork.

1. Run the reset link at the top of this file. Expected: Login.
2. Copy `tests/maestro/items.yaml` to a new file on your fork, or write a shorter flow that searches `Item 021`, opens `items.row.21`, and asserts the detail title.
3. Run that flow.

Done when: the flow passes on your fork.

## 6. Save the form

Goal: fill Forms until `Form saved` appears, then automate that path in Maestro or Appium.

1. Run the reset link at the top of this file, then log in. Expected: Items.
2. Enter a name, an email containing `@`, a quantity from 1 to 10, a date, Canada, France, or Japan, accept the terms, and choose Basic or Pro.
3. Assert `forms.successModal` in Maestro or Appium.

Done when: the modal appears in the app and in your test.

## 7. Scroll to the hidden target

Goal: scroll inside `gestures.scrollView` until `gestures.hiddenTarget` is visible.

1. Run the reset link at the top of this file, then log in. Expected: Items.
2. Open the Gestures tab and assert the text `Hidden target`.

Done when: the assertion passes without tapping a control above the fold.

## 8. Submit the WebView form

Goal: switch from the native app into the WebView and back.

1. Run the reset link at the top of this file, then log in. Expected: Items.
2. Follow the context section in `tests/appium/README.md`. Submit the bundled form and assert `Web form sent`.

Done when: the assertion passes inside the WebView context, and you can switch back to `NATIVE_APP`.

## 9. Record permission results

Goal: read the status labels.

1. Run the reset link at the top of this file, then log in. Expected: Items.
2. Tap `permissions.cameraButton`, `permissions.locationButton`, and `permissions.notificationsButton`.
3. Write down each status word.

Done when: each status has left `unknown` and is one of `granted`, `denied`, `blocked`, or `unavailable`.

## 10. Prove the flaky seed

Goal: show that one seed always waits the same amount of time.

1. Run the reset link at the top of this file, then log in. Expected: Items, and seed `1`.
2. Open Flaky from Settings, or use `qatraining://flaky?flakySeed=1` (quote it the same way as the reset link).
3. Tap the delay button and wait for `Flaky result`. Record the wait. Repeat with the same seed.
4. Use an even seed, dismiss `flaky.toast`, and tap `flaky.coveredButton`.

Done when: both waits for seed `1` match (2 seconds), and the even seed shows a toast you can dismiss.

## 11. Bad locators

Goal: find controls that were left hard to locate.

1. Run the reset link at the top of this file, then log in. Expected: Items.
2. Open Bad Locators from Settings. Find the nested `OK` and both `Submit` buttons.
3. Write which locator you used and why it would break if the text changed.

Done when: your notes name the locator strategy and the risk.

## 12. Bug report

Goal: describe a broken search before you read the answer.

1. Run the reset link at the top of this file, then log in. Expected: search matches titles, because `knownBug=0`.
2. Turn on **Enable known bug**. Try Items search.
3. Write `exercises/notes/bug-report.md` on your fork describing what search does.
4. Only then open `docs/KNOWN_BUG.md` and add a sentence on how your report compares.

Done when: the note exists on your fork and the sample tests still launch with `knownBug=0`.
