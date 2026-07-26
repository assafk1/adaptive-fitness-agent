// Mobility, Active Recovery & Restorative Stretches Database

export const MOBILITY_DB = [
  {
    id: 'mobility-post-run-sports',
    name: 'Post-Run & Lower Body Relief Flow',
    category: 'Mobility',
    targetFocus: 'Lower Body & Hips (Post Tennis/Soccer/Running)',
    durationMin: 15,
    description: 'Targeted restorative routine for hamstrings, quads, calves, hip flexors, and lower back to prevent tightness and injury.',
    stretches: [
      { name: 'Kneeling Hip Flexor Stretch', durationSec: 60, perSide: true, tips: 'Tuck pelvis under, shift hips forward, feel deep stretch in hip flexor.' },
      { name: 'Pigeon Pose / Figure-4 Glute Stretch', durationSec: 60, perSide: true, tips: 'Keep spine long, fold over front leg to release outer glute.' },
      { name: 'Standing Calf & Achilles Stretch', durationSec: 45, perSide: true, tips: 'Press heel firmly into ground, lean forward against wall.' },
      { name: 'Seated Hamstring Forward Fold', durationSec: 60, perSide: false, tips: 'Hinge at hips, reach toward toes without rounding upper back.' },
      { name: 'World\'s Greatest Stretch', durationSec: 60, perSide: true, tips: 'Deep lunge with thoracic twist towards front knee.' }
    ]
  },
  {
    id: 'mobility-upper-spine',
    name: 'Thoracic Mobility & Shoulder Opener',
    category: 'Mobility',
    targetFocus: 'Shoulders, Chest & Upper Back (Post Calisthenics)',
    durationMin: 12,
    description: 'Decompresses spine, opens tight chest/deltoids, and improves shoulder overhead range of motion.',
    stretches: [
      { name: 'Cat-Cow Spinal Waves', durationSec: 90, perSide: false, tips: 'Inhale arching back, exhale rounding spine fully.' },
      { name: 'Thread the Needle Stretch', durationSec: 60, perSide: true, tips: 'Reach arm under torso, rest shoulder on mat and rotate upper spine.' },
      { name: 'Puppy Dog / Extended Child\'s Pose', durationSec: 90, perSide: false, tips: 'Keep hips over knees, melt chest toward floor.' },
      { name: 'Doorway Chest & Bicep Stretch', durationSec: 45, perSide: true, tips: 'Place forearm against doorframe, step through gently.' }
    ]
  },
  {
    id: 'mobility-full-body-recovery',
    name: 'Complete Rest & Decompression Flow',
    category: 'Mobility',
    targetFocus: 'Full Body Restorative / Active Recovery Day',
    durationMin: 20,
    description: 'Gentle full-body movement flow to release tension, promote Parasympathetic nerve recovery, and relieve soreness.',
    stretches: [
      { name: 'Legs Up the Wall (Viparita Karani)', durationSec: 180, perSide: false, tips: 'Rest legs vertically up wall, close eyes, slow deep belly breaths.' },
      { name: 'Supine Spinal Twist', durationSec: 90, perSide: true, tips: 'Bring knee across body, keep shoulders flat on floor.' },
      { name: 'Butterfly / Bound Angle Hold', durationSec: 120, perSide: false, tips: 'Soles of feet together, let knees fall open naturally.' },
      { name: 'Full Body Standing Reach & Fold', durationSec: 90, perSide: false, tips: 'Reach high, fold down slowly, sway side to side.' }
    ]
  }
];
