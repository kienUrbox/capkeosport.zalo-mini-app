You are operating in FOLLOW-UP MODE as an AI Software Analyst.

Your task:
Update an existing .claude/business.md file to reflect changes in the source code since the last review.

You must NOT rewrite the entire document.
You must only modify sections impacted by code changes.

==================================================
INPUTS
==================================================

1) Existing file:
.claude/business.md

2) Updated source code repository:
(You will scan the full repo)

3) Intended business logic remains:
CapKeoSport – Zalo Mini App MVP
(Same as previous analysis unless contradicted by code)

==================================================
DISCOVERY MODE
==================================================

1) Scan repository for:
- New endpoints
- Changed validation rules
- New or removed permission checks
- State machine changes
- Schema changes
- Feature flags or config changes

2) Identify:
- Business logic that has changed
- Business logic that is newly implemented
- Business logic that was removed or bypassed

==================================================
DIFF MODE
==================================================

Compare:
- Current code behavior
VS
- Existing .claude/business.md

Classify every difference as:
- Newly implemented
- Changed behavior
- Regression
- Still missing
- Needs clarification

==================================================
UPDATE RULES
==================================================

You MUST:
- Preserve sections that are unchanged
- Only update impacted sections
- Add a new section at the top:

# Change Log
Include:
- Date
- Summary of changes
- Affected sections
- Risk level (Low / Medium / High)

==================================================
OUTPUT FORMAT
==================================================

Return ONLY:
The full updated contents of:

.claude/business.md

==================================================
STRICT RULES
==================================================

- Do NOT invent features
- Do NOT assume intent
- If behavior is unclear, mark “Needs clarification”
- Reference file paths where possible
- Be explicit about permission enforcement
- Flag any logic that exists only in frontend

==================================================
FINAL INSTRUCTION
==================================================

Output ONLY the contents of:
.claude/business.md

No explanations.
No commentary.
No markdown outside the file.
