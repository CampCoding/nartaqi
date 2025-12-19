"use client";

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageLayout from '../../../components/layout/PageLayout';
import BreadcrumbsShowcase from '../../../components/ui/BreadCrumbs';
import PagesHeader from '../../../components/ui/PagesHeader';
import { Button, Modal, Input, Form, Popconfirm, Card, Spin, Empty, Tag } from 'antd';
import { BarChart3, File, Plus, Edit, Trash2, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { handleAddTerms, handleEditTerms, handleDeleteTerms } from '../../../lib/features/termsConditionSlice';
import { handleGetAllRounds, handleGetSourceRound } from '../../../lib/features/roundsSlice';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الشروط والأحكام", href: "#", icon: File, current: true },
];

export default function TermsPage() {
  const dispatch = useDispatch();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [points, setPoints] = useState(['']);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { add_terms_loading, edit_terms_loading, delete_terms_loading } = useSelector(state => state?.terms);
  const { rounds_list, rounds_loading, source_round_list, source_round_loading } = useSelector(state => state?.rounds);

  const searchParams = useSearchParams();
  const roundID = searchParams.get("roundId");
  const categoriesId = searchParams.get("category");
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "10";

  const [terms, setTerms] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (categoriesId) {
        await dispatch(handleGetAllRounds({ page, per_page: pageSize, course_category_id: categoriesId }));
      } else {
        await dispatch(handleGetSourceRound({ page, per_page: pageSize }));
      }
    } catch (error) {
      toast.error('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, pageSize, categoriesId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!roundID) return;

    let filtered = [];
    if (categoriesId) {
      const round = rounds_list?.data?.message?.data?.find(item => item?.id == roundID);
      filtered = round?.round_terms || [];
    } else {
      const round = source_round_list?.data?.message?.data?.find(item => item?.id == roundID);
      filtered = round?.round_terms || [];
    }
    setTerms(filtered);
  }, [roundID, categoriesId, rounds_list, source_round_list]);

  const refreshData = useCallback(() => {
    fetchData();
    toast.success('تم تحديث البيانات بنجاح');
  }, [fetchData]);

  const handleAddPoint = () => setPoints([...points, '']);
  const handleRemovePoint = (index) => setPoints(points.filter((_, i) => i !== index));
  const handlePointChange = (index, value) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const handleAddSubmit = async () => {
    if (!roundID) return toast.error('لم يتم تحديد الدورة');

    try {
      const values = await form.validateFields();
      const filteredPoints = points.filter(p => p.trim());

      if (filteredPoints.length === 0) return toast.error('يرجى إضافة نقطة واحدة على الأقل');

      await dispatch(handleAddTerms({
        body: { round_id: roundID, title: values.title, points: filteredPoints }
      })).unwrap();

      toast.success('تم إضافة الشروط بنجاح');
      refreshData();
      setAddModal(false);
      form.resetFields();
      setPoints(['']);
    } catch (err) {
      toast.error('حدث خطأ أثناء الإضافة');
    }
  };

  const handleEditClick = (record) => {
    setSelectedTerm(record);
    editForm.setFieldsValue({ title: record.title });
    setPoints(record.points || ['']);
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      const filteredPoints = points.filter(p => p.trim());

      if (filteredPoints.length === 0) return toast.error('يرجى إضافة نقطة واحدة على الأقل');

      await dispatch(handleEditTerms({
        body: { id: selectedTerm.id, round_id: roundID, title: values.title, points: filteredPoints }
      })).unwrap();

      toast.success('تم تعديل الشروط بنجاح');
      refreshData();
      setEditModal(false);
      setSelectedTerm(null);
      setPoints(['']);
    } catch (err) {
      toast.error('حدث خطأ أثناء التعديل');
    }
  };

  const handleDelete = (id) => {
    dispatch(handleDeleteTerms({ body: { id } }))
      .unwrap()
      .then(() => {
        toast.success('تم الحذف بنجاح');
        refreshData();
      })
      .catch(() => toast.error('حدث خطأ أثناء الحذف'));
  };

  if (!roundID) {
    return (
      <PageLayout>
        <div dir="rtl" className="min-h-screen  p-6">
          <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
          <Card className="mt-8 text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl">
            <Empty description="لم يتم تحديد دورة" />
            <p className="text-gray-600 mt-4 text-lg">يرجى اختيار دورة لإدارة شروطها وأحكامها</p>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50">
            <PagesHeader
              title="إدارة الشروط والأحكام"
              subtitle="تحديد الشروط والأحكام الخاصة بهذه الدورة لضمان تجربة تعليمية منظمة وعادلة"
              extra={
                <Button
                  onClick={() => setAddModal(true)}
                  type="primary"
                  size="large"
                  icon={<Plus className="w-6 h-6" />}
                  loading={add_terms_loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600  border-0 shadow-lg text-lg px-8 py-6 rounded-2xl font-semibold"
                >
                  إضافة شروط جديدة
                </Button>
              }
            />
          </div>
        </div>

        {/* Terms Cards */}
        <div className="max-w-7xl mx-auto px-6 mt-10 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              قائمة الشروط والأحكام
            </h2>
            <p className="text-lg text-gray-600 mt-3">
              العدد الإجمالي: <span className="font-bold text-indigo-600">{terms.length}</span> مجموعة
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" tip="جاري تحميل الشروط..." />
            </div>
          ) : terms.length === 0 ? (
            <Card className="text-center py-20 bg-white/80 backdrop-blur shadow-2xl border-0 rounded-3xl">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="لا توجد شروط وأحكام مضافة بعد"
              />
              <Button
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setAddModal(true)}
                className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg px-8 py-6 text-lg"
              >
                إضافة أول مجموعة شروط
              </Button>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
              {terms.map((term) => (
                <div
                  key={term.id}
                  className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-lg shadow-xl border border-white/50  transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{term.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{term.points?.length || 0} نقاط</p>
                        </div>
                      </div>

                      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          icon={<Edit className="w-5 h-5" />}
                          onClick={() => handleEditClick(term)}
                          className="bg-blue-50 text-blue-600  rounded-xl shadow-md"
                          size="large"
                        />
                        <Popconfirm
                          title="تأكيد الحذف"
                          description="هل أنت متأكد من حذف هذه الشروط نهائياً؟"
                          onConfirm={() => handleDelete(term.id)}
                          okText="نعم، احذف"
                          cancelText="إلغاء"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            danger
                            icon={<Trash2 className="w-5 h-5" />}
                            className="hover:bg-red-50 rounded-xl shadow-md"
                            size="large"
                          />
                        </Popconfirm>
                      </div>
                    </div>

                    {/* Points List */}
                    <div className="space-y-4">
                      {term.points?.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl">
                          <CheckCircle2 className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared Modal Style for Add/Edit */}
        {["add", "edit"].map((mode) => {
          const isEdit = mode === "edit";
          const modalOpen = isEdit ? editModal : addModal;
          const setModalOpen = isEdit ? setEditModal : setAddModal;
          const formInstance = isEdit ? editForm : form;
          const submitHandler = isEdit ? handleEditSubmit : handleAddSubmit;
          const loadingState = isEdit ? edit_terms_loading : add_terms_loading;

          return (
            <Modal
              key={mode}
              open={modalOpen}
              onCancel={() => {
                setModalOpen(false);
                formInstance.resetFields();
                setPoints(['']);
                setSelectedTerm(null);
              }}
              onOk={submitHandler}
              confirmLoading={loadingState}
              title={
                <div className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-indigo-600" />
                  {isEdit ? "تعديل الشروط والأحكام" : "إضافة شروط وأحكام جديدة"}
                </div>
              }
              okText={isEdit ? "حفظ التعديلات" : "إضافة الشروط"}
              cancelText="إلغاء"
              okButtonProps={{
                className: "bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg px-8 py-6 text-lg rounded-2xl",
                size: "large"
              }}
              cancelButtonProps={{ size: "large", className: "px-8 py-6 rounded-2xl" }}
              width={700}
              className="top-10"
            >
              <Form form={formInstance} layout="vertical" className="mt-6">
                <Form.Item
                  name="title"
                  label={<span className="text-lg font-semibold text-gray-800">عنوان الشروط</span>}
                  rules={[{ required: true, message: 'يرجى إدخال عنوان واضح' }]}
                >
                  <Input
                    placeholder="مثال: شروط المشاركة في الدورة"
                    size="large"
                    className="rounded-xl text-lg py-4"
                  />
                </Form.Item>

                <Form.Item label={<span className="text-lg font-semibold text-gray-800">النقاط التفصيلية</span>}>
                  <div className="space-y-4">
                    {points.map((point, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-1">
                          <TextArea
                            value={point}
                            onChange={(e) => handlePointChange(index, e.target.value)}
                            placeholder={`النقطة ${index + 1} (مثال: يجب حضور 80% من المحاضرات... )`}
                            rows={3}
                            className="rounded-xl text-base resize-none"
                            showCount
                            maxLength={500}
                          />
                        </div>
                        {points.length > 1 && (
                          <Button
                            danger
                            type="text"
                            icon={<Trash2 className="w-5 h-5" />}
                            onClick={() => handleRemovePoint(index)}
                            className="mt-2 hover:bg-red-50 rounded-xl p-3"
                          />
                        )}
                      </div>
                    ))}

                    <Button
                      type="dashed"
                      onClick={handleAddPoint}
                      block
                      icon={<Plus className="w-5 h-5" />}
                      className="h-14 text-lg rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 hover:border-indigo-500 hover:text-indigo-700"
                    >
                      إضافة نقطة جديدة
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
          );
        })}
      </div>
    </PageLayout>
  );
}