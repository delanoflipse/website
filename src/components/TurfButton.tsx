type TurfButtonProps = Readonly<{
  children: React.ReactNode;
  onClick: () => void;
}>;

export const TurfButton = ({ children, onClick }: TurfButtonProps) => {
  return (
    <button
      className={`p-2 px-8 shadow-sm font-bold border-black border-[3px] hover:bg-black hover:text-white text-xl`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
