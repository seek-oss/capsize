/// <reference types="vite/client" />

// https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md
declare module '*.png?quality=100' {
  const src: string;
  export default src;
}
declare module '*.png?w=512' {
  const src: string;
  export default src;
}
declare module '*.png?w=512&quality=100' {
  const src: string;
  export default src;
}
