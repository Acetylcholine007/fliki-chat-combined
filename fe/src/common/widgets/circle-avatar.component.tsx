export interface CircleAvatarProps {
  children: React.ReactNode;
}

const CircleAvatar: React.FC<CircleAvatarProps> = (props) => {
  const { children } = props;

  return (
    <div className="flex aspect-square w-[2.25rem] items-center justify-center rounded-full bg-slate-500">
      {children}
    </div>
  );
};

export default CircleAvatar;
