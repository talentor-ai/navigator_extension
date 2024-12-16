import { SERVICE_PATH } from '@popup:api';
import { ButtonIcon, H2 } from '@popup:components';
import { isEmpty } from 'lodash';

const HistoryItem = ({ name, skills, downloadPath }: any) => {
  return (
    <div
      className="px-[1.3rem] py-[0.7rem] rounded-md border border-tertiary
        flex gap-4"
    >
      <div className="">
        <H2 className="text-tertiary">{name}</H2>
        <p>{!isEmpty(skills) && skills.join(', ')}</p>
      </div>
      <div className="w-6">
        <a href={SERVICE_PATH + '/uploads/' + downloadPath || ''}>
          <ButtonIcon icon="print" />
        </a>
      </div>
    </div>
  );
};

export default HistoryItem;
