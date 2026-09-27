type Props = {
  message: string;
};

const ResumeImportErrorState = ({ message }: Props) => {
  return (
    <div
      role="alert"
      tabIndex={-1}
      aria-live="assertive"
      className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </div>
  );
};

export default ResumeImportErrorState;
