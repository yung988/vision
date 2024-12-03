declare module '@studio-freight/react-lenis' {
  import { ReactNode } from 'react';

  interface LenisProps {
    children: ReactNode;
    root?: boolean;
    options?: any;
  }

  export const ReactLenis: React.FC<LenisProps>;
} 