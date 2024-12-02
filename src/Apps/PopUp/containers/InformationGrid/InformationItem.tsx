import { useTranslation } from 'react-i18next';
import { H2, Icons, Link } from '@popup:components';

interface IInformationItemProps {
  keyLabel: string;
  value: string;
  span?: number;
}

const InformationItem = ({
  keyLabel,
  value,
  span = 1,
}: IInformationItemProps) => {
  const { t } = useTranslation();

  if (urlKeyList[keyLabel]) {
    return (
      <div style={{ gridColumn: `span ${span}` }}>
        <H2 className="mb-2 text-txt1">{t('formFields.' + keyLabel)}:</H2>
        <Link href={value} target="_blank" rel="noreferrer">
          <Icons iconType={urlKeyList[keyLabel]} className="mr-1" />
          {t('formFields.' + urlKeyList[keyLabel])}
        </Link>
      </div>
    );
  }
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <H2 className="mb-2 text-txt1">{t('formFields.' + keyLabel)}:</H2>
      <p className="text-txt3">{value}</p>
    </div>
  );
};

// The following keys will render as links
const urlKeyList: { [keyLabel: string]: string } = {
  linkedInUrl: 'linkedIn',
  githubURL: 'github',
  portfolioUrl: 'portfolio',
};

export default InformationItem;
