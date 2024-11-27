import { Box, H2 } from '../../components';
import Info from './components/Info';

const Home = () => {
  return (
    <Box containerMode autoSize>
      <Info infoId="user_info" icon="user" title={<H2>Job position</H2>}>
        <p>Something...</p>
      </Info>
    </Box>
  );
};

export default Home;
