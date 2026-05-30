import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import RegisterUserModal from '../components/Users/RegisterUserModal';
import { deleteUser, toggleUserStatus } from '../store/slices/usersSlice';

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) => 
    user.name.includes(searchTerm) || 
    user.email.includes(searchTerm) || 
    user.id.includes(searchTerm)
  );

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    toast.info('تم حذف المستخدم');
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleUserStatus(id));
    toast.success('تم تحديث حالة المستخدم');
  };

  const columns = ['رقم المستخدم', 'الاسم', 'البريد الإلكتروني', 'الدور', 'الحالة', 'تاريخ التسجيل', 'إجراءات'];

  const renderRow = (user) => (
    <>
      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">#{user.id}</td>
      <td className="px-6 py-4 font-bold text-gray-900">{user.name}</td>
      <td className="px-6 py-4 text-gray-500">{user.email}</td>
      <td className="px-6 py-4">{user.role}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'نشط' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-500">{user.date}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleToggleStatus(user.id)}
            className="text-gray-400 hover:text-[#A85121] transition-colors"
            title={user.status === 'نشط' ? 'حظر المستخدم' : 'تنشيط المستخدم'}
          >
            {user.status === 'نشط' ? <NoSymbolIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5 text-green-600" />}
          </button>
          <button 
            onClick={() => handleDelete(user.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="حذف المستخدم"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة المستخدمين</h1>
          <p className="text-sm text-gray-500">إدارة حسابات المستخدمين وإضافة مستخدمين جدد.</p>
        </div>
        <Button variant="primary" className="bg-[#A85121] hover:bg-[#8B431B]" onClick={() => setIsModalOpen(true)}>
          <UserPlusIcon className="w-5 h-5" />
          إضافة مستخدم جديد
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <div className="relative flex-1 max-w-md ml-auto">
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم المستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-full py-2 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#A85121]/50 shadow-sm"
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <Table columns={columns} data={filteredUsers} renderRow={renderRow} />

      <RegisterUserModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UsersPage;
