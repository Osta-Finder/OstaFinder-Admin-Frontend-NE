import { useState, useEffect } from 'react';
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
import { workerAPI, categoryAPI } from '../services/adminApi';

const StatCard = ({ title, value, icon: Icon, colorClass, loading }) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
          {loading ? '...' : value}
        </h3>
      </div>
      <div className={`p-4 rounded-2xl ${colorClass} shadow-sm border group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  </div>
);

const TechnicianApprovalsPage = () => {
  const [technicians, setTechnicians] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approvedToday: 0,
    urgent: 0,
  });
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [showModal, setShowModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  // Load pending technicians on mount
  useEffect(() => {
    loadTechnicians();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      // data is already the array (interceptor returns response.data => { success, count, data: [...] })
      setCategories(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      const [pendingData, allWorkersRes] = await Promise.all([
        workerAPI.getPendingWorkers(),
        workerAPI.getAllWorkers({ limit: 1000 }),
      ]);

      // httpClient interceptor returns response.data => { success, results, data: [...] }
      const allWorkers = Array.isArray(allWorkersRes) ? allWorkersRes : (allWorkersRes?.data || []);

      // Map pending workers to component format
      const formatted = pendingData.map(worker => ({
        id: worker._id,
        name: worker.name || 'بدون اسم',
        email: worker.email || '',
        phoneNumber: worker.phoneNumber || '',
        specialty: worker.category?.name || 'غير محدد',
        experience: worker.yearsOfExperience ? `${worker.yearsOfExperience} سنوات` : 'غير محدد',
        status: 'قيد المراجعة',
        bio: worker.bio || '',
        nationalId: worker.nationalId || '',
        certificates: worker.certificates || [],
        city: worker.city || '',
        address: worker.address || '',
        profilePicture: worker.profilePicture || worker.image || null,
        approvalStatus: worker.approvalStatus,
        createdAt: worker.createdAt,
        initials: worker.name ? worker.name.substring(0, 2).toUpperCase() : 'WK',
      }));

      setTechnicians(formatted);

      // حساب "تم الاعتماد اليوم" من كل الـ workers
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const approvedToday = allWorkers.filter(w => {
        if (w.approvalStatus !== 'approved' || !w.approvedAt) return false;
        const approvedDate = new Date(w.approvedAt);
        approvedDate.setHours(0, 0, 0, 0);
        return approvedDate.getTime() === today.getTime();
      }).length;

      // حساب "طلبات عاجلة" — pending من أكثر من 3 أيام
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const urgent = pendingData.filter(w => {
        return w.createdAt && new Date(w.createdAt) < threeDaysAgo;
      }).length;

      setStats({ pending: formatted.length, approvedToday, urgent });
    } catch (error) {
      console.error('Error loading technicians:', error);
      toast.error('فشل تحميل الفنيين');
    } finally {
      setLoading(false);
    }
  };


  const filteredTechnicians = technicians.filter(tech => {
    if (activeCategory === 'الكل') return true;
    return tech.specialty.includes(activeCategory);
  });

  const handleApprove = async (tech) => {
    try {
      setApproving(true);
      await workerAPI.updateWorkerApproval(tech.id, 'approved');
      toast.success('تم اعتماد الفني بنجاح');
      setTechnicians(prev => prev.filter(t => t.id !== tech.id));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approvedToday: prev.approvedToday + 1,
        urgent: tech.createdAt && new Date(tech.createdAt) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          ? prev.urgent - 1
          : prev.urgent,
      }));
      setShowModal(false);
    } catch (error) {
      console.error('Error approving technician:', error);
      toast.error('فشل اعتماد الفني');
    } finally {
      setApproving(false);
    }
  };

  const handleBlock = async (tech) => {
    try {
      setApproving(true);
      await workerAPI.updateWorkerApproval(tech.id, 'rejected');
      toast.success('تم رفض الفني');
      setTechnicians(prev => prev.filter(t => t.id !== tech.id));
      setStats(prev => ({ ...prev, pending: prev.pending - 1 }));
      setShowModal(false);
    } catch (error) {
      console.error('Error blocking technician:', error);
      toast.error('فشل رفض الفني');
    } finally {
      setApproving(false);
    }
  };

  const handleViewDocuments = (tech) => {
    setSelectedTech(tech);
    setShowModal(true);
  };

  const renderRow = (tech) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {tech.profilePicture ? (
            <img src={tech.profilePicture} alt={tech.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
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
            عرض التفاصيل
          </button>
          {tech.status !== 'معتمد' && tech.status !== 'محظور' && (
            <>
              <button 
                onClick={() => handleApprove(tech)}
                disabled={approving}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold px-3 py-1 rounded-lg transition-colors text-sm"
              >
                {approving ? '...' : 'اعتماد'}
              </button>
              <button 
                onClick={() => handleBlock(tech)}
                disabled={approving}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold px-3 py-1 rounded-lg transition-colors text-sm"
              >
                {approving ? '...' : 'حظر'}
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">جاري التحميل...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="إجمالي الطلبات المعلقة" 
              value={stats.pending} 
              icon={ClipboardDocumentListIcon} 
              colorClass="bg-orange-50 text-orange-500"
              loading={loading}
            />
            <StatCard 
              title="تم الاعتماد اليوم" 
              value={stats.approvedToday} 
              icon={CheckCircleIcon} 
              colorClass="bg-green-50 text-green-500"
              loading={loading}
            />
            <StatCard 
              title="طلبات عاجلة للمراجعة" 
              value={stats.urgent} 
              icon={ExclamationCircleIcon} 
              colorClass="bg-red-50 text-red-500"
              loading={loading}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">تصفية حسب التخصص:</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <button 
                onClick={() => setActiveCategory('الكل')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeCategory === 'الكل' ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                الكل
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat._id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeCategory === cat.name ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {technicians.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد طلبات انتظار حالياً</p>
            </div>
          ) : (
            <Table columns={['الاسم', 'التخصص', 'الخبرة', 'الحالة', 'الإجراءات']} data={filteredTechnicians} renderRow={renderRow} />
          )}
        </>
      )}

      {showModal && selectedTech && (
        <div className="modal-overlay">
          <div className="modal-content !max-w-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-50 border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الفني</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                {selectedTech.profilePicture ? (
                  <img src={selectedTech.profilePicture} alt={selectedTech.name} className="w-20 h-20 rounded-full object-cover shadow" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-2xl shadow">
                    {selectedTech.initials}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTech.name}</h3>
                  <p className="text-gray-600">{selectedTech.specialty}</p>
                  <p className="text-sm text-gray-500">{selectedTech.email}</p>
                  {selectedTech.phoneNumber && (
                    <p className="text-sm text-gray-500">{selectedTech.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">سنوات الخبرة</p>
                  <p className="text-lg font-bold text-gray-900">{selectedTech.experience}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">الحالة</p>
                  <Badge status={selectedTech.status}>{selectedTech.status}</Badge>
                </div>
                {selectedTech.city && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">المدينة</p>
                    <p className="font-semibold text-gray-800">{selectedTech.city}</p>
                  </div>
                )}
                {selectedTech.address && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">العنوان</p>
                    <p className="font-semibold text-gray-800">{selectedTech.address}</p>
                  </div>
                )}
                {selectedTech.nationalId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">رقم الهوية الوطنية</p>
                    <p className="font-semibold text-gray-800">{selectedTech.nationalId}</p>
                  </div>
                )}
                {selectedTech.createdAt && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">تاريخ التسجيل</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedTech.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                )}
              </div>

              {/* Bio */}
              {selectedTech.bio && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">نبذة شخصية</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{selectedTech.bio}</p>
                </div>
              )}

              {/* Certificates */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-3">الوثائق المرفقة</h4>
                {selectedTech.certificates && selectedTech.certificates.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTech.certificates.map((cert, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {cert.startsWith('http') ? (
                          <a
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-700 hover:underline flex items-center gap-1"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            وثيقة {i + 1} — عرض
                          </a>
                        ) : (
                          <span className="text-sm text-blue-800 flex items-center gap-1">
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            {cert}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-700">لا توجد وثائق مرفقة</p>
                )}
              </div>

              {/* Actions */}
              {selectedTech.status !== 'معتمد' && selectedTech.status !== 'محظور' && (
                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors text-sm"
                  >
                    إغلاق
                  </button>
                  <button
                    onClick={() => handleBlock(selectedTech)}
                    disabled={approving}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    {approving ? 'جاري...' : 'حظر'}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedTech)}
                    disabled={approving}
                    className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm shadow-sm"
                  >
                    {approving ? 'جاري...' : 'اعتماد'}
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
