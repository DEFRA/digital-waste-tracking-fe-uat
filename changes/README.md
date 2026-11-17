# Changes

What is changing in this repo, and why.

- `todo/` is work that is not done.
- `done/` is work that is finished.
- `ai-revision-log.md` is why each change happened.

A new task starts as a note in `todo/`. When it is finished, move the note to `done/`. A change that moves a decision, or that changes how the suite runs, appends the next numbered section to `ai-revision-log.md` and updates the Cursor rule that stated the old decision. The section names `git config --global user.name`, the UTC time, and the commit the change was made on top of. It says what changed, concretely enough to unpick.
