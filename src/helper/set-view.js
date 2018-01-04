import { views } from './get-view';

export default function setView(name, view) {
  views[name] = view;
  return view;
}
