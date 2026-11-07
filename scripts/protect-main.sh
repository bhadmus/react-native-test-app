#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: scripts/protect-main.sh OWNER REPO" >&2
  exit 2
fi

OWNER="$1"
REPO="$2"

if [[ ! "$OWNER" =~ ^[A-Za-z0-9_.-]+$ ]] || [[ ! "$REPO" =~ ^[A-Za-z0-9_.-]+$ ]]; then
  echo "OWNER and REPO must match ^[A-Za-z0-9_.-]+$" >&2
  exit 2
fi

# Predefined repository role "admin" for actor_type RepositoryRole.
# Rulesets exported from GitHub and the public terraform-github-repository map
# use 5 for admin, 2 for maintain, and 4 for write. GitHub's REST schema does
# not publish these ids. If the API rejects 5, change only this number.
ADMIN_ROLE_ID=5
echo "Bypass actor: repository admin role id ${ADMIN_ROLE_ID}"

EXISTING="$(gh api "repos/${OWNER}/${REPO}/rulesets" --jq '.[] | select(.name=="Protect main") | .id')"
if [[ -n "${EXISTING}" ]]; then
  echo "A ruleset named \"Protect main\" already exists (id ${EXISTING})." >&2
  echo "Delete it in the GitHub UI before running this script again." >&2
  exit 1
fi

PAYLOAD="$(cat <<EOF
{
  "name": "Protect main",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [
    {
      "actor_id": ${ADMIN_ROLE_ID},
      "actor_type": "RepositoryRole",
      "bypass_mode": "always"
    }
  ],
  "conditions": {
    "ref_name": {
      "include": ["~DEFAULT_BRANCH"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": true,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "do_not_enforce_on_create": false,
        "required_status_checks": [
          { "context": "lint" },
          { "context": "typecheck" },
          { "context": "unit-tests" },
          { "context": "android-debug" }
        ]
      }
    }
  ]
}
EOF
)"

echo "Payload:"
echo "${PAYLOAD}"
echo "Response:"
gh api --method POST "repos/${OWNER}/${REPO}/rulesets" --input - <<<"${PAYLOAD}"
