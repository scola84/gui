import CheckboxInput from './checkbox';
import DateInput from './date';
import EmailInput from './email';
import IntegerInput from './integer';
import OrderInput from './order';
import PasswordInput from './password';
import Plain from './plain';
import RadioInput from './radio';
import SelectInput from './select';
import SubmitInput from './submit';
import TextInput from './text';
import TextareaInput from './textarea';

export default {
  checkbox: new CheckboxInput(),
  date: new DateInput(),
  email: new EmailInput(),
  integer: new IntegerInput(),
  order: new OrderInput(),
  password: new PasswordInput(),
  plain: new Plain(),
  radio: new RadioInput(),
  select: new SelectInput(),
  submit: new SubmitInput(),
  text: new TextInput(),
  textarea: new TextareaInput(),
};
