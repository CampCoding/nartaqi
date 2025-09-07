"use client";
import Button from '@/components/atoms/Button';
import PageLayout from '@/components/layout/PageLayout'
import BreadcrumbsShowcase from '@/components/ui/BreadCrumbs'
import PagesHeader from '@/components/ui/PagesHeader';
import SearchAndFilters from '@/components/ui/SearchAndFilters';
import { BarChart3, Download, Plus, Book, Edit, Trash2, MoreVertical, X } from 'lucide-react';
import React, { useState } from 'react'
import { Modal, Form, Input, Switch, message } from 'antd';

// Initial categories data
export const all_categories = [
    {
        id: 1,
        title: "الدورات العامة",
        description: "دورات تدريبية عامة في مختلف المجالات",
        coursesCount: 15,
        createdAt: "2024-01-15",
        status: "active"
    },
    {
        id: 2,
        title: "الرخصة المهنية",
        description: "دورات تأهيل للحصول على الرخص المهنية",
        coursesCount: 8,
        createdAt: "2024-02-10",
        status: "active"
    },
    {
        id: 3,
        title: "دورات اللغات والبرمجه وحفظ القران",
        description: "دورات متخصصة في اللغات والتقنية والعلوم الشرعية",
        coursesCount: 23,
        createdAt: "2024-03-05",
        status: "active"
    }
];

// Grid Card Component
const CategoryCard = ({ category, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
            <div className="relative">
                <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
            </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {category.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>{category.coursesCount} دورة</span>
            <span>{new Date(category.createdAt).toLocaleDateString('ar-SA')}</span>
        </div>
        
        <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                category.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
            }`}>
                {category.status === 'active' ? 'نشط' : 'غير نشط'}
            </span>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => onEdit(category)}
                    className="p-1 hover:bg-blue-50 rounded text-blue-600"
                    title="تعديل"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => onDelete(category)}
                    className="p-1 hover:bg-red-50 rounded text-red-600"
                    title="حذف"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

// Table Component
const CategoriesTable = ({ categories, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        اسم الفئة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عدد الدورات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الإنشاء
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {categories?.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {category.title}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                {category.description}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                                {category.coursesCount}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                                {new Date(category.createdAt).toLocaleDateString('ar-SA')}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                category.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {category.status === 'active' ? 'نشط' : 'غير نشط'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => onEdit(category)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="تعديل"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => onDelete(category)}
                                    className="text-red-600 hover:text-red-900"
                                    title="حذف"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Category Form Component
const CategoryForm = ({ 
    visible, 
    onCancel, 
    onFinish, 
    initialValues, 
    formTitle,
    confirmLoading 
}) => {
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={formTitle}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            closeIcon={<X className="w-5 h-5" />}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={onFinish}
                className="mt-6"
            >
                <Form.Item
                    name="title"
                    label="اسم الفئة"
                    rules={[
                        { required: true, message: 'يرجى إدخال اسم الفئة' },
                        { min: 3, message: 'يجب أن يكون الاسم على الأقل 3 أحرف' }
                    ]}
                >
                    <Input placeholder="أدخل اسم الفئة" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="وصف الفئة"
                    rules={[
                        { required: true, message: 'يرجى إدخال وصف الفئة' },
                        { min: 10, message: 'يجب أن يكون الوصف على الأقل 10 أحرف' }
                    ]}
                >
                    <Input.TextArea 
                        placeholder="أدخل وصف الفئة" 
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="حالة الفئة"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch 
                        checkedChildren="نشط"
                        unCheckedChildren="غير نشط"
                        defaultChecked
                    />
                </Form.Item>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="secondary"
                        onClick={handleCancel}
                    >
                        إلغاء
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={confirmLoading}
                    >
                        حفظ
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default function Page() {
    const breadcrumbs = [
        { label: "الرئيسية", href: "/", icon: BarChart3 },
        { label: "فئات الدورات", href: "#", icon: Book, current: true },
    ];

    const [categories, setCategories] = useState(all_categories);
    const [newModal, setNewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle Add Category
    const handleAdd = () => {
        setNewModal(true);
        setSelectedCategory(null);
    };

    const handleAddFinish = (values) => {
        setConfirmLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            const newCategory = {
                id: Math.max(...categories.map(c => c.id), 0) + 1,
                title: values.title,
                description: values.description,
                coursesCount: 0,
                createdAt: new Date().toISOString().split('T')[0],
                status: values.status ? 'active' : 'inactive'
            };

            setCategories([...categories, newCategory]);
            setNewModal(false);
            setConfirmLoading(false);
            message.success('تم إضافة الفئة بنجاح');
        }, 1000);
    };

    // Handle Edit Category
    const handleEdit = (category) => {
        setSelectedCategory(category);
        setEditModal(true);
    };

    const handleEditFinish = (values) => {
        setConfirmLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            const updatedCategories = categories.map(category =>
                category.id === selectedCategory.id
                    ? {
                        ...category,
                        title: values.title,
                        description: values.description,
                        status: values.status ? 'active' : 'inactive'
                    }
                    : category
            );

            setCategories(updatedCategories);
            setEditModal(false);
            setSelectedCategory(null);
            setConfirmLoading(false);
            message.success('تم تعديل الفئة بنجاح');
        }, 1000);
    };

    // Handle Delete Category
    const handleDelete = (category) => {
        setSelectedCategory(category);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        setConfirmLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            const updatedCategories = categories.filter(
                category => category.id !== selectedCategory.id
            );

            setCategories(updatedCategories);
            setDeleteModal(false);
            setSelectedCategory(null);
            setConfirmLoading(false);
            message.success('تم حذف الفئة بنجاح');
        }, 1000);
    };

    const cancelDelete = () => {
        setDeleteModal(false);
        setSelectedCategory(null);
    };

    return (
        <PageLayout>
            <div style={{ dir: "rtl" }}>
                <BreadcrumbsShowcase variant='pill' items={breadcrumbs}/>

                <PagesHeader
                    title={"إدارة فئات الدورات"}
                    subtitle={"نظّم وأدر فئات الدورات"}
                    extra={
                        <div className="flex items-center gap-4 gap-reverse">
                            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                                تصدير
                            </Button>
                            <Button
                                onClick={handleAdd}
                                type="primary"
                                size="large"
                                icon={<Plus className="w-5 h-5" />}
                            >
                                إضافة فئة جديدة
                            </Button>
                        </div>
                    }
                />

                <SearchAndFilters 
                    mode={viewMode} 
                    setMode={setViewMode} 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                />

                {/* Data Display */}
                <div className="mt-6">
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-2">لا توجد فئات</div>
                            <div className="text-gray-400 text-sm">
                                {searchTerm ? 'لم يتم العثور على نتائج مطابقة للبحث' : 'لم يتم إنشاء أي فئات بعد'}
                            </div>
                        </div>
                    ) : (
                        <>
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCategories.map((category) => (
                                        <CategoryCard
                                            key={category.id}
                                            category={category}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <CategoriesTable
                                    categories={filteredCategories}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Results Summary */}
                {filteredCategories.length > 0 && (
                    <div className="mt-6 text-sm text-gray-500 text-center">
                        عرض {filteredCategories.length} من {categories.length} فئة
                    </div>
                )}

                {/* Add Category Modal */}
                <CategoryForm
                    visible={newModal}
                    onCancel={() => setNewModal(false)}
                    onFinish={handleAddFinish}
                    formTitle="إضافة فئة جديدة"
                    confirmLoading={confirmLoading}
                />

                {/* Edit Category Modal */}
                <CategoryForm
                    visible={editModal}
                    onCancel={() => {
                        setEditModal(false);
                        setSelectedCategory(null);
                    }}
                    onFinish={handleEditFinish}
                    initialValues={{
                        title: selectedCategory?.title,
                        description: selectedCategory?.description,
                        status: selectedCategory?.status === 'active'
                    }}
                    formTitle="تعديل الفئة"
                    confirmLoading={confirmLoading}
                />

                {/* Delete Confirmation Modal */}
                <Modal
                    title="تأكيد الحذف"
                    open={deleteModal}
                    onCancel={cancelDelete}
                    footer={[
                        <Button key="cancel" type="secondary" onClick={cancelDelete}>
                            إلغاء
                        </Button>,
                        <Button
                            key="delete"
                            type="danger"
                            loading={confirmLoading}
                            onClick={confirmDelete}
                        >
                            حذف
                        </Button>
                    ]}
                    closeIcon={<X className="w-5 h-5" />}
                >
                    <div className="py-4">
                        <p className="text-gray-600">
                            هل أنت متأكد من أنك تريد حذف الفئة "{selectedCategory?.title}"؟
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            لا يمكن التراجع عن هذا الإجراء.
                        </p>
                    </div>
                </Modal>
            </div>
        </PageLayout>
    );
}