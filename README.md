# Constructional Affection Coach

An AI-assisted interview and program builder for creating **Constructional Affection** behavior plans.

Rather than focusing on unwanted behavior, the application identifies the interaction a person wants to build, analyzes where components of that interaction already occur, and generates a step-by-step constructional program that uses affection as reinforcement.

---

## Overview

Constructional Affection is a constructional approach to building interaction patterns between people and their dogs.

The application guides users through a structured interview that:

1. Defines the desired interaction.
2. Identifies existing constructional assets.
3. Maps the interaction chain.
4. Builds a progressive training strategy.
5. Generates a downloadable program.

The result is a behavior program that begins where reliable behavior already exists and incrementally transfers that behavior into the desired interaction.

---

## Interview Process

### Step 1 — Define Success

Clarify the interaction the owner wants to create.

The outcome must be:

- observable
- positive
- constructional
- independently measurable

Example:

> While preparing for a walk, the dog remains standing or sitting calmly nearby waiting for the leash.

---

### Step 2 — What Already Works

Identify existing repertoires and reinforcers.

The interview discovers:

- preferred forms of affection
- existing calm behaviors
- contexts where the desired pattern already occurs
- skills that can be transferred

Example:

- dog sits calmly when owner stands with hands clasped
- dog enjoys petting
- dog enjoys praise
- dog approaches calmly when owner holds food

These become the constructional assets used to build the program.

---

### Step 3 — Analyze Chain

Determine where the desired interaction currently breaks down.

Rather than analyzing problem behavior, the interview analyzes the interaction sequence itself.

Example:

Preparing for a walk:

```
owner walks toward leash
↓
owner reaches toward leash
↓
owner touches leash
↓
owner picks up leash
↓
dog begins jumping
```

The first loss of control becomes the transfer point for the program.

---

### Step 4 — Build Strategy

The application constructs a shaping program.

Each stage includes:

- entry repertoire
- target behavior
- starting conditions
- success criterion
- affection loop
- interaction guidelines
- reinforcers

Each stage changes only one variable at a time while maintaining successful interaction.

---

### Step 5 — Complete

The user receives a complete Constructional Affection program including:

- clarified target outcome
- constructional assets
- interaction chain
- recommended starting point
- progressive program stages
- rationale

---

## Example Program

```
Goal

Dog remains calmly on the floor while owner prepares for a walk.

↓

Stage 1

Owner stands near leash.

Dog remains calmly sitting.

↓

Stage 2

Owner reaches toward leash.

Dog remains calmly sitting.

↓

Stage 3

Owner touches leash.

Dog remains calmly sitting.

↓

Stage 4

Owner picks up leash.

Dog remains calmly sitting.

↓

Stage 5

Owner prepares for walk.

Dog waits calmly until released.
```

---

## Core Concepts

### Constructional Assets

Existing successful interactions that can be transferred into new situations.

Examples:

- sitting
- lying down
- approaching calmly
- enjoying petting
- enjoying praise
- proximity
- eye contact

---

### Entry Repertoire

The behavior that already occurs reliably before introducing a new challenge.

Example:

```
Dog sits calmly
+
Owner standing with hands clasped
```

---

### Transfer Point

The first point in the interaction where control is lost.

Programs always begin immediately before this point.

---

### Affection Loop

Affection is delivered while the target interaction occurs.

If the interaction deteriorates:

- affection pauses
- calm behavior returns
- affection resumes

No punishment or correction is introduced.

---

### Interaction Guidelines

Each program stage includes practical coaching instructions describing exactly:

- when to begin affection
- when to pause
- when to resume
- how long to continue
- what constitutes success

---

## Technology

### Frontend

- SvelteKit
- TypeScript
- Tailwind CSS

### Backend

- Node
- TypeScript

### AI

- OpenAI Responses API
- Structured JSON generation
- Zod validation

### Infrastructure

Planned AWS deployment:

- API Gateway
- Lambda
- DynamoDB
- CloudFront
- S3

---

## Planned Features

### V1

- Guided interview
- AI-generated constructional programs
- PDF export
- AWS deployment

### V2

- User accounts
- Save multiple programs
- Resume interviews
- Program execution coaching
- Session tracking
- Progress logging
- Troubleshooting assistant
- Generalization planning
- Proofing suggestions

---

## Philosophy

Constructional Affection does not attempt to suppress unwanted behavior.

Instead, it asks:

> What interaction do we want to build?

The interview identifies existing successful behavior, determines where that behavior already exists, and constructs a progression that transfers it into increasingly challenging situations using affection as reinforcement.

The focus is not on reducing behavior.

The focus is on constructing new interaction patterns.

---

## Status

Current version:

- ✅ AI interview complete
- ✅ Target outcome generation
- ✅ Constructional asset discovery
- ✅ Interaction chain analysis
- ✅ Program generation
- 🚧 PDF export
- 🚧 AWS deployment
- 🚧 User accounts
- 🚧 Saved programs

---

## Author

Built by Chase Hendrix as an exploration of applying AI to Constructional Affection methodology.
