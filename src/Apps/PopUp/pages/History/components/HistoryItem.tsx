import { SERVICE_PATH } from '@popup:api';
import { ButtonIcon, H2 } from '@popup:components';
import { isEmpty } from 'lodash';

const HistoryItem = ({ name, skills, downloadPath }: any) => {
  return (
    <div
      className="ik-px-[1.3rem] ik-py-[0.7rem] ik-rounded-md ik-border ik-border-tertiary
        flex gap-4"
    >
      <div className="">
        <H2 className="ik-text-tertiary">{name}</H2>
        <p>{!isEmpty(skills) && skills.join(', ')}</p>
      </div>
      <div className="ik-w-6">
        <a href={SERVICE_PATH + '/uploads/' + downloadPath || ''}>
          <ButtonIcon icon="print" />
        </a>
      </div>
    </div>
  );
};

export default HistoryItem;
