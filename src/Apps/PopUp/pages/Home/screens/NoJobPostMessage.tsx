import { Box, H1, Icons } from '@popup:components';
import { GENERATE_MANUALLY_PATH } from '@popup:constants/paths';

const NoJobPostMessage = () => {
  return (
    <>
      <div className="mt-8">
        <H1 className="text-center text-txt2">
          No hay ninguna oferta de empleo seleccionada
        </H1>
        <p className="text-center mt-4 text-txt3">
          Para seleccionar una oferta de empleo, diríjase a LinkedIn y presione
          el botón de "Aplicar ahora" en la oferta de empleo o agregue uno
          manualmente presionando "Agregar manualmente".
        </p>
      </div>
      <Box
        boxType="navLink"
        to={GENERATE_MANUALLY_PATH}
        className="bg-txt2 text-primary font-semibold block w-fit mx-auto mt-10
          px-6 hover:scale-[1.02]"
      >
        <Icons iconType="plus" className="mr-2" />
        Agregar manualmente
      </Box>
    </>
  );
};

export default NoJobPostMessage;
