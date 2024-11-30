import { Box, H1, Icons } from '@popup:components';
import { GENERATE_MANUALLY_PATH } from '@popup:constants/paths';
import { useTranslation } from 'react-i18next';

const NoJobPostMessage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mt-20">
        <H1 className="text-center text-txt2">
          {t('home.noEmployeeOfferSelected')}
        </H1>
        <p className="text-center mt-4 text-txt3">{t('home.description')}</p>
      </div>
      <Box
        boxType="navLink"
        to={GENERATE_MANUALLY_PATH}
        className="bg-txt2 text-primary font-semibold block w-fit mx-auto mt-10
          px-6 hover:scale-[1.02]"
      >
        <Icons iconType="plus" className="mr-2" />
        {t('home.addManually')}
      </Box>
    </>
  );
};

export default NoJobPostMessage;
