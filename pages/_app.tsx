
import '../styles/globals.scss'
import { app } from '../utils/firebase';
import { getAnalytics } from "firebase/analytics";
import type { AppProps } from 'next/app'
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      getAnalytics(app);
    }
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
