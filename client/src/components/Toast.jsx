import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import './Toast.css';

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map(({ id, message, type }) => {
        const Icon = icons[type] || FiInfo;
        return (
          <div key={id} className={`toast toast-${type}`}>
            <Icon className="toast-icon" />
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={() => removeToast(id)}>
              <FiX />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
