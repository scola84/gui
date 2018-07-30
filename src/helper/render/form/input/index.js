import CheckboxInput from './checkbox';
import DateInput from './date';
import EmailInput from './email';
import FileInput from './file';
import FloatInput from './float';
import IbanInput from './iban';
import IntegerInput from './integer';
import OrderInput from './order';
import PasswordInput from './password';
import Plain from './plain';
import RadioInput from './radio';
import SelectInput from './select';
import SubmitInput from './submit';
import TelInput from './tel';
import TextInput from './text';
import TextareaInput from './textarea';
import ZipInput from './zip';

export default {
  checkbox: new CheckboxInput(),
  date: new DateInput(),
  email: new EmailInput(),
  file: new FileInput(),
  float: new FloatInput(),
  iban: new IbanInput(),
  integer: new IntegerInput(),
  order: new OrderInput(),
  password: new PasswordInput(),
  plain: new Plain(),
  radio: new RadioInput(),
  select: new SelectInput(),
  submit: new SubmitInput(),
  tel: new TelInput(),
  text: new TextInput(),
  textarea: new TextareaInput(),
  zip: new ZipInput()
};
