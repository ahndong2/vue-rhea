const CHART_METHOD = {
  panZoomAction: (e) => {
    const { id, canvas, resetZoom } = e.chart;
    const header = canvas.closest('.panel').querySelector('.panel-header');

    const checkBtn = header.querySelector('.btn-reset-chart');
    if (checkBtn) return;
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = 'reset';
    resetBtn.className = 'btn-reset-chart';
    resetBtn.setAttribute('id', id);
    resetBtn.onclick = () => {
      resetZoom();
      resetBtn.remove();
    };
    header.insertBefore(resetBtn, header.children[1]);
  },
};
export { CHART_METHOD };
