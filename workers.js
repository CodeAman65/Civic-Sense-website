// workers.js
const WORKERS_KEY = 'workersData';
const container = document.getElementById('workers-dashboard');

function loadWorkers() {
  const raw = JSON.parse(localStorage.getItem(WORKERS_KEY) || '[]');
  // sort by lastAssigned desc (nulls last)
  raw.sort((a,b) => (b.lastAssigned || 0) - (a.lastAssigned || 0));
  return raw;
}

function render() {
  const workers = loadWorkers();
  if (!container) return;
  container.innerHTML = '';
  workers.forEach(w => {
    const div = document.createElement('div');
    div.className = 'worker-card';
    const tasksHtml = (w.tasks && w.tasks.length) ? w.tasks.map(t => {
      const mapsLink = `https://www.google.com/maps?q=${t.location}`;
      const time = new Date(t.timestamp).toLocaleString();
      return `<li class="task">
                <div><strong>${t.title}</strong> <small>(${time})</small></div>
                <div><a href="${mapsLink}" target="_blank">Open location</a></div>
              </li>`;
    }).join('') : '<li class="no-tasks">No tasks</li>';

    div.innerHTML = `
      <div class="worker-card-header">
        <h3>${w.name}</h3>
        <div class="worker-stats">${w.tasks.length} job(s) ${w.lastAssigned ? '• ' + new Date(w.lastAssigned).toLocaleString() : ''}</div>
      </div>
      <ul class="task-list">${tasksHtml}</ul>
      <div class="worker-actions">
        <button class="clear-done">Mark all done</button>
      </div>
    `;

    // mark all done - simple example (removes all tasks)
    div.querySelector('.clear-done').addEventListener('click', () => {
      if (!confirm(`Mark all tasks of ${w.name} as done?`)) return;
      const all = loadWorkers();
      const idx = all.findIndex(x => x.id === w.id);
      if (idx === -1) return;
      all[idx].tasks = [];
      all[idx].lastAssigned = null;
      localStorage.setItem(WORKERS_KEY, JSON.stringify(all));
      render();
    });

    container.appendChild(div);
  });
}

// update in real time when other tab modifies workersData
window.addEventListener('storage', (e) => {
  if (e.key === WORKERS_KEY) render();
});

render();