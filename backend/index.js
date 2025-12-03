// index.js - BACKEND SERVER
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/Student');

// Khởi tạo Express app
const app = express();

// Middleware
app.use(cors()); // Cho phép frontend gọi API từ domain khác
app.use(express.json()); // Parse JSON request body

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('✅ Kết nối MongoDB thành công!'))
.catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// ============================================
// BÀI 1: API LẤY DANH SÁCH HỌC SINH
// ============================================
// Endpoint: GET /api/students
// Mục đích: Trả về danh sách tất cả học sinh
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách học sinh',
      error: error.message
    });
  }
});

// ============================================
// BÀI 2: API THÊM HỌC SINH MỚI
// ============================================
// Endpoint: POST /api/students
// Mục đích: Tạo học sinh mới và lưu vào database
app.post('/api/students', async (req, res) => {
  try {
    const { name, age, class: studentClass } = req.body;

    // Validate dữ liệu đầu vào
    if (!name || !age || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin (Tên, Tuổi, Lớp)'
      });
    }

    // Tạo học sinh mới
    const newStudent = new Student({
      name,
      age,
      class: studentClass
    });

    // Lưu vào database
    const savedStudent = await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Thêm học sinh thành công!',
      data: savedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm học sinh',
      error: error.message
    });
  }
});

// ============================================
// BÀI 3: API SỬA THÔNG TIN HỌC SINH
// ============================================
// Endpoint: PUT /api/students/:id
// Mục đích: Cập nhật thông tin học sinh theo ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, class: studentClass } = req.body;

    // Validate dữ liệu
    if (!name || !age || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Tìm và cập nhật học sinh
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, class: studentClass },
      { new: true, runValidators: true } // Trả về document mới và chạy validation
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học sinh'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật học sinh',
      error: error.message
    });
  }
});

// ============================================
// BÀI 4: API XÓA HỌC SINH
// ============================================
// Endpoint: DELETE /api/students/:id
// Mục đích: Xóa học sinh theo ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học sinh'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa học sinh thành công!',
      data: deletedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa học sinh',
      error: error.message
    });
  }
});

// ============================================
// ROUTE MẶC ĐỊNH (Kiểm tra server hoạt động)
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'Student Management API đang chạy!',
    endpoints: {
      getAll: 'GET /api/students',
      create: 'POST /api/students',
      update: 'PUT /api/students/:id',
      delete: 'DELETE /api/students/:id'
    }
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
