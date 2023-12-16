import RegisterForm from '../features/auth/components/register-form.component';

export interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  return (
    <div className="flex h-full w-full items-center justify-center py-[5vh]">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
