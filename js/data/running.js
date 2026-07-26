// Running Workouts & Drills Database

export const RUNNING_DB = [
  {
    id: 'run-recovery-jog',
    name: 'Easy Recovery Zone 2 Jog',
    category: 'Running',
    type: 'Steady State',
    difficulty: 'Beginner',
    durationMin: 20,
    targetHRZone: 'Zone 2 (Conversational Pace)',
    description: 'Light, relaxed jog designed to increase blood flow and accelerate muscle recovery without accumulating fatigue.',
    structure: [
      { phase: 'Warm-up', durationSec: 180, notes: 'Brisk walking + dynamic leg swings' },
      { phase: 'Main Jog', durationSec: 900, notes: 'Maintain easy conversational pace (Zone 2)' },
      { phase: 'Cool-down', durationSec: 120, notes: 'Easy walk + calf & hamstring static stretch' }
    ]
  },
  {
    id: 'run-hiit-sprints',
    name: 'Express HIIT Sprint Intervals',
    category: 'Running',
    type: 'HIIT / Sprints',
    difficulty: 'Advanced',
    durationMin: 15,
    targetHRZone: 'Zone 4-5 (High Intensity)',
    description: 'Short explosive sprint intervals to boost aerobic capacity, leg speed, and fat metabolism in minimum time.',
    structure: [
      { phase: 'Dynamic Warm-up', durationSec: 240, notes: 'Jogging, high knees, butt kicks, leg swings' },
      { phase: 'Sprint Intervals', durationSec: 480, notes: '8 Rounds: 30s All-Out Sprint + 30s Walking Rest' },
      { phase: 'Cool-down', durationSec: 180, notes: 'Walk +quad and groin stretches' }
    ]
  },
  {
    id: 'run-tempo-interval',
    name: 'Adaptive Tempo Run',
    category: 'Running',
    type: 'Tempo',
    difficulty: 'Intermediate',
    durationMin: 25,
    targetHRZone: 'Zone 3-4 (Comfortably Hard)',
    description: 'Sustained rhythm run to push lactate threshold and build stamina for outdoor sports like soccer and tennis.',
    structure: [
      { phase: 'Warm-up', durationSec: 300, notes: 'Easy jog + bounding strides' },
      { phase: 'Tempo Block', durationSec: 900, notes: '15 mins at tempo pace (7/10 effort)' },
      { phase: 'Cool-down', durationSec: 300, notes: 'Light walk + full lower body stretch' }
    ]
  },
  {
    id: 'run-tennis-soccer-warmup',
    name: 'Pre-Match Agility & Activation Warm-up',
    category: 'Running',
    type: 'Sports Specific',
    difficulty: 'Beginner',
    durationMin: 12,
    targetHRZone: 'Zone 2-3 (Match Ready)',
    description: 'Dynamic activation drill specifically designed prior to playing Tennis or Soccer to prime joints, ankles, and reaction speed.',
    structure: [
      { phase: 'Light Jog', durationSec: 180, notes: 'Easy forward & backward jogging' },
      { phase: 'Lateral Shuffles', durationSec: 180, notes: 'Side shuffles + carioca drills' },
      { phase: 'Dynamic Stretching', durationSec: 240, notes: 'Hip openers, arm circles, ankle rotations' },
      { phase: 'Match Accelerations', durationSec: 120, notes: '3x 10m short burst accelerations' }
    ]
  }
];
