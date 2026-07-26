// Jump Rope Workouts Database

export const JUMPROPE_DB = [
  {
    id: 'rope-express-hiit',
    name: '15-Min Jump Rope Cardio Burn',
    category: 'JumpRope',
    difficulty: 'Intermediate',
    durationMin: 15,
    description: 'High-efficiency jump rope session combining basic bounces with high-knee intervals for rapid cardio condition.',
    rounds: [
      { name: 'Basic Bounce Warm-Up', durationSec: 120, restSec: 30, tips: 'Stay light on toes, rotate wrists smoothly.' },
      { name: 'Boxer Step Rhythm', durationSec: 180, restSec: 30, tips: 'Shift weight lightly from left foot to right foot.' },
      { name: 'High Knee Speed Burst', durationSec: 120, restSec: 45, tips: 'Drive knees up high, maintain rapid rope tempo.' },
      { name: 'Alternating Single Foot Jump', durationSec: 180, restSec: 30, tips: 'Hop twice per leg in a steady rhythm.' },
      { name: 'Cool-Down Basic Bounce', durationSec: 120, restSec: 0, tips: 'Slow down rope speed and focus on deep breathing.' }
    ]
  },
  {
    id: 'rope-boxer-footwork',
    name: 'Boxer Jump Rope & Coordination',
    category: 'JumpRope',
    difficulty: 'Beginner',
    durationMin: 12,
    description: 'Low-impact coordination builder focusing on light footwork and wrist control.',
    rounds: [
      { name: 'Bounce Step', durationSec: 120, restSec: 30, tips: 'Jump just 1-2 inches off the ground.' },
      { name: 'Side-to-Side Hops', durationSec: 120, restSec: 30, tips: 'Small lateral jumps over an imaginary line.' },
      { name: 'Front-to-Back Hops', durationSec: 120, restSec: 30, tips: 'Scissor feet slightly forward and back.' },
      { name: 'Boxer Shuffle', durationSec: 180, restSec: 30, tips: 'Relax shoulders and bounce lightly.' }
    ]
  },
  {
    id: 'rope-calisthenics-fusion',
    name: 'Rope & Bodyweight Fusion Routine',
    category: 'JumpRope',
    difficulty: 'Advanced',
    durationMin: 25,
    description: 'Alternates 2 minutes of jump rope with bodyweight calisthenics (push-ups, squats, core) for full-body conditioning.',
    rounds: [
      { name: 'Rope: Basic Bounce', durationSec: 120, restSec: 15 },
      { name: 'Calisthenics: Push-Ups (15 reps)', durationSec: 45, restSec: 30 },
      { name: 'Rope: Boxer Step', durationSec: 120, restSec: 15 },
      { name: 'Calisthenics: Air Squats (20 reps)', durationSec: 45, restSec: 30 },
      { name: 'Rope: High Knees', durationSec: 120, restSec: 15 },
      { name: 'Calisthenics: Plank Hold', durationSec: 60, restSec: 30 }
    ]
  }
];
