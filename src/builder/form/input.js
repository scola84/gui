import CheckboxInput from './input/checkbox';
import EmailInput from './input/email';
import IntegerInput from './input/integer';
import PasswordInput from './input/password';
import SubmitInput from './input/submit';
import TextInput from './input/text';

export default {
  checkbox: new CheckboxInput(),
  email: new EmailInput(),
  integer: new IntegerInput(),
  password: new PasswordInput(),
  submit: new SubmitInput(),
  text: new TextInput()
};
