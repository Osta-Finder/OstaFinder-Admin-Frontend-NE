import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'السباكة',
      description: 'خدمات سباكة احترافية وإصلاح الأنابيب والتسريبات',
      price: '150 ر.س',
      users: 1250,
      status: 'نشط',
      icon: '🔧',
    },
    {
      id: 2,
      name: 'الكهرباء',
      description: 'خدمات كهربائية متخصصة والتركيبات الكهربائية',
      price: '200 ر.س',
      users: 980,
      status: 'نشط',
      icon: '⚡',
    },
    {
      id: 3,
      name: 'النجارة',
      description: 'خدمات نجارة وتصنيع الأثاث والديكور',
      price: '180 ر.س',
      users: 750,
      status: 'نشط',
      icon: '🪵',
    },
    {
      id: 4,
      name: 'الصيانة العامة',
      description: 'خدمات صيانة عامة وإصلاح شاملة',
      price: '120 ر.س',
      users: 620,
      status: 'نشط',
      icon: '🛠️',
    },
  ]);

  const [selectedService, setSelectedService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    icon: '🔧',
  });
  const [editService, setEditService] = useState({
    name: '',
    description: '',
    price: '',
    icon: '🔧',
  });

  const handleAddService = () => {
    if (!newService.name || !newService.description || !newService.price) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    const service = {
      id: services.length + 1,
      name: newService.name,
      description: newService.description,
      price: newService.price,
      users: Math.floor(Math.random() * 1000) + 100,
      status: 'نشط',
      icon: newService.icon,
    };

    setServices([...services, service]);
    setNewService({ name: '', description: '', price: '', icon: '🔧' });
    setShowAddModal(false);
    toast.success('تم إضافة الخدمة بنجاح');
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
      description: selectedService.description,
      price: selectedService.price,
      icon: selectedService.icon,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editService.name || !editService.description || !editService.price) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    setServices(services.map(service =>
      service.id === selectedService.id
        ? {
            ...service,
            name: editService.name,
            description: editService.description,
            price: editService.price,
            icon: editService.icon,
          }
        : service
    ));

    setSelectedService({
      ...selectedService,
      name: editService.name,
      description: editService.description,
      price: editService.price,
      icon: editService.icon,
    });

    setShowEditModal(false);
    toast.success('تم تحديث الخدمة بنجاح');
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 
                       transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-4xl">{service.icon}</span>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  service.status === 'نشط'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {service.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 text-right">
              {service.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 text-right">
              {service.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">السعر</p>
                <p className="text-lg font-bold text-orange-600">{service.price}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">المستخدمين</p>
                <p className="text-lg font-bold text-gray-900">{service.users}</p>
              </div>
            </div>

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
                <span className="text-5xl">{selectedService.icon}</span>
                <div>
                  <p className="text-sm text-gray-600">الحالة</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {selectedService.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">الوصف</h3>
                <p className="text-gray-600 leading-relaxed">{selectedService.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">السعر</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedService.price}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">المستخدمين</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedService.users}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">الحالة</p>
                  <p className="text-lg font-bold text-green-600">نشط</p>
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
                  الوصف
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-right focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  placeholder="أدخل وصف الخدمة"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  السعر
                </label>
                <input
                  type="text"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-right focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="مثال: 150 ر.س"
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
                  الوصف
                </label>
                <textarea
                  value={editService.description}
                  onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-right focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  placeholder="أدخل وصف الخدمة"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  السعر
                </label>
                <input
                  type="text"
                  value={editService.price}
                  onChange={(e) => setEditService({ ...editService, price: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-right focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="مثال: 150 ر.س"
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
