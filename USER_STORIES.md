# User stories

What players must be able to do. Behavioral changes cite a story id. Agents
propose changes; the operator owns each story's intent.

## US-001: Fresh, fair pairs every round

A group can play many matches without the prompts going stale, and every pair
they see gives them a real chance to write a line that fits both worlds.

Criteria:

- The deck holds at least 500 pairs.
- No pair repeats within a match.
- Every generated pair in the deck has a passing record under the current pair
  battery in `evidence/pairs/reports.jsonl`; a pair without one fails the test
  suite.
- Every passing record includes a probe line that scored at least 4 points in
  the game rubric and turned its meaning between the worlds by 1.5 or more.
- Every world's text meets 7:1 contrast, and every world name is 4 words or
  fewer and distinct from its partner.

Status: proposed by an agent on 2026-09-23; awaiting operator review.
