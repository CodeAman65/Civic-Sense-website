// workers.enhance.js
// Enhancements for workers page: show phone numbers with tasks, nicer visuals, prevent duplicate assignment check visual

(function(){
  const WORKERS_KEY = 'workersData';
  const container = document.getElementById('workers-dashboard');

  function loadWorkers() {
    const raw = JSON.parse(localStorage.getItem(WORKERS_KEY) || '[]');
    raw.sort((a,b) => (b.lastAssigned || 0) - (a.lastAssigned || 0));
    return raw;
  }

  function renderEnhanced(){
    const workers = loadWorkers();
    if (!container) return;
    container.innerHTML = '';
    workers.forEach(w => {
      const div = document.createElement('div');
      div.className = 'worker-card';
      // Build tasks with phone displayed (if present)
      const tasksHtml = (w.tasks && w.tasks.length) ? w.tasks.map(t => {
        const mapsLink = `https://www.google.com/maps?q=${t.location}`;
        const time = new Date(t.timestamp).toLocaleString();
        const phoneLine = t.phone ? `<div>📞 <span class="phone">${t.phone}</span></div>` : '';
        return `<li class="task">
                  <div><strong>${t.title}</strong> <small>(${time})</small></div>
                  ${phoneLine}
                  <div><a href="${mapsLink}" target="_blank">Open location</a></div>
                </li>`;
      }).join('') : '<li class="no-tasks">No tasks</li>';

      // If worker already has tasks, show badge
      const badge = (w.tasks && w.tasks.length) ? `<span class="badge">Assigned</span>` : '';

      div.innerHTML = `
        <div class="worker-card-header">
          <h3>${w.name} ${badge}</h3>
          <div class="worker-stats">${w.tasks.length} job(s) ${w.lastAssigned ? '• ' + new Date(w.lastAssigned).toLocaleString() : ''}</div>
        </div>
        <ul class="task-list">${tasksHtml}</ul>
        <div class="worker-actions">
          <button class="clear-done">Mark all done</button>
        </div>
      `;

      div.querySelector('.clear-done').addEventListener('click', () => {
        if (!confirm(`Mark all tasks of ${w.name} as done?`)) return;
        const all = loadWorkers();
        const idx = all.findIndex(x => x.id === w.id);
        if (idx === -1) return;
        all[idx].tasks = [];
        all[idx].lastAssigned = null;
        localStorage.setItem(WORKERS_KEY, JSON.stringify(all));
        // re-render both enhanced and original if present
        renderEnhanced();
        if (typeof render === 'function') try{ render(); }catch(e){}
      });

      container.appendChild(div);
    });
  }

  // initial enhanced render
  setTimeout(renderEnhanced, 120);

  // re-render when workersData changes
  window.addEventListener('storage', (e) => {
    if (e.key === WORKERS_KEY) renderEnhanced();
  });

})();
