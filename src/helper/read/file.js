import { select } from 'd3';

function addFile(route, data, name, file, isArray) {
  route.formData = true;

  if (isArray) {
    file = typeof data[name] === 'undefined' ?
      ([file]) : data[name].concat(file);
  }

  data[name] = file;
}

function addBlock(route, data, form, node) {
  let name = select(node).attr('name');
  const isArray = name.slice(-2) === '[]';
  name = isArray ? name.slice(0, -2) : name;

  form
    .selectAll('.block.file')
    .each((datum) => {
      addFile(route, data, name, datum, isArray);
    });
}

function addInput(route, data, form, node) {
  let name = select(node).attr('name');
  const isArray = name.slice(-2) === '[]';
  name = isArray ? name.slice(0, -2) : name;

  for (let i = 0; i < node.files.length; i += 1) {
    addFile(route, data, name, node.files[i], isArray);
  }
}

export default function readFile(route, data, form) {
  form
    .selectAll('input[type=file]')
    .each((datum, index, nodes) => {
      if (datum.preview) {
        addBlock(route, data, form, nodes[index]);
      } else {
        addInput(route, data, form, nodes[index]);
      }
    });

  return data;
}
