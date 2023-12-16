import SignInForm from '../features/auth/components/signin-form.component';

export interface SignInPageProps {}

const SignInPage: React.FC<SignInPageProps> = () => {
  return (
    <div className="flex h-full w-full items-center justify-center py-[5vh]">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
