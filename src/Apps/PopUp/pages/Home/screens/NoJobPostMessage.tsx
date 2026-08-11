import { Box, H1, Icons } from '@popup:components';
import { GENERATE_MANUALLY_PATH } from '@popup:constants/paths';
import { useTranslation } from 'react-i18next';

const NoJobPostMessage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="ik-mt-20">
        <H1 className="ik-text-center ik-text-txt2">
          {t('home.noEmployeeOfferSelected')}
        </H1>
        <p className="ik-text-center ik-mt-4 ik-text-txt3">
          {t('home.description')}
        </p>
      </div>
      <Box
        boxType="navLink"
        to={GENERATE_MANUALLY_PATH}
        className="ik-bg-txt2 ik-text-primary ik-font-semibold ik-block ik-w-fit ik-mx-auto ik-mt-10
          ik-px-6 hover:ik-scale-[1.02]"
      >
        <Icons iconType="plus" className="ik-mr-2" />
        {t('home.addManually')}
      </Box>
    </>
  );
};

export default NoJobPostMessage;
