import Snippet from '../snippet';

export default class Throw extends Snippet {
  resolveAfter(box, error) {
    throw error;
  }
}
