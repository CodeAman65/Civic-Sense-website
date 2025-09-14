// report.enhance.js
// Enhancement script: phone capture, voice-report, nicer preview behavior, and bridge data for municipality

(function(){
  // Basic element refs
  const uploadClick = document.getElementById('uploadClick');
  const fileInput = document.getElementById('fileInput');
  const preview = document.getElementById('preview');
  const phoneInput = document.getElementById('phoneInput');
  const voiceText = document.getElementById('voiceText');
  const startVoice = document.getElementById('startVoice');
  const voiceStatus = document.getElementById('voiceStatus');
  const submitBtn = document.getElementById('submitBtn');

  // Make upload area clickable
  uploadClick.addEventListener('click', () => fileInput.click());
  // Also support drag & drop
  const uploadBox = document.getElementById('uploadBox');
  ['dragenter','dragover'].forEach(ev => {
    uploadBox.addEventListener(ev, (e) => { e.preventDefault(); uploadBox.classList.add('drag'); });
  });
  ['dragleave','drop'].forEach(ev => {
    uploadBox.addEventListener(ev, (e) => { e.preventDefault(); uploadBox.classList.remove('drag'); });
  });
  uploadBox.addEventListener('drop', (e) => {
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) fileInput.files = e.dataTransfer.files, fileInput.dispatchEvent(new Event('change'));
  });

  // nicer preview when original fileReader runs: we just show a placeholder if none yet
  // (original preview will update style.backgroundImage)
  preview.style.display = preview.style.backgroundImage ? 'block' : 'none';

  // Voice to text using Web Speech API (graceful fallback)
  let recognition = null;
  let recognizing = false;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new Rec();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      recognizing = true;
      voiceStatus.innerText = 'Recording… click again to stop';
      startVoice.innerText = '⏹ Stop';
      startVoice.classList.add('recording');
    };
    recognition.onresult = (ev) => {
      const text = Array.from(ev.results).map(r => r[0].transcript).join(' ');
      voiceText.value = (voiceText.value ? voiceText.value + ' ' : '') + text;
    };
    recognition.onerror = (ev) => {
      console.warn('Speech error', ev);
      voiceStatus.innerText = 'Error while recording';
    };
    recognition.onend = () => {
      recognizing = false;
      voiceStatus.innerText = 'Not recording';
      startVoice.innerText = '🎤 Start Recording';
      startVoice.classList.remove('recording');
    };
  } else {
    startVoice.disabled = true;
    voiceStatus.innerText = 'Voice capture not supported in this browser';
  }

  startVoice.addEventListener('click', () => {
    if (!recognition) return;
    if (recognizing) recognition.stop();
    else recognition.start();
  });

  // When user clicks submit, we store phone & voice notes into a temp place so municipality can pick it up
  // We deliberately DO NOT change your original submit handler. Instead we create a metadata record
  // that will be used later by municipality page to enrich issues.
  submitBtn.addEventListener('click', () => {
    const phone = phoneInput.value.trim();
    const note = voiceText.value.trim();
    const meta = {
      phone: phone || null,
      voice: note || null,
      savedAt: new Date().toISOString()
    };
    // store the latest reporter meta (single latest). Municipality will try to attach it to incoming report(s).
    localStorage.setItem('lastReporterMeta', JSON.stringify(meta));
    // Also keep a lightweight audit log in case multiple reports are made
    const logs = JSON.parse(localStorage.getItem('reportMetaLog') || '[]');
    logs.push(meta);
    localStorage.setItem('reportMetaLog', JSON.stringify(logs.slice(-10)));
  });

  // Improve UX: show preview image when user selects file (original script also does this)
  fileInput.addEventListener('change', function(ev){
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = function(e){
      preview.style.backgroundImage = `url(${e.target.result})`;
      preview.style.display = 'block';
      preview.setAttribute('aria-hidden','false');
    };
    r.readAsDataURL(f);
  });

  // Friendly fallback: if geolocation does not resolve immediately show button to retry
  const locationDisplay = document.getElementById('locationDisplay');
  if (locationDisplay && locationDisplay.innerText.includes('not available')) {
    const btn = document.createElement('button');
    btn.className = 'btn subtle';
    btn.style.marginLeft = '10px';
    btn.innerText = 'Retry location';
    btn.addEventListener('click', () => location.reload());
    locationDisplay.appendChild(btn);
  }

})();
