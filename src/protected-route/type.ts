import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
  isOnlyAuth?: boolean; 
}

export type { ProtectedRouteProps };
