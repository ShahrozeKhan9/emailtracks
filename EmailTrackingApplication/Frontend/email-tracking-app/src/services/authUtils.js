const STORAGE_KEY = 'user';

export const authUtils = {
  setUser: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEY);
  },

  isDirector: () => {
    const user = authUtils.getUser();
    return user ? user.isDirector : false;
  },

  getUserId: () => {
    const user = authUtils.getUser();
    return user ? user.userId : null;
  },
};
