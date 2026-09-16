import { LOGIN_PATH } from '@modules/popup/constants/paths';
import { useSessionStore } from '@modules/popup/store';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface IRenderAuthComponent {
  children: ReactNode;
}

/**
 * This component was made to render the children only if the user is authenticated.
 */
const RenderAuthComponent = ({ children }: IRenderAuthComponent) => {
  const { token } = useSessionStore();

  if (token) {
    return children;
  } else {
    return <Navigate to={LOGIN_PATH} />;
  }
};

export default RenderAuthComponent;
