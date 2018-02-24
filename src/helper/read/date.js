export default function readDate(form, data) {
  form
    .selectAll('input[type=date]')
    .each((datum, index, nodes) => {
      if (nodes[index].value) {
        data[nodes[index].name] = nodes[index].valueAsNumber;
      }
    });

  return data;
}
