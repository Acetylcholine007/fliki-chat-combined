import { z } from 'zod';
import { ChatGroupSchema } from '../models/chat.models';

export const getExternalChatGroups = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat-group/external`,
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

  return z.array(ChatGroupSchema).parse(jsonData.data.chatGroups);
};

export const getChatGroup = async (chatGroupId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat-group/${chatGroupId}`,
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

  return ChatGroupSchema.parse(jsonData.data);
};

export const createChatGroup = async (name: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/chat-group`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name }),
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

  return ChatGroupSchema.parse(jsonData.data);
};

export const updateChatGroup = async (name: string, chatGroupId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat-group/${chatGroupId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name }),
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

  return ChatGroupSchema.parse(jsonData.data);
};

export const joinChatGroup = async (chatGroupId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat-group/join/${chatGroupId}`,
    {
      method: 'PATCH',
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

  return ChatGroupSchema.parse(jsonData.data);
};

export const leaveChatGroup = async (chatGroupId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat-group/leave/${chatGroupId}`,
    {
      method: 'PATCH',
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

  return ChatGroupSchema.parse(jsonData.data);
};

export const deleteChatGroup = async (chatGroupId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat-group/${chatGroupId}`,
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

  return ChatGroupSchema.parse(jsonData.data);
};
