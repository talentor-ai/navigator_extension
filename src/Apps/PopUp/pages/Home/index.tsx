import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Outlet />
      {/* <Box containerMode autoSize>
        <Info infoId="user_info" icon="user" title={<H2>Job position</H2>}>
        <p>Something...</p>
      </Info>
      </Box> */}
    </>
  );
};

export default Home;
