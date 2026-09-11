import { Box, H1, Icons } from '@popup:components';
import { GENERATE_MANUALLY_PATH } from '@popup:constants/paths';
import { useTranslation } from 'react-i18next';

const NoJobPostMessage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="tai:mt-20">
        <H1 className="tai:text-center tai:text-txt2">
          {t('home.noEmployeeOfferSelected')}
        </H1>
        <p className="tai:text-center tai:mt-4 tai:text-txt3">
          {t('home.description')}
        </p>
      </div>
      <Box
        boxType="navLink"
        to={GENERATE_MANUALLY_PATH}
        className="tai:bg-txt2 tai:text-primary tai:font-semibold tai:block tai:w-fit tai:mx-auto tai:mt-10
          tai:px-6 tai:hover:scale-[1.02]"
      >
        <Icons iconType="plus" className="tai:mr-2" />
        {t('home.addManually')}
      </Box>
    </>
  );
};

export default NoJobPostMessage;
