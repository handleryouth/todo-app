import { useTheme } from "next-themes";
import Image from "next/image";

const Title = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-between mb-20 items-center  ">
      <h1 className="text-6xl text-white ">TODO</h1>
      <Image
        src={`${theme === "dark" ? "/icon-sun.svg" : "/icon-moon.svg"}`}
        alt="change theme"
        layout="fixed"
        width={25}
        height={25}
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      />
    </div>
  );
};

export default Title;
