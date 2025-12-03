// models/Student.js
const mongoose = require('mongoose');

// Định nghĩa Schema cho Student
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên học sinh là bắt buộc'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Tuổi là bắt buộc'],
    min: [1, 'Tuổi phải lớn hơn 0'],
    max: [100, 'Tuổi phải nhỏ hơn 100']
  },
  class: {
    type: String,
    required: [true, 'Lớp học là bắt buộc'],
    trim: true
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Export model
module.exports = mongoose.model('Student', studentSchema);