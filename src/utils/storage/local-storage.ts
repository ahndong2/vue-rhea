const getLocalStorage = (name: string) => {
  const item = window.localStorage.getItem(name) as string;
  return JSON.parse(item);
};

const setLocalStorage = (name:string, data:any) => {
  const strData = JSON.stringify(data);
  window.localStorage.setItem(name, strData);
};

export { getLocalStorage, setLocalStorage };
