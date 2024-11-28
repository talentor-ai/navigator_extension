import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface IConditionalRedirect {
  condition: boolean;
  redirectPath: string;
  children: ReactNode;
}

const ConditionalRedirect = ({
  condition,
  redirectPath,
  children,
}: IConditionalRedirect) => {
  if (condition) {
    return children;
  } else {
    return <Navigate to={redirectPath} />;
  }
};

export default ConditionalRedirect;
