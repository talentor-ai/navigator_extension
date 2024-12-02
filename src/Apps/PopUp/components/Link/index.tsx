import { CustomizableComponent } from '@popup:models/default.components';

interface LinkProps extends CustomizableComponent {
  href: string;
  children?: React.ReactNode;
  target?: string;
  rel?: string;
}

const Link = ({ href, children, ...extra }: LinkProps) => {
  return (
    <a className="text-infoColor underline" href={href} {...extra}>
      {children}
    </a>
  );
};

export default Link;
