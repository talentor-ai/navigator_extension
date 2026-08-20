import { Box } from '../../../../../components';
import style from './infoFeature.module.css';

interface iProps {
  title: string;
  description: string;
}

const InfoFeature = ({ title, description }: iProps) => {
  return (
    <Box containerMode>
      <p className={style.title}>{title}</p>
      <p>{description}</p>
    </Box>
  );
};

export default InfoFeature;
