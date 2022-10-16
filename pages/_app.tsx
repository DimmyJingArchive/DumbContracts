import "styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import hljs from "highlight.js";
import hljsDefineSolidity from "highlightjs-solidity";
import "node_modules/highlight.js/styles/tokyo-night-dark.css";
config.autoAddCss = false;

hljsDefineSolidity(hljs);

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Head>
        <title>DumbContracts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
};
export default MyApp;
