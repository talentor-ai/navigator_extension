export type FormValues = {
  name: string;
  fullName: string;
  email: string;
  locale: string;
};

export type FieldErrors = Partial<Record<keyof FormValues, string>>;

export type CreateProfileDialogProps = {
  open: boolean;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void | Promise<void>;
};
