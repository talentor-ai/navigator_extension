import { useJobProfile } from '@popup:store';
import { useEffect } from 'react';
import useHistoryStore from '@popup/store/useHistoryStore';
import useResumeHistory from '../hooks/useResumeHistory';
import { isEmpty, reverse } from 'lodash';
import HistoryItem from './HistoryItem';

const MyCVList = () => {
  const { jobProfileIdSelected } = useJobProfile();
  const { setResumeHistory, resumeHistory } = useHistoryStore();
  const { data: resumeList } = useResumeHistory(jobProfileIdSelected || '');

  console.log(resumeHistory);

  useEffect(() => {
    // @ts-expect-error Expect response
    const result = resumeList?.response;
    if (!result) return;
    setResumeHistory(result);
  }, [resumeList]);

  return (
    <div className="flex flex-col gap-2">
      {!isEmpty(resumeHistory) &&
        reverse(resumeHistory).map((resume: any) => (
          <HistoryItem key={resume.id} {...resume} />
        ))}
    </div>
  );
};

export default MyCVList;
