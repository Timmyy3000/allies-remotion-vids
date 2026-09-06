# Agent instructions

Read ENGINEERING_STYLE.md before changing this repository. Read nested
AGENTS.md files before working in their subtrees.

## Pull request size

- Strongly prefer small, coherent PRs to ship faster and give Enkii shorter,
  more accurate reviews. Aim for one change reviewable in about 20-30 minutes.
- Treat 200-500 changed lines as a useful target, not a minimum or hard limit;
  exclude generated files, lockfiles, and mechanical formatting from the count.
  Above 500 lines, actively consider splitting; above 1,000, normally split or
  explain why keeping the change together is safer and easier to review.
- Keep required tests, contracts, and migrations with their implementation.
  Preserve coherent, testable intermediate states and document dependencies
  and merge/rollout order. Do not sacrifice correctness to meet a line count.
- Apply this during planning and before expanding a PR. Size alone is not an
  automatic review failure. See AL-12 in `ENGINEERING_STYLE.md`.
