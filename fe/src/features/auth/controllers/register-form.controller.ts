import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';
import { setUser } from '../../../store/slices/user.slice';
import useAppDispatch from '../../../common/hooks/app-dispatch.hook';

export default function useRegisterForm() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const registerFormRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const passwordToggler = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const registerHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData(e.currentTarget);
        const parsedJson = {
          name: formData.get('name')!.toString(),
          email: formData.get('email')!.toString(),
          password: formData.get('password')!.toString(),
        };

        const user = await register(
          parsedJson.name,
          parsedJson.email,
          parsedJson.password
        );
        dispatch(setUser(user));
        navigate('/');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          return;
        }
        setError('Unknown error occurred!');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetHandler = useCallback(() => {
    registerFormRef.current?.reset();
    setError('');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, []);

  return {
    resetHandler,
    registerHandler,
    navigate,
    passwordToggler,
    registerFormRef,
    loading,
    error,
    showPassword,
  };
}
