// App.js - FRONTEND REACT APPLICATION
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// URL của Backend API
const API_URL = 'http://localhost:5000/api/students';

function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [students, setStudents] = useState([]); // Danh sách học sinh từ database (BÀI 1)
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Form state (BÀI 2 & 3)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: ''
  });
  const [editingId, setEditingId] = useState(null); // ID của học sinh đang sửa (BÀI 3)

  // BÀI 5: State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // BÀI 6: State cho sắp xếp
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'

  // ============================================
  // BÀI 1: LẤY DANH SÁCH HỌC SINH KHI LOAD TRANG
  // ============================================
  useEffect(() => {
    fetchStudents();
  }, []); // Chạy 1 lần khi component mount

  // Hàm gọi API lấy danh sách
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data.data); // Lấy mảng students từ response
    } catch (error) {
      console.error('Lỗi khi lấy danh sách:', error);
      alert('Không thể kết nối đến server. Vui lòng kiểm tra backend!');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // BÀI 2: THÊM HỌC SINH MỚI
  // ============================================
  const handleAddStudent = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.age || !formData.class) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const response = await axios.post(API_URL, formData);

      // Cập nhật danh sách ngay lập tức (không cần reload)
      setStudents([response.data.data, ...students]);

      // Reset form
      setFormData({ name: '', age: '', class: '' });

      alert('✅ Thêm học sinh thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm học sinh:', error);
      alert('❌ Lỗi khi thêm học sinh!');
    }
  };

  // ============================================
  // BÀI 3: SỬA THÔNG TIN HỌC SINH
  // ============================================
  // Hàm load dữ liệu vào form để sửa
  const handleEditClick = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      age: student.age,
      class: student.class
    });
    // Scroll lên form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hàm gửi request cập nhật
  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.class) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${editingId}`, formData);

      // Cập nhật danh sách ngay lập tức
      setStudents(students.map(student =>
        student._id === editingId ? response.data.data : student
      ));

      // Reset form và trạng thái edit
      setFormData({ name: '', age: '', class: '' });
      setEditingId(null);

      alert('✅ Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('❌ Lỗi khi cập nhật học sinh!');
    }
  };

  // Hàm hủy sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', age: '', class: '' });
  };

  // ============================================
  // BÀI 4: XÓA HỌC SINH
  // ============================================
  const handleDeleteStudent = async (id, name) => {
    // Xác nhận trước khi xóa
    const confirmed = window.confirm(`Bạn có chắc muốn xóa học sinh "${name}"?`);

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      // Cập nhật danh sách ngay lập tức (loại bỏ student đã xóa)
      setStudents(students.filter(student => student._id !== id));

      alert('✅ Xóa học sinh thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('❌ Lỗi khi xóa học sinh!');
    }
  };

  // ============================================
  // BÀI 5: TÌM KIẾM HỌC SINH (CLIENT-SIDE)
  // ============================================
  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================
  // BÀI 6: SẮP XẾP THEO TÊN (CLIENT-SIDE)
  // ============================================
  // Sắp xếp danh sách đã lọc
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name); // A-Z
    } else {
      return b.name.localeCompare(a.name); // Z-A
    }
  });

  // Hàm đảo chiều sắp xếp
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // ============================================
  // RENDER GIAO DIỆN
  // ============================================
  return (
    <div className="App">
      {/* HEADER */}
      <header className="app-header">
        <h1>🎓 QUẢN LÝ HỌC SINH</h1>
        <p>Ứng dụng quản lý thông tin học sinh - MERN Stack</p>
      </header>

      <div className="app-container">
        {/* ============================================
            BÀI 2: FORM THÊM/SỬA HỌC SINH
            ============================================ */}
        <div className="student-form">
          <h2>{editingId ? '✏️ Sửa Thông Tin Học Sinh' : '➕ Thêm Học Sinh Mới'}</h2>
          <form onSubmit={editingId ? handleUpdateStudent : handleAddStudent}>
            <div className="form-row">
              <div className="form-group">
                <label>Tên học sinh *</label>
                <input
                  type="text"
                  placeholder="Nhập tên học sinh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tuổi *</label>
                <input
                  type="number"
                  placeholder="Nhập tuổi"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="1"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Lớp *</label>
                <input
                  type="text"
                  placeholder="Nhập lớp (VD: 10A1)"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? '💾 Cập Nhật' : '➕ Thêm Học Sinh'}
              </button>

              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                  ❌ Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ============================================
            BÀI 5: TÌM KIẾM & BÀI 6: SẮP XẾP
            ============================================ */}
        <div className="search-sort-section">
          {/* BÀI 5: Ô tìm kiếm */}
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* BÀI 6: Nút sắp xếp */}
          <button className="btn-sort" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? '⬆️ Sắp xếp A-Z' : '⬇️ Sắp xếp Z-A'}
          </button>
        </div>

        {/* ============================================
            BÀI 1: HIỂN THỊ DANH SÁCH HỌC SINH
            ============================================ */}
        <div className="student-list">
          <h2>📋 Danh Sách Học Sinh</h2>
          <p className="student-count">
            Tổng số: <strong>{sortedStudents.length}</strong> học sinh
            {searchTerm && ` (Kết quả tìm kiếm cho "${searchTerm}")`}
          </p>
          {loading ? (
            <div className="loading">⏳ Đang tải dữ liệu...</div>
          ) : sortedStudents.length === 0 ? (
            <div className="empty-state">
              {searchTerm
                ? `Không tìm thấy học sinh nào với từ khóa "${searchTerm}"`
                : 'Chưa có học sinh nào. Hãy thêm học sinh mới!'}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Học Sinh</th>
                  <th>Tuổi</th>
                  <th>Lớp</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.age}</td>
                    <td>{student.class}</td>
                    <td>
                      <div className="action-buttons">
                        {/* BÀI 3: Nút Sửa */}
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(student)}
                        >
                          ✏️ Sửa
                        </button>

                        {/* BÀI 4: Nút Xóa */}
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteStudent(student._id, student.name)}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;