import { Public } from '@/providers/public.provider';
import { ReactNode } from 'react';

const landingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Public>
      <div className='min-h-screen flex flex-col'>
        <main className='flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-auto'>
          {children}
        </main>
      </div>
    </Public>
  );
};

export default landingLayout;
