# AI Workout Coach

This context defines the product language for the AI workout coach. It keeps the domain terms separate from implementation details so product decisions stay consistent.

## Language

**AI Workout Coach**:
A mobile-first coaching product that gives the user today's workout assignment and adjusts future assignments from completed workout records.
_Avoid_: Workout board, exercise post board

**Workout Assignment**:
The workout task the product gives the user before training, including exercises, target weights, target reps, and intent. It is separate from the completed result.
_Avoid_: Post, recommendation text

**Workout Log**:
The user's completed workout result after training, including actual weights, reps, sets, and one short overall note. It is separate from the assigned plan.
_Avoid_: Post, authentication post

**공개 운동 기록**:
A Workout Log that is visible in the community feed after completion. It is public by default, but the user can turn sharing off before saving the completed workout.
_Avoid_: Mandatory post, private note

**운동 인증 피드**:
The community surface that shows public workout logs from all users in latest-first order. It is not personalized by goal or routine.
_Avoid_: Personalized feed, AI recommendation feed, post board

**운동 반응**:
A lightweight community response to a public workout log, centered on quick reactions and short comments rather than long discussion.
_Avoid_: Forum thread, long review, debate

**Workout Session**:
The focused training flow where the user opens today's workout assignment, performs each set, checks completion, and leaves a short note after training.
_Avoid_: Post writing flow, long workout form

**운동 중 최소 정보 원칙**:
The Workout Session presentation principle: show only the exercise name and target set by default, let the user check completed sets with minimal input, let the user defer an exercise when equipment is occupied, and reveal explanations or weight/reps editing only when the user asks for them.
_Avoid_: Dense instruction screen, long coaching text

**나중에 하기**:
A lightweight Workout Session action that moves an exercise later because its equipment is currently occupied. It changes only today's exercise order, not the routine itself.
_Avoid_: Routine edit, exercise deletion, full reordering

**AI Coach Dashboard**:
The mobile home screen whose primary job is to move the user into today's workout assignment. Feed and history are secondary surfaces, not the main focus.
_Avoid_: Post list, board home

**Onboarding Profile**:
The minimum setup information needed to generate useful workout assignments: available equipment, training goal, available time, split type, and training experience.
_Avoid_: Medical profile, full fitness profile

**Routine Candidate**:
One of three routine options generated from the user's onboarding profile. The candidates differ mainly by exercise composition, while the overall difficulty stays within the user's goal, time, experience, equipment, and split type.
_Avoid_: Single forced routine, unlimited routine list
