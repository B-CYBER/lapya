import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'auth' | 'form' | 'content' | 'dashboard' | 'landing' | 'full';
  className?: string;
  noPadding?: boolean;
}

const maxWidthClasses = {
  auth: 'max-w-[440px]',
  form: 'max-w-[520px]',
  content: 'max-w-[720px]',
  dashboard: 'max-w-[1120px]',
  landing: 'max-w-[1200px]',
  full: 'max-w-full'
};

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'content',
  className = '',
  noPadding = false
}) => {
  const paddingClasses = noPadding ? '' : 'px-4 sm:px-6 lg:px-8';

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
