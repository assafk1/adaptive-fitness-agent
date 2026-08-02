// Interactive Workout, Rest Timer, and Dynamic AI Video Curation Component

const CURATED_VERIFIED_VIDEOS = {
  "world's greatest stretch": '28pE9y9vJg8',
  'greatest stretch': '28pE9y9vJg8',
  'push-up': 'IODxDxX7oi4',
  'push up': 'IODxDxX7oi4',
  'pull-up': 'eGo4IYlbE5g',
  'pull up': 'eGo4IYlbE5g',
  'dip': 'c3ZGl4pAwZ4',
  'pike': 'sposDXIE0zc',
  'plank': 'pSHjTRCQxIw',
  'jump rope': 'P56_C33f678',
  'boxer step': '8c6340n0N-E',
  'squat': 'gcNh17Ckjgg',
  'lunge': 'QOVaHwm-Q6U',
  'mountain climber': 'nmwgirgXLYM',
  'burpee': 'auBLPXO8F6U',
  'chin-up': 'brhRXlOhWAM',
  'hollow hold': '44ScXWFaVBs',
  'calf raise': '-M4-G8p8fmc'
};

export const WorkoutComponent = {
  getVideoId(exerciseObj, exerciseName = '') {
    if (exerciseObj && exerciseObj.youtubeVideoId) {
      return exerciseObj.youtubeVideoId;
    }

    const lower = exerciseName.toLowerCase();
    for (const key in CURATED_VERIFIED_VIDEOS) {
      if (lower.includes(key)) return CURATED_VERIFIED_VIDEOS[key];
    }
    return null;
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
          <span>🔥 Gemini AI Tailored</span>
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

    // Video Guide listeners
    containerEl.querySelectorAll('.watch-video-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const exName = e.currentTarget.dataset.name;
        const videoId = e.currentTarget.dataset.videoid;
        this.renderVideoModal(exName, videoId);
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
    const videoId = this.getVideoId(ex, ex.name);

    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="exercise-name" style="font-size: 15px;">${ex.name}</span>
            <button class="btn btn-outline btn-sm watch-video-btn" data-name="${ex.name}" data-videoid="${videoId || ''}" style="padding: 2px 8px; font-size: 11px;">🎥 Watch Form</button>
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
    const videoId = this.getVideoId(st, st.name);
    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="exercise-name" style="font-size: 15px;">🧘 ${st.name}</span>
            <button class="btn btn-outline btn-sm watch-video-btn" data-name="${st.name}" data-videoid="${videoId || ''}" style="padding: 2px 8px; font-size: 11px;">🎥 Watch Form</button>
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
    const videoId = this.getVideoId(rd, rd.name);
    return `
      <div class="exercise-item-row" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
        <div class="exercise-info">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="exercise-name" style="font-size: 15px;">⚡ ${rd.name}</span>
            <button class="btn btn-outline btn-sm watch-video-btn" data-name="${rd.name}" data-videoid="${videoId || ''}" style="padding: 2px 8px; font-size: 11px;">🎥 Watch Form</button>
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

  renderVideoModal(exerciseName, videoId = '') {
    let modal = document.getElementById('video-guide-modal');
    if (!modal) {
      const modalEl = document.createElement('div');
      modalEl.id = 'video-guide-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
      modal = modalEl;
    }

    const searchUrl = `https://www.youtube.com/results?search_query=proper+form+1+min+${encodeURIComponent(exerciseName)}`;

    let videoContentHtml = '';
    if (videoId) {
      videoContentHtml = `
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius-sm); margin-bottom: 12px;">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      `;
    } else {
      videoContentHtml = `
        <div style="text-align: center; padding: 24px 12px; background: rgba(255,255,255,0.04); border-radius: var(--radius-sm); margin-bottom: 12px;">
          <p style="margin-bottom: 12px;">Tap below to watch concise 1-minute technique guides on YouTube for <strong>${exerciseName}</strong>:</p>
          <a href="${searchUrl}" target="_blank" class="btn btn-primary btn-block">🎥 Search Concise Video Guide on YouTube</a>
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="modal-card glassmorphism animate-fade-in" style="max-width: 500px;">
        <div class="modal-header">
          <h3>🎥 ${exerciseName} - Technique Guide</h3>
          <button class="btn-icon" id="close-video-btn">&times;</button>
        </div>
        ${videoContentHtml}
        <div style="display: flex; gap: 8px;">
          <a href="${searchUrl}" target="_blank" class="btn btn-outline btn-sm btn-block">🔎 Open in YouTube App</a>
          <button class="btn btn-primary btn-sm btn-block" id="done-video-btn">Done</button>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('close-video-btn');
    const doneBtn = document.getElementById('done-video-btn');

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
