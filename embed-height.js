/* Sends only document height to the embedding page. */
(() => {
  if (window.parent === window) return;
  let origin = null;
  let lastHeight = 0;
  let scheduled = false;
  function report() {
    scheduled = false;
    if (!origin) return;
    const root = document.getElementById('root');
    const node = root || document.body;
    const height = Math.ceil(node.getBoundingClientRect().height + 32);
    if (height < 100 || height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage({type:'white-dof:height', height}, origin);
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(report); }
  }
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || !/^https?:\/\//.test(event.origin)) return;
    if (event.data?.type !== 'white-dof:measure') return;
    origin = event.origin;
    lastHeight = 0;
    schedule();
  });
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(schedule);
    observer.observe(document.getElementById('root') || document.body);
  }
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
})();
