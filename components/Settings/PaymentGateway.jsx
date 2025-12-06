import React, { useState, useMemo } from 'react';
import { CreditCard, Plus, Trash2, Edit, X, Save, Key, Wallet, Image, Link, Search } from 'lucide-react';

// --- Mock Data ---
const initialGateways = [
  { id: 1, name: 'Stripe', logoUrl: 'https://placehold.co/40x40/635BFF/ffffff?text=S', apiKey: 'sk_live_...487', token: 'tok_str_...221' },
  { id: 2, name: 'PayPal', logoUrl: 'https://placehold.co/40x40/0070BA/ffffff?text=P', apiKey: 'sb_client_...901', token: 'tok_ppl_...332' },
  { id: 3, name: 'Square', logoUrl: 'https://placehold.co/40x40/0069F7/ffffff?text=Q', apiKey: 'sq_app_...556', token: 'tok_sq_...443' },
];

/**
 * A reusable modal component for the Add/Edit form.
 */
const GatewayModal = ({ isOpen, onClose, onSave, initialData }) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState(initialData || { name: '', logoUrl: '', apiKey: '', token: '' });

  React.useEffect(() => {
    setFormData(initialData || { name: '', logoUrl: '', apiKey: '', token: '' });
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const InputField = ({ icon: Icon, name, label, type = 'text', placeholder, value }) => (
    <div className="mb-4" dir="rtl">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 text-right">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {/* Adjusted icon position for RTL using 'right-0' and 'pr-3' */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          id={name}
          // Adjusted padding to 'pr-10' and 'pl-4' for RTL text
          className="block w-full rounded-md border-0 py-2.5 pr-10 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition duration-150 text-right"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-transform duration-300 transform scale-100" dir="rtl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
            <CreditCard className="w-6 h-6 ml-2 text-indigo-600" /> {/* Icon margin adjusted to ml-2 */}
            {isEditing ? 'تعديل بوابة الدفع' : 'إضافة بوابة دفع جديدة'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <InputField
            icon={Link}
            name="name"
            label="اسم البوابة"
            placeholder="مثال: Stripe، PayPal، Square"
            value={formData.name}
          />
          <InputField
            icon={Image}
            name="logoUrl"
            label="رابط الشعار (40x40 موصى به)"
            placeholder="https://example.com/logo.png"
            value={formData.logoUrl}
          />
          <InputField
            icon={Key}
            name="apiKey"
            label="مفتاح API (سري أو قابل للنشر)"
            placeholder="sk_live_******************"
            value={formData.apiKey}
          />
          <InputField
            icon={Wallet}
            name="token"
            label="رمز الوصول / معرّف العميل"
            placeholder="tok_access_****************"
            value={formData.token}
          />

          {/* Used flex-row-reverse for button order consistency in RTL */}
          <div className="mt-6 flex justify-start space-x-3 space-x-reverse">
            <button
              type="submit"
              className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md shadow-indigo-500/50"
            >
              <Save className="w-4 h-4 ml-2" /> {/* Icon margin adjusted to ml-2 */}
              {isEditing ? 'تحديث البوابة' : 'إضافة البوابة'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Main application component.
 */
const PaymentGatewayManager = () => {
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  // State for the list of gateways
  const [gateways, setGateways] = useState(initialGateways);
  // State for search filter
  const [searchTerm, setSearchTerm] = useState('');
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for which gateway is being edited (null for add, object for edit)
  const [editingGateway, setEditingGateway] = useState(null);

  // Filtered list based on search term
  const filteredGateways = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return gateways.filter(g =>
      g.name.toLowerCase().includes(lowerCaseSearch) ||
      g.apiKey.toLowerCase().includes(lowerCaseSearch)
    );
  }, [gateways, searchTerm]);

  // --- CRUD Operations ---

  const handleOpenAdd = () => {
    setEditingGateway(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gateway) => {
    setEditingGateway(gateway);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGateway(null);
  };

  const handleDelete = (id) => {
    // Translated confirmation message
    if (window.confirm(`هل أنت متأكد من أنك تريد حذف بوابة الدفع بالمعرّف ${id}؟`)) {
      setGateways(prev => prev.filter(g => g.id !== id));
      console.log(`Gateway ID ${id} deleted for app: ${appId}`);
    }
  };

  const handleSave = (newGatewayData) => {
    if (editingGateway) {
      // Edit logic
      setGateways(prev => prev.map(g =>
        g.id === editingGateway.id ? { ...g, ...newGatewayData } : g
      ));
      console.log(`Gateway ID ${editingGateway.id} updated for app: ${appId}`);
    } else {
      // Add logic
      const newId = Math.max(...gateways.map(g => g.id), 0) + 1;
      const newGateway = { ...newGatewayData, id: newId };
      setGateways(prev => [...prev, newGateway]);
      console.log(`New Gateway ID ${newId} added for app: ${appId}`);
    }
    handleCloseModal();
  };

  // --- Gateway Card Component for Display ---

  const GatewayCard = ({ gateway }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col justify-between h-full" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4 space-x-reverse"> {/* space-x-reverse for RTL */}
          <img
            src={gateway.logoUrl || 'https://placehold.co/40x40/cccccc/000000?text=?'}
            alt={`${gateway.name} Logo`}
            className="w-10 h-10 object-contain rounded-lg border p-1"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/cccccc/000000?text=?'; }}
          />
          <h4 className="text-xl font-bold text-gray-800">{gateway.name}</h4>
        </div>
        <div className="flex space-x-2 space-x-reverse"> {/* space-x-reverse for RTL */}
          <button
            onClick={() => handleOpenEdit(gateway)}
            className="p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-full hover:bg-indigo-100 transition duration-150"
            title="تعديل البوابة"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(gateway.id)}
            className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded-full hover:bg-red-100 transition duration-150"
            title="حذف البوابة"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <span className="font-medium text-gray-600 flex items-center space-x-2 space-x-reverse"><Key className="w-4 h-4 ml-2" /> مفتاح API:</span> {/* ml-2 for icon in RTL */}
          {/* Changed text-right to text-left for API keys/tokens (which are usually LTR) */}
          <span className="font-mono text-gray-900 truncate mr-2 text-left" dir="ltr">
            {gateway.apiKey.length > 20 ? gateway.apiKey.substring(0, 10) + '...' + gateway.apiKey.slice(-5) : gateway.apiKey}
          </span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <span className="font-medium text-gray-600 flex items-center space-x-2 space-x-reverse"><Wallet className="w-4 h-4 ml-2" /> رمز الوصول:</span> {/* ml-2 for icon in RTL */}
          <span className="font-mono text-gray-900 truncate mr-2 text-left" dir="ltr">
            {gateway.token.length > 20 ? gateway.token.substring(0, 10) + '...' + gateway.token.slice(-5) : gateway.token}
          </span>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-left" dir="ltr"> {/* Force LTR for ID display */}
        المعرّف: {gateway.id}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center"> {/* justify-end for RTL title */}
          <CreditCard className="w-8 h-8 ml-3 text-indigo-600" /> {/* Icon margin adjusted to ml-3 */}
          إعدادات بوابات الدفع
        </h1>
        <p className="text-gray-500 mt-2">إدارة جميع بوابات الدفع الخارجية لتطبيقك (معرف التطبيق: {appId}).</p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
           {/* Search Bar - placed last in the flex container for visual order in RTL layout */}
        <div className="relative w-full md:w-80">
          {/* Adjusted icon position for RTL using 'right-0' and 'pr-3' */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="البحث عن البوابات بالاسم أو مفتاح API"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Adjusted padding to 'pr-10' and 'pl-4' for RTL text
            className="block w-full rounded-lg border-0 py-2.5 pr-10 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm text-right"
          />
        </div>
        {/* Add Button - placed first in the flex container for visual order */}
        <button
          onClick={handleOpenAdd}
          className="flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto justify-center"
        >
          إضافة بوابة جديدة
          <Plus className="w-5 h-5 mr-2" />
        </button>        
      </div>

      {/* Gateway List/Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGateways.length > 0 ? (
          filteredGateways.map(gateway => (
            <GatewayCard key={gateway.id} gateway={gateway} />
          ))
        ) : (
          <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-inner border-dashed border-2 border-gray-300 text-center text-gray-500">
            <CreditCard className="w-8 h-8 mx-auto mb-2" />
            لم يتم العثور على بوابات تطابق "{searchTerm}".
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <GatewayModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingGateway}
      />

    </div>
  );
};

export default PaymentGatewayManager;