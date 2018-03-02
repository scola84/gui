import serializeForm from 'form-serialize';

export default function readForm(route, data, form, serialize) {
  return Object.assign({}, data, serializeForm(form.node(), serialize));
}
