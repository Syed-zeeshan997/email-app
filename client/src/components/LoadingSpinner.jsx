import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const spinner = (
    <div className={`spinner spinner-${size}`}>
      <div className="spinner-ring"></div>
    </div>
  );

  if (fullScreen) {
    return <div className="spinner-overlay">{spinner}</div>;
  }

  return spinner;
};

export default LoadingSpinner;
