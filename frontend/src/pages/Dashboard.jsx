import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', studentId: '', department: '', phone: '' });

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const res = await api.get('/students');
      if (res.data.status === 'success') setStudents(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    const url = editingStudent ? `/students/${editingStudent.id}` : '/students';
    const method = editingStudent ? 'PUT' : 'POST';
    try {
      const res = await api({ method, url, data: formData });
      if (res.data.status === 'success') {
        await fetchStudents();
        setShowForm(false);
        setEditingStudent(null);
        setFormData({ fullName: '', studentId: '', department: '', phone: '' });
      }
    } catch {}
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch {}
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      studentId: student.studentId,
      department: student.department,
      phone: student.phone || ''
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
              <p className="text-gray-500">Manage all students in the system</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowForm(!showForm); setEditingStudent(null); setFormData({ fullName: '', studentId: '', department: '', phone: '' }); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {showForm ? 'Cancel' : '+ Add Student'}
              </button>
              <button onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
                Logout
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
              <h3 className="text-xl font-semibold mb-4">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <form onSubmit={handleSubmitStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                <input placeholder="Student ID" value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                <input placeholder="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button type="submit"
                  className="col-span-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition font-semibold">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-400 text-lg">No students registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-600">ID</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Name</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Department</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">{s.studentId}</td>
                      <td className="p-3">{s.fullName}</td>
                      <td className="p-3">{s.department}</td>
                      <td className="p-3">
                        <button onClick={() => handleEditStudent(s)}
                          className="text-blue-600 hover:underline mr-3 font-medium">Edit</button>
                        <button onClick={() => handleDeleteStudent(s.id)}
                          className="text-red-600 hover:underline font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
