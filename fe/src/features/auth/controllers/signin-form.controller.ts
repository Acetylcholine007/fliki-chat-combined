import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/auth.service';
import useAppDispatch from '../../../common/hooks/app-dispatch.hook';
import { setUser } from '../../../store/slices/user.slice';

export default function useSignInForm() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const signInFormRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const passwordToggler = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const signInHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData(e.currentTarget);
        const parsedJson = {
          email: formData.get('email')!.toString(),
          password: formData.get('password')!.toString(),
        };

        const user = await signIn(parsedJson.email, parsedJson.password);
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
    [dispatch]
  );

  const resetHandler = useCallback(() => {
    signInFormRef.current?.reset();
    setError('');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, []);

  return {
    resetHandler,
    signInHandler,
    navigate,
    passwordToggler,
    signInFormRef,
    loading,
    error,
    showPassword,
  };
}
