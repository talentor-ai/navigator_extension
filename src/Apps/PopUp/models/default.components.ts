import React from 'react';

export interface CustomizableComponent {
  className?: string;
  style?: React.CSSProperties;
}

// Dynamic type for recursive objects

export type DynamicType = string | number | boolean | null | undefined;
export interface RecursiveObject {
  [key: string]:
    | DynamicType
    | RecursiveObject
    | Array<DynamicType>
    | Array<RecursiveObject>;
}
