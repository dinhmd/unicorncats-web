"use client";

import { Button } from "@/components/Button";
import SandWich from "@/assets/images/cats/cream_sandwiches.svg";
import StrawBerry from "@/assets/images/cats/strawberry.svg";
import CoffeeCup from "@/assets/images/cats/coffee_cup.svg";
import UnicornCat from "@/assets/images/cats/unicorn_cat.svg";
import Image from "next/image";
import Banner from "@/assets/images/cats/fly_cat.svg";
import styles from "./app.module.css";
import Footer from "./Footer/Footer";
import Overlay from "./Overlay/Overlay";
import { useState } from "react";
import FlappyCatGame from "./Games/FlappyCatV2";

export default function Home() {
  const [isActiveGames, setIsActiveGames] = useState(false);

  return (
    <main className="h-[100vh] w-[100vw] overflow-hidden relative">
      <Overlay isActive={isActiveGames} onClose={() => setIsActiveGames(false)}>
        <FlappyCatGame />
      </Overlay>
      <section>
        <div className="w-full p-4 mt-10 flex items-start justify-center gap-4 relative">
          <div className="h-[420px]">
            <Image
              className={`${styles.banner} rounded-xl`}
              width={500}
              height={200}
              src={Banner}
              alt={"banner"}
            />
          </div>
          <div className="w-1/4 mt-10 flex flex-col gap-4">
            <div>
              <p className="text text-2xl font-bold">
                Welcome to the &#34;Unicorn Cat&#34; project!
              </p>
              <p className="text text-xl">
                We are proud to present a unique collection of stickers
                featuring adorable and colorful unicorn cats. Each sticker is
                meticulously designed to bring joy and happiness to users. Join
                us to experience and share this delightful collection with your
                friends and family. Together, we can spread joy and magic
                through these charming stickers! You&#39;ll love every little
                detail of each unicorn cat.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button color="primary" icon={CoffeeCup} url="/">
                Twister
              </Button>
              <Button color="primary" icon={StrawBerry} url="/">
                Telegram
              </Button>
            </div>
            <Button color="primary" icon={SandWich} url="/">
              Buy
            </Button>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            color="orange"
            onClick={() => setIsActiveGames(true)}
            icon={UnicornCat}
          >
            Play FlappyCat
          </Button>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </main>
  );
}
