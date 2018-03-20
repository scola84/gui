export default function fixSubmit(panel) {
  const button = panel
    .select('.bar.header button[form]');

  const node = button.node();

  if (node && node.form === null) {
    button.on('click', () => {
      panel
        .select('#' + button.attr('form'))
        .dispatch('submit');
    });
  }
}
