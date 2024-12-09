import { useJobProfile } from '@popup:store';
import ControlPanel from '../Profile/Screens/components/ControlPanel';
import { MyCVList } from './components';

const History = () => {
  const { jobProfileIdSelected } = useJobProfile();
  return (
    <div>
      <ControlPanel />
      {jobProfileIdSelected && <MyCVList />}
    </div>
  );
};

export default History;