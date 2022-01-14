import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ContainerList, Title } from "components";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Simple Todo App using React DnD" />
        <meta
          name="keywords"
          content="NextJS, Tailwind, React, React DnD, SWR, Todo App"
        />
        <meta name="language" content="English" />
        <meta name="author" content="Tony David" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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

          <p className="text-center mt-8 py-4">
            Drag and drop to reorder list (desktop Only)
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
