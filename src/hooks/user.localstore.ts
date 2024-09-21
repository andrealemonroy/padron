interface User {
    id: string;
    email: string;
    name: string;
    token: string;
  }
  
  export const saveUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getUser = (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  export const removeUser = () => {
    localStorage.removeItem('user');
  };

  export const signOut = () => {
    // Sign out logic
    localStorage.removeItem('user');
  };
  
  export const refreshToken = async () => {
    // Refresh token logic
  };