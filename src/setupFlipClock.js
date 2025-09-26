export function setupFlipClock() {
  // Live view camera preview logic
  const liveViewBtn = document.getElementById('liveViewBtn');
  const liveViewContainer = document.getElementById('liveViewContainer');
  const liveViewVideo = document.getElementById('liveViewVideo');
  const closeLiveViewBtn = document.getElementById('closeLiveViewBtn');
  let liveViewStream = null;

  if (!liveViewBtn || !liveViewContainer || !liveViewVideo || !closeLiveViewBtn) {
    console.warn('Flip clock controls not found in the DOM.');
    return;
  }

  liveViewBtn.addEventListener('click', async () => {
    if (liveViewStream) {
      // Already running, just show
      liveViewContainer.classList.add('active');
      return;
    }
    try {
      liveViewBtn.disabled = true;
      liveViewBtn.textContent = 'Loading...';
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      liveViewStream = stream;
      liveViewVideo.srcObject = stream;
      liveViewContainer.classList.add('active');
      liveViewBtn.textContent = 'Turn on Live View';
    } catch (e) {
      alert('Unable to access camera. Please allow camera access or check your device.');
      liveViewBtn.textContent = 'Turn on Live View';
    } finally {
      liveViewBtn.disabled = false;
    }
  });

  closeLiveViewBtn.addEventListener('click', () => {
    liveViewContainer.classList.remove('active');
    // Optionally stop the stream to release camera
    if (liveViewStream) {
      liveViewStream.getTracks().forEach(track => track.stop());
      liveViewStream = null;
      liveViewVideo.srcObject = null;
    }
  });
  // Matrix rain effect
  const canvas = document.getElementById('matrix');
  const ctx = canvas ? canvas.getContext('2d') : null;

  if (!canvas || !ctx) {
    console.warn('Matrix canvas not found; skipping matrix animation.');
  } else {
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Recalculate columns when canvas resizes
      updateMatrixColumns();
    }

    let drops = [];
    let columns = 0;

    function updateMatrixColumns() {
      const fontSize = Math.max(12, Math.min(16, window.innerWidth / 100));
      columns = Math.floor(canvas.width / fontSize);
      
      // Reset drops array if columns changed
      if (drops.length !== columns) {
        drops = [];
        for (let i = 0; i < columns; i++) {
          drops[i] = Math.random() * -100;
        }
      }
    }

    resizeCanvas();

    // Enhanced resize handler for better performance on mobile
    let matrixResizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(matrixResizeTimeout);
      matrixResizeTimeout = setTimeout(resizeCanvas, 150);
      // Hide live view on resize
      liveViewContainer.classList.remove('active');
    });

    // Handle orientation change on mobile devices
    window.addEventListener('orientationchange', function() {
      setTimeout(resizeCanvas, 300);
    });

    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾛﾜﾝ';

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const fontSize = Math.max(12, Math.min(16, window.innerWidth / 100));
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length && i < columns; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        const gradient = ctx.createLinearGradient(0, y - fontSize * 5, 0, y);
        gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(0, 255, 0, 0.4)');
        gradient.addColorStop(0.7, 'rgba(0, 255, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 1)');
        ctx.fillStyle = gradient;
        
        ctx.fillText(char, x, y);
        
        if (drops[i] * fontSize > 0 && Math.random() > 0.9) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ff00';
          ctx.fillStyle = '#88ff88';
          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0;
        }
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    // Use requestAnimationFrame for better performance on mobile
    let matrixAnimationId;
    let lastMatrixUpdate = 0;

    function animateMatrix(timestamp) {
      if (timestamp - lastMatrixUpdate >= 35) {
        drawMatrix();
        lastMatrixUpdate = timestamp;
      }
      matrixAnimationId = requestAnimationFrame(animateMatrix);
    }

    // Start matrix animation
    animateMatrix(0);
  }
  function pad(num) {
    return num.toString().padStart(2, '0');
  }
  function renderDigit(container, value, prevValue) {
    container.innerHTML = '';
    const top = document.createElement('div');
    top.className = 'top';
    const topSpan = document.createElement('span');
    topSpan.textContent = value;
    top.appendChild(topSpan);
    
    const bottom = document.createElement('div');
    bottom.className = 'bottom';
    const bottomSpan = document.createElement('span');
    bottomSpan.textContent = value;
    bottom.appendChild(bottomSpan);
    
    container.appendChild(top);
    container.appendChild(bottom);
    
    if (prevValue !== undefined && prevValue !== value) {
      const flip = document.createElement('div');
      flip.className = 'flip';
      const flipSpan = document.createElement('span');
      flipSpan.textContent = prevValue;
      flip.appendChild(flipSpan);
      container.appendChild(flip);
      
      flip.addEventListener('animationend', () => {
        flip.remove();
      });
      
      // Fallback for older browsers that might not support animationend
      setTimeout(() => {
        if (flip.parentNode) {
          flip.remove();
        }
      }, 600);
    }
  }
  // Cyberpunk fluorescent tube flickering effects
  function triggerRandomGlitch() {
    const digits = document.querySelectorAll('.digit');
    if (digits.length === 0) return;
    
    // Randomly select 1-2 digits to flicker like fluorescent tubes
    const flickerCount = Math.random() < 0.8 ? 1 : 2;
    const selectedDigits = [];
    
    for (let i = 0; i < flickerCount; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * digits.length);
      } while (selectedDigits.includes(randomIndex));
      
      selectedDigits.push(randomIndex);
      const digit = digits[randomIndex];
      
      // Remove any existing fluorescent classes
      digit.classList.remove('fluorescent-flicker', 'fluorescent-buzz', 'fluorescent-startup');
      
      // Randomly choose fluorescent tube effect type
      const fluorescentTypes = ['fluorescent-flicker', 'fluorescent-buzz', 'fluorescent-startup'];
      const weights = [0.5, 0.3, 0.2]; // Flicker most common, startup least common
      
      let randomValue = Math.random();
      let selectedEffect;
      
      if (randomValue < weights[0]) {
        selectedEffect = fluorescentTypes[0]; // flicker
      } else if (randomValue < weights[0] + weights[1]) {
        selectedEffect = fluorescentTypes[1]; // buzz
      } else {
        selectedEffect = fluorescentTypes[2]; // startup
      }
      
      // Apply fluorescent tube effect
      digit.classList.add(selectedEffect);
      
      // Remove effect after animation completes
      const duration = selectedEffect === 'fluorescent-startup' ? 1200 : 
                      selectedEffect === 'fluorescent-flicker' ? 1000 : 800;
      
      setTimeout(() => {
        digit.classList.remove(selectedEffect);
      }, duration);
    }
  }

  // Start random fluorescent tube flickering
  function startCyberpunkGlitches() {
    // Trigger fluorescent flicker every 4-10 seconds randomly
    function scheduleNextGlitch() {
      const delay = Math.random() * 6000 + 4000; // 4-10 seconds
      setTimeout(() => {
        triggerRandomGlitch();
        scheduleNextGlitch();
      }, delay);
    }
    
    // Initial delay before first flicker
    setTimeout(() => {
      scheduleNextGlitch();
    }, 3000);
  }

  // Mobile detection and dynamic sizing for landscape orientation
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768) ||
           ('ontouchstart' in window);
  }

  function isLandscapeMobile() {
    return isMobileDevice() && 
           (window.innerWidth > window.innerHeight) && 
           (window.innerHeight <= 500);
  }

  function calculateOptimalSizes() {
    const isMobile = isMobileDevice();
    const isLandscape = isLandscapeMobile();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (!isMobile) {
      return null; // Use CSS variables for desktop
    }
    
    // More aggressive screen utilization - use more of the available space
    const availableWidth = screenWidth * 0.98; // Use 98% of screen width
    const availableHeight = isLandscape ? screenHeight * 0.75 : screenHeight * 0.5; // Use more height
    const totalElements = 8; // 6 digits + 2 colons
    
    let digitWidth, digitHeight, fontSize, colonSize, gap;
    
    if (isLandscape) {
      // Landscape mobile - maximize size while maintaining fit
      const maxElementWidth = availableWidth / totalElements;
      const maxDigitHeight = availableHeight * 0.9; // Use 90% of available height
      
      // Start with width-constrained size, then check height
      digitWidth = Math.max(50, maxElementWidth * 0.85); // More aggressive width usage
      digitHeight = Math.min(maxDigitHeight, digitWidth * 1.8); // Taller ratio for landscape
      
      // If height allows, make digits even larger
      if (digitHeight < maxDigitHeight * 0.8) {
        const heightBasedWidth = maxDigitHeight / 1.8;
        if (heightBasedWidth * totalElements <= availableWidth) {
          digitWidth = Math.min(heightBasedWidth, digitWidth * 1.3);
          digitHeight = digitWidth * 1.8;
        }
      }
      
      fontSize = digitHeight * 0.65; // Larger font relative to digit size
      colonSize = fontSize * 0.75;
      gap = Math.max(2, digitWidth * 0.06); // Slightly more gap for larger digits
      
    } else {
      // Portrait mobile - also maximize usage
      const maxElementWidth = availableWidth / totalElements;
      const maxDigitHeight = availableHeight * 0.85;
      
      digitWidth = Math.max(60, maxElementWidth * 0.9); // More width usage
      digitHeight = Math.min(maxDigitHeight, digitWidth * 1.4);
      
      // If height allows, make digits larger
      if (digitHeight < maxDigitHeight * 0.8) {
        const heightBasedWidth = maxDigitHeight / 1.4;
        if (heightBasedWidth * totalElements <= availableWidth) {
          digitWidth = Math.min(heightBasedWidth, digitWidth * 1.2);
          digitHeight = digitWidth * 1.4;
        }
      }
      
      fontSize = digitHeight * 0.6;
      colonSize = fontSize * 0.8;
      gap = Math.max(3, digitWidth * 0.08);
    }
    
    return {
      digitWidth: Math.floor(digitWidth),
      digitHeight: Math.floor(digitHeight),
      fontSize: Math.floor(fontSize),
      colonSize: Math.floor(colonSize),
      gap: Math.floor(gap),
      borderRadius: Math.max(8, Math.floor(digitWidth * 0.12))
    };
  }

  function applySizes(sizes) {
    if (!sizes) return;
    
    const root = document.documentElement;
    root.style.setProperty('--digit-width', sizes.digitWidth + 'px');
    root.style.setProperty('--digit-height', sizes.digitHeight + 'px');
    root.style.setProperty('--digit-font-size', sizes.fontSize + 'px');
    root.style.setProperty('--colon-size', sizes.colonSize + 'px');
    root.style.setProperty('--gap', sizes.gap + 'px');
    root.style.setProperty('--border-radius', sizes.borderRadius + 'px');
  }

  function adjustForMobile() {
    const sizes = calculateOptimalSizes();
    applySizes(sizes);
    
    // Additional adjustments for mobile devices
    if (isMobileDevice()) {
      const flipClockContainer = document.querySelector('.flip-clock-container');
      const flipClock = document.querySelector('.flip-clock');
      
      if (flipClockContainer && flipClock) {
        if (isLandscapeMobile()) {
          // Minimize padding for landscape to maximize space
          flipClockContainer.style.padding = '2px 1px';
          flipClock.style.margin = '0 auto';
        } else {
          // Normal padding for portrait
          flipClockContainer.style.padding = '10px 5px';
        }
        
        // Ensure proper fit with more aggressive scaling if needed
        setTimeout(() => {
          const clockWidth = flipClock.scrollWidth;
          const containerWidth = flipClockContainer.clientWidth - 5; // Minimal margins
          
          if (clockWidth > containerWidth) {
            // More aggressive scaling - use up to 99% of container width
            const scale = Math.min(containerWidth / clockWidth, 0.99);
            flipClock.style.transform = `scale(${scale})`;
            flipClock.style.transformOrigin = 'center center';
          } else {
            // If it fits, try to scale UP slightly for better utilization
            const maxScale = containerWidth / clockWidth;
            if (maxScale > 1.1 && maxScale < 1.3) {
              flipClock.style.transform = `scale(${Math.min(maxScale * 0.95, 1.25)})`;
              flipClock.style.transformOrigin = 'center center';
            } else {
              flipClock.style.transform = 'none';
            }
          }
        }, 100);
      }
    }
  }

  // Enhanced resize and orientation handlers
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      adjustForMobile();
    }, 150);
  }

  function handleOrientationChange() {
    setTimeout(() => {
      adjustForMobile();
    }, 300);
  }

  const flipClock = document.getElementById('flipClock');
  if (!flipClock) {
    console.warn('Flip clock container missing; cannot initialize.');
    return;
  }
  let mode = 'clock';
  let countdown = 60;
  let countdownInterval = null;
  let prevDigits = [null, null, null, null, null, null];
  function renderClock(h, m, s) {
    const timeStr = pad(h) + pad(m) + pad(s);
    flipClock.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const digit = document.createElement('div');
      digit.className = 'digit';
      renderDigit(digit, timeStr[i], prevDigits[i]);
      flipClock.appendChild(digit);
      prevDigits[i] = timeStr[i];
      if (i === 1 || i === 3) {
        const colon = document.createElement('div');
        colon.className = 'colon';
        colon.textContent = ':';
        flipClock.appendChild(colon);
      }
    }
    
    // Mobile fit check after rendering
    if (isMobileDevice()) {
      setTimeout(() => {
        ensureMobileFit();
      }, 50);
    }
  }

  function ensureMobileFit() {
    const flipClock = document.querySelector('.flip-clock');
    const container = document.querySelector('.flip-clock-container');
    
    if (!flipClock || !container) return;
    
    const clockWidth = flipClock.scrollWidth;
    const containerWidth = container.clientWidth - 10; // Minimal margin
    
    if (clockWidth > containerWidth) {
      // Scale down if too big
      const scale = Math.min(containerWidth / clockWidth, 0.98);
      flipClock.style.transform = `scale(${scale})`;
      flipClock.style.transformOrigin = 'center center';
    } else {
      // If it fits comfortably, try to scale up for better utilization
      const utilizationRatio = clockWidth / containerWidth;
      if (utilizationRatio < 0.8) { // If using less than 80% of space
        const maxScale = containerWidth / clockWidth;
        const optimalScale = Math.min(maxScale * 0.95, 1.2); // Cap at 20% increase
        if (optimalScale > 1.05) { // Only scale up if meaningful increase
          flipClock.style.transform = `scale(${optimalScale})`;
          flipClock.style.transformOrigin = 'center center';
        }
      }
    }
  }
  function showClock() {
    mode = 'clock';
    document.getElementById('countdownInputs').style.display = 'none';
    document.getElementById('startCountdown').style.display = 'none';
    // Do NOT clear countdownInterval, so countdown keeps running in background
    function update() {
      const now = new Date();
      renderClock(now.getHours(), now.getMinutes(), now.getSeconds());
    }
    update();
    // Use a separate interval for clock display
    if (window.clockDisplayInterval) clearInterval(window.clockDisplayInterval);
    window.clockDisplayInterval = setInterval(update, 1000);
    showControlsTemporarily();
  }
  function showCountdown() {
    mode = 'countdown';
    document.getElementById('countdownInputs').style.display = '';
    document.getElementById('startCountdown').style.display = '';
    // Stop clock display interval if running
    if (window.clockDisplayInterval) clearInterval(window.clockDisplayInterval);
    // If countdown is not running, show the input values
    if (!countdownInterval) {
      let h = parseInt(document.getElementById('countdownHour').value, 10) || 0;
      let m = parseInt(document.getElementById('countdownMinute').value, 10) || 0;
      let s = parseInt(document.getElementById('countdownSecond').value, 10) || 0;
      renderClock(h, m, s);
    } else {
      // Resume countdown display (do not reset timer)
      let h = Math.floor(countdown / 3600);
      let m = Math.floor((countdown % 3600) / 60);
      let s = countdown % 60;
      renderClock(h, m, s);
    }
    showControlsTemporarily();
  }
  // Effective countdown calculator
  let effectiveCountdownSeconds = 0;
  let lastCountdownDuration = 0;
  let pendingEffectiveTime = 0;
  let lastCountdownDate = new Date().toDateString();

  function updateEffectiveTimeDisplay() {
    let sec = effectiveCountdownSeconds;
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = sec % 60;
    document.getElementById('effectiveTime').textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  function updatePendingTimeDisplay() {
    let sec = pendingEffectiveTime;
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = sec % 60;
    document.getElementById('pendingTimeDisplay').textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    
    // Enable/disable buttons based on pending time
    const addBtn = document.getElementById('addTimeBtn');
    const clearBtn = document.getElementById('clearTimeBtn');
    
    addBtn.disabled = pendingEffectiveTime === 0;
    clearBtn.disabled = pendingEffectiveTime === 0;
    
    // Flash the add button if pending time is assigned
    if (pendingEffectiveTime > 0) {
      addBtn.classList.add('flash');
    } else {
      addBtn.classList.remove('flash');
    }
  }

  function resetEffectiveIfNewDay() {
    let today = new Date().toDateString();
    if (today !== lastCountdownDate) {
      effectiveCountdownSeconds = 0;
      lastCountdownDate = today;
      updateEffectiveTimeDisplay();
    }
  }

  function addPendingTime() {
    if (pendingEffectiveTime > 0) {
      effectiveCountdownSeconds += pendingEffectiveTime;
      updateEffectiveTimeDisplay();
      // Flash the effective time value
      const effElem = document.getElementById('effectiveTime');
      effElem.classList.add('flash');
      setTimeout(() => effElem.classList.remove('flash'), 1000);
      pendingEffectiveTime = 0;
      updatePendingTimeDisplay();
    }
  }

  function clearPendingTime() {
    pendingEffectiveTime = 0;
    updatePendingTimeDisplay();
  }

  function editPendingTime() {
    let currentH = Math.floor(pendingEffectiveTime / 3600);
    let currentM = Math.floor((pendingEffectiveTime % 3600) / 60);
    let currentS = pendingEffectiveTime % 60;
    
    let newTime = prompt(`Edit time (format: HH:MM:SS)\nCurrent: ${pad(currentH)}:${pad(currentM)}:${pad(currentS)}`, `${pad(currentH)}:${pad(currentM)}:${pad(currentS)}`);
    
    if (newTime !== null) {
      let timeParts = newTime.split(':');
      if (timeParts.length === 3) {
        let h = parseInt(timeParts[0], 10) || 0;
        let m = parseInt(timeParts[1], 10) || 0;
        let s = parseInt(timeParts[2], 10) || 0;
        
        if (h >= 0 && m >= 0 && m < 60 && s >= 0 && s < 60) {
          pendingEffectiveTime = h * 3600 + m * 60 + s;
          updatePendingTimeDisplay();
        } else {
          alert('Invalid time format. Please use HH:MM:SS format.');
        }
      } else {
        alert('Invalid time format. Please use HH:MM:SS format.');
      }
    }
  }
  // Create audio context for soft notification sound
  let audioContext = null;

  function createSoftNotificationSound() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Create a gentle notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Soft, pleasant frequency
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
      
      // Gentle volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.type = 'sine';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (e) {
      console.log('Audio not supported');
    }
  }
  function startCountdown() {
    let h = parseInt(document.getElementById('countdownHour').value, 10) || 0;
    let m = parseInt(document.getElementById('countdownMinute').value, 10) || 0;
    let s = parseInt(document.getElementById('countdownSecond').value, 10) || 0;
    countdown = h * 3600 + m * 60 + s;
    lastCountdownDuration = countdown;
    resetEffectiveIfNewDay();
    if (isNaN(countdown) || countdown < 1) countdown = 60;
    if (countdownInterval) clearInterval(countdownInterval);
    
    function update() {
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        if (mode === 'countdown') renderClock(0, 0, 0);
        
        // Set pending effective time
        pendingEffectiveTime = lastCountdownDuration;
        updatePendingTimeDisplay();
        
        // Show controls and make Add button flash
        showControlsTemporarily();
        const addTimeSection = document.getElementById('addEffectiveTime');
        addTimeSection.classList.remove('hide');
        
        // Play soft notification sound
        createSoftNotificationSound();
        
        return;
      }
      let h = Math.floor(countdown / 3600);
      let m = Math.floor((countdown % 3600) / 60);
      let s = countdown % 60;
      if (mode === 'countdown') renderClock(h, m, s);
      countdown--;
    }
    update();
    countdownInterval = setInterval(update, 1000);
  }
  // Event listeners with improved mobile handling
  document.getElementById('clockMode').addEventListener('click', function() {
    // Hide live view window
    const liveViewContainer = document.getElementById('liveViewContainer');
    if (liveViewContainer) {
      // Remember if it was active
      window.liveViewWasActive = liveViewContainer.classList.contains('active');
      liveViewContainer.classList.remove('active');
      // Stop camera stream if running
      if (window.liveViewStream) {
        window.liveViewStream.getTracks().forEach(track => track.stop());
        window.liveViewStream = null;
        document.getElementById('liveViewVideo').srcObject = null;
      }
    }
    // Hide goal display
    const timerTagDisplay = document.getElementById('timerTagDisplay');
    if (timerTagDisplay) timerTagDisplay.style.display = 'none';
    showClock();
  });
  document.getElementById('countdownMode').addEventListener('click', function() {
    showCountdown();
    // Restore Goal if set
    if (window.timerTag && window.timerTag.trim()) {
      document.getElementById('timerTagDisplay').style.display = 'block';
    }
    // Restore live view window if it was active before clock mode
    if (window.liveViewWasActive) {
      document.getElementById('liveViewContainer').classList.add('active');
      window.liveViewWasActive = false;
    }
  });
  document.getElementById('startCountdown').addEventListener('click', startCountdown);

  // Add effective time controls
  document.getElementById('addTimeBtn').addEventListener('click', addPendingTime);
  document.getElementById('clearTimeBtn').addEventListener('click', clearPendingTime);
  // Fullscreen handling with better mobile support and iOS fix
  document.getElementById('fullscreenBtn').addEventListener('click', () => {
    // Check if we're on iOS - improved detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
      // iOS doesn't support true fullscreen API, so use our custom implementation
      toggleIOSFullscreen();
    } else {
      // Standard fullscreen API for other browsers
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        const elem = document.documentElement;
        try {
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
          } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
          } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
          } else {
            // Fallback for browsers that don't support fullscreen API
            toggleIOSFullscreen();
          }
        } catch (e) {
          console.log('Fullscreen API failed, using fallback');
          toggleIOSFullscreen();
        }
      } else {
        try {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
          }
        } catch (e) {
          console.log('Exit fullscreen failed');
        }
      }
    }
  });

  // iOS fullscreen simulation
  let isIOSFullscreen = false;

  function toggleIOSFullscreen() {
    // Check if running on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (!isIOSFullscreen) {
      enterIOSFullscreen(isIOS);
    } else {
      exitIOSFullscreen(isIOS);
    }
  }

  function enterIOSFullscreen(isIOS) {
    const body = document.body;
    const controls = document.querySelector('.controls');
    const calculator = document.querySelector('#countdownCalculator');
    const addTime = document.querySelector('#addEffectiveTime');
    
    // iOS-specific fullscreen handling
    if (isIOS) {
      // Try to use the new iOS fullscreen API if available
      if (document.documentElement.webkitRequestFullscreen) {
        try {
          document.documentElement.webkitRequestFullscreen();
        } catch (e) {
          console.log('iOS fullscreen API failed, using fallback');
        }
      }
      
      // Force to landscape if not already (better fullscreen experience on iOS)
      if (window.orientation !== 90 && window.orientation !== -90) {
        try {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(e => console.log('Could not lock orientation:', e));
          }
        } catch (e) {
          console.log('Orientation lock not supported');
        }
      }
      
      // Hide Safari UI by scrolling slightly
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 300);
    }
    
    // Add iOS fullscreen styles
    body.style.position = 'fixed';
    body.style.top = '0';
    body.style.left = '0';
    body.style.width = '100%';
    body.style.height = '100%'; // Use 100% instead of 100vh for better iOS compatibility
    body.style.overflow = 'hidden';
    body.style.webkitUserSelect = 'none';
    body.style.webkitTouchCallout = 'none';
    
    // Add safe area insets for notched iOS devices
    body.style.paddingTop = 'env(safe-area-inset-top)';
    body.style.paddingBottom = 'env(safe-area-inset-bottom)';
    body.style.paddingLeft = 'env(safe-area-inset-left)';
    body.style.paddingRight = 'env(safe-area-inset-right)';
    
    // Hide controls initially in fullscreen
    if (controls) controls.classList.add('hide');
    if (calculator) calculator.classList.add('hide');
    if (addTime) addTime.classList.add('hide');
    
    // Add fullscreen class for additional styling
    body.classList.add('ios-fullscreen');
    
    isIOSFullscreen = true;
    
    // Update button text
    document.getElementById('fullscreenBtn').textContent = 'Exit Fullscreen';
    
    // Trigger resize to adjust clock size
    setTimeout(() => {
      adjustForMobile();
      window.dispatchEvent(new Event('resize'));
    }, 300); // Longer timeout for iOS
  }

  function exitIOSFullscreen(isIOS) {
    const body = document.body;
    
    // iOS-specific exit fullscreen
    if (isIOS) {
      if (document.webkitExitFullscreen) {
        try {
          document.webkitExitFullscreen();
        } catch (e) {
          console.log('iOS exit fullscreen API failed');
        }
      }
      
      // Release orientation lock if possible
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (e) {
        console.log('Orientation unlock not supported');
      }
    }
    
    // Remove iOS fullscreen styles
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.width = '';
    body.style.height = '';
    body.style.overflow = '';
    body.style.webkitUserSelect = '';
    body.style.webkitTouchCallout = '';
    body.style.paddingTop = '';
    body.style.paddingBottom = '';
    body.style.paddingLeft = '';
    body.style.paddingRight = '';
    
    // Remove fullscreen class
    body.classList.remove('ios-fullscreen');
    
    isIOSFullscreen = false;
    
    // Update button text
    document.getElementById('fullscreenBtn').textContent = 'Fullscreen';
    
    // Show controls temporarily
    showControlsTemporarily();
    
    // Trigger resize to readjust clock size
    setTimeout(() => {
      adjustForMobile();
      window.dispatchEvent(new Event('resize'));
    }, 300); // Longer timeout for iOS
  }

  // Handle orientation change in iOS fullscreen
  window.addEventListener('orientationchange', function() {
    if (isIOSFullscreen) {
      setTimeout(() => {
        window.scrollTo(0, 1);
        adjustForMobile();
      }, 500);
    }
  });

  // Prevent scrolling in iOS fullscreen
  document.addEventListener('touchmove', function(e) {
    if (isIOSFullscreen) {
      e.preventDefault();
    }
  }, { passive: false });
  function showControlsTemporarily() {
    const controls = document.querySelector('.controls');
    const calculator = document.querySelector('#countdownCalculator');
    const addTime = document.querySelector('#addEffectiveTime');
    controls.classList.remove('hide');
    calculator.classList.remove('hide');
    addTime.classList.remove('hide');
    // Only show goal if not in clock mode
    if (window.timerTag && window.timerTag.trim() && mode !== 'clock') {
      document.getElementById('timerTagDisplay').style.display = 'block';
    }
    if (controls.hideTimeout) clearTimeout(controls.hideTimeout);
    controls.hideTimeout = setTimeout(() => {
      controls.classList.add('hide');
      calculator.classList.add('hide');
      addTime.classList.add('hide');
      // Only show goal if not in clock mode
      document.getElementById('timerTagDisplay').style.display = (window.timerTag && window.timerTag.trim() && mode !== 'clock') ? 'block' : 'none';
    }, 5000);
  }
  // Improved event listeners for better mobile support
  document.addEventListener('mousemove', showControlsTemporarily);
  document.addEventListener('click', showControlsTemporarily);
  document.addEventListener('keydown', showControlsTemporarily);

  // Show controls on touch for mobile with better handling
  document.addEventListener('touchstart', showControlsTemporarily, { passive: true });
  document.addEventListener('touchend', showControlsTemporarily, { passive: true });
  // Prevent iOS zoom on double tap for specific elements
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  // Handle visibility change (when tab becomes inactive/active)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden && mode === 'clock') {
      // Refresh clock when tab becomes visible again
      const now = new Date();
      renderClock(now.getHours(), now.getMinutes(), now.getSeconds());
    }
  });
  // Initialize
  // Initialize when DOM is ready
  const initializeApp = () => {
    // Set default countdown to 30 minutes and start in countdown mode
    document.getElementById('countdownHour').value = 0;
    document.getElementById('countdownMinute').value = 30;
    document.getElementById('countdownSecond').value = 0;
    
    // Apply mobile adjustments first
    adjustForMobile();
    
    // Initialize display
    showCountdown();
    updateEffectiveTimeDisplay();
    updatePendingTimeDisplay();
    
    // Add resize and orientation listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Start cyberpunk glitch effects
    startCyberpunkGlitches();
  };

  initializeApp();
  // Tag functionality
  const tagsBtn = document.getElementById('tagsBtn');
  const timerTagDisplay = document.getElementById('timerTagDisplay');
  const timerTagText = document.getElementById('timerTagText');
  let timerTag = '';
  window.timerTag = timerTag;

  // Custom modal for Goal
  const goalModal = document.getElementById('goalModal');
  const goalInput = document.getElementById('goalInput');
  const goalModalOk = document.getElementById('goalModalOk');
  const goalModalCancel = document.getElementById('goalModalCancel');
  tagsBtn.addEventListener('click', () => {
    goalInput.value = timerTag || '';
    goalModal.style.display = 'flex';
    setTimeout(() => goalInput.focus(), 100);
  });
  goalModalOk.addEventListener('click', () => {
    const tag = goalInput.value;
    timerTag = tag.trim();
    window.timerTag = timerTag;
    if (timerTag) {
      timerTagText.textContent = timerTag;
      timerTagDisplay.style.display = 'block';
    } else {
      timerTagText.textContent = '';
      timerTagDisplay.style.display = 'none';
    }
    goalModal.style.display = 'none';
  });
  goalModalCancel.addEventListener('click', () => {
    goalModal.style.display = 'none';
  });
  goalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      goalModalOk.click();
    } else if (e.key === 'Escape') {
      goalModalCancel.click();
    }
  });
}
