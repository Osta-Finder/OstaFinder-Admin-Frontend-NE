import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { categoryAPI } from '../services/adminApi';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    icon: '🔧',
  });
  const [editService, setEditService] = useState({
    name: '',
    icon: '🔧',
  });

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await categoryAPI.getCategories();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('فشل تحميل الخدمات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.name) {
      toast.error('يرجى ملء اسم الخدمة');
      return;
    }

    try {
      await categoryAPI.createCategory({
        name: newService.name,
        icon: newService.icon,
      });
      setNewService({ name: '', icon: '🔧' });
      setShowAddModal(false);
      toast.success('تم إضافة الخدمة بنجاح');
      loadServices();
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('فشل إضافة الخدمة');
    }
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleEditClick = () => {
    setEditService({
      name: selectedService.name,
      icon: selectedService.icon || '🔧',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editService.name) {
      toast.error('يرجى ملء اسم الخدمة');
      return;
    }

    try {
      await categoryAPI.updateCategory(selectedService._id, {
        name: editService.name,
        icon: editService.icon,
      });
      setSelectedService({
        ...selectedService,
        name: editService.name,
        icon: editService.icon,
      });
      setShowEditModal(false);
      toast.success('تم تحديث الخدمة بنجاح');
      loadServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('فشل تحديث الخدمة');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      try {
        await categoryAPI.deleteCategory(serviceId);
        setSelectedService(null);
        toast.success('تم حذف الخدمة بنجاح');
        loadServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('فشل حذف الخدمة');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          الخدمات
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          إدارة وعرض جميع الخدمات المتاحة
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 
                           transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-4xl">{service.icon || '🔧'}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      service.isActive !== false
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {service.isActive !== false ? 'نشط' : 'معطل'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 text-right">
                  {service.name}
                </h3>

                <button 
                  onClick={() => handleViewDetails(service)}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 
                                  text-white font-semibold rounded-lg transition-all 
                                  duration-200 transform hover:scale-105">
                  عرض التفاصيل
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white 
                              font-semibold rounded-full transition-all duration-200 
                              transform hover:scale-105 shadow-md">
              + إضافة خدمة جديدة
            </button>
          </div>
        </>
      )}

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedService.icon || '🔧'}</span>
                <div>
                  <p className="text-sm text-gray-600">الحالة</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {selectedService.isActive !== false ? 'نشط' : 'معطل'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  إغلاق
                </button>
                <button 
                  onClick={() => handleDeleteService(selectedService._id)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  حذف
                </button>
                <button 
                  onClick={handleEditClick}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                >
                  تعديل الخدمة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">إضافة خدمة جديدة</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  اسم الخدمة
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-right focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="أدخل اسم الخدمة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  الأيقونة
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['🔧', '⚡', '🪵', '🛠️', '🔨', '🪛', '🧰', '⚙️'].map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewService({ ...newService, icon })}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        newService.icon === icon
                          ? 'bg-orange-500 scale-110'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={handleAddService}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">تعديل الخدمة</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  اسم الخدمة
                </label>
                <input
                  type="text"
                  value={editService.name}
                  onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-right focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="أدخل اسم الخدمة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  الأيقونة
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['🔧', '⚡', '🪵', '🛠️', '🔨', '🪛', '🧰', '⚙️'].map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setEditService({ ...editService, icon })}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        editService.icon === icon
                          ? 'bg-orange-500 scale-110'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
