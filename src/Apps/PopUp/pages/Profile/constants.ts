import { FieldConfig, InputFieldType } from '@popup:models/model.form';

export const JOB_PROFILE_FIELDS: FieldConfig[] = [
  {
    name: 'title',
    label: 'Descripcion breve',
    type: InputFieldType.text,
    placeholder: 'Ingrese la descripcion del perfil',
    validationRules: {
      required: 'Este campo es obligatorio',
      maxLength: {
        value: 150,
        message: 'No puede exceder los 150 caracteres',
      },
    },
  },
  {
    name: 'position',
    label: 'Sobre mi',
    type: InputFieldType.text,
    placeholder: 'Ingrese una descrición de su trayectoria laboral',
    validationRules: {
      required: 'Este campo es obligatorio',
      maxLength: {
        value: 50,
        message: 'No puede exceder los 50 caracteres',
      },
    },
  },
  {
    name: 'jobType',
    label: 'Habilidades',
    type: InputFieldType.subForm,
    subFormFields: [
      {
        formId: '1',
        name: 'skill',
        label: 'Habilidad',
        fields: [
          {
            name: 'id',
            label: 'Habilidad',
            type: InputFieldType.hidden,
          },
          {
            name: 'skillName',
            label: 'Habilidad',
            type: InputFieldType.text,
          },
          {
            name: 'yearsOfExperience',
            label: 'Años de experiencia',
            type: InputFieldType.number,
          },
        ],
      },
    ],
  },
  {
    name: 'description',
    label: 'Habilidades adicionales',
    type: InputFieldType.textarea,
    placeholder: 'Habilidades extra (separadas por coma)',
    validationRules: {
      required: 'Este campo es obligatorio',
    },
  },
  {
    name: 'location',
    label: 'Idiomas',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese los idiomas que habla',
    validationRules: {
      maxLength: {
        value: 50,
        message: 'No puede exceder los 50 caracteres',
      },
    },
  },
  {
    name: 'companyName',
    label: 'Linkedin URL',
    type: InputFieldType.text,
    placeholder: 'Ingrese la URL de su perfil de Linkedin',
    validationRules: {
      required: 'Este campo es obligatorio',
    },
  },
  {
    name: 'companyBriefDescription',
    label: 'GitHub',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese la URL de su perfil de GitHub',
    validationRules: {
      maxLength: {
        value: 250,
        message: 'No puede exceder los 250 caracteres',
      },
    },
  },
  {
    name: 'companyDescription',
    label: 'Portafolio',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese la URL de su portafolio',
  },
];
