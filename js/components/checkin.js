// Daily Check-in & Readiness Component

export const CheckInComponent = {
  renderModal(containerEl, currentCheckIn, onSave) {
    const energy = currentCheckIn ? currentCheckIn.energyLevel : 7;
    const soreness = currentCheckIn ? currentCheckIn.sorenessLevel : 2;
    const minutes = currentCheckIn ? currentCheckIn.availableMinutes : 30;
    const sports = currentCheckIn ? currentCheckIn.sportsToday : [];

    const html = `
      <div class="modal-overlay" id="checkin-modal">
        <div class="modal-card glassmorphism animate-fade-in">
          <div class="modal-header">
            <h3>☀️ Daily Readiness & Schedule Check-in</h3>
            <button class="btn-icon" id="close-checkin-btn">&times;</button>
          </div>
          
          <form id="checkin-form">
            <!-- 1. AVAILABLE TIME TODAY -->
            <div class="form-group">
              <label class="form-label">⏳ How much time do you have today?</label>
              <div class="time-chips-grid">
                <button type="button" class="chip-select ${minutes === 15 ? 'active' : ''}" data-value="15">⚡ 15 Mins (Express)</button>
                <button type="button" class="chip-select ${minutes === 30 ? 'active' : ''}" data-value="30">🎯 30 Mins (Standard)</button>
                <button type="button" class="chip-select ${minutes === 45 ? 'active' : ''}" data-value="45">🔥 45+ Mins (Deep Session)</button>
                <button type="button" class="chip-select ${minutes === 0 ? 'active' : ''}" data-value="0">🧘 0 Mins (Rest / Busy)</button>
              </div>
              <input type="hidden" id="availableMinutes" value="${minutes}" />
            </div>

            <!-- 2. ENERGY LEVEL SLIDER -->
            <div class="form-group">
              <div class="slider-header">
                <label class="form-label">⚡ How is your energy level today?</label>
                <span class="slider-val" id="energy-val">${energy} / 10</span>
              </div>
              <input type="range" id="energyLevel" min="1" max="10" value="${energy}" class="custom-range" />
              <div class="range-labels">
                <span>Drained</span>
                <span>Moderate</span>
                <span>Fully Charged</span>
              </div>
            </div>

            <!-- 3. SORENESS LEVEL SLIDER -->
            <div class="form-group">
              <div class="slider-header">
                <label class="form-label">🩹 Muscle Soreness & Fatigue</label>
                <span class="slider-val" id="soreness-val">${soreness} / 10</span>
              </div>
              <input type="range" id="sorenessLevel" min="1" max="10" value="${soreness}" class="custom-range" />
            </div>

            <!-- 4. SORENESS AREAS -->
            <div class="form-group">
              <label class="form-label">Body parts feeling tight or sore:</label>
              <div class="tag-chips-grid">
                <label class="checkbox-tag"><input type="checkbox" name="sorenessAreas" value="Legs" /> 🦵 Legs / Calves</label>
                <label class="checkbox-tag"><input type="checkbox" name="sorenessAreas" value="Upper Body" /> 🦾 Shoulders / Chest</label>
                <label class="checkbox-tag"><input type="checkbox" name="sorenessAreas" value="Back" /> 🪵 Lower / Upper Back</label>
                <label class="checkbox-tag"><input type="checkbox" name="sorenessAreas" value="Core" /> 🧘 Core</label>
              </div>
            </div>

            <!-- 5. EXTERNAL SPORTS TODAY -->
            <div class="form-group">
              <label class="form-label">🎾 Are you playing sports today?</label>
              <div class="tag-chips-grid">
                <label class="checkbox-tag"><input type="checkbox" name="sportsToday" value="Tennis" ${sports.includes('Tennis') ? 'checked' : ''} /> 🎾 Tennis</label>
                <label class="checkbox-tag"><input type="checkbox" name="sportsToday" value="Soccer" ${sports.includes('Soccer') ? 'checked' : ''} /> ⚽ Soccer</label>
                <label class="checkbox-tag"><input type="checkbox" name="sportsToday" value="Outdoor Running" ${sports.includes('Outdoor Running') ? 'checked' : ''} /> 🏃 Outdoor Run</label>
              </div>
            </div>

            <div class="modal-footer">
              <button type="submit" class="btn btn-primary btn-block">🚀 Save Readiness & Build Today's Plan</button>
            </div>
          </form>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    // EVENT LISTENERS
    const modalEl = document.getElementById('checkin-modal');
    const closeBtn = document.getElementById('close-checkin-btn');
    const form = document.getElementById('checkin-form');

    closeBtn.addEventListener('click', () => containerEl.innerHTML = '');
    
    // Time chips listener
    const timeChips = containerEl.querySelectorAll('.chip-select');
    timeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        timeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        document.getElementById('availableMinutes').value = chip.dataset.value;
      });
    });

    // Slider value updates
    const energySlider = document.getElementById('energyLevel');
    const energyVal = document.getElementById('energy-val');
    energySlider.addEventListener('input', (e) => energyVal.textContent = `${e.target.value} / 10`);

    const sorenessSlider = document.getElementById('sorenessLevel');
    const sorenessVal = document.getElementById('soreness-val');
    sorenessSlider.addEventListener('input', (e) => sorenessVal.textContent = `${e.target.value} / 10`);

    // Submit listener
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const minutesVal = parseInt(document.getElementById('availableMinutes').value, 10);
      const energyValNum = parseInt(energySlider.value, 10);
      const sorenessValNum = parseInt(sorenessSlider.value, 10);

      const sorenessAreasArr = Array.from(form.querySelectorAll('input[name="sorenessAreas"]:checked')).map(cb => cb.value);
      const sportsArr = Array.from(form.querySelectorAll('input[name="sportsToday"]:checked')).map(cb => cb.value);

      const checkInData = {
        availableMinutes: minutesVal,
        energyLevel: energyValNum,
        sorenessLevel: sorenessValNum,
        sorenessAreas: sorenessAreasArr,
        sportsToday: sportsArr
      };

      containerEl.innerHTML = '';
      onSave(checkInData);
    });
  }
};
