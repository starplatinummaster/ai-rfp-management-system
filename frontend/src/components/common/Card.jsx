const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      onClick={onClick}
      style={{ pointerEvents: 'auto' }}
    >
      {children}
    </div>
  );
};

export default Card;
