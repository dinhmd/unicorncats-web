import Image, { ImageProps } from "next/image";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  onClick?(): void;
  url?: string;
  className?: string | `${string}`;
  icon?: ImageProps["src"];
}

export const Button = ({ children, onClick, url, className, icon }: Props) => {
  const iconMarkup = icon ? (
    <Image width={30} height={30} src={icon} alt={""} />
  ) : null;

  const contentMarkup = url ? (
    <Link href={url} className="flex items-center gap-1">
      {children}
    </Link>
  ) : (
    children
  );

  return (
    <button
      onClick={onClick}
      className={`flex align-middle justify-center px-3 py-1 h-9 outline-none rounded-lg items-center gap-1 transition-colors ${className}`}
    >
      {iconMarkup}
      {contentMarkup}
    </button>
  );
};
