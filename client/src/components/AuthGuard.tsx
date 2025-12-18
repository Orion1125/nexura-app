// src/components/AuthGuard.tsx
import React from "react";

type AuthGuardProps = {
  children: React.ReactNode;
};

// Mock AuthGuard: always allows access
export const AuthGuard = ({ children }: AuthGuardProps) => {
  return <>{children}</>;
};

// Optional: default export if you want to keep your old imports
export default AuthGuard;
