import { Alert, Modal } from 'antd';
import { Button } from '@/components/ui/button';
import { ProfileFormField } from './components/ProfileFormField';
import { useCreateProfileForm } from './hooks/useCreateProfileForm';
import type { CreateProfileDialogProps } from './types';

export type {
  CreateProfileDialogProps,
  FieldErrors,
  FormValues,
} from './types';

const CreateProfileDialog = ({
  open,
  pending,
  error,
  onCancel,
  onSubmit,
}: CreateProfileDialogProps) => {
  const { values, fieldErrors, handleChange, handleSubmit, handleCancel } =
    useCreateProfileForm({
      open,
      pending,
      onCancel,
      onSubmit,
    });

  return (
    <Modal
      title="Create profile"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden={false}
      mask={{ closable: !pending }}
      keyboard={!pending}
      centered
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-2">
        {error ? (
          <Alert
            type="error"
            title={error}
            showIcon
            role="alert"
            className="mb-2"
          />
        ) : null}

        <ProfileFormField
          id="profile-create-name"
          name="name"
          label="Profile name"
          value={values.name}
          onChange={handleChange('name')}
          disabled={pending}
          error={fieldErrors.name}
          placeholder="e.g. Senior Frontend"
          autoComplete="off"
        />

        <ProfileFormField
          id="profile-create-fullName"
          name="fullName"
          label="Full name"
          value={values.fullName}
          onChange={handleChange('fullName')}
          disabled={pending}
          error={fieldErrors.fullName}
          placeholder="Ada Lovelace"
          autoComplete="name"
        />

        <ProfileFormField
          id="profile-create-email"
          name="email"
          label="Email"
          value={values.email}
          onChange={handleChange('email')}
          disabled={pending}
          error={fieldErrors.email}
          placeholder="ada@example.com"
          autoComplete="email"
          type="email"
        />

        <ProfileFormField
          id="profile-create-locale"
          name="locale"
          label="Locale"
          value={values.locale}
          onChange={handleChange('locale')}
          disabled={pending}
          error={fieldErrors.locale}
          placeholder="en-US"
          autoComplete="off"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={pending} aria-busy={pending}>
            {pending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProfileDialog;
export { CreateProfileDialog };
