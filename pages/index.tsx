import Image from "next/image";
import type { NextPage } from "next";
import { ContainerList, Title } from "components";

const Home: NextPage = () => {
  return (
    <div className="dark:bg-slate-700 bg-white  ">
      <div className="w-full h-80 absolute  ">
        <Image
          src="/bg-desktop-dark.jpg"
          alt="background image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className=" relative min-h-[800px] sm:h-screen z-10 pt-28 ">
        <div className=" max-w-[45rem] mx-auto !w-full px-4 md:px-0  ">
          <Title />
          <ContainerList />
        </div>

        <p className="text-center mt-8 py-4">Drag and drop to reorder list</p>
      </div>
    </div>
  );
};

export default Home;
