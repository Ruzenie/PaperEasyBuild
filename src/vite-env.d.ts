/// <reference types="vite/client" />

// Allow importing image assets (e.g. import logo from './logo.svg')
declare module "*.svg" {
  const src: string;
  export default src;
}

