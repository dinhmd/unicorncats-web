import { Button } from "./Button";
import Image from "next/image";

import Logo from "../assets/images/cats/fly_cat.svg";

export default function Header() {
  return (
    <div className="relative">
      <div className="menu h-12 z-10 w-full items-center lg:flex fixed">
        <Image width={40} height={40} src={Logo} alt="logo" />
        <ul className="flex items-center justify-center gap-4 font-bold text-2xl">
          <li>
            <Button url="/cats">Cats</Button>
          </li>
          <li>
            <Button url="/about">About US</Button>
          </li>
        </ul>
      </div>
      <div className="h-12" />
    </div>
  );
}
