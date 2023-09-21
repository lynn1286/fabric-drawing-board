declare namespace NodeJS {
  interface ProcessEnv {}
}

declare type RootLayout = {
  children: React.ReactNode;
  params: { locale: string };
};
