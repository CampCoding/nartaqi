// src/components/AddCourseSourceResource.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal as AntModal,
  Row,
  DatePicker,
  message,
  Upload,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  FolderOutlined,
  LinkOutlined,
  CopyOutlined,
  DeleteOutlined,
  UploadOutlined,
  FileTextOutlined,
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  PaperClipOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetAllRoundResources,
  handleAddRoundResource,
  handleEditRoundResource,
  handleDeleteRoundResource,
  handleUpdateResourceLinks, // You need to create this action
} from "../../lib/features/resourcesSlice";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export default function AddCourseSourceResource({
  videos,
  setVideos,
  duplicateTargets = [],
  onDuplicateResources,
  goToNextStep,
  goToPrevStep,
  currentStep,
  id, // round_id
  STEPS,
  source
}) {
  const [form] = Form.useForm(); // Add form instance
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    add_resource_loading,
    edit_resource_loading,
    delete_resource_loading,
    all_resources_loading,
    all_resources_list,
  } = useSelector((state) => state?.resource);

  // Duplicate Modal States
  const [dupOpen, setDupOpen] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [dupError, setDupError] = useState("");
  const [targetsSearch, setTargetsSearch] = useState("");
  const [selectedTargets, setSelectedTargets] = useState([]);

  // File Modal States
  const [addFileModal, setAddFileModal] = useState(false);
  const [editFileModal, setEditFileModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [newFileData, setNewFileData] = useState({
    name: "",
    description: "",
    file: null,
    show_date: dayjs(),
  });

  // Initial form values from existing data
  useEffect(() => {
    if (all_resources_list?.data?.message) {
      const resources = all_resources_list.data.message;
      form.setFieldsValue({
        resources: {
          telegram: resources?.group_links?.telegram_link || "",
          whatsapp: resources?.group_links?.whatsapp_link || "",
        }
      });
    }
  }, [all_resources_list, form]);

  // Load existing resources
  useEffect(() => {
    dispatch(handleGetAllRoundResources({ body: { round_id: id } }));
  }, [dispatch, id]);

  const filteredTargets = useMemo(() => {
    const term = (targetsSearch || "").toLowerCase();
    if (!term) return duplicateTargets;
    return duplicateTargets.filter((t) =>
      (t.title || "").toLowerCase().includes(term)
    );
  }, [duplicateTargets, targetsSearch]);

  const toggleTarget = (id) => {
    setSelectedTargets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllTargets = () => {
    if (selectedTargets.length === filteredTargets.length) {
      setSelectedTargets([]);
    } else {
      setSelectedTargets(filteredTargets.map((t) => t.id));
    }
  };

  const openDuplicateModal = () => {
    setDupError("");
    setTargetsSearch("");
    setSelectedTargets([]);
    setDupOpen(true);
  };

  const confirmDuplicate = async () => {
    if (selectedTargets.length === 0) {
      setDupError("برجاء اختيار دورة/دورات الهدف أولاً.");
      return;
    }
    try {
      setDupLoading(true);
      const telegram = form?.getFieldValue?.(["resources", "telegram"]) ?? "";
      const whatsapp = form?.getFieldValue?.(["resources", "whatsapp"]) ?? "";
      const files = (videos || []).map((v) => ({
        id: v.id,
        name: v.name || "",
        description: v.description || "",
        source: "upload",
        file: v.file,
        show_date: v.show_date,
      }));

      if (onDuplicateResources) {
        await onDuplicateResources(
          { links: { telegram, whatsapp }, files },
          selectedTargets
        );
      }
      message.success("تم نسخ المصادر بنجاح!");
      setDupOpen(false);
    } catch (e) {
      setDupError(e?.message || "تعذّر النسخ، جرّب مرة أخرى.");
    } finally {
      setDupLoading(false);
    }
  };

  // Get file icon based on type
  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FilePdfOutlined className="text-red-600 text-xl" />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined className="text-blue-600 text-xl" />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined className="text-green-600 text-xl" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined className="text-purple-600 text-xl" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileZipOutlined className="text-yellow-600 text-xl" />;
      default:
        return <FileUnknownOutlined className="text-gray-600 text-xl" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Save Telegram & WhatsApp links
  const saveResourceLinks = async () => {
    try {
      await form.validateFields([['resources', 'telegram'], ['resources', 'whatsapp']]);

      const values = form.getFieldsValue();
      const telegram_link = values?.resources?.telegram || "";
      const whatsapp_link = values?.resources?.whatsapp || "";

      // Create a function to update links in your Redux slice
      // For now, we'll send them with each file operation
      return { telegram_link, whatsapp_link };
    } catch (error) {
      console.error("Validation error:", error);
      return { telegram_link: "", whatsapp_link: "" };
    }
  };

  // Add File Functions
  const openAddFileModal = async () => {
    const links = await saveResourceLinks();
    setNewFileData({
      name: "",
      description: "",
      file: null,
      show_date: dayjs(),
      ...links // Store links in newFileData
    });
    setAddFileModal(true);
  };

  const confirmAddFile = async () => {
    if (!newFileData.name.trim()) {
      message.error("عنوان الملف مطلوب");
      return;
    }
    if (!newFileData.file) {
      message.error("يرجى رفع ملف");
      return;
    }

    try {
      // Get current form values for links
      const values = form.getFieldsValue();
      const telegram = values?.resources?.telegram || "";
      const whatsapp = values?.resources?.whatsapp || "";

      const formData = new FormData();
      formData.append("telegram_link", telegram);
      formData.append("whatsapp_link", whatsapp);
      formData.append("round_id", id);
      formData.append("title", newFileData.name.trim());
      formData.append("description", newFileData.description.trim());
      formData.append("file", newFileData.file);
      formData.append("show_date", newFileData.show_date.format("YYYY-MM-DD"));

      dispatch(handleAddRoundResource({ body: formData }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status === "success") {
            toast.success("تم إضافة الملف بنجاح");
            dispatch(handleGetAllRoundResources({ body: { round_id: id || 1 } }));
            setAddFileModal(false);
            setNewFileData({
              name: "",
              description: "",
              file: null,
              show_date: dayjs(),
            });
          } else {
            toast.error(res?.data?.message || "فشل في إضافة الملف");
          }
        })
        .catch((error) => {
          toast.error("حدث خطأ أثناء إضافة الملف");
        });
    } catch (error) {
      toast.error("حدث خطأ أثناء التحقق من البيانات");
    }
  };

  // Edit File Functions
  const openEditFileModal = (resource) => {
    setSelectedResource(resource);
    setNewFileData({
      name: resource.title || "",
      description: resource.description || "",
      file: null, // Don't pre-populate file for edit
      show_date: dayjs(resource.show_date || resource.created_at),
    });
    setEditFileModal(true);
  };

  const confirmEditFile = async () => {
    if (!newFileData.name.trim()) {
      message.error("عنوان الملف مطلوب");
      return;
    }

    try {
      // Get current form values for links
      const values = form.getFieldsValue();
      const telegram = values?.resources?.telegram || "";
      const whatsapp = values?.resources?.whatsapp || "";

      const formData = new FormData();
      formData.append("id", selectedResource.id);
      formData.append("telegram_link", telegram);
      formData.append("whatsapp_link", whatsapp);
      formData.append("round_id", id);
      formData.append("title", newFileData.name.trim());
      formData.append("description", newFileData.description.trim());
      formData.append("show_date", newFileData.show_date.format("YYYY-MM-DD"));

      // Only append file if a new one was selected
      if (newFileData.file) {
        formData.append("file", newFileData.file);
      }

      dispatch(handleEditRoundResource({ body: formData }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status === "success") {
            toast.success("تم تعديل الملف بنجاح");
            dispatch(handleGetAllRoundResources({ body: { round_id: id || 1 } }));
            setEditFileModal(false);
            setSelectedResource(null);
          } else {
            toast.error(res?.data?.message || "فشل في تعديل الملف");
          }
        })
        .catch((error) => {
          toast.error("حدث خطأ أثناء تعديل الملف");
        });
    } catch (error) {
      toast.error("حدث خطأ أثناء التحقق من البيانات");
    }
  };

  // Delete File Functions
  const handleDeleteFile = (resourceId) => {
    dispatch(handleDeleteRoundResource({ body: { id: resourceId } }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success("تم حذف الملف بنجاح");
          dispatch(handleGetAllRoundResources({ body: { round_id: id || 1 } }));
        } else {
          toast.error(res?.data?.message || "فشل في حذف الملف");
        }
      })
      .catch((error) => {
        toast.error("حدث خطأ أثناء حذف الملف");
      });
  };

  // View File Details
  const viewFileDetails = (resource) => {
    AntModal.info({
      title: resource.title,
      width: 600,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {getFileIcon(resource.url || resource.title)}
            <div>
              <h4 className="font-bold text-lg">{resource.title}</h4>
              {resource.description && (
                <p className="text-gray-600">{resource.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">تاريخ الإضافة</div>
              <div className="font-medium">
                {dayjs(resource.created_at).format("YYYY/MM/DD HH:mm")}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">تاريخ العرض</div>
              <div className="font-medium">
                {dayjs(resource.show_date || resource.created_at).format("YYYY/MM/DD")}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-500">رابط الملف</div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {resource.url}
            </a>
          </div>
        </div>
      ),
      okText: "تم",
    });
  };

  // Save & Continue
  const handleSaveAndContinue = async () => {

    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const telegram_link = values?.resources?.telegram || "";
      const whatsapp_link = values?.resources?.whatsapp || "";

      // Save links to the backend
      // You need to create a Redux action for this
      const saveLinksResult = await dispatch(
        handleUpdateResourceLinks({
          body: {
            round_id: id || 1,
            telegram_link,
            whatsapp_link
          }
        })
      ).unwrap();



      if (saveLinksResult?.data?.status === "success") {
        toast.success("تم حفظ الروابط بنجاح");
        localStorage.removeItem("courseBasicInfo")
      } else {
        toast.error("فشل في حفظ الروابط");
      }

    } catch (err) {
      console.error("Error saving resources:", err);
      message.error("حدث خطأ أثناء حفظ المصادر");
    }
    finally {
      if (currentStep == STEPS.length) {
        if(!source) {
         router.push(`/round_content?id=${id}&source=${1}`);
        }else {
          router.push(`/round_content?id=${id}`);
        }
        
      } else {
        goToNextStep();
      }
    }
  };

  // You need to add this function to your resourcesSlice
  const handleUpdateResourceLinks = async ({ body }) => {
    // API call to update Telegram and WhatsApp links for the round
    // Example endpoint: PUT /api/rounds/{id}/resource-links
    // const response = await api.post(apiRoutes.update_resource_links, { body });
    // return response;
  };

  const resources = all_resources_list?.data?.message?.resource || [];
  const resourceLinks = all_resources_list?.data?.message || {};

  useEffect(() => {
    console.log(resourceLinks?.group_links)
  }, [resourceLinks])

  return (
    <div className="space-y-8" dir="rtl">
      <Form form={form} layout="vertical">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0 flex items-center gap-3">
              <FolderOutlined className="text-purple-600" />
              المصادر والملفات
            </h3>
            {duplicateTargets.length > 0 && (
              <Button
                type="primary"
                icon={<CopyOutlined />}
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={openDuplicateModal}
              >
                نسخ إلى دورات أخرى
              </Button>
            )}
          </div>

          {/* Telegram & WhatsApp Links */}
          <Row gutter={24} className="mt-6">
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <LinkOutlined className="text-blue-500" />
                    رابط مجموعة التليجرام
                  </span>
                }
                name={["resources", "telegram"]}
                initialValue={resourceLinks?.group_links?.telegram_link || ""}
                rules={[
                  {
                    type: 'url',
                    message: 'يرجى إدخال رابط صحيح',
                  },
                ]}
              >
                <Input
                  placeholder="https://t.me/groupname"
                  className="rounded-xl"
                  prefix={<LinkOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <LinkOutlined className="text-green-500" />
                    رابط مجموعة الواتساب
                  </span>
                }
                name={["resources", "whatsapp"]}
                initialValue={resourceLinks?.group_links?.whatsapp_link || ""}
                rules={[
                  {
                    type: 'url',
                    message: 'يرجى إدخال رابط صحيح',
                  },
                ]}
              >
                <Input
                  placeholder="https://chat.whatsapp.com/..."
                  className="rounded-xl"
                  prefix={<LinkOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Files List */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FolderOutlined className="text-blue-600" />
                ملفات إضافية ({resources.length})
              </h4>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={openAddFileModal}
                className="bg-blue-600 hover:bg-blue-700"
              >
                إضافة ملف جديد
              </Button>
            </div>

            {all_resources_loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">جاري تحميل الملفات...</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                <FileTextOutlined className="text-4xl text-gray-300 mb-4" />
                <p className="text-lg">لا توجد ملفات مضافة بعد</p>
                <p className="text-sm text-gray-400 mt-2">قم بإضافة أول ملف للموارد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((resource, idx) => (
                  <div
                    key={resource.id || idx}
                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {getFileIcon(resource.url || resource.title)}
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">
                              {resource.title}
                            </h4>
                            {resource.description && (
                              <p className="text-gray-600 text-sm leading-relaxed mt-1 line-clamp-2">
                                {resource.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                          <Tooltip title="عرض الملف">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-blue-600"
                            >
                              <EyeOutlined />
                              <span className="truncate max-w-xs">{resource.url}</span>
                            </a>
                          </Tooltip>

                          <span className="flex items-center gap-1">
                            <CalendarOutlined />
                            {dayjs(resource.show_date || resource.created_at).format("YYYY/MM/DD")}
                          </span>

                          {resource.file_size && (
                            <span className="flex items-center gap-1">
                              <PaperClipOutlined />
                              {formatFileSize(resource.file_size)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* <Tooltip title="عرض التفاصيل">
                          <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => viewFileDetails(resource)}
                            className="text-blue-500 hover:text-blue-700"
                          />
                        </Tooltip> */}

                        <Tooltip title="تحميل الملف">
                          <a
                            href={resource.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<DownloadOutlined />}
                              className="text-green-500 hover:text-green-700"
                            />
                          </a>
                        </Tooltip>

                        <Tooltip title="تعديل">
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEditFileModal(resource)}
                            className="text-yellow-500 hover:text-yellow-700"
                            disabled={edit_resource_loading}
                          />
                        </Tooltip>

                        <Popconfirm
                          title="حذف الملف"
                          description="هل أنت متأكد من حذف هذا الملف؟"
                          onConfirm={() => handleDeleteFile(resource.id)}
                          okText="نعم"
                          cancelText="لا"
                          okButtonProps={{ danger: true }}
                        >
                          <Tooltip title="حذف">
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              className="text-red-500 hover:text-red-700"
                              disabled={delete_resource_loading}
                            />
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Form>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 1}
          className={`px-8 py-3 rounded-lg border text-gray-700 bg-white hover:bg-gray-50 transition ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          السابق
        </button>
        <button
          onClick={handleSaveAndContinue}
          disabled={add_resource_loading || all_resources_loading}
          className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {currentStep === STEPS.length ? "إنهاء ونشر" : "التالي"}
        </button>
      </div>

      {/* Add File Modal */}
      <AntModal
        title={
          <div className="flex items-center gap-3 text-xl font-bold">
            <UploadOutlined className="text-blue-600" />
            إضافة ملف جديد
          </div>
        }
        open={addFileModal}
        onCancel={() => setAddFileModal(false)}
        onOk={confirmAddFile}
        okText={add_resource_loading ? "جاري الإضافة..." : "إضافة الملف"}
        cancelText="إلغاء"
        width={640}
        okButtonProps={{
          size: "large",
          loading: add_resource_loading,
          disabled: add_resource_loading || !newFileData.name.trim() || !newFileData.file,
        }}
        cancelButtonProps={{ size: "large", disabled: add_resource_loading }}
      >
        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              عنوان الملف <span className="text-red-500">*</span>
            </label>
            <Input
              size="large"
              placeholder="مثال: ملزمة الرياضيات - الوحدة الثانية"
              value={newFileData.name}
              onChange={(e) => setNewFileData({ ...newFileData, name: e.target.value })}
              disabled={add_resource_loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الوصف 
            </label>
            <Input.TextArea
              rows={3}
              required
              placeholder="وصف مختصر عن محتوى الملف..."
              value={newFileData.description}
              onChange={(e) => setNewFileData({ ...newFileData, description: e.target.value })}
              disabled={add_resource_loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              رفع الملف <span className="text-red-500">*</span>
            </label>
            <Upload
              beforeUpload={(file) => {
                setNewFileData({ ...newFileData, file });
                return false; // Prevent auto upload
              }}
              showUploadList={false}
              disabled={add_resource_loading}
            >
              <Button
                icon={<UploadOutlined />}
                size="large"
                block
                className="h-16 border-dashed"
              >
                اختر ملف
              </Button>
            </Upload>
            {newFileData.file && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileTextOutlined />
                  <span className="truncate max-w-xs">{newFileData.file.name}</span>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => setNewFileData({ ...newFileData, file: null })}
                  disabled={add_resource_loading}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              يمكنك رفع أي نوع من الملفات (PDF، Word، Excel، صور، إلخ)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تاريخ العرض
            </label>
            <DatePicker
              className="w-full"
              size="large"
              value={newFileData.show_date}
              onChange={(date) => setNewFileData({ ...newFileData, show_date: date })}
              format="YYYY-MM-DD"
              disabled={add_resource_loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              سيظهر الملف للطلاب بدءًا من هذا التاريخ
            </p>
          </div>
        </div>
      </AntModal>

      {/* Edit File Modal */}
      <AntModal
        title={
          <div className="flex items-center gap-3 text-xl font-bold">
            <EditOutlined className="text-yellow-600" />
            تعديل الملف
          </div>
        }
        open={editFileModal}
        onCancel={() => setEditFileModal(false)}
        onOk={confirmEditFile}
        okText={edit_resource_loading ? "جاري التعديل..." : "حفظ التعديلات"}
        cancelText="إلغاء"
        width={640}
        okButtonProps={{
          size: "large",
          loading: edit_resource_loading,
          disabled: edit_resource_loading || !newFileData.name.trim(),
        }}
        cancelButtonProps={{ size: "large", disabled: edit_resource_loading }}
      >
        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              عنوان الملف <span className="text-red-500">*</span>
            </label>
            <Input
              size="large"
              placeholder="عنوان الملف"
              value={newFileData.name}
              onChange={(e) => setNewFileData({ ...newFileData, name: e.target.value })}
              disabled={edit_resource_loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الوصف (اختياري)
            </label>
            <Input.TextArea
              rows={3}
              placeholder="وصف الملف"
              value={newFileData.description}
              onChange={(e) => setNewFileData({ ...newFileData, description: e.target.value })}
              disabled={edit_resource_loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تغيير الملف (اختياري)
            </label>
            <Upload
              beforeUpload={(file) => {
                setNewFileData({ ...newFileData, file });
                return false; // Prevent auto upload
              }}
              showUploadList={false}
              disabled={edit_resource_loading}
            >
              <Button
                icon={<UploadOutlined />}
                size="large"
                block
                className="h-16 border-dashed"
              >
                اختر ملف جديد
              </Button>
            </Upload>
            {newFileData.file ? (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileTextOutlined />
                  <span className="truncate max-w-xs">{newFileData.file.name}</span>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => setNewFileData({ ...newFileData, file: null })}
                  disabled={edit_resource_loading}
                />
              </div>
            ) : (
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                <div className="flex items-center gap-2">
                  <FileTextOutlined />
                  <span>سيتم الاحتفاظ بالملف الحالي</span>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              اتركه فارغاً للحفاظ على الملف الحالي
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تاريخ العرض
            </label>
            <DatePicker
              className="w-full"
              size="large"
              value={newFileData.show_date}
              onChange={(date) => setNewFileData({ ...newFileData, show_date: date })}
              format="YYYY-MM-DD"
              disabled={edit_resource_loading}
            />
          </div>
        </div>
      </AntModal>

      {/* Duplicate to Other Courses Modal */}
      <AntModal
        open={dupOpen}
        onCancel={() => setDupOpen(false)}
        onOk={confirmDuplicate}
        okText={dupLoading ? "جارٍ النسخ..." : "نسخ"}
        cancelText="إلغاء"
        confirmLoading={dupLoading}
        width={600}
        title={
          <div className="flex items-center gap-3">
            <CopyOutlined className="text-emerald-600" />
            نسخ الموارد إلى دورات أخرى
          </div>
        }
      >
        <div className="space-y-4">
          <Input.Search
            placeholder="ابحث عن دورة..."
            allowClear
            onChange={(e) => setTargetsSearch(e.target.value)}
            disabled={dupLoading}
          />
          <div className="flex justify-between text-sm">
            <button
              type="button"
              className="px-3 py-1 border rounded hover:bg-gray-50"
              onClick={toggleAllTargets}
              disabled={dupLoading}
            >
              {selectedTargets.length === filteredTargets.length
                ? "إلغاء تحديد الكل"
                : "تحديد الكل"}
            </button>
            <span className="text-gray-500">
              المختار: {selectedTargets.length} من {filteredTargets.length}
            </span>
          </div>

          <div className="max-h-64 overflow-auto space-y-2">
            {filteredTargets.map((t) => (
              <label
                key={t.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${selectedTargets.includes(t.id)
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:bg-gray-50"
                  } ${dupLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => !dupLoading && toggleTarget(t.id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedTargets.includes(t.id)}
                    onChange={() => { }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={dupLoading}
                  />
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-gray-500">ID: {t.id}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {dupError && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{dupError}</div>
          )}
        </div>
      </AntModal>
    </div>
  );
}