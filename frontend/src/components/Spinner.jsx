const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' };
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizes[size]} rounded-full border-solid spinner-gold animate-spin`}
        style={{ borderWidth: size === 'lg' ? 3 : 2 }}
      />
    </div>
  );
};

export default Spinner;
