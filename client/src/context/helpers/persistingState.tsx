
const addToLocalStorage = (user: string, token: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", user);
};

//for logging out
const removeLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  
  return { user, token };
};

export { addToLocalStorage, removeLocalStorage, getFromLocalStorage };
