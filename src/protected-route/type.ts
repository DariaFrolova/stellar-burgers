import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

export type { ProtectedRouteProps };
