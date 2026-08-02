// Interactive Workout, Rest Timer, and CaliXpert + Squat University Visual Form Cards

const EXERCISE_FORM_CARDS = {
  // PUSHING
  'push-up': { muscle: 'Chest & Triceps', cues: ['Hands slightly wider than shoulders, core tight', 'Lower chest 1 inch from floor with elbows at 45°', 'Avoid sagging hips or flaring elbows'] },
  'diamond push-up': { muscle: 'Triceps & Inner Chest', cues: ['Index fingers and thumbs touch forming a diamond', 'Lower chest to hands keeping elbows tucked', 'Engage core to prevent lower back arching'] },
  'pike push-up': { muscle: 'Shoulders & Upper Chest', cues: ['Hips high in upside-down V position', 'Lower top of head forward toward floor', 'Press back up through shoulders'] },
  'dip': { muscle: 'Triceps & Lower Chest', cues: ['Hands on edge of chair/bench, feet extended', 'Lower hips until elbows reach 90 degrees', 'Keep chest open and shoulders down'] },

  // PULLING & BACK (BAR-FREE)
  'doorframe iso pull': { muscle: 'Lats & Upper Back', cues: ['Grasp sturdy doorframe at chest height', 'Lean back with arms straight, then pull chest to frame', 'Squeeze shoulder blades together at top'] },
  'prone y-t-w': { muscle: 'Upper Back & Rear Delts', cues: ['Lie face down on floor with arms in Y, T, and W shapes', 'Raise arms up squeezing shoulder blades for 2s', 'Keep neck neutral looking down at mat'] },
  'cobra hold': { muscle: 'Spinal Erectors & Glutes', cues: ['Lie face down, lift chest and hands off floor', 'Keep toes touching mat and squeeze glutes', 'Hold for prescribed duration Breathing smoothly'] },

  // CORE & ABS (FLOOR)
  'forearm plank': { muscle: 'Core & Abs', cues: ['Elbows directly under shoulders, forearms parallel', 'Squeeze glutes and brace abs in straight line', 'Don\'t let hips sag or pike high'] },
  'side plank': { muscle: 'Obliques & Lateral Core', cues: ['Elbow under shoulder, stack feet or stagger', 'Lift hips high creating straight diagonal line', 'Brace core and avoid letting top hip rotate back'] },
  'deadbug': { muscle: 'Deep Core & Stability', cues: ['Lie on back, arms up, knees at 90 degrees', 'Extend opposite arm and leg toward floor slowly', 'Keep lower back pressed flat into mat'] },
  'hollow body': { muscle: 'Entire Abdominal Wall', cues: ['Lie back, press lower back to floor, lift shoulders and legs', 'Reach arms overhead or by sides', 'Hold rigid banana shape'] },

  // LEGS & SNOWBOARD PREP
  'squat': { muscle: 'Quads & Glutes', cues: ['Feet shoulder-width, toes slightly out', 'Sit back into hips keeping knees tracking over toes', 'Keep chest upright and push through mid-foot'] },
  'bulgarian split squat': { muscle: 'Single-Leg Quads & Glutes', cues: ['Rear foot elevated on chair, front foot 3ft forward', 'Lower back knee toward floor vertically', 'Keep front heel planted firmly'] },
  'cossack squat': { muscle: 'Adductors & Ankle Mobility', cues: ['Wide stance, shift weight to one side bending knee deep', 'Straight leg heel stays planted with toes pointing up', 'Keep chest high'] },
  'reverse lunge': { muscle: 'Glutes & Hamstrings', cues: ['Step backward smoothly onto ball of foot', 'Lower hips until front thigh is parallel to floor', 'Push off front foot to return to standing'] },
  'wall sit': { muscle: 'Quad Endurance (Snowboard Prep)', cues: ['Back flat against wall, knees bent at 90 degrees', 'Keep thighs parallel to floor and heels flat', 'Hold position bracing core'] },
  'single-leg rdl': { muscle: 'Hamstrings & Glute Balance', cues: ['Hinge at hips extending one leg backward straight', 'Keep back flat and hips square to floor', 'Squeeze glute to return to standing'] },

  // JUMP ROPE & CARDIO
  'jump rope': { muscle: 'Calves, Footwork & Cardio', cues: ['Stay light on balls of feet, knees soft', 'Rotate rope from wrists, keep elbows close', 'Jump only 1-2 inches off floor'] },
  'boxer step': { muscle: 'Ankle Stamina & Tennis Agility', cues: ['Shift weight smoothly from foot to foot with each turn', 'Keep jumps tiny and rhythm relaxed', 'Maintain soft knees'] },

  // MOBILITY & STRETCHES (SQUAT UNIVERSITY & KOT)
  "world's greatest stretch": { muscle: 'Hips, Thoracic Spine & Hamstrings', cues: ['Deep lunge, place inside hand on floor', 'Rotate inside arm up to sky opening chest', 'Hold 3s, return, and stretch front hamstring'] },
  '90/90 hip': { muscle: 'Hip Internal & External Rotation', cues: ['Sit on floor with both knees bent at 90 degrees', 'Rotate hips side to side keeping chest tall', 'Hinge forward over front shin for deep stretch'] },
  'couch stretch': { muscle: 'Quads & Hip Flexors', cues: ['Rear shin vertical against wall, front foot in lunge', 'Squeeze glute on rear leg to feel deep quad stretch', 'Keep torso upright'] },
  'pigeon pose': { muscle: 'Glutes & Piriformis', cues: ['Front leg folded across mat at 90/45 degrees', 'Rear leg extended straight behind hips', 'Hinge torso forward over front leg'] },
  'cat-cow': { muscle: 'Spinal Mobility', cues: ['On all fours, arch back up to ceiling (Cat)', 'Dip belly to floor lifting chest & tailbone (Cow)', 'Move slowly with breath'] },
  'thoracic thread': { muscle: 'Mid-Back Mobility (Tennis Rotations)', cues: ['On all fours, reach one arm under body to floor', 'Unwind and reach arm to sky opening chest', 'Follow hand with eyes'] }
};

export const WorkoutComponent = {
  getFormCard(exerciseName = '') {
    const lower = exerciseName.toLowerCase();
    for (const key in EXERCISE_FORM_CARDS) {
      if (lower.includes(key)) return { name: exerciseName, ...EXERCISE_FORM_CARDS[key] };
    }
    return {
      name: exerciseName,
      muscle: 'Targeted Movement',
      cues: [
        'Maintain controlled tempo and steady breathing',
        'Brace core and protect lower back throughout movement',
        'Focus on full range of motion without rushing'
      ]
    };
  },

  renderWorkoutCard(containerEl, plan, onComplete) {
    if (!plan) {
      containerEl.innerHTML = `<div class="empty-card glassmorphism"><p>No plan active yet today. Chat with your coach to generate today's adaptive routine.</p></div>`;
      return;
    }

    const { type, title, summary, readinessScore, estimatedMinutes, aiAdvice } = plan;

    let exercisesHtml = '';

    if (plan.routines && plan.routines.length > 0) {
      plan.routines.forEach((routine, idx) => {
        exercisesHtml += `
          <div class="routine-block">
            <h4>${routine.name || routine.title || 'Routine Block ' + (idx + 1)}</h4>
            <p class="text-muted" style="margin-bottom: 12px; font-size: 14px;">${routine.description || ''}</p>
            ${routine.exercises ? routine.exercises.map(ex => this.renderExerciseRow(ex)).join('') : ''}
            ${routine.stretches ? routine.stretches.map(st => this.renderStretchRow(st)).join('') : ''}
            ${routine.rounds ? routine.rounds.map(rd => this.renderRoundRow(rd)).join('') : ''}
            ${routine.structure ? routine.structure.map(st => this.renderStructureRow(st)).join('') : ''}
          </div>
        `;
      });
    } else if (plan.exercises && plan.exercises.length > 0) {
      exercisesHtml += `
        <div class="routine-block">
          <h4>Custom AI Exercise Flow</h4>
          ${plan.exercises.map(ex => this.renderExerciseRow(ex)).join('')}
        </div>
      `;
    }

    const html = `
      <div class="workout-card glassmorphism animate-fade-in">
        <div class="workout-header">
          <div class="workout-title-group">
            <span class="badge badge-primary">${type || 'Adaptive Workout'}</span>
            <h3 style="margin-top: 6px;">${title || 'Today\'s Fitness Routine'}</h3>
            <p class="workout-summary">${summary || ''}</p>
          </div>
          <div class="readiness-pill">
            <span class="pill-label">Readiness</span>
            <span class="pill-value">${readinessScore || 85}%</span>
          </div>
        </div>

        <div class="workout-meta-bar">
          <span>⏱️ ${estimatedMinutes || 15} Minutes</span>
          <span>🔥 100% Bar-Free</span>
          <button class="btn btn-outline btn-sm" id="launch-timer-btn">⏱️ Rest Timer</button>
        </div>

        ${aiAdvice ? `
          <div class="ai-coach-banner">
            <div class="avatar-sm">🏃‍♂️</div>
            <div class="coach-speech">${aiAdvice}</div>
          </div>
        ` : ''}

        <div class="workout-body">
          ${exercisesHtml}
        </div>

        <div class="workout-actions" style="margin-top: 20px;">
          <button class="btn btn-primary btn-block btn-lg" id="complete-workout-btn">✅ Log Session Completed</button>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    // Timer listener
    const timerBtn = document.getElementById('launch-timer-btn');
    if (timerBtn) {
      timerBtn.addEventListener('click', () => this.renderTimerModal(60));
    }

    // Form Card listeners
    containerEl.querySelectorAll('.view-form-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const exName = e.currentTarget.dataset.name;
        this.renderFormCardModal(exName);
      });
    });

    // Complete listener
    const completeBtn = document.getElementById('complete-workout-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        onComplete({
          title: title || 'Completed Session',
          type: type || 'Adaptive',
          durationMin: estimatedMinutes || 15,
          readinessScore: readinessScore || 85
        });
        alert('🎉 Great work! Session logged to your progress history.');
      });
    }
  },

  renderExerciseRow(ex) {
    if (!ex) return '';
    const totalSets = Math.min(Math.max(parseInt(ex.defaultSets || ex.sets || 3, 10), 1), 6);
    const setsArray = Array.from({ length: totalSets }, (_, i) => i + 1);

    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="exercise-name" style="font-size: 15px;">${ex.name}</span>
            <button class="btn btn-outline btn-sm view-form-card-btn" data-name="${ex.name}" style="padding: 2px 8px; font-size: 11px;">🖼️ Form Card</button>
          </div>
          <span class="exercise-meta">${ex.defaultSets ? ex.defaultSets + ' Sets x ' : ''}${ex.defaultReps ? ex.defaultReps + ' Reps' : (ex.defaultDurationSec ? Math.round(ex.defaultDurationSec / 60) + ' min hold' : '')}</span>
          <p class="exercise-tips">${ex.tips || ''}</p>
        </div>
        <div class="set-checkboxes">
          ${setsArray.map(setNum => `<label class="checkbox-circle" title="Mark Set ${setNum} Complete"><input type="checkbox" /> <span>${setNum}</span></label>`).join('')}
        </div>
      </div>
    `;
  },

  renderStretchRow(st) {
    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="exercise-name" style="font-size: 15px;">🧘 ${st.name}</span>
            <button class="btn btn-outline btn-sm view-form-card-btn" data-name="${st.name}" style="padding: 2px 8px; font-size: 11px;">🖼️ Form Card</button>
          </div>
          <span class="exercise-meta">${st.durationSec}s ${st.perSide ? 'per side' : 'hold'}</span>
          <p class="exercise-tips">${st.tips || ''}</p>
        </div>
        <div class="set-checkboxes">
          <label class="checkbox-circle" title="Mark Complete"><input type="checkbox" /> <span>✓</span></label>
        </div>
      </div>
    `;
  },

  renderRoundRow(rd) {
    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="exercise-name" style="font-size: 15px;">⚡ ${rd.name}</span>
            <button class="btn btn-outline btn-sm view-form-card-btn" data-name="${rd.name}" style="padding: 2px 8px; font-size: 11px;">🖼️ Form Card</button>
          </div>
          <span class="exercise-meta">${rd.durationSec}s Work | ${rd.restSec || 0}s Rest</span>
          <p class="exercise-tips">${rd.tips || ''}</p>
        </div>
        <div class="set-checkboxes">
          <label class="checkbox-circle" title="Mark Complete"><input type="checkbox" /> <span>✓</span></label>
        </div>
      </div>
    `;
  },

  renderStructureRow(st) {
    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <span class="exercise-name" style="font-size: 15px;">🏃 ${st.phase}</span>
          <span class="exercise-meta">${Math.round(st.durationSec / 60)} Mins</span>
          <p class="exercise-tips">${st.notes || ''}</p>
        </div>
      </div>
    `;
  },

  renderFormCardModal(exerciseName) {
    let modal = document.getElementById('form-card-modal');
    if (!modal) {
      const modalEl = document.createElement('div');
      modalEl.id = 'form-card-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
      modal = modalEl;
    }

    const cardData = this.getFormCard(exerciseName);

    modal.innerHTML = `
      <div class="modal-card glassmorphism animate-fade-in" style="max-width: 480px; padding: 20px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-primary">${cardData.muscle}</span>
            <h3 style="margin-top: 4px;">🖼️ ${cardData.name}</h3>
          </div>
          <button class="btn-icon" id="close-card-btn">&times;</button>
        </div>

        <div style="background: rgba(255,255,255,0.04); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 16px; border: 1px solid var(--border-glass);">
          <h4 style="font-size: 13px; color: var(--accent-primary); text-transform: uppercase; margin-bottom: 8px;">💡 Form & Execution Cues</h4>
          <ul style="padding-left: 18px; font-size: 13px; line-height: 1.6; color: var(--text-primary);">
            ${cardData.cues.map(c => `<li style="margin-bottom: 6px;">${c}</li>`).join('')}
          </ul>
        </div>

        <button class="btn btn-primary btn-block" id="done-card-btn">Got It!</button>
      </div>
    `;

    const closeBtn = document.getElementById('close-card-btn');
    const doneBtn = document.getElementById('done-card-btn');

    const closeModal = () => modal.remove();
    closeBtn.addEventListener('click', closeModal);
    doneBtn.addEventListener('click', closeModal);
  },

  renderTimerModal(defaultSec = 60) {
    let modal = document.getElementById('timer-modal');
    if (!modal) {
      const modalEl = document.createElement('div');
      modalEl.id = 'timer-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
      modal = modalEl;
    }

    let remaining = defaultSec;
    let timerInterval = null;

    const updateDisplay = () => {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      const displayStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      document.getElementById('timer-countdown').textContent = displayStr;
    };

    modal.innerHTML = `
      <div class="modal-card glassmorphism timer-card animate-fade-in">
        <div class="modal-header">
          <h3>⏱️ Rest & Interval Timer</h3>
          <button class="btn-icon" id="close-timer-btn">&times;</button>
        </div>
        <div class="timer-display-container">
          <div class="timer-circle">
            <span id="timer-countdown">01:00</span>
          </div>
        </div>
        <div class="timer-preset-btns">
          <button class="btn btn-outline btn-sm" data-sec="30">30s</button>
          <button class="btn btn-outline btn-sm" data-sec="60">60s</button>
          <button class="btn btn-outline btn-sm" data-sec="90">90s</button>
        </div>
        <div class="timer-controls">
          <button class="btn btn-primary btn-lg" id="start-timer-btn">▶️ Start</button>
          <button class="btn btn-outline btn-lg" id="reset-timer-btn">🔄 Reset</button>
        </div>
      </div>
    `;

    updateDisplay();

    const closeBtn = document.getElementById('close-timer-btn');
    const startBtn = document.getElementById('start-timer-btn');
    const resetBtn = document.getElementById('reset-timer-btn');
    const presets = modal.querySelectorAll('[data-sec]');

    closeBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      modal.remove();
    });

    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(timerInterval);
        startBtn.textContent = '▶️ Start';
        remaining = parseInt(btn.dataset.sec, 10);
        updateDisplay();
      });
    });

    startBtn.addEventListener('click', () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = '▶️ Resume';
      } else {
        startBtn.textContent = '⏸️ Pause';
        timerInterval = setInterval(() => {
          remaining--;
          updateDisplay();
          if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            startBtn.textContent = '▶️ Start';
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              osc.type = 'sine';
              osc.frequency.value = 880;
              osc.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.5);
            } catch (e) {}
            alert('⏰ Rest period over! Time for your next set.');
          }
        }, 1000);
      }
    });

    resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerInterval = null;
      remaining = defaultSec;
      startBtn.textContent = '▶️ Start';
      updateDisplay();
    });
  }
};
