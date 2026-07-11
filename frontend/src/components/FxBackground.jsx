import { useEffect, useRef } from 'react';

const FxBackground = () => {
  const mouseGlowRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.left = e.clientX + 'px';
        mouseGlowRef.current.style.top  = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="fx-bg" aria-hidden="true">
      {/* Grid */}
      <div className="fx-grid" />

      {/* Blobs */}
      <div className="fx-blob" style={{
        width:'600px', height:'600px', left:'-10%', top:'-15%',
        background:'radial-gradient(circle, #3B82F6 0%, #1d4ed8 50%, transparent 80%)',
        '--dur':'20s', '--tx':'60px', '--ty':'-40px', '--tx2':'-30px', '--ty2':'70px',
      }} />
      <div className="fx-blob" style={{
        width:'500px', height:'500px', right:'-8%', top:'5%',
        background:'radial-gradient(circle, #8B5CF6 0%, #6d28d9 50%, transparent 80%)',
        '--dur':'25s', '--del':'4s', '--tx':'-50px', '--ty':'60px', '--tx2':'30px', '--ty2':'-40px',
      }} />
      <div className="fx-blob" style={{
        width:'400px', height:'400px', left:'30%', bottom:'-5%',
        background:'radial-gradient(circle, #06B6D4 0%, #0891b2 50%, transparent 80%)',
        '--dur':'18s', '--del':'8s', '--tx':'40px', '--ty':'-60px', '--tx2':'-60px', '--ty2':'30px',
      }} />
      <div className="fx-blob" style={{
        width:'300px', height:'300px', right:'20%', bottom:'15%',
        background:'radial-gradient(circle, #EC4899 0%, #be185d 50%, transparent 80%)',
        '--dur':'22s', '--del':'2s', '--tx':'-30px', '--ty':'-50px', '--tx2':'50px', '--ty2':'20px',
      }} />
      <div className="fx-blob" style={{
        width:'250px', height:'250px', left:'50%', top:'40%',
        background:'radial-gradient(circle, #6366F1 0%, transparent 80%)',
        '--dur':'15s', '--del':'6s', '--tx':'80px', '--ty':'40px', '--tx2':'-60px', '--ty2':'-30px',
        opacity: 0.1,
      }} />

      {/* Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="fx-particle"
          style={{
            width:  `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left:   `${Math.random() * 100}%`,
            background: ['#3B82F6','#8B5CF6','#06B6D4','#EC4899'][i % 4],
            opacity: Math.random() * 0.5 + 0.1,
            '--pdur': `${Math.random() * 15 + 8}s`,
            '--pdel': `${Math.random() * 12}s`,
          }}
        />
      ))}

      {/* Mouse-follow glow */}
      <div className="fx-mouse-glow" ref={mouseGlowRef} />

      {/* Aurora sweep */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse at 50% -20%, rgba(59,130,246,0.12) 0%, transparent 60%)',
      }} />
    </div>
  );
};

export default FxBackground;
