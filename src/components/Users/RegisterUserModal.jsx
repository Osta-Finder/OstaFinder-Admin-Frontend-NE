import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { addUser } from '../../store/slices/usersSlice';

const RegisterUserModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'عميل',
    status: 'نشط',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('الرجاء تعبئة الحقول المطلوبة');
      return;
    }
    
    dispatch(addUser(formData));
    toast.success('تم تسجيل المستخدم بنجاح');
    setFormData({ name: '', email: '', role: 'عميل', status: 'نشط' });
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="تسجيل مستخدم جديد">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/50 focus:border-[#A85121] outline-none"
            placeholder="أدخل اسم المستخدم"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/50 focus:border-[#A85121] outline-none"
            placeholder="example@domain.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/50 focus:border-[#A85121] outline-none"
            >
              <option value="عميل">عميل</option>
              <option value="مسؤول">مسؤول</option>
              <option value="فني">فني</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/50 focus:border-[#A85121] outline-none"
            >
              <option value="نشط">نشط</option>
              <option value="محظور">محظور</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex gap-3 justify-end border-t mt-6">
          <Button type="button" variant="outline" onClick={closeModal}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary">
            تسجيل المستخدم
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterUserModal;
