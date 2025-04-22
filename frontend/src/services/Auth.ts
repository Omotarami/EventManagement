export type SignupInput = {
  fullname: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export const signupOrganizer = async (data: SignupInput) => {
  try {
    const res = await fetch('http://localhost:8080/api/auth/organizer/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Signup failed');
    }

    const responseData = await res.json();
    return responseData; // contains token or user info depending on your backend
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signupUser = async (data: SignupInput) => {
  try {
    const res = await fetch('http://localhost:8080/api/auth/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Signup failed');
    }

    const responseData = await res.json();
    return responseData; // contains token or user info depending on your backend
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Frontend login function
export const login = async (data) => {
  try {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    const responseData = await res.json();

    // Store token and user data in localStorage
    localStorage.setItem('token', responseData.token);
    localStorage.setItem('user', JSON.stringify(responseData.user));

    return responseData;
  } catch (error) {
    throw new Error(error.message);
  }
};

