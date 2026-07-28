import { useState, useRef } from 'react';
import { FiUpload, FiPaperclip } from 'react-icons/fi';
import { emailService } from '../services';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/helpers';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const Compose = () => {
  const [form, setForm] = useState({ receiver: '', subject: '', message: '' });
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const { toast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.receiver) newErrors.receiver = 'Recipient is required';
    else if (!validateEmail(form.receiver)) newErrors.receiver = 'Invalid email';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('receiver', form.receiver);
      formData.append('subject', form.subject);
      formData.append('message', form.message);
      if (attachment) formData.append('attachment', attachment);

      await emailService.sendEmail(formData);
      toast.success('Email sent successfully!');
      setForm({ receiver: '', subject: '', message: '' });
      setAttachment(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Compose">
      <div className="page-header">
        <h1>Compose Email</h1>
        <p>Send an email to anyone</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">To</label>
            <input
              type="email"
              name="receiver"
              className="form-input"
              placeholder="recipient@example.com"
              value={form.receiver}
              onChange={handleChange}
            />
            {errors.receiver && <p className="form-error">{errors.receiver}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="subject"
              className="form-input"
              placeholder="Email subject"
              value={form.subject}
              onChange={handleChange}
            />
            {errors.subject && <p className="form-error">{errors.subject}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              className="form-textarea"
              placeholder="Write your message here..."
              rows={10}
              value={form.message}
              onChange={handleChange}
            />
            {errors.message && <p className="form-error">{errors.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Attachment</label>
            <div className="file-upload" onClick={() => fileRef.current?.click()}>
              <input type="file" ref={fileRef} onChange={handleFileChange} />
              <FiPaperclip style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
              <p className="file-upload-label">
                {attachment ? attachment.name : 'Click to attach a file (max 5MB)'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : <><FiUpload /> Send Email</>}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Compose;
