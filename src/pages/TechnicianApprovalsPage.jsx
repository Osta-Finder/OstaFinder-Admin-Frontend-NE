import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import { approveTechnician, blockTechnician } from '../store/slices/techniciansSlice';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-3xl p-6 border border-[#F2DECF] flex items-center justify-between shadow-sm">
    <div className={`p-4 rounded-full ${colorClass}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div className="text-left" dir="rtl">
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-[#A85121]">{value}</h3>
    </div>
  </div>
);

const TechnicianApprovalsPage = () => {
  const dispatch = useDispatch();
  const { technicians, stats } = useSelector((state) => state.technicians);
  
  const [activeCategory, setActiveCategory] = useState('الكل');

  const filteredTechnicians = technicians.filter(tech => {
    if (activeCategory === 'الكل') return true;
    return tech.specialty.includes(activeCategory);
  });

  const columns = ['الاسم', 'التخصص', 'الخبرة', 'الحالة', 'الإجراءات'];

  const handleApprove = (id) => {
    dispatch(approveTechnician(id));
    toast.success(`تم اعتماد الفني بنجاح`);
  };

  const handleBlock = (id) => {
    dispatch(blockTechnician(id));
    toast.error(`تم حظر الفني`);
  };

  const renderRow = (tech) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {tech.avatar ? (
            <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
              {tech.initials}
            </div>
          )}
          <div>
            <div className="font-bold text-gray-900">{tech.name}</div>
            <div className="text-xs text-gray-500">{tech.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-700">{tech.specialty}</td>
      <td className="px-6 py-4 text-gray-500">{tech.experience}</td>
      <td className="px-6 py-4">
        <Badge status={tech.status}>{tech.status}</Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3 justify-end">
          <button className="text-[#E56E24] hover:text-[#d46520] font-medium text-sm underline underline-offset-4 decoration-2 decoration-[#E56E24]/30">
            عرض الوثائق
          </button>
          {tech.status !== 'معتمد' && tech.status !== 'محظور' && (
            <>
              <Button 
                variant="primary" 
                className="!px-6 !py-1.5 shadow-md shadow-[#E56E24]/20"
                onClick={() => handleApprove(tech.id)}
              >
                اعتماد
              </Button>
              <Button 
                variant="outline" 
                className="!px-4 !py-1.5 rounded-xl border-gray-300"
                onClick={() => handleBlock(tech.id)}
              >
                حظر
              </Button>
            </>
          )}
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">طلبات اعتماد الفنيين</h1>
        <p className="text-sm text-gray-500">مراجعة واعتماد طلبات الانضمام الجديدة للمنصة.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="إجمالي الطلبات المعلقة" 
          value={stats.pending} 
          icon={ClipboardDocumentListIcon} 
          colorClass="bg-orange-50 text-orange-500" 
        />
        <StatCard 
          title="تم الاعتماد اليوم" 
          value={stats.approvedToday} 
          icon={CheckCircleIcon} 
          colorClass="bg-green-50 text-green-500" 
        />
        <StatCard 
          title="طلبات عاجلة للمراجعة" 
          value={stats.urgent} 
          icon={ExclamationCircleIcon} 
          colorClass="bg-red-50 text-red-500" 
        />
      </div>

      {/* Filters section */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="text-sm border-gray-200 shadow-sm !text-[#E56E24]">
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          تصفية متقدمة
        </Button>

        <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
          {['الكل', 'كهرباء', 'سباكة'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={filteredTechnicians} renderRow={renderRow} />
    </div>
  );
};

export default TechnicianApprovalsPage;
