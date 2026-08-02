// Interactive Workout, Rest Timer, and CaliXpert + Squat University YouTube Video Guides

const CALIXPERT_AND_SQUATUNI_VIDEOS = {
  // CALIXPERT CALISTHENICS VIDEOS (BAR-FREE)
  'push-up': { videoId: 'IODxDxX7oi4', channel: 'CaliXpert' },
  'diamond push-up': { videoId: '_2M2gTq3fGY', channel: 'CaliXpert' },
  'pike push-up': { videoId: 'sposDXIE0zc', channel: 'CaliXpert' },
  'decline push-up': { videoId: 'B-AobTxlAig', channel: 'CaliXpert' },
  'chair dip': { videoId: '0326dy_-CzM', channel: 'CaliXpert' },
  'bench dip': { videoId: '0326dy_-CzM', channel: 'CaliXpert' },
  'floor tricep dip': { videoId: '0326dy_-CzM', channel: 'CaliXpert' },
  
  // CORE & ABS (CALIXPERT)
  'forearm plank': { videoId: 'pSHjTRCQxIw', channel: 'CaliXpert' },
  'plank': { videoId: 'pSHjTRCQxIw', channel: 'CaliXpert' },
  'side plank': { videoId: 'N_4lYnLyo5c', channel: 'CaliXpert' },
  'deadbug': { videoId: '4XLEnwUr1d8', channel: 'CaliXpert' },
  'hollow body': { videoId: '44ScXWFaVBs', channel: 'CaliXpert' },
  'mountain climber': { videoId: 'nmwgirgXLYM', channel: 'CaliXpert' },

  // LEGS & SNOWBOARD PREP (CALIXPERT)
  'squat': { videoId: 'gcNh17Ckjgg', channel: 'CaliXpert' },
  'bulgarian split squat': { videoId: '2C-uNgKwPLE', channel: 'CaliXpert' },
  'cossack squat': { videoId: '1-EUvBto8lE', channel: 'CaliXpert' },
  'lunge': { videoId: 'QOVaHwm-Q6U', channel: 'CaliXpert' },
  'reverse lunge': { videoId: 'QOVaHwm-Q6U', channel: 'CaliXpert' },
  'wall sit': { videoId: 'y-wV4Venusw', channel: 'CaliXpert' },
  'single-leg rdl': { videoId: 'QW_uGfSj99k', channel: 'CaliXpert' },
  'calf raise': { videoId: '-M4-G8p8fmc', channel: 'CaliXpert' },

  // ROPE SKIPPING (CALIXPERT)
  'jump rope': { videoId: 'P56_C33f678', channel: 'CaliXpert' },
  'boxer step': { videoId: '8c6340n0N-E', channel: 'CaliXpert' },

  // STRETCHES & MOBILITY (SQUAT UNIVERSITY & KOT GUY)
  "world's greatest stretch": { videoId: '28pE9y9vJg8', channel: 'Squat University' },
  'greatest stretch': { videoId: '28pE9y9vJg8', channel: 'Squat University' },
  '90/90 hip': { videoId: '_WvVv_13W-0', channel: 'Squat University' },
  'couch stretch': { videoId: '80w3iW12M9g', channel: 'Knees Over Toes' },
  'pigeon pose': { videoId: 'cWl2sCjK9lQ', channel: 'Squat University' },
  'cat-cow': { videoId: 'w_UKcI1gTn8', channel: 'Squat University' },
  'thoracic thread': { videoId: '_V-QJvQ99p4', channel: 'Squat University' },
  'sleeper stretch': { videoId: 'G1N4yM-7rZc', channel: 'Squat University' },
  'ankle mobility': { videoId: 'e4W7-M6Tz0c', channel: 'Squat University' },
  "child's pose": { videoId: 'm9VwH8qMhO8', channel: 'Squat University' }
};

export const WorkoutComponent = {
  getVideoInfo(exerciseName = '') {
    const lower = exerciseName.toLowerCase();
    for (const key in CALIXPERT_AND_SQUATUNI_VIDEOS) {
      if (lower.includes(key)) return { name: exerciseName, ...CALIXPERT_AND_SQUATUNI_VIDEOS[key] };
    }
    return { name: exerciseName, videoId: null, channel: 'YouTube' };
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
          <span>🎥 CaliXpert & SquatUni Videos</span>
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
        this.renderVideoModal(exName);
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
            <button class="btn btn-outline btn-sm watch-video-btn" data-name="${ex.name}" style="padding: 2px 8px; font-size: 11px;">🎥 Watch Video</button>
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
            <button class="btn btn-outline btn-sm watch-video-btn" data-name="${st.name}" style="padding: 2px 8px; font-size: 11px;">🎥 Watch Video</button>
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
            <button class="btn btn-outline btn-sm watch-video-btn" data-name="${rd.name}" style="padding: 2px 8px; font-size: 11px;">🎥 Watch Video</button>
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

  renderVideoModal(exerciseName) {
    let modal = document.getElementById('video-guide-modal');
    if (!modal) {
      const modalEl = document.createElement('div');
      modalEl.id = 'video-guide-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
      modal = modalEl;
    }

    const info = this.getVideoInfo(exerciseName);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' form tutorial ' + info.channel)}`;

    let videoContentHtml = '';
    if (info.videoId) {
      videoContentHtml = `
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius-sm); margin-bottom: 12px;">
          <iframe 
            src="https://www.youtube.com/embed/${info.videoId}?autoplay=1" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      `;
    } else {
      videoContentHtml = `
        <div style="text-align: center; padding: 24px 12px; background: rgba(255,255,255,0.04); border-radius: var(--radius-sm); margin-bottom: 12px;">
          <p style="margin-bottom: 12px;">Watch high-quality technique video on YouTube for <strong>${exerciseName}</strong>:</p>
          <a href="${searchUrl}" target="_blank" class="btn btn-primary btn-block">🎥 Search Video Guide on YouTube</a>
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="modal-card glassmorphism animate-fade-in" style="max-width: 500px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-primary">${info.channel} Guide</span>
            <h3 style="margin-top: 4px;">🎥 ${exerciseName}</h3>
          </div>
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
