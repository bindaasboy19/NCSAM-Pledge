import React, { useEffect, useRef } from 'react';

/**
 * SecurityCanvas: Subtle interactive network of digital points connecting
 * toward a central shield geometry. Represents awareness and interconnected security.
 * Respects prefers-reduced-motion by rendering a single static frame.
 */
export function SecurityCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Node count scaled to screen size
    const nodeCount = Math.min(36, Math.floor(width / 35));
    const nodes = [];

    // Initialize nodes with subtle velocity
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
        alpha: Math.random() * 0.4 + 0.2,
        isPink: Math.random() > 0.85, // Pink is rare accent
      });
    }

    let mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Draw central faint shield geometry motif
    const drawCentralShield = (time) => {
      const cx = width / 2;
      const cy = height * 0.42;
      const size = Math.min(width, height) * 0.22;

      ctx.save();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();

      // Shield path
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size * 0.85, cy - size * 0.45);
      ctx.lineTo(cx + size * 0.65, cy + size * 0.55);
      ctx.lineTo(cx, cy + size);
      ctx.lineTo(cx - size * 0.65, cy + size * 0.55);
      ctx.lineTo(cx - size * 0.85, cy - size * 0.45);
      ctx.closePath();
      ctx.stroke();

      // Inner faint concentric shield
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.08)'; // subtle pink accent
      ctx.beginPath();
      const innerSize = size * 0.65;
      ctx.moveTo(cx, cy - innerSize);
      ctx.lineTo(cx + innerSize * 0.85, cy - innerSize * 0.45);
      ctx.lineTo(cx + innerSize * 0.65, cy + innerSize * 0.55);
      ctx.lineTo(cx, cy + innerSize);
      ctx.lineTo(cx - innerSize * 0.65, cy + innerSize * 0.55);
      ctx.lineTo(cx - innerSize * 0.85, cy - innerSize * 0.45);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    };

    const render = (time = 0) => {
      ctx.clearRect(0, 0, width, height);

      drawCentralShield(time);

      // Connect nodes within threshold
      const maxDistance = 110;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // Gentle pull toward mouse if hovered
          if (mouse.active) {
            const mdx = mouse.x - node.x;
            const mdy = mouse.y - node.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 140) {
              node.x += (mdx / mdist) * 0.4;
              node.y += (mdy / mdist) * 0.4;
            }
          }
        }

        ctx.fillStyle = node.isPink
          ? `rgba(236, 72, 153, ${node.alpha * 1.2})`
          : `rgba(37, 99, 235, ${node.alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto opacity-75 z-0"
      aria-hidden="true"
    />
  );
}

export default SecurityCanvas;
