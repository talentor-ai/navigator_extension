import { omitBy } from 'lodash';

export const cleanEmptyFieldsFromObject = (obj: { [key: string]: any }) =>
  omitBy(
    obj,
    (value) =>
      value === '' ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0),
  );
