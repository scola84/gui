import { views } from './get';

export default function setView(name, view) {
  views[name] = view;
  return view;
}
