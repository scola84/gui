import CheckboxInput from './checkbox';
import EmailInput from './email';
import IntegerInput from './integer';
import PasswordInput from './password';
import SubmitInput from './submit';
import TextInput from './text';

export default {
  checkbox: new CheckboxInput(),
  email: new EmailInput(),
  integer: new IntegerInput(),
  password: new PasswordInput(),
  submit: new SubmitInput(),
  text: new TextInput()
};
