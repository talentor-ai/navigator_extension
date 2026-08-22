type Props = {
  error?: string | null;
};

export function EditableError({ error }: Props) {
  if (!error) return null;
  return (
    <div role="alert" className="mt-1 text-sm text-destructive">
      {error}
    </div>
  );
}
