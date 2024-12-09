import { H2 } from '@popup:components';
import { isEmpty } from 'lodash';

const HistoryItem = ({ name, skills }: any) => {
  return (
    <div className="px-[1.3rem] py-[0.7rem] rounded-md border border-tertiary
        flex gap-4">
      <div className="">
        <H2 className='text-tertiary'>{name}</H2>
        <p>{!isEmpty(skills) && skills.join(', ')}</p>
      </div>
    </div>
  );
};

export default HistoryItem;
