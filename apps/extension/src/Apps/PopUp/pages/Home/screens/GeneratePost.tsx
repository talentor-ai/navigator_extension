import { FormComponent, H1 } from '@popup:components';
import { generatePostFormFields } from '../constants';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from '@popup:constants/paths';
import { useJobPostFormStore, useJobProfile } from '@popup:store';
import useApplyToJob from '../hooks/useApplyToJob';
import { cleanEmptyFieldsFromObject } from '@popup:helpers';

const GeneratePost = () => {
  const navigate = useNavigate();
  const { jobProfileIdSelected } = useJobProfile();
  const { setFormData, formData, clearFormData } = useJobPostFormStore();
  const { mutate: applyToJob } = useApplyToJob();

  const onSubmit = (data: any) => {
    applyToJob({
      jobPost: cleanEmptyFieldsFromObject(data),
      jobProfileId: jobProfileIdSelected,
    });
    useJobPostFormStore.getState().clearFormData();
    navigate(MAIN_PATH);
  };
  const oncancel = () => {
    clearFormData();
    useJobPostFormStore.getState().clearFormData();
    navigate(MAIN_PATH);
  };

  // Handlers
  const onWatch = (data: Record<string, any>) => {
    setFormData(data);
  };

  return (
    <div>
      <H1 className="ik-text-txt2 ik-my-8 ik-px-4">
        Agregar una oferta de trabajo
      </H1>
      <FormComponent
        className="ik-my-8 ik-flex ik-flex-col ik-justify-center ik-w-full ik-px-4"
        fieldProps={generatePostFormFields}
        onSubmit={onSubmit}
        onCancel={oncancel}
        onWatch={onWatch}
        defaultValues={formData}
      />
    </div>
  );
};

export default GeneratePost;
