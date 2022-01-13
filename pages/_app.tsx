import "../styles/globals.css";
import "@fontsource/josefin-sans";
import type { AppProps } from "next/app";
import axios from "axios";
import { SWRConfig } from "swr";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <DndProvider backend={HTML5Backend}>
        <SWRConfig value={{ fetcher }}>
          <Component {...pageProps} />
        </SWRConfig>
      </DndProvider>
    </ThemeProvider>
  );
}

export default MyApp;
