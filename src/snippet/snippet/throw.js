import Snippet from '../snippet';

export default class Throw extends Snippet {
  resolve(box, error) {
    throw error;
  }
}
