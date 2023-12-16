import { Button, Checkbox, Divider, Input } from 'react-daisyui';
import useSignInForm from '../controllers/signin-form.controller';

export interface SignInFormProps {}

const SignInForm: React.FC<SignInFormProps> = () => {
  const {
    error,
    showPassword,
    loading,
    signInFormRef,
    passwordToggler,
    navigate,
    signInHandler,
  } = useSignInForm();

  return (
    <form
      className="flex h-full w-full max-w-lg flex-col items-center justify-center rounded-lg bg-slate-700 px-16 py-8 shadow-lg"
      ref={signInFormRef}
      onSubmit={signInHandler}
    >
      <h1 className="pb-8 text-4xl">Sign In</h1>
      <Input
        required
        className="w-full"
        bordered
        placeholder="Your email"
        name="email"
      />
      <div className="h-2" />
      <Input
        required
        className="w-full"
        bordered
        placeholder="Your password"
        name="password"
        type={showPassword ? 'text' : 'password'}
      />
      <div className="flex w-full justify-start gap-2 pt-2">
        <Checkbox checked={showPassword} onChange={passwordToggler} />
        <p>Show password?</p>
      </div>
      {error && <p className="py-1 text-red-400">{`⚠️ ${error}`}</p>}
      <div className="h-8" />
      <Button loading={loading} color="primary" fullWidth type="submit">
        Sign In
      </Button>
      <Divider className="my-2 text-xs">OR</Divider>
      <Button
        onClick={() => navigate('/register')}
        variant="outline"
        color="secondary"
        fullWidth
      >
        Register
      </Button>
    </form>
  );
};

export default SignInForm;
