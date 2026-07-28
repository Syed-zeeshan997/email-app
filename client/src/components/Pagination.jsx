import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.css';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const nums = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <FiChevronLeft />
      </button>
      {getPageNumbers().map((num) => (
        <button
          key={num}
          className={`pagination-btn ${num === page ? 'active' : ''}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="pagination-btn"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
