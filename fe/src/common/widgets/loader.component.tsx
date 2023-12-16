import { Loading } from 'react-daisyui';

export interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loading variant="spinner" size="lg" />
    </div>
  );
};

export default Loader;
