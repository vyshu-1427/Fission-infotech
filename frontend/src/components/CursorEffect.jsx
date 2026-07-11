import { useEffect, useRef } from 'react';

const CursorEffect = () => {
  const cursorRef  = useRef(null);
  const trailRef   = useRef(null);
  const posRef     = useRef({ x: 0, y: 0 });
  const trailPos   = useRef({ x: 0, y: 0 });
  const rafRef     = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail  = trailRef.current;
    if (!cursor || !trail) return;

    // ── Move ──────────────────────────────────
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    };

    // Smooth trail follows cursor with lag
    const animateTrail = () => {
      trailPos.current.x += (posRef.current.x - trailPos.current.x) * 0.12;
      trailPos.current.y += (posRef.current.y - trailPos.current.y) * 0.12;
      trail.style.left = trailPos.current.x + 'px';
      trail.style.top  = trailPos.current.y + 'px';
      rafRef.current = requestAnimationFrame(animateTrail);
    };
    rafRef.current = requestAnimationFrame(animateTrail);

    // ── Hover detection ───────────────────────
    const onOver = (e) => {
      const el = e.target;
      const isInteractive = el.closest('a,button,input,select,textarea,[role="button"],[tabindex]');
      if (isInteractive) {
        cursor.classList.add('hovering');
        trail.classList.add('hovering');
      }
    };

    const onOut = () => {
      cursor.classList.remove('hovering');
      trail.classList.remove('hovering');
    };

    // ── Click ripple + sparks ─────────────────
    const spawnSparks = (x, y) => {
      const colors = ['#fbbf24', '#f59e0b', '#fb923c', '#fcd34d', '#ffffff'];
      for (let i = 0; i < 8; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        const angle = (i / 8) * Math.PI * 2;
        const dist  = 20 + Math.random() * 30;
        const tx    = Math.cos(angle) * dist;
        const ty    = Math.sin(angle) * dist;
        spark.style.cssText = `
          left: ${x}px; top: ${y}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          --tx: ${tx}px; --ty: ${ty}px;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 850);
      }
    };

    const onClick = (e) => {
      // Ripple
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top  = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);

      // Sparks
      spawnSparks(e.clientX, e.clientY);

      // Brief click state
      cursor.classList.add('clicking');
      setTimeout(() => cursor.classList.remove('clicking'), 180);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);
    document.addEventListener('click',     onClick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
      document.removeEventListener('click',     onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div id="custom-cursor" ref={cursorRef} />
      <div id="cursor-trail"  ref={trailRef}  />
    </>
  );
};

export default CursorEffect;
