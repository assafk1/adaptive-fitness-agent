// Calisthenics & Bodyweight Exercises Database

export const CALISTHENICS_DB = [
  // PUSH EXERCISES
  {
    id: 'pushup-std',
    name: 'Standard Push-Ups',
    category: 'Push',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    targetMuscles: ['Chest', 'Triceps', 'Anterior Deltoids', 'Core'],
    defaultReps: 12,
    defaultSets: 3,
    restSec: 60,
    tips: 'Keep core tight, elbows at a 45-degree angle, lower until chest nearly touches floor.',
    progression: {
      easier: 'Incline / Knee Push-Ups',
      harder: 'Decline / Diamond Push-Ups'
    }
  },
  {
    id: 'pushup-incline',
    name: 'Incline Push-Ups',
    category: 'Push',
    equipment: 'Bench / Chair',
    difficulty: 'Beginner',
    targetMuscles: ['Lower Chest', 'Triceps', 'Shoulders'],
    defaultReps: 10,
    defaultSets: 3,
    restSec: 45,
    tips: 'Place hands elevated on a chair or sturdy surface. Maintain a straight body line.',
    progression: { easier: 'Wall Push-Ups', harder: 'Standard Push-Ups' }
  },
  {
    id: 'pushup-decline',
    name: 'Decline Push-Ups',
    category: 'Push',
    equipment: 'Bench / Chair',
    difficulty: 'Advanced',
    targetMuscles: ['Upper Chest', 'Deltoids', 'Triceps'],
    defaultReps: 10,
    defaultSets: 3,
    restSec: 60,
    tips: 'Place feet elevated on a chair. Focus on controlled eccentric phase.',
    progression: { easier: 'Standard Push-Ups', harder: 'Pike Push-Ups' }
  },
  {
    id: 'dips-bench',
    name: 'Chair / Bench Dips',
    category: 'Push',
    equipment: 'Chair / Bench',
    difficulty: 'Beginner',
    targetMuscles: ['Triceps', 'Anterior Deltoids', 'Chest'],
    defaultReps: 12,
    defaultSets: 3,
    restSec: 60,
    tips: 'Keep shoulders pressed down, lower hips vertically close to the chair edge.',
    progression: { easier: 'Bent Knee Dips', harder: 'Straight Leg Dips' }
  },
  {
    id: 'pike-pushup',
    name: 'Pike Push-Ups',
    category: 'Push',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    targetMuscles: ['Shoulders', 'Upper Chest', 'Triceps'],
    defaultReps: 8,
    defaultSets: 3,
    restSec: 75,
    tips: 'Hike hips up into an inverted V position. Lower head forward toward the floor.',
    progression: { easier: 'Decline Push-Ups', harder: 'Elevated Pike Push-Ups' }
  },

  // PULL EXERCISES
  {
    id: 'pullup-std',
    name: 'Pull-Ups',
    category: 'Pull',
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    targetMuscles: ['Lats', 'Upper Back', 'Biceps', 'Core'],
    defaultReps: 6,
    defaultSets: 3,
    restSec: 90,
    tips: 'Overhand grip, drive elbows down to ribs, pull chest up past the bar without swinging.',
    progression: { easier: 'Band-Assisted / Negative Pull-Ups', harder: 'Chest-to-Bar Pull-Ups' }
  },
  {
    id: 'chinup-std',
    name: 'Chin-Ups',
    category: 'Pull',
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    targetMuscles: ['Biceps', 'Lats', 'Upper Back'],
    defaultReps: 8,
    defaultSets: 3,
    restSec: 75,
    tips: 'Underhand grip. Engage biceps and squeeze shoulder blades at top position.',
    progression: { easier: 'Assisted Chin-Ups', harder: 'Weighted Chin-Ups' }
  },
  {
    id: 'inverted-row',
    name: 'Inverted Table Rows',
    category: 'Pull',
    equipment: 'Sturdy Table / Resistance Band',
    difficulty: 'Beginner',
    targetMuscles: ['Rhomboids', 'Rear Delts', 'Biceps'],
    defaultReps: 10,
    defaultSets: 3,
    restSec: 60,
    tips: 'Grasp sturdy table edge or door band anchor. Pull chest straight up to grip height.',
    progression: { easier: 'Door Band Rows', harder: 'Single Leg Inverted Rows' }
  },

  // LEGS EXERCISES
  {
    id: 'squat-air',
    name: 'Air Squats',
    category: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    defaultReps: 15,
    defaultSets: 3,
    restSec: 45,
    tips: 'Feet shoulder-width apart, sit hips back as if onto a chair, keep chest lifted.',
    progression: { easier: 'Chair Assisted Squats', harder: 'Jump Squats' }
  },
  {
    id: 'squat-jump',
    name: 'Explosive Jump Squats',
    category: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Power'],
    defaultReps: 10,
    defaultSets: 3,
    restSec: 60,
    tips: 'Explode vertically off the floor. Land softly through toe-to-heel mechanics.',
    progression: { easier: 'Air Squats', harder: 'Pistol Squats' }
  },
  {
    id: 'lunge-walking',
    name: 'Alternating Walking Lunges',
    category: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    defaultReps: 12,
    defaultSets: 3,
    restSec: 60,
    tips: 'Step forward landing heel first, lower back knee just above floor level.',
    progression: { easier: 'Static Reverse Lunges', harder: 'Jumping Lunges' }
  },
  {
    id: 'bridge-single-leg',
    name: 'Single-Leg Glute Bridges',
    category: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    targetMuscles: ['Glutes', 'Hamstrings', 'Lower Back'],
    defaultReps: 10,
    defaultSets: 3,
    restSec: 45,
    tips: 'Lie on back, drive heel through floor, squeeze glute at peak extension.',
    progression: { easier: 'Two-Leg Glute Bridge', harder: 'Elevated Glute Bridge' }
  },

  // CORE EXERCISES
  {
    id: 'plank-elbow',
    name: 'Forearm Plank',
    category: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Shoulders'],
    defaultDurationSec: 45,
    defaultSets: 3,
    restSec: 45,
    tips: 'Squeeze glutes, pull navel into spine, maintain a rigid straight body line.',
    progression: { easier: 'Knee Plank', harder: 'Plank Shoulder Taps' }
  },
  {
    id: 'hollow-body',
    name: 'Hollow Body Hold',
    category: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    targetMuscles: ['Lower Abs', 'Core Tension', 'Hip Flexors'],
    defaultDurationSec: 30,
    defaultSets: 3,
    restSec: 60,
    tips: 'Press lower back flat into the ground. Extend arms and legs out long.',
    progression: { easier: 'Tuck Hollow Hold', harder: 'Hollow Rocks' }
  },
  {
    id: 'mountain-climbers',
    name: 'Dynamic Mountain Climbers',
    category: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    targetMuscles: ['Core', 'Hip Flexors', 'Cardio', 'Shoulders'],
    defaultDurationSec: 30,
    defaultSets: 3,
    restSec: 45,
    tips: 'Drive knees rapidly toward chest while maintaining a flat plank position.',
    progression: { easier: 'Slow Knee Drives', harder: 'Cross-Body Mountain Climbers' }
  }
];
