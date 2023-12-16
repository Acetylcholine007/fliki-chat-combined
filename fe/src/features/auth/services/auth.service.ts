import { UserSchema } from '../models/auth.models';

export const getUserData = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/user-data`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    }
  );
  const jsonData = await response.json();
  if (!response.ok)
    throw new Error(
      jsonData.data
        ? Object.values(JSON.parse(jsonData.data))
            .map((value) => (value as any).msg)
            .join(',')
        : jsonData.message
    );

  return UserSchema.parse(jsonData.data);
};

export const signIn = async (email: string, password: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ email, password }),
  });
  const jsonData = await response.json();
  if (!response.ok)
    throw new Error(
      jsonData.data
        ? Object.values(JSON.parse(jsonData.data))
            .map((value) => (value as any).msg)
            .join(',')
        : jsonData.message
    );

  localStorage.setItem('token', jsonData.data.token);
  return UserSchema.parse(jsonData.data.user);
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name, email, password }),
    }
  );
  const jsonData = await response.json();
  if (!response.ok)
    throw new Error(
      jsonData.data
        ? Object.values(JSON.parse(jsonData.data))
            .map((value) => (value as any).msg)
            .join(',')
        : jsonData.message
    );

  localStorage.setItem('token', jsonData.data.token);
  return UserSchema.parse(jsonData.data.user);
};
