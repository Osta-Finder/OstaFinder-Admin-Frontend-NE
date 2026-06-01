import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import { approveTechnician, blockTechnician } from '../store/slices/techniciansSlice';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon className="w-8 h-8" />
      </div>
    </div>
  </div>
);

const TechnicianApprovalsPage = () => {
  const dispatch = useDispatch();
  const { technicians, stats } = useSelector((state) => state.technicians);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [showModal, setShowModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);

  const filteredTechnicians = technicians.filter(tech => {
    if (activeCategory === 'الكل') return true;
    return tech.specialty.includes(activeCategory);
  });

  const columns = ['الاسم', 'التخصص', 'الخبرة', 'الحالة', 'الإجراءات'];

  const handleApprove = (id) => {
    dispatch(approveTechnician(id));
    toast.success('تم اعتماد الفني بنجاح');
    setShowModal(false);
  };

  const handleBlock = (id) => {
    dispatch(blockTechnician(id));
    toast.error('تم حظر الفني');
    setShowModal(false);
  };

  const handleViewDocuments = (tech) => {
    setSelectedTech(tech);
    setShowModal(true);
  };

  const renderRow = (tech) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {tech.avatar ? (
            <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shadow-sm">
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
        <div className="flex items-center gap-2 justify-end">
          <button 
            onClick={() => handleViewDocuments(tech)}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors"
          >
            عرض الوثائق
          </button>
          {tech.status !== 'معتمد' && tech.status !== 'محظور' && (
            <>
              <button 
                onClick={() => handleApprove(tech.id)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-lg transition-colors text-sm"
              >
                اعتماد
              </button>
              <button 
                onClick={() => handleBlock(tech.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-lg transition-colors text-sm"
              >
                حظر
              </button>
            </>
          )}
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          طلبات اعتماد الفنيين
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          مراجعة واعتماد طلبات الانضمام الجديدة للمنصة
        </p>
      </div>

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

      <div className="flex items-center justify-between">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          تصفية متقدمة
        </button>

        <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
          {['الكل', 'كهرباء', 'سباكة', 'نجارة'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Table columns={columns} data={filteredTechnicians} renderRow={renderRow} />

      {showModal && selectedTech && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">وثائق الفني</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                {selectedTech.avatar ? (
                  <img src={selectedTech.avatar} alt={selectedTech.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-2xl">
                    {selectedTech.initials}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTech.name}</h3>
                  <p className="text-gray-600">{selectedTech.specialty}</p>
                  <p className="text-sm text-gray-500">{selectedTech.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">سنوات الخبرة</p>
                  <p className="text-lg font-bold text-gray-900">{selectedTech.experience}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">الحالة</p>
                  <Badge status={selectedTech.status}>{selectedTech.status}</Badge>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">الوثائق المرفقة:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ شهادة التخصص</li>
                  <li>✓ بطاقة الهوية</li>
                  <li>✓ شهادات الخبرة</li>
                  <li>✓ تقييمات العملاء</li>
                </ul>
              </div>

              {selectedTech.status !== 'معتمد' && selectedTech.status !== 'محظور' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
                  >
                    إغلاق
                  </button>
                  <button 
                    onClick={() => handleBlock(selectedTech.id)}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    حظر
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedTech.id)}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    اعتماد
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianApprovalsPage;
