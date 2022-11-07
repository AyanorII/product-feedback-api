export const toUpperSnakeCase = (str: string) => {
  return str.replace(/[^a-zA-Z]/, '_').toUpperCase();
};

export const randomIndex = (arr: any[]) => {
  return Math.floor(Math.random() * arr.length);
};
