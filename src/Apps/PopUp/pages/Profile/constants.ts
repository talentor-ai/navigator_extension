import { FieldConfig, InputFieldType } from '@popup:models/model.form';

export const JOB_PROFILE_FIELDS: FieldConfig[] = [
  {
    name: 'id',
    type: InputFieldType.hidden,
  },
  {
    name: 'userId',
    type: InputFieldType.hidden,
  },
  {
    name: 'briefDescription',
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
    name: 'aboutMe',
    label: 'Sobre mi',
    type: InputFieldType.text,
    placeholder: 'Ingrese una descrición de su trayectoria laboral',
    validationRules: {
      required: 'Este campo es obligatorio',
      maxLength: {
        value: 1000,
        message: 'No puede exceder los 1000 caracteres',
      },
    },
  },
  {
    name: 'userJobProfileExperiences',
    label: 'Experiencia laboral',
    type: InputFieldType.subForm,
    subFormFields: [
      {
        formId: '1',
        name: 'skill',
        label: 'Experiencia laboral',
        fields: [
          {
            name: 'id',
            label: 'Habilidad',
            type: InputFieldType.hidden,
          },
          {
            name: 'position',
            label: 'Puesto',
            type: InputFieldType.text,
            validationRules: {
              required: 'Este campo es obligatorio',
            },
          },
          {
            name: 'company',
            label: 'Empresa',
            type: InputFieldType.text,
            validationRules: {
              required: 'Este campo es obligatorio',
            },
          },
          {
            name: 'startDate',
            label: 'Fecha de inicio',
            type: InputFieldType.date,
            validationRules: {
              required: 'Este campo es obligatorio',
            },
          },
          {
            name: 'endDate',
            label: 'Fecha de fin',
            type: InputFieldType.date,
            validationRules: {
              required: 'Este campo es obligatorio',
            },
          },
          {
            name: 'jobType',
            label: 'Modalidad de trabajo',
            type: InputFieldType.text,
          },
          {
            name: 'location',
            label: 'Ubicación',
            type: InputFieldType.text,
          },
          {
            name: 'description',
            label: 'Descripción',
            type: InputFieldType.text,
          },
        ],
      },
    ],
  },
  {
    name: 'userJobProfileSkills',
    label: 'Habilidades',
    type: InputFieldType.subForm,
    subFormFields: [
      {
        formId: '1',
        name: 'skill',
        label: 'Habilidades',
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
    name: 'additionalSkills',
    label: 'Habilidades adicionales',
    type: InputFieldType.textarea,
    placeholder: 'Habilidades extra (separadas por coma)',
  },
  {
    name: 'languages',
    label: 'Idiomas',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese los idiomas que habla (separados por coma)',
    validationRules: {
      maxLength: {
        value: 50,
        message: 'No puede exceder los 50 caracteres',
      },
    },
  },
  {
    name: 'linkedInUrl',
    label: 'Linkedin URL',
    type: InputFieldType.text,
    placeholder: 'Ingrese la URL de su perfil de LinkedIn',
    validationRules: {
      required: 'Este campo es obligatorio',
    },
  },
  {
    name: 'githubUrl',
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
    name: 'portfolioUrl',
    label: 'Portafolio',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese la URL de su portafolio',
  },
];
