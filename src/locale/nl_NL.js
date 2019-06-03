const maxlength = 'Deze waarde is te lang (max. %(maxlength)s tekens).';
const required = 'Dit veld is verplicht.';
const pattern = 'Deze waarde is niet goed (%(pattern)s).';

export default {
  dom: {
    input: {
      color: {
        maxlength,
        pattern,
        required,
        type: 'Dit is geen kleur.'
      },
      date: {
        maxlength,
        pattern,
        required,
        max: 'Deze datum is te laat (max. %(max)l[D]).',
        min: 'Deze datum is te vroeg (min. %(min)l[D]).',
        type: 'Dit is geen datum.'
      },
      datetimelocal: {
        maxlength,
        pattern,
        required,
        max: 'Deze datumtijd is te laat (max. %(max)l[f]).',
        min: 'Deze datumtijd is te vroeg (min. %(min)l[f]).',
        type: 'Dit is geen datumtijd.'
      },
      email: {
        maxlength,
        pattern,
        required,
        domain: 'Dit is geen e-mailadres.',
        local: 'Dit is geen e-mailadres.',
        space: 'Dit is geen e-mailadres.'
      },
      file: {
        maxlength,
        pattern,
        required,
        accept: 'Het bestandstype is niet juist $(accept)s',
        maxsize: 'Het bestand is te groot (max. %(maxsize)n[~s]B)'
      },
      iban: {
        maxlength,
        pattern,
        required,
        type: 'Dit is een geen rekeningnummer.'
      },
      month: {
        maxlength,
        pattern,
        required,
        max: 'Deze maand is te laat (max. %(max)l[D]).',
        min: 'Deze maand is te vroeg (min. %(min)l[D]).',
        type: 'Dit is geen maand.'
      },
      number: {
        maxlength,
        pattern,
        required,
        max: 'Dit getal is te hoog (max. %(max)s).',
        min: 'Dit getal is te laag (min. %(min)s).',
        type: 'Dit is geen getal.'
      },
      password: {
        maxlength,
        pattern,
        required,
        type: 'Dit is geen wachtwoord.'
      },
      range: {
        maxlength,
        pattern,
        required,
        max: 'Dit getal is te hoog (max. %(max)s).',
        min: 'Dit getal is te laag (min. %(min)s).',
        type: 'Dit is geen getal.'
      },
      select: {
        maxlength,
        pattern,
        required,
        type: 'Deze waarde is niet goed.'
      },
      tel: {
        maxlength,
        pattern,
        required,
        type: 'Dit is geen telefoonnummer.'
      },
      text: {
        maxlength,
        pattern,
        required,
        type: 'Dit is geen tekst.'
      },
      textarea: {
        maxlength,
        pattern,
        required,
        type: 'Dit is geen tekst.'
      },
      time: {
        maxlength,
        pattern,
        required,
        max: 'Deze tijd is te laat (max. %(max)l[t]).',
        min: 'Deze tijd is te vroeg (max. %(max)l[t]).',
        type: 'Dit is geen tijd.'
      },
      zip: {
        maxlength,
        pattern,
        required,
        type: 'Dit is geen postcode.'
      }
    }
  }
};
