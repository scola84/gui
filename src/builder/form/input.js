import HiddenInput from './input/hidden';
import IntegerInput from './input/integer';
import SubmitInput from './input/submit';
import TextInput from './input/text';

export default {
  hidden: new HiddenInput(),
  integer: new IntegerInput(),
  submit: new SubmitInput(),
  text: new TextInput()
};
