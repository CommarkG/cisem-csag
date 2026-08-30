---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\planning\\2026-08-28__AntigravityLocal__YarivGovernor__CoreSpiralMethodologySpecification__V3.1.md"
  artifact_status: "RATIFIED"
  maturity: "RELEASE"
  version: "3.1"
  role_type: "CANONICAL_METHODOLOGY_SPECIFICATION"
  author: "Yariv Governor & Claude Reviewer & Antigravity Builder"
  related_axioms: ["AX-SPIRAL-01", "AX-SPIRAL-02", "AX-SPIRAL-03", "PR-11100", "PR-11400", "PR-13500"]
---

CISEM · THE CORESPIRAL
THE METHODOLOGY, ITS FOUR PROPERTIES, AND WHAT ENFORCES THEM
V3.1 · 2026-08-28. Supersedes V3.0, V2.0, and V1.0, which survive as evidence.

CHANGES IN V3.1: CORRECTION OF SECTION 3 CORESPINE SETTLED ELEMENTS based on live 
database audit of 2026-08-28. Element 2 (ISOLATION) downgraded to PARTIALLY OBSERVED 
(proven on browser path; un-enforced on FastAPI backend path). Element 3 (IDENTITY 
OF CALLER) downgraded to FALSE (disproven 2026-08-28; backend runs on bypassing 
service_role key).

===============================================================================
1 · THE THREE TERMS
===============================================================================

A CORESPINE IS THE ORDERED CHAIN OF SETTLED ELEMENTS.
Each element, once settled, binds everything that comes after it. It is not a
list of topics. It is a sequence in which position carries obligation.

A CORE CYCLE IS ONE PASS ALONG THAT CHAIN.
Not a task, not a sprint, not a plan version. ONE PASS, over one element, at one
depth.

A SPIRAL IS RETURNING TO AN ELEMENT ALREADY SETTLED, LATER, AT GREATER DEPTH.
Revisiting identity once locations exist and finding what that changes.

===============================================================================
1B · THE THREE AXIOMS — FROM THE REPOSITORY FILE, KEPT WITH THEIR IDENTIFIERS
===============================================================================

AX-SPIRAL-01 · NON-RIGID CORECYCLES.
  Cycles are defined by context and by inheritance — deep foundations first.

AX-SPIRAL-02 · FLEXIBLE PILLAR LIFECYCLES.
  An architectural concern need not appear in every cycle.

AX-SPIRAL-03 · VARIABLE MATURITY EXIT.
  A subject may reach maturity at any point and become a read-only stable dependency.

===============================================================================
2 · THE FOUR PROPERTIES OF A CORE CYCLE
===============================================================================
ORDER · DEPTH · PROGRESSIVE SPECIFICATION · STRICT NON-OPTIONAL OBLIGATION.

===============================================================================
3 · THE CORESPINE AS IT STANDS TODAY (UPDATED V3.1 · 2026-08-28)
===============================================================================
IN ORDER. EACH BINDS EVERYTHING AFTER IT.

  1 · WHO. One identity, many operational records. An operational record may not
      exist without an identity behind it — ENFORCED IN SCHEMA 2026-08-22.
      STATUS: SETTLED.

  2 · ISOLATION. A tenant cannot read another tenant, write into another tenant,
      rewrite platform reference data, publish a row visible to everyone, or
      delete another tenant.
      STATUS: PARTIALLY OBSERVED (2026-08-28).
      EXPLANATION: Proven against a direct browser connection (2026-08-22).
      DISPROVEN BEHIND THE API (2026-08-28): 0 of 66 tables enforce FORCE ROW LEVEL
      SECURITY, and the FastAPI backend connects using the service_role key which
      carries ROLBYPASSRLS TRUE. Isolation does not exist behind the platform's
      own backend API until the Publishable-Key Split lands.

  3 · THE IDENTITY OF THE CALLER. No request runs as an administrator. The role
      comes from the caller's own verified token.
      STATUS: FALSE (DISPROVEN 2026-08-28).
      EXPLANATION: Live query of pg_roles on 2026-08-28 proved that the backend
      connects using service_role (ROLBYPASSRLS TRUE). Requests entering the API
      execute as an administrator bypass, not as the caller's JWT role.

ANY CYCLE THAT ADDRESSES AN ELEMENT ON THE CORESPINE MUST HARDEN IT TO FULLY SETTLED.
SETTLED REQUIRES LANDED AND OBSERVED ON ALL EXECUTION PATHS (API AND BROWSER).
A COMMITTED RECORD NAMES EACH SETTLED ELEMENT, WHAT PROVED IT, AND WHEN.

===============================================================================
4 · HOW A CYCLE IS ORDERED AGAINST OTHERS
===============================================================================
A THING COMES FIRST IF WHAT FOLLOWS INHERITS FROM IT.

===============================================================================
5 · WHAT IS NOT ENFORCED, STATED SO IT IS NOT MISTAKEN FOR MECHANISM
===============================================================================
Depth and progress are not enforced. Obligation to previous elements is enforced by gates.

===============================================================================
6 · THE CYCLE TEMPLATE
===============================================================================
1 · NAME AND POSITION ON THE CORESPINE
2 · TARGET MATURITY
3 · INHERITED DEPENDENCIES
4 · PILLARS ACTIVE (ENTERS / MATURES / TERMINATES)
5 · EXECUTABLE PROOF (COMMAND + WHAT MUST BE SEEN)
6 · WHAT IS IN SCOPE
7 · WHAT IS OUT OF SCOPE
8 · WHAT DEFEATS THIS CYCLE'S PROOF (NAMED DEFEAT INPUT)

End of CISEM · THE CORESPIRAL · V3.1
