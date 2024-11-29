import { Form, H1 } from '@popup:components';
import { generatePostFormFields } from '../constants';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from '@popup:constants/paths';

const GeneratePost = () => {
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log(data);
  };
  const oncancel = () => {
    navigate(MAIN_PATH);
  };

  return (
    <div>
      <H1 className="text-txt2 my-8 px-4">Agregar una oferta de trabajo</H1>
      <Form
        className="my-8 flex flex-col justify-center w-full px-4"
        fieldProps={generatePostFormFields}
        onSubmit={onSubmit}
        onCancel={oncancel}
      />
    </div>
  );
};

export default GeneratePost;
