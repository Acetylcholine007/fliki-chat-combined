import { z } from 'zod';
import { ChatSchema } from '../models/chat.models';

export const getChats = async (chatGroupId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat?chatGroupId=${chatGroupId}`,
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

  return z.array(ChatSchema).parse(jsonData.data);
};

export const createChat = async (message: string, chatGroupId: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ message, chatGroupId }),
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

  return ChatSchema.parse(jsonData.data);
};

export const deleteChat = async (chatId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat/${chatId}`,
    {
      method: 'DELETE',
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

  return ChatSchema.parse(jsonData.data);
};
