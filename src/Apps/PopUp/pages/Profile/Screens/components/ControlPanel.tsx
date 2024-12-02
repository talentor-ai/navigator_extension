import { Select } from '@popup/components/FormComponent/components';
import { ButtonIcon } from '@popup:components';

const ControlPanel = () => {
  return (
    <div className="">
      <p className='mb-2 font-semibold text-tertiary'>Seleccionar perfil</p>
      <div className="grid grid-cols-[1fr_2.3rem_2.3rem_2.3rem] gap-2 mb-4">
        <Select />
        <ButtonIcon icon="plus" />
        <ButtonIcon icon="edit" />
        <ButtonIcon icon="delete" />
      </div>
    </div>
  );
};

export default ControlPanel;
