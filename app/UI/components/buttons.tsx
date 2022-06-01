import { Link, LinkProps } from '@remix-run/react';
import { ButtonHTMLAttributes } from 'react';
import { getAriaClasses } from '../aria';
import { SpinnerSvg } from '../icons/spinner';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isPrimary?: boolean;
  isLoading?: boolean;
};

export const Button = ({ isPrimary = false, isLoading = false, children, className = '', ...props }: ButtonProps) => (
  <button
    {...props}
    disabled={isLoading}
    className={`text-lg ${getAriaClasses(true)} p-2 border-2 border-black ${
      isPrimary ? 'bg-primary dark:bg-primaryDark text-white dark:text-black' : 'bg-secondary text-white'
    } ${className}`}
  >
    <div className="flex items-center justify-center">{isLoading ? <SpinnerSvg className="w-7 h-7" /> : children}</div>
  </button>
);

type ButtonLinkProps = LinkProps & {
  isPrimary?: boolean;
};

export const ButtonLink = ({ isPrimary = false, children, className = '', ...props }: ButtonLinkProps) => (
  <div>
    <Link
      {...props}
      className={`text-lg ${getAriaClasses(true)} p-2 border-2 border-black ${
        isPrimary ? 'bg-primary dark:bg-primaryDark text-white dark:text-black' : 'bg-secondary text-white'
      } ${className}`}
    >
      {children}
    </Link>
  </div>
);
