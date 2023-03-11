export const isElectron = (): boolean => {
  const userAgent = navigator.userAgent.toLocaleLowerCase();
  return userAgent.includes( ' electron/' );
};
