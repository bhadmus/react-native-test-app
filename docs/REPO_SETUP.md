# Repository setup

Students do not need this file. It is the owner's checklist for publishing the course repo.

1. Create a public GitHub repository named `qa-training-app-react-native`.
2. In Settings, enable **Allow forking**.
3. Replace `@OWNER_USERNAME` in `CODEOWNERS` with the GitHub user who will review pull requests. That user must be able to review. Do this before branch protection, or every pull request will be stuck.
4. Push `main`. Do not give students write or admin on this repo.
5. Under Actions, set the default workflow permissions to read-only.
6. Require approval for first-time contributors on pull requests from forks.
7. Run `scripts/protect-main.sh OWNER REPO` from a machine where `gh auth` is the owner. The script creates one ruleset: one approving review, code-owner review, the checks `lint`, `typecheck`, `unit-tests`, and `android-debug`, no force pushes, and no deletion. The only bypass is the repository admin role (role id printed by the script). A solo owner merges their own branches with that admin bypass.
8. Leave `ios-simulator` out of the ruleset until that job has passed once on the hosted `macos-26` runner. A required check that never reports blocks every merge. After it is green, add the context in the GitHub ruleset UI.
9. Push the tag `v1.0.0` when you want the Release workflow to publish the APK, the simulator zip, and `checksums.sha256`.

If the ruleset API rejects `actor_id` 5, check the current ruleset docs for the predefined admin role id and edit `ADMIN_ROLE_ID` in the script. Do not add a user, app, or team bypass.
