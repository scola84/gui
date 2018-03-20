export default function fixSubmit(panel) {
  const button = panel
    .select('.bar.header button[form]');

  if (button.node().form === null) {
    button.on('click', () => {
      panel
        .select('#' + button.attr('form'))
        .dispatch('submit');
    });
  }
}
