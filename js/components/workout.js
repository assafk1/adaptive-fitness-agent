// Interactive Workout & Rest Timer Component

export const WorkoutComponent = {
  renderWorkoutCard(containerEl, plan, onComplete) {
    if (!plan) {
      containerEl.innerHTML = `<div class="empty-card glassmorphism"><p>No plan active yet today. Tap <strong>⚡ Start Daily Check-in</strong> to generate today's adaptive routine.</p></div>`;
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
    } else if (plan.components) {
      const { mainComponent, cardioComponent, mobilityComponent } = plan.components;
      if (mainComponent && mainComponent.exercises) {
        exercisesHtml += `<div class="routine-block"><h4>💪 ${mainComponent.title}</h4>${mainComponent.exercises.map(ex => this.renderExerciseRow(ex)).join('')}</div>`;
      }
      if (cardioComponent) {
        exercisesHtml += `<div class="routine-block"><h4>🏃 ${cardioComponent.name}</h4><p class="text-muted">${cardioComponent.description || ''}</p></div>`;
      }
      if (mobilityComponent) {
        exercisesHtml += `<div class="routine-block"><h4>🧘 ${mobilityComponent.name}</h4><p class="text-muted">${mobilityComponent.description || ''}</p></div>`;
      }
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
          <span>🔥 Gemini AI Tailored</span>
          <button class="btn btn-outline btn-sm" id="launch-timer-btn">⏱️ Open Rest Timer</button>
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
          <button class="btn btn-success btn-block btn-lg" id="complete-workout-btn">✅ Log Session Completed</button>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    // Timer listener
    const timerBtn = document.getElementById('launch-timer-btn');
    if (timerBtn) {
      timerBtn.addEventListener('click', () => this.renderTimerModal(60));
    }

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
        alert('🎉 Great work! Session logged to your progress dashboard.');
      });
    }
  },

  renderExerciseRow(ex) {
    if (!ex) return '';
    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <span class="exercise-name" style="font-size: 15px;">${ex.name}</span>
          <span class="exercise-meta">${ex.defaultSets ? ex.defaultSets + ' Sets x ' : ''}${ex.defaultReps ? ex.defaultReps + ' Reps' : (ex.defaultDurationSec ? Math.round(ex.defaultDurationSec / 60) + ' min hold' : '')}</span>
          <p class="exercise-tips">${ex.tips || ''}</p>
        </div>
        <div class="set-checkboxes">
          ${[1,2,3].map(setNum => `<label class="checkbox-circle"><input type="checkbox" /> <span>${setNum}</span></label>`).join('')}
        </div>
      </div>
    `;
  },

  renderStretchRow(st) {
    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <span class="exercise-name" style="font-size: 15px;">🧘 ${st.name}</span>
          <span class="exercise-meta">${st.durationSec}s ${st.perSide ? 'per side' : 'hold'}</span>
          <p class="exercise-tips">${st.tips || ''}</p>
        </div>
        <div class="set-checkboxes">
          <label class="checkbox-circle"><input type="checkbox" /> <span>✓</span></label>
        </div>
      </div>
    `;
  },

  renderRoundRow(rd) {
    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <span class="exercise-name" style="font-size: 15px;">⚡ ${rd.name}</span>
          <span class="exercise-meta">${rd.durationSec}s Work | ${rd.restSec || 0}s Rest</span>
          <p class="exercise-tips">${rd.tips || ''}</p>
        </div>
        <div class="set-checkboxes">
          <label class="checkbox-circle"><input type="checkbox" /> <span>✓</span></label>
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
