import { HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const H1 = ({ children, className = '', ...props }: HeadingProps) => (
  <h1 {...props} className={`dark:text-primaryDark text-primary text-xl md:text-2xl lg:text-3xl ${className}`}>
    {children}
  </h1>
);

export const H2 = ({ children, className = '', ...props }: HeadingProps) => (
  <h2 {...props} className={`dark:text-primaryDark text-primary text-xl md:text-2xl lg:text-3xl ${className}`}>
    {children}
  </h2>
);

export const H3 = ({ children, className = '', ...props }: HeadingProps) => (
  <h3 {...props} className={`dark:text-primaryDark text-primary text-lg md:text-xl lg:text-2xl ${className}`}>
    {children}
  </h3>
);
