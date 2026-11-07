# When search ignores the title

Open this file only after writing `exercises/notes/bug-report.md`.

With **Enable known bug** on, Items search does not look at the title. It keeps a row only when the query is exactly that row's decimal id. Searching `1` returns Item 001. Searching `Item` or `Item 001` returns nothing. Searching `21` returns Item 021. The subtitle is never searched. Turn the switch off, or reset the app, and search is a case-insensitive match on the title again.
