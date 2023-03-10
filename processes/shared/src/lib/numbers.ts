export const isBetween = (target: number, number1: number, number2: number): boolean => {
  return (number1 - target) * (number2 - target) <= 0;
};
