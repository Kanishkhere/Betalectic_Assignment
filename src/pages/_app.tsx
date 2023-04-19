import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useStore, StoreProvider } from '../store/index';

export default function App({ Component, pageProps }: AppProps) {
  return (
  <StoreProvider>
  <Component {...pageProps} />
  </StoreProvider>
  )
}
