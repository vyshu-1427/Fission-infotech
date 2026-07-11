import { useEffect, useRef } from 'react';

const FxCursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf     = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    };

    const animateRing = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.1;
      ring.style.left = ringPos.current.x + 'px';
      ring.style.top  = ringPos.current.y + 'px';
      raf.current = requestAnimationFrame(animateRing);
    };
    raf.current = requestAnimationFrame(animateRing);

    const onOver = (e) => {
      if (e.target.closest('a,button,input,select,textarea,[role="button"]')) {
        dot.classList.add('hovered'); ring.classList.add('hovered');
      }
    };
    const onOut = () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); };

    const onClick = (e) => {
      // Burst
      const burst = document.createElement('div');
      burst.className = 'click-burst';
      burst.style.left = e.clientX + 'px';
      burst.style.top  = e.clientY + 'px';
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 520);
      // Flash
      dot.classList.add('clicked');
      setTimeout(() => dot.classList.remove('clicked'), 150);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout',  onOut);
    window.addEventListener('click',     onClick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout',  onOut);
      window.removeEventListener('click',     onClick);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
};

export default FxCursor;
