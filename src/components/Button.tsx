import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export type ButtonColor = "primary" | "orange";

interface Props {
  children: React.ReactNode;
  onClick?(): void;
  url?: string;
  className?: string | `${string}`;
  icon?: ImageProps["src"];
  color?: ButtonColor;
}

export const Button = ({
  children,
  onClick,
  url,
  className,
  icon,
  color,
}: Props) => {
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

  const colorClass = useMemo(() => {
    let className = "";
    switch (color) {
      case "primary":
        className = "bg-pink-500 hover:bg-pink-400 active:bg-pink-500";
        break;
      case "orange":
        className = "bg-orange-500 hover:bg-orange-400 active:bg-orange-500";
        break;
      default:
        break;
    }
    return className;
  }, [color]);

  return (
    <button
      onClick={onClick}
      className={`flex align-middle justify-center px-3 py-1 h-9 outline-none rounded-lg items-center gap-1 transition-colors ${className} ${colorClass}`}
    >
      {iconMarkup}
      {contentMarkup}
    </button>
  );
};
