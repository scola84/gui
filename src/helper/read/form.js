import serializeForm from 'form-serialize';

export default function readForm(form, data, serialize) {
  return serializeForm(form.node(), serialize);
}
