export const INTERACTION_CHAIN_RESOURCE_URI =
  "constructional-affection://methodology/interaction-chain";

export const INTERACTION_CHAIN_RESOURCE = `

# Constructional Affection Interaction Chain

## 1. Purpose

The Interaction Chain phase identifies the meaningful sequence of events
through which the accepted Target Outcome must eventually be established.

The phase maps:

* how the relevant interaction begins;
* which person, dog, and environmental events occur next;
* where the desired interaction is already present;
* the first condition under which the desired interaction is no longer
  maintained;
* the interaction event immediately before that transition;
* and the remaining ordinary events leading to the complete Target Outcome.

The Interaction Chain provides the structural path used later to:

* select the constructional starting point;
* identify the first transfer variable;
* organize program phases;
* create successive approximations;
* and determine when the full terminal interaction has been reached.

The phase does not design the program.

It does not create Step 0, prescribe the Affection Loop, select durations,
recommend procedures, or determine exact successive approximations.

Its purpose is to identify the interaction structure that later program design
will use.

---

## 2. Relationship to Previous Phases

The Interaction Chain is derived from:

1. the Target Outcome; and
2. the Constructional Assets.

### 2.1 Target Outcome

The Target Outcome defines:

* the complete desired interaction;
* the relevant context;
* the person's terminal activity;
* the dog's target actions;
* acceptable alternatives;
* and the terminal conditions under which success should occur.

The final link of the Interaction Chain should correspond to the accepted
Target Outcome.

The Target Outcome defines the destination of the chain.

### 2.2 Constructional Assets

Constructional Assets identify:

* target-related behavior already in the dog's repertoire;
* conditions under which relevant behavior already occurs;
* available social reinforcers;
* and potentially useful starting interactions.

Constructional Assets provide evidence for determining where the desired
interaction may already be present at the beginning of the chain.

They should constrain the selection of the constructional starting point.

### 2.3 Interaction Chain

The Interaction Chain connects:

> existing interaction → changed conditions → complete target interaction

It identifies the route through which control will later be transferred.

---

## 3. Current Pattern and Target Pattern

### 3.1 The Chain Represents a Comparison

The Interaction Chain is built by comparing:

* what currently happens at the beginning of the interaction; and
* what would happen if the Target Outcome remained present through the
  complete interaction.

The phase is not a full problem-analysis chain and not a fictional idealized
sequence detached from current behavior.

It uses the current interaction only to determine:

* how the sequence begins;
* where the target pattern is still present;
* and the first point where the current and target patterns diverge.

The remaining ordinary events may then be inferred toward the Target Outcome.

### 3.2 Current Pattern

The current pattern provides evidence about:

* the opening conditions;
* the dog's available behavior;
* the person or environmental event that changes;
* and the earliest point at which deliberate transfer may be required.

The phase should not analyze the unwanted behavior beyond locating this
transition.

### 3.3 Target Pattern

The target pattern is the positive interaction defined in the Target Outcome.

The chain should represent the target pattern as continuing through relevant
conditions even where it does not currently occur reliably.

This allows later program design to identify which conditions require transfer.

### 3.4 Divergence Point

The divergence point is the first meaningful interaction event at which:

* the current pattern no longer matches the Target Outcome;
* the target pattern becomes absent or uncertain;
* or a new condition is introduced under which the target pattern has not yet
  been established.

The divergence point identifies the first transfer problem.

It does not require a detailed analysis of the unwanted behavior that follows.

---

## 4. The Complaint Is Not the Chain

The Interaction Chain should not become a detailed sequence of unwanted
behavior.

Do not construct a chain such as:

> dog jumps → person pushes dog away → dog mouths sleeve → person raises voice
> → dog barks

unless one of those events is strictly necessary to identify the first point
where the desired interaction disappeared.

The complaint serves only to reveal:

* that the target pattern is no longer occurring;
* and the conditions under which it first changes.

Once that transition is known, the phase should return to the desired
interaction and map the ordinary sequence leading to the Target Outcome.

The phase should not ask:

* why the problem happens;
* what reinforces it;
* how severe it is;
* what the person does afterward;
* what happens after correction;
* how long escalation lasts;
* or what consequences maintain the unwanted behavior.

Those questions belong to problem analysis rather than Interaction Chain
construction.

---

## 5. Meaningful Interaction Events

### 5.1 Definition

An interaction event is a meaningful, observable change involving:

* the person;
* the dog;
* or the environment.

Examples include:

* the person walks toward the couch;
* the person reaches toward the leash;
* the person's hand touches the leash;
* the person lifts the leash;
* the person bends their knees;
* the person sits;
* the dog approaches;
* the dog sits;
* the dog lies down;
* a door opens;
* another person enters;
* a sound occurs;
* an object is moved.

Each event should represent a change that may matter to the target interaction
or later transfer plan.

### 5.2 Meaningful Granularity

The chain should be decomposed enough to identify distinct conditions through
which the target pattern must later be transferred.

It should not become a microscopic motor analysis.

Appropriate:

* walk toward the leash;
* reach toward the leash;
* touch the leash;
* lift the leash;
* turn toward the dog.

Too broad:

* get ready for a walk.

Too narrow:

* extend the index finger;
* rotate the wrist;
* bend the elbow five degrees;
* contact one edge of the leash.

The appropriate level is the smallest meaningful interaction event likely to
affect the program.

### 5.3 Later Practice Value

A step is worth representing separately when it could later:

* serve as a distinct transfer condition;
* mark a change in control;
* become a program approximation;
* define a phase transition;
* or clarify the relation between current and target interaction.

A step need not be separated when doing so would not change the eventual
program.

---

## 6. Interaction Chain Model

A completed Interaction Chain contains:

* steps;
* constructionStartIndex;
* targetOutcomeIndex;
* and notes.

Each step contains:

* index;
* actor;
* description;
* change;
* optional expectedDogBehavior;
* targetPatternPresent;
* requiresTransfer;
* and optional notes.

---

## 7. Interaction Step Semantics

### 7.1 index

index identifies the step's ordered position in the chain.

Indexes should:

* begin at zero;
* increase sequentially;
* contain no duplicates;
* and correspond to array order.

For example:

* first step: index 0;
* second step: index 1;
* third step: index 2.

### 7.2 actor

actor identifies the primary source of the change introduced in that step.

Possible values are:

* person;
* dog;
* environment.

#### person

Use person when the defining change is produced by the human.

Examples:

* the person stands;
* the person walks toward the couch;
* the person reaches for the leash;
* the person begins petting;
* the person sits.

#### dog

Use dog when the defining event is an action initiated by the dog.

Examples:

* the dog approaches;
* the dog sits;
* the dog lies down;
* the dog moves to the bed;
* the dog orients toward the person.

#### environment

Use environment when the defining change is not directly initiated by the
person or dog being modeled.

Examples:

* a visitor enters;
* a door opens automatically;
* another dog appears;
* a sound occurs;
* the television turns on;
* an object falls.

When several actors are involved, assign the actor responsible for the primary
change and describe the broader interaction in the step text.

### 7.3 description

description states what is happening at that point in the interaction.

It should describe the observable event in plain, concise language.

Good:

> The person bends their knees toward the couch.

Weak:

> The interaction changes.

Good:

> The dog remains sitting beside the person.

Weak:

> The dog behaves appropriately.

The description may include the surrounding interaction when necessary for
clarity.

### 7.4 change

change identifies what is different from the preceding step.

This field should make the progression explicit.

Examples:

* The person moves from standing still to walking toward the couch.
* The person's hand moves from their side toward the leash.
* The dog moves from standing to sitting.
* The couch changes from being nearby to supporting the person's weight.
* A visitor enters the room.

The first step should describe the initial condition rather than referring to
a nonexistent previous step.

For example:

> Establishes the opening interaction condition.

### 7.5 expectedDogBehavior

expectedDogBehavior describes the dog behavior expected under the Target
Outcome at that step.

This field should be used when the dog's target behavior is relevant or can be
reasonably inferred.

Examples:

* remains sitting near the person;
* lies beside the couch;
* walks beside the person;
* approaches and sits;
* remains on the bed;
* shifts between sitting and lying while staying nearby.

The expected behavior should remain consistent with:

* the Target Outcome;
* acceptable alternatives;
* and the conditions introduced by the step.

Do not use expectedDogBehavior to describe the complaint.

### 7.6 targetPatternPresent

targetPatternPresent identifies whether the desired interaction pattern is
currently available or known to be available at that step.

Possible values are:

* true;
* false;
* "unknown".

#### true

Use true when evidence indicates that the relevant target pattern, or the
required part of it, is present under that step's conditions.

Supporting evidence may come from:

* the user's description;
* Constructional Assets;
* an established earlier interaction;
* or a direct statement that things are still going well at that point.

#### false

Use false when the available information clearly indicates that the target
pattern is no longer occurring under those conditions.

The field should identify the absence of the target pattern, not describe or
analyze the unwanted behavior replacing it.

#### unknown

Use "unknown" when:

* the interaction has not been observed under that condition;
* the user does not know;
* the target pattern may or may not occur;
* or the step is part of the inferred path toward the terminal interaction and
  current control has not been established.

Do not use false merely because evidence is missing.

### 7.7 requiresTransfer

requiresTransfer indicates whether the target pattern must later be
established or extended to the conditions introduced by the step.

Use false when:

* the target pattern is already reliably present;
* the step is part of the established entry interaction;
* or no new condition relevant to control is introduced.

Use true when:

* the step introduces a meaningful condition under which the target pattern is
  absent;
* the target pattern is uncertain;
* the current and target patterns diverge;
* or later program construction must extend control to that step.

A step may have:

* targetPatternPresent: false and requiresTransfer: true;
* targetPatternPresent: "unknown" and requiresTransfer: true;
* targetPatternPresent: true and requiresTransfer: false.

A step should rarely have:

* targetPatternPresent: false and requiresTransfer: false.

That combination would require a specific explanation in notes.

### 7.8 notes

The optional notes field may preserve information such as:

* evidence supporting the classification;
* uncertainty;
* an acceptable alternative;
* a relation to a Constructional Asset;
* a reason the step was inferred;
* a contextual limitation;
* or a likely larger transfer variable.

Notes should not replace information that belongs in structured fields.

---

## 8. Construction Start Index

### 8.1 Purpose

constructionStartIndex identifies the step from which deliberate program
construction should begin.

It usually corresponds to the last meaningful interaction step before the first
step requiring transfer.

The construction starting point should represent the closest available
interaction from which the target pattern can be extended.

### 8.2 Selection Rule

The preferred construction start is:

1. the last step where the target pattern is known to be present;
2. immediately before the first meaningful changed condition under which the
   pattern is absent or uncertain;
3. supported by Constructional Assets when possible;
4. observable and reproducible;
5. and sufficiently close to the divergence point to create an efficient
   transfer sequence.

### 8.3 Construction Start Is Not Automatically Step Zero

The first event in the natural interaction may occur well before deliberate
construction needs to begin.

For example:

* index 0: person enters the room;
* index 1: person walks toward the couch;
* index 2: person stands beside the couch while the dog sits;
* index 3: person bends their knees and the target pattern changes.

The constructionStartIndex may be 2 rather than 0.

The index identifies the constructionally useful starting interaction, not
necessarily the beginning of the entire natural sequence.

### 8.4 When No Clear Last-Successful Step Exists

If the target pattern is not clearly present at any step immediately before
the divergence, use Constructional Assets to identify the closest supported
interaction.

The selected index should correspond to:

* a general area;
* posture;
* activity;
* or interaction condition

under which relevant behavior is already available.

Document uncertainty in notes rather than inventing control.

### 8.5 Relationship to Program Initialization

Program Initialization later uses constructionStartIndex as evidence when
constructing Step 0.

The Interaction Chain identifies the location.

Program Initialization defines the exact executable starting interaction,
reinforcer arrangement, control criterion, and readiness criterion.

---

## 9. Target Outcome Index

### 9.1 Purpose

targetOutcomeIndex identifies the step representing the complete accepted
Target Outcome.

The step should include:

* the terminal human activity;
* the terminal context;
* and the desired dog interaction pattern.

### 9.2 Selection

The target outcome index should generally refer to the final meaningful step
in the chain.

However, if later entries merely restate or annotate the terminal interaction,
the index should point to the step where the Target Outcome is first fully
present.

### 9.3 Terminal Interaction

The target outcome step should not represent only arrival at a location or
posture.

For example:

Insufficient terminal step:

> The person sits on the couch.

Complete terminal step:

> The person watches television while the dog sits or lies beside the couch and
> may occasionally shift position while remaining nearby.

The terminal link must reflect the complete interaction contract established
during the Target Outcome phase.

---

## 10. Identifying the Divergence

### 10.1 Last Successful Step

The last successful step is the final step before the target pattern first
becomes false or unknown under a meaningful changed condition.

This step frequently becomes constructionStartIndex.

### 10.2 First Transfer Step

The first transfer step is the first step after the construction start where:

* a relevant condition changes;
* and the target pattern is absent or uncertain under that condition.

This step should normally have:

* requiresTransfer: true.

### 10.3 Do Not Assume the Divergence

The phase should not infer the precise divergence point when the answer could
materially change program initialization.

Ask enough to determine:

* where the interaction is still going well;
* and what the person, dog, or environment does next when that changes.

### 10.4 Do Not Over-Investigate

Once the last successful step and first changed condition are known, do not ask
the user to describe the entire unwanted pattern that follows.

Infer the remaining ordinary target sequence from:

* the Target Outcome;
* the natural structure of the activity;
* and established context.

---

## 11. Inferring Ordinary Events

### 11.1 Purpose

The user should not have to narrate every obvious interaction step.

Ordinary events may be inferred when:

* they are common and unambiguous;
* the exact form would not change the program;
* the Target Outcome already establishes the terminal activity;
* and no safety- or context-relevant uncertainty remains.

Examples may include:

* walking to a couch;
* reaching for a leash;
* opening a door;
* sitting in a chair;
* turning toward the dog;
* lifting an ordinary object.

### 11.2 When Not to Infer

Ask for clarification when the exact event could change:

* the construction starting point;
* the first transfer variable;
* the step actor;
* the target behavior expected;
* the meaning of success;
* or the later program sequence.

For example, whether the dog begins jumping when the person:

* walks toward the leash;
* touches the leash;
* lifts the leash;
* or turns toward the door

could materially alter program construction.

### 11.3 Marking Inference

When useful, note that a step was inferred from the accepted context or Target
Outcome.

Do not present a speculative event as user-reported fact.

---

## 12. Chain Length and Granularity

### 12.1 Minimum Structure

The schema requires at least two steps.

A valid chain should include enough steps to represent:

* the beginning;
* the construction starting point;
* the first transfer condition;
* and the terminal Target Outcome.

In practice, many chains will require more than two steps.

### 12.2 Avoid Excessive Decomposition

Do not create dozens of steps merely because every movement can be divided.

Each step should justify its existence through one of the following:

* it changes the interaction condition;
* it marks a possible transfer variable;
* it changes the actor;
* it changes the expected dog behavior;
* it marks presence or loss of the target pattern;
* or it advances meaningfully toward the terminal interaction.

### 12.3 Avoid Overly Broad Steps

Do not collapse an entire functional sequence into one step when the internal
changes are likely to matter.

Weak:

> The person gets ready to leave.

Better:

* The person walks toward the entryway.
* The person reaches for the leash.
* The person lifts the leash.
* The person turns toward the dog.
* The person moves the leash toward the dog.

### 12.4 Program-Relevant Granularity

The correct level of detail is the level most likely to support later transfer
design.

The chain is neither:

* a broad narrative summary;
* nor a complete biomechanical task analysis.

---

## 13. Interview Process

### 13.1 Begin With the Opening Interaction

Identify how the relevant interaction begins.

The initial question should help determine:

* the first meaningful event;
* the starting context;
* and what the dog is doing at that point.

### 13.2 Locate the Last Successful Interaction

Determine where the desired interaction is still present.

Ask about the positive pattern rather than asking for a detailed description of
the complaint.

Useful language includes:

* Where are things still going well?
* What is your dog doing just before that changes?
* What is the next thing you do?
* At what point is your dog still sitting or lying nearby?

### 13.3 Identify the Next Changed Condition

Determine the first meaningful person, dog, or environmental event after the
last successful interaction.

This identifies the first likely transfer condition.

### 13.4 Infer the Remaining Target Sequence

Once the opening, last successful interaction, and first changed condition are
known, infer ordinary events leading to the Target Outcome where reasonable.

Do not interview the user through every obvious action.

### 13.5 Ask One Question at a Time

Each question should resolve one meaningful uncertainty.

Avoid combined questions such as:

> What happens first, what does your dog do, and where does everything change?

Instead, ask the highest-value unresolved question.

### 13.6 Do Not Ask What Is Already Known

Use information from:

* the Target Outcome;
* Constructional Assets;
* and previous answers.

Do not require the user to repeat the final context, target actions, or
successful conditions already established.

### 13.7 Stop When the Chain Is Sufficient

The phase should end when additional information is unlikely to change:

* constructionStartIndex;
* the first step requiring transfer;
* the meaningful sequence toward the Target Outcome;
* or targetOutcomeIndex.

---

## 14. Interview Efficiency

### 14.1 Every Question Must Affect the Chain

A question is useful only when the answer could change:

* where the chain begins;
* where the target pattern is last present;
* which event occurs next;
* which actor owns the change;
* which step requires transfer;
* or how the chain reaches the Target Outcome.

Do not ask additional questions merely to produce more detailed prose.

### 14.2 Prefer the Earliest Relevant Divergence

Once the first meaningful divergence is known, later unwanted events usually
do not need further investigation.

The earliest divergence defines the initial teaching problem.

### 14.3 Respect Diminishing Returns

Stop decomposing when smaller steps would not change later construction.

Do not ask:

* which finger touched an object;
* how many degrees the elbow bent;
* which foot moved first;
* or another detail irrelevant to transfer.

### 14.4 Do Not Design While Mapping

The phase should not decide:

* how many seconds each step should last;
* how much affection should be delivered;
* what the first approximation will be;
* how recovery will work;
* how many program phases are needed;
* or when to advance.

Those decisions belong to Program Initialization.

---

## 15. Completion Standard

The Interaction Chain is sufficiently specified when the following are known:

1. how the relevant interaction begins;
2. the meaningful events leading toward the Target Outcome;
3. where the target pattern is still present;
4. the first condition under which it is absent or uncertain;
5. the step immediately before that change;
6. the first step likely to require transfer;
7. the complete terminal Target Outcome step;
8. and enough intermediate structure to support later program design.

The phase does not require:

* exhaustive problem analysis;
* a complete history of every unwanted event;
* every motor movement;
* exact training approximations;
* or implementation criteria.

---

## 16. Output Semantics

The phase may produce one of two result states.

### 16.1 Interview Continues

When a material uncertainty remains:

* phaseComplete is false;
* coachMessage contains one concise question;
* no Interaction Chain object is returned.

The question should address the single uncertainty most likely to change the
chain structure or construction starting point.

### 16.2 Interaction Chain Complete

When the chain is sufficiently specified:

* phaseComplete is true;
* interactionChain is returned;
* coachMessage may contain a brief acknowledgement or transition.

The completed object contains:

* an ordered steps array;
* constructionStartIndex;
* targetOutcomeIndex;
* and notes.

---

## 17. Populating the Steps Array

For each step:

### index

Assign a sequential zero-based index matching array order.

### actor

Identify the primary source of the step's change:

* person;
* dog;
* or environment.

### description

Describe the observable interaction event.

### change

State what changed from the previous step.

### expectedDogBehavior

Describe the dog behavior expected if the Target Outcome is preserved under
that condition.

### targetPatternPresent

Assign:

* true when supported as present;
* false when clearly absent;
* "unknown" when current control under that condition is not established.

### requiresTransfer

Assign true when later program construction must establish or extend the
target pattern under that condition.

### notes

Preserve evidence, inference, uncertainty, or another qualification.

---

## 18. Populating constructionStartIndex

Select the index representing:

* the last supported interaction where the target pattern is present;
* immediately before the first meaningful step requiring transfer;
* or the closest conservative starting interaction supported by Constructional
  Assets.

The selected index must refer to an existing step.

It should be less than or equal to targetOutcomeIndex.

Document uncertainty when the exact point cannot be established.

---

## 19. Populating targetOutcomeIndex

Select the index representing the complete accepted Target Outcome.

The selected step should include:

* the terminal human activity;
* the relevant environment;
* the desired dog pattern;
* and permitted variation when material.

The selected index must refer to an existing step.

---

## 20. Chain Notes

The top-level notes field may summarize:

* how the construction start was selected;
* which step marks the first divergence;
* which steps were inferred;
* important uncertainties;
* the primary transfer path;
* or how the chain relates to Constructional Assets.

Because the current schema requires notes, provide a concise meaningful
summary rather than an empty string.

Example:

> The dog is reported to remain sitting through the person's approach to the
> couch. The target pattern becomes uncertain when the person begins lowering
> toward the seat. Later seated events were inferred from the accepted Target
> Outcome.

---

## 21. Relationship Between Fields

Example step:

index:

> 3

actor:

> person

description:

> The person begins bending their knees toward the couch.

change:

> The person changes from standing upright to lowering their body.

expectedDogBehavior:

> The dog remains sitting or lying beside the couch.

targetPatternPresent:

> false

requiresTransfer:

> true

notes:

> The user reports that this is the first point where the dog stops remaining
> settled.

Each field serves a different purpose:

* description states the event;
* change identifies the transition;
* expectedDogBehavior states the target pattern;
* targetPatternPresent describes current availability;
* requiresTransfer describes later program need;
* and notes preserves the evidence.

---

## 22. Language and Interaction Style

The methodology may use technical terminology internally.

The user-facing interview should use ordinary conversational language.

Avoid terms such as:

* stimulus control;
* transfer of control;
* approximation;
* response chain;
* disturbing pattern;
* terminal stimulus;
* construction start;
* divergence point;
* and target pattern present.

Prefer language such as:

* what happens first;
* what you do next;
* what your dog is doing then;
* where things are still going well;
* when things start to change;
* and what happens after that if everything were going the way you want.

Questions should be:

* brief;
* open-ended;
* neutral;
* focused on one event;
* and limited to information needed for the chain.

The phase should not provide training recommendations.

---

## 23. Constructional Boundaries

A valid Interaction Chain phase:

* begins from the accepted Target Outcome;
* uses Constructional Assets as evidence;
* identifies the opening interaction;
* locates the last point where the target pattern is present;
* identifies the first changed condition;
* decomposes the sequence into meaningful events;
* assigns actors accurately;
* distinguishes current availability from later transfer need;
* infers ordinary events when appropriate;
* preserves uncertainty honestly;
* ends at the complete terminal interaction;
* and stops before program design begins.

A valid Interaction Chain phase does not:

* investigate the causes of the complaint;
* map the full escalation sequence;
* ask what happens after unwanted behavior;
* create a behavior-reduction plan;
* design Step 0;
* prescribe the Affection Loop;
* generate successive approximations;
* ask about irrelevant motor details;
* treat broad activities as one step when meaningful internal changes matter;
* invent where control is lost;
* mark missing evidence as false;
* confuse the beginning of the natural interaction with the construction start;
* stop at the person's terminal posture without representing the complete Target
  Outcome;
* or continue interviewing after the chain is sufficient.

---

## 24. Derivation Procedure

The following procedure should be used to conduct the Interaction Chain phase.

### Step 1: Read the Target Outcome

Identify:

* the terminal context;
* the person's terminal activity;
* the dog target actions;
* the desired interaction pattern;
* and acceptable alternatives.

### Step 2: Read the Constructional Assets

Identify:

* target-related behavior already available;
* successful interaction conditions;
* relevant human actions;
* and conditions that may support a starting point.

### Step 3: Establish the Opening Event

Determine how the relevant interaction begins.

Create the first meaningful chain step.

### Step 4: Infer an Initial Chain

Using the Target Outcome and ordinary structure of the activity, infer a
provisional sequence from the beginning to the terminal interaction.

The provisional chain should remain open to correction by the user's answers.

### Step 5: Locate the Last Successful Interaction

Determine the latest step at which the desired dog interaction is still known
to occur.

Mark that step with:

* targetPatternPresent: true;
* and normally requiresTransfer: false.

### Step 6: Identify the First Changed Condition

Identify the next meaningful event introduced by the person, dog, or
environment.

Determine whether the target pattern is:

* false;
* or unknown

under that condition.

Mark the step as requiring transfer when appropriate.

### Step 7: Select the Construction Start

Choose the last supported step immediately before the first required transfer.

Use Constructional Assets to resolve uncertainty conservatively.

### Step 8: Complete the Target Sequence

Infer the remaining ordinary steps leading from the divergence to the accepted
Target Outcome.

Assign expected dog behavior at each relevant step.

### Step 9: Identify the Terminal Step

Ensure that one step represents the complete Target Outcome, not merely arrival
at a location or posture.

Assign its index to targetOutcomeIndex.

### Step 10: Evaluate Granularity

Combine steps that are unnecessarily microscopic.

Split steps that contain multiple program-relevant changes.

### Step 11: Validate Field Relationships

Confirm that:

* indexes are sequential;
* actor assignments match the primary change;
* descriptions and changes are distinct;
* target pattern classifications are supported;
* transfer requirements are coherent;
* and both referenced indexes exist.

### Step 12: End the Phase

When additional information is unlikely to change the construction start,
first transfer condition, or terminal path, return the Interaction Chain.

Do not begin program design.

---

## 25. Quality Checks

Before completing the phase, verify the following.

### Chain Beginning

* Is the opening interaction known?
* Does the first step represent a meaningful event?
* Is the initial dog behavior known or appropriately marked uncertain?

### Divergence

* Is the last known successful interaction identified?
* Is the first changed condition identified?
* Was the divergence located without investigating the full complaint?
* Was uncertainty preserved rather than guessed?

### Construction Start

* Does constructionStartIndex refer to an existing step?
* Is it supported by Constructional Assets?
* Is it the last meaningful supported step before transfer?
* Is it distinct from the first transfer step when appropriate?

### Steps

* Are indexes sequential and unique?
* Does each step have one primary actor?
* Is each description observable?
* Does each change state what differs from the previous step?
* Are steps meaningful rather than microscopic?
* Are broad program-relevant events decomposed sufficiently?

### Target Pattern

* Is expected dog behavior aligned with the Target Outcome?
* Is true supported by evidence?
* Is false used only when absence is known?
* Is "unknown" used when control has not been established?
* Does requiresTransfer reflect later program need?

### Terminal Outcome

* Does targetOutcomeIndex refer to an existing step?
* Does the terminal step represent the complete interaction?
* Are human activity, dog behavior, and context included?
* Are accepted alternatives preserved?

### Interview Efficiency

* Did every question address a meaningful uncertainty?
* Was one question asked at a time?
* Were ordinary events inferred when safe to do so?
* Did the phase stop before program design?

### Schema Integrity

* Are there at least two steps?
* Are all indexes nonnegative integers?
* Are both chain indexes valid?
* Is the notes field meaningful?
* Does the result conform to the correct phase-result branch?

---

## 26. Illustrative Example

### Target Outcome

> While the person watches television, the dog sits or lies beside the couch
> and may occasionally shift position while remaining nearby.

### Constructional Assets

The dog:

* approaches the person voluntarily;
* sits near the person while the person stands beside the couch;
* lies on a nearby bed during quiet evening activities;
* and seeks chest scratches.

The person reports that the desired pattern changes when they begin lowering
toward the couch.

### Interaction Chain

#### Step 0

index:

> 0

actor:

> person

description:

> The person enters the living room and walks toward the couch.

change:

> Establishes the opening interaction and moves the person toward the target
> location.

expectedDogBehavior:

> The dog remains nearby or approaches the person.

targetPatternPresent:

> true

requiresTransfer:

> false

#### Step 1

index:

> 1

actor:

> person

description:

> The person stands upright beside the couch.

change:

> The person changes from walking to standing still beside the couch.

expectedDogBehavior:

> The dog sits or lies near the person.

targetPatternPresent:

> true

requiresTransfer:

> false

#### Step 2

index:

> 2

actor:

> person

description:

> The person begins bending their knees toward the couch.

change:

> The person changes from standing upright to lowering their body.

expectedDogBehavior:

> The dog remains sitting or lying beside the couch.

targetPatternPresent:

> false

requiresTransfer:

> true

notes:

> The user identifies this as the first point where the desired interaction
> changes.

#### Step 3

index:

> 3

actor:

> person

description:

> The person briefly contacts the couch while lowering.

change:

> The person's body first makes contact with the couch.

expectedDogBehavior:

> The dog remains sitting or lying nearby.

targetPatternPresent:

> unknown

requiresTransfer:

> true

#### Step 4

index:

> 4

actor:

> person

description:

> The person sits fully on the couch.

change:

> The person changes from partially lowered to fully seated.

expectedDogBehavior:

> The dog sits or lies beside the couch.

targetPatternPresent:

> unknown

requiresTransfer:

> true

#### Step 5

index:

> 5

actor:

> person

description:

> The person begins watching television and shifts naturally while seated.

change:

> The person changes from initially sitting to engaging in the full television
> routine.

expectedDogBehavior:

> The dog sits or lies beside the couch and may occasionally shift position
> while remaining nearby.

targetPatternPresent:

> unknown

requiresTransfer:

> true

### Indexes

constructionStartIndex:

> 1

targetOutcomeIndex:

> 5

### Notes

> The target pattern is reported to be present while the person stands beside
> the couch. It first disappears when the person begins lowering. The later
> seated sequence was inferred from the accepted Target Outcome and represents
> the conditions through which control must later be transferred.

### Interpretation

The chain establishes:

* the natural beginning of the interaction;
* the last supported target interaction;
* the first transfer condition;
* the larger sequence of changed postures;
* and the complete terminal context.

It does not yet specify:

* the exact Step 0 procedure;
* the size of each approximation;
* affection delivery;
* recovery;
* or advancement criteria.

Those belong to Program Initialization.`;
