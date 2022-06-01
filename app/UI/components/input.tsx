import { HTMLAttributes, InputHTMLAttributes, ReactElement } from 'react';
import { getAriaClasses } from '../aria';

type ErrorTextProps = HTMLAttributes<HTMLParagraphElement>;

export const ErrorText = ({ children, className = '', ...props }: ErrorTextProps) => (
  <p {...props} className={`text-red-500 ${className}`} role="alert">
    {children}
  </p>
);

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = '', ...props }: InputProps) => (
  <input
    {...props}
    className={`w-full p-2 border-2 border-black bg-white text-black ${getAriaClasses(true)} ${className}`}
  />
);
