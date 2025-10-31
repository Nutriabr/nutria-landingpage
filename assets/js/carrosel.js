
  document.querySelectorAll('.carousel').forEach(carousel => {
    const container = carousel.querySelector('.carousel-container');
    const track = carousel.querySelector('.carousel-track');
    if (!container || !track) return;

    // === DUPLICAR ITENS PARA LOOP INFINITO ===
    const originalItems = Array.from(track.children);
    const clonesBefore = originalItems.map(n => n.cloneNode(true));
    const clonesAfter = originalItems.map(n => n.cloneNode(true));
    clonesBefore.reverse().forEach(n => track.insertBefore(n, track.firstChild));
    clonesAfter.forEach(n => track.appendChild(n));

    const totalItems = originalItems.length;
    let itemWidth = 0;
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    for (let i = 0; i < totalItems; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      indicators.appendChild(dot);
    }
    carousel.appendChild(indicators);

    function updateSizes() {
      const first = track.querySelector(':scope > *');
      const gap = parseFloat(getComputedStyle(track).gap || 0);
      itemWidth = first ? first.getBoundingClientRect().width + gap : 0;
    }

    function resetPosition() {
      const offset = totalItems * itemWidth;
      container.scrollLeft = offset;
    }

    updateSizes();
    resetPosition();

    // --- ARRASTE (MOUSE e TOUCH) ---
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX;
      startScroll = container.scrollLeft;
      container.style.cursor = 'grabbing';
    });
    container.addEventListener('mouseleave', () => { isDragging = false; });
    container.addEventListener('mouseup', () => {
      isDragging = false;
      container.style.cursor = 'grab';
      updateActiveDot();
    });
    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.pageX - startX;
      container.scrollLeft = startScroll - dx;
      checkLoop();
    });

    // --- TOUCH ---
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX;
      startScroll = container.scrollLeft;
    });
    container.addEventListener('touchend', () => {
      isDragging = false;
      updateActiveDot();
    });
    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].pageX - startX;
      container.scrollLeft = startScroll - dx;
      checkLoop();
    });

    // --- SUPORTE A TOUCHPAD (scroll de dois dedos) ---
    container.addEventListener('wheel', (e) => {
      // scroll horizontal (ou diagonal) do touchpad
      if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
        container.scrollLeft += e.deltaY + e.deltaX;
        checkLoop();
        updateActiveDot();
      }
    }, { passive: true });

    // --- LOOP ---
    function checkLoop() {
      const maxScroll = track.scrollWidth - container.clientWidth;
      if (container.scrollLeft <= 0) {
        container.scrollLeft += totalItems * itemWidth;
      } else if (container.scrollLeft >= maxScroll - itemWidth) {
        container.scrollLeft -= totalItems * itemWidth;
      }
    }

    // --- INDICADORES ---
    function updateActiveDot() {
      const index = Math.round((container.scrollLeft % (itemWidth * totalItems)) / itemWidth);
      indicators.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    // --- RESIZE ---
    window.addEventListener('resize', () => {
      updateSizes();
      resetPosition();
    });

    container.style.cursor = 'grab';
  });

