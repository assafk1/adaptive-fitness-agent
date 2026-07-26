// Adaptive Fitness & Recovery Engine

import { CALISTHENICS_DB } from '../data/exercises.js';
import { RUNNING_DB } from '../data/running.js';
import { JUMPROPE_DB } from '../data/jumprope.js';
import { MOBILITY_DB } from '../data/mobility.js';

export const FitnessEngine = {
  /**
   * Calculates a Readiness Score (0 - 100) based on energy, soreness, and external sports.
   */
  calculateReadiness(energy, soreness, sports = []) {
    let score = (energy * 7) + ((10 - soreness) * 3);
    if (sports.length > 0) {
      score -= (sports.length * 10);
    }
    return Math.max(10, Math.min(100, Math.round(score)));
  },

  /**
   * Generates a fully adaptive daily fitness plan.
   */
  generateDailyPlan(checkIn, userProfile) {
    const { energyLevel, sorenessLevel, sorenessAreas = [], availableMinutes, sportsToday = [] } = checkIn;
    const readiness = this.calculateReadiness(energyLevel, sorenessLevel, sportsToday);

    // CASE 1: ZERO MINUTES OR LOW READINESS (< 35) -> FULL REST / RESTORATIVE MOBILITY
    if (availableMinutes === 0 || readiness < 35 || energyLevel <= 3 || sorenessLevel >= 8) {
      const mobilityRoutine = MOBILITY_DB.find(m => m.id === 'mobility-full-body-recovery');
      return {
        type: 'Rest & Recovery',
        title: 'Restorative Mobility & Recovery Day',
        summary: 'Your body is asking for recovery today to protect joints and prevent burnout.',
        readinessScore: readiness,
        estimatedMinutes: mobilityRoutine ? mobilityRoutine.durationMin : 15,
        routines: mobilityRoutine ? [mobilityRoutine] : [],
        aiAdvice: `Today's priority is recovery. With an energy level of ${energyLevel}/10 and soreness at ${sorenessLevel}/10, pushing heavy workouts today increases injury risk. Focus on hydration, quality sleep, and light restorative stretching.`
      };
    }

    // CASE 2: MATCH DAY (TENNIS OR SOCCER)
    if (sportsToday.length > 0) {
      const sportName = sportsToday.join(' & ');
      const prepRoutine = RUNNING_DB.find(r => r.id === 'run-tennis-soccer-warmup');
      const recoveryRoutine = MOBILITY_DB.find(m => m.id === 'mobility-post-run-sports');

      return {
        type: 'Sports Support',
        title: `${sportName} Match Day Activation & Recovery`,
        summary: `Tailored pre-match activation and post-match stretch routine for ${sportName}.`,
        readinessScore: readiness,
        estimatedMinutes: Math.min(availableMinutes, 20),
        routines: [
          { name: 'Pre-Match Dynamic Activation', ...prepRoutine },
          { name: 'Post-Match Lower Body Relief', ...recoveryRoutine }
        ],
        aiAdvice: `Since you have ${sportName} today, we won't drain your leg tank with heavy workouts. Do this 12-min dynamic warm-up before playing to prime your knees/ankles, and use the lower-body stretch flow afterwards to relieve hamstrings and lower back.`
      };
    }

    // CASE 3: EXPRESS SESSION (15 MINUTES)
    if (availableMinutes <= 20) {
      // Pick either Jump Rope HIIT, Running Sprint, or Calisthenics Express based on preference & equipment
      const hasJumpRope = userProfile.equipment.includes('Jump Rope');
      let selectedRoutine;

      if (hasJumpRope && !sorenessAreas.includes('Legs') && energyLevel >= 6) {
        selectedRoutine = JUMPROPE_DB.find(j => j.id === 'rope-express-hiit');
      } else if (energyLevel >= 7 && !sorenessAreas.includes('Legs')) {
        selectedRoutine = RUNNING_DB.find(r => r.id === 'run-hiit-sprints');
      } else {
        // Calisthenics Express
        const push = CALISTHENICS_DB.find(e => e.id === 'pushup-std');
        const core = CALISTHENICS_DB.find(e => e.id === 'plank-elbow');
        const legs = CALISTHENICS_DB.find(e => e.id === 'squat-air');
        selectedRoutine = {
          name: '15-Min Express Calisthenics Circuit',
          description: '3 Rounds of continuous bodyweight circuit fitting your 15-min window.',
          exercises: [push, legs, core]
        };
      }

      return {
        type: 'Express Session',
        title: `15-Min Express ${selectedRoutine.name || 'Routine'}`,
        summary: `High-efficiency workout designed to fit your busy schedule today.`,
        readinessScore: readiness,
        estimatedMinutes: 15,
        routines: [selectedRoutine],
        aiAdvice: `Awesome discipline checking in despite a busy schedule! We've designed a compact 15-minute session to keep your momentum going without taking up your day.`
      };
    }

    // CASE 4: STANDARD SESSION (30 MINUTES)
    // Filter calisthenics exercises avoiding sore body parts
    let allowedCalisthenics = CALISTHENICS_DB.filter(ex => {
      if (sorenessAreas.includes('Upper Body') && (ex.category === 'Push' || ex.category === 'Pull')) return false;
      if (sorenessAreas.includes('Legs') && ex.category === 'Legs') return false;
      if (!userProfile.equipment.includes('Pull-up Bar') && ex.equipment === 'Pull-up Bar') return false;
      return true;
    });

    const isHighEnergy = energyLevel >= 7;
    let mainComponent, cardioComponent, mobilityComponent;

    if (isHighEnergy) {
      // Calisthenics Strength + Jump Rope or Jog
      mainComponent = {
        title: 'Calisthenics Strength Trio',
        exercises: allowedCalisthenics.slice(0, 3)
      };
      if (userProfile.equipment.includes('Jump Rope')) {
        cardioComponent = JUMPROPE_DB.find(j => j.id === 'rope-boxer-footwork');
      } else {
        cardioComponent = RUNNING_DB.find(r => r.id === 'run-recovery-jog');
      }
      mobilityComponent = MOBILITY_DB.find(m => m.id === 'mobility-upper-spine');
    } else {
      // Moderate energy -> Calisthenics + Restoration
      mainComponent = {
        title: 'Balanced Bodyweight & Core',
        exercises: allowedCalisthenics.slice(0, 3)
      };
      mobilityComponent = MOBILITY_DB.find(m => m.id === 'mobility-full-body-recovery');
    }

    return {
      type: 'Standard Workout',
      title: 'Adaptive Calisthenics & Cardio Session',
      summary: `Tailored 30-min workout combining strength, mobility, and cardio based on your readiness score of ${readiness}%.`,
      readinessScore: readiness,
      estimatedMinutes: 30,
      components: { mainComponent, cardioComponent, mobilityComponent },
      aiAdvice: isHighEnergy 
        ? `You're feeling strong today (${energyLevel}/10 energy)! We've paired a calisthenics strength trio with light cardio and shoulder/spine mobility.`
        : `With moderate energy today, we're focusing on controlled movement quality, core stability, and deep spinal decompression.`
    };
  }
};
