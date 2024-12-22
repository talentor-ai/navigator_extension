import { FieldConfig, InputFieldType } from '@popup:models/model.form';

export const generatePostFormFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Título del Trabajo',
    type: InputFieldType.text,
    placeholder: 'Ingrese el título del trabajo',
    validationRules: {
      required: 'Este campo es obligatorio',
      maxLength: {
        value: 150,
        message: 'El título no puede exceder los 150 caracteres',
      },
    },
  },
  {
    name: 'position',
    label: 'Posición',
    type: InputFieldType.text,
    placeholder: 'Ingrese la posición',
    validationRules: {
      required: 'Este campo es obligatorio',
      maxLength: {
        value: 50,
        message: 'La posición no puede exceder los 50 caracteres',
      },
    },
  },
  {
    name: 'jobType',
    label: 'Tipo de Trabajo',
    type: InputFieldType.text,
    placeholder:
      'Ingrese el tipo de trabajo (ej., Tiempo completo, Medio tiempo)',
    validationRules: {
      maxLength: {
        value: 20,
        message: 'La posición no puede exceder los 20 caracteres',
      },
    },
  },
  {
    name: 'description',
    label: 'Descripción del Trabajo',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese la descripción del trabajo',
    validationRules: {
      required: 'Este campo es obligatorio',
    },
  },
  {
    name: 'location',
    label: 'Ubicación',
    type: InputFieldType.text,
    placeholder: 'Ingrese la ubicación',
    validationRules: {
      maxLength: {
        value: 50,
        message: 'La ubicación no puede exceder los 50 caracteres',
      },
    },
  },
  {
    name: 'companyName',
    label: 'Nombre de la Empresa',
    type: InputFieldType.text,
    placeholder: 'Ingrese el nombre de la empresa',
    validationRules: {
      required: 'Este campo es obligatorio',
    },
  },
  {
    name: 'companyBriefDescription',
    label: 'Descripción Breve de la Empresa',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese una breve descripción de la empresa',
    validationRules: {
      maxLength: {
        value: 250,
        message: 'El nombre de la empresa no puede exceder los 250 caracteres',
      },
    },
  },
  {
    name: 'companyDescription',
    label: 'Descripción de la Empresa',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese una descripción detallada de la empresa',
  },
  {
    name: 'companyLogoUrl',
    label: 'URL del Logo de la Empresa',
    type: InputFieldType.text,
    placeholder: 'Ingrese la URL del logo de la empresa',
    validationRules: {
      maxLength: {
        value: 250,
        message: 'La URL no puede exceder los 250 caracteres',
      },
    },
  },
  {
    name: 'companyWorkers',
    label: 'Número de Trabajadores',
    type: InputFieldType.number,
    placeholder: 'Ingrese el número de trabajadores',
  },
  {
    name: 'datePosted',
    label: 'Fecha de Publicación',
    type: InputFieldType.datetime,
    placeholder: 'Ingrese la fecha de publicación',
    validationRules: {
      maxLength: {
        value: 100,
        message: 'La URL no puede exceder los 100 caracteres',
      },
    },
  },
  {
    name: 'applicants',
    label: 'Número de Postulantes',
    type: InputFieldType.number,
    placeholder: 'Ingrese el número de postulantes',
  },
  {
    name: 'skills',
    label: 'Habilidades Requeridas',
    type: InputFieldType.textarea,
    placeholder: 'Ingrese las habilidades requeridas, separadas por comas',
  },
];
