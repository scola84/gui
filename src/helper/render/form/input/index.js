import CheckboxInput from './checkbox';
import DateInput from './date';
import EmailInput from './email';
import IntegerInput from './integer';
import OrderInput from './order';
import PasswordInput from './password';
import RadioInput from './radio';
import SubmitInput from './submit';
import TextInput from './text';

export default {
  checkbox: new CheckboxInput(),
  date: new DateInput(),
  email: new EmailInput(),
  integer: new IntegerInput(),
  order: new OrderInput(),
  password: new PasswordInput(),
  radio: new RadioInput(),
  submit: new SubmitInput(),
  text: new TextInput()
};
