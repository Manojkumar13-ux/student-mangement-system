import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '', studentId: '', department: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', form);
      localStorage.setItem('token', res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Student Signup</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input name="studentId" placeholder="Student ID" onChange={handleChange} required />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (min 6)" onChange={handleChange} required minLength="6" />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  error: { color: 'red' }
};
export default Signup;
