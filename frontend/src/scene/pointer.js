/** A single smoothed pointer position (-1..1) shared by every living picture. */
export const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
let users = 0;

function onMove(e) {
  if (e.pointerType && e.pointerType !== 'mouse') return;
  pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
}

export function watchPointer() {
  if (users++ === 0) window.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    if (--users === 0) window.removeEventListener('pointermove', onMove);
  };
}

export function easePointer() {
  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;
}
