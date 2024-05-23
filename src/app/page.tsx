"use client";

import { Button } from "@/components/Button";
import SandWich from "@/assets/images/cream_sandwiches.svg";
import StrawBerry from "@/assets/images/strawberry.svg";
import CoffeeCup from "@/assets/images/coffee_cup.svg";
import Image from "next/image";
import Banner from "@/assets/images/fly_cat.svg";
import styles from "./app.module.css";
import Footer from "./Footer";

export default function Home() {
  return (
    <main className="h-[100vh] w-[100vw] overflow-hidden">
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
              <Button
                className="bg-pink-500 hover:bg-pink-400 active:bg-pink-500"
                icon={CoffeeCup}
                url="/"
              >
                Twister
              </Button>
              <Button
                className="bg-pink-500 hover:bg-pink-400 active:bg-pink-500"
                icon={StrawBerry}
                url="/"
              >
                Telegram
              </Button>
            </div>
            <Button
              className="bg-pink-500 hover:bg-pink-400 active:bg-pink-500"
              icon={SandWich}
              url="/"
            >
              Buy
            </Button>
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </main>
  );
}
