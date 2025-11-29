import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import {
  FolderOutlined,
  LinkOutlined,
  CopyOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllRoundResources } from "../../lib/features/resourcesSlice";
import { useRouter } from "next/navigation";

export default function AddCourseSourceResource({
  videos,
  setVideos,
  duplicateTargets = [],              // [{ id, title }]
  onDuplicateResources,  
  goToNextStep,
  goToPrevStep,
  currentStep   ,
  id    ,
  STEPS
        // async ({ links, files }, targetIds) => {}
}) {
  // If this component is rendered inside a <Form>, this gives access to its values
  const form = Form.useFormInstance?.();
  const router =useRouter();
  // ----- Duplicate to other courses (checkbox list) -----
  const [dupOpen, setDupOpen] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [dupError, setDupError] = useState("");
  const [targetsSearch, setTargetsSearch] = useState("");
  const [selectedTargets, setSelectedTargets] = useState([]);
  const dispatch = useDispatch();
  const {add_resource_loading , all_resources_loading , all_resources_list} = useSelector(state => state?.resource)

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

      // Read telegram/whatsapp from the parent form if available
      const telegram = form?.getFieldValue?.(["resources", "telegram"]) ?? undefined;
      const whatsapp = form?.getFieldValue?.(["resources", "whatsapp"]) ?? undefined;

      const files = (videos || []).map((v) => ({
        id: v.id,
        name: v.name || "",
        source: v.source === "upload" ? "upload" : "url",
        url: v.source === "url" ? (v.url || "") : undefined,
        file: v.source === "upload" ? v.file : undefined,
      }));

      if (onDuplicateResources) {
        await onDuplicateResources(
          { links: { telegram, whatsapp }, files },
          selectedTargets
        );
      } else {
        // Fallback for testing
        // eslint-disable-next-line no-console
        console.log("Duplicate resources ->", {
          links: { telegram, whatsapp },
          files,
          to: selectedTargets,
        });
      }

      setDupOpen(false);
    } catch (e) {
      setDupError(e?.message || "تعذّر النسخ، جرّب مرة أخرى.");
    } finally {
      setDupLoading(false);
    }
  };

  // ----- Helpers for files list -----
  const updateItem = (index, patch) => {
    setVideos((arr) => arr.map((x, i) => (i === index ? { ...x, ...patch } : x)));
  };

  const removeItem = (index) => {
    setVideos((arr) => arr.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setVideos((arr) => [
      ...arr,
      { id: Date.now(), name: "", source: "url", url: "" },
    ]);
  };

  useEffect(() => {
    dispatch(handleGetAllRoundResources())
  } , [dispatch])

  useEffect(() => {
    console.log(all_resources_list)
  } , [all_resources_list])

  return (
    <div className="space-y-8">
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

        {/* Links (telegram / whatsapp) — these Form.Items bind to parent Form */}
        <Row gutter={24} className="mt-2">
          <Col span={12}>
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <LinkOutlined className="text-blue-500" />
                  رابط مجموعة التليجرام
                </span>
              }
              name={["resources", "telegram"]}
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
            >
              <Input
                placeholder="https://chat.whatsapp.com/groupid"
                className="rounded-xl"
                prefix={<LinkOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Files list */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FolderOutlined className="text-blue-600" />
            ملفات إضافية
          </h4>

          <div className="space-y-3">
            {(videos || []).map((v, idx) => {
              const source = v.source === "upload" ? "upload" : "url";
              return (
                <div
                  key={v.id ?? idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-white rounded-xl p-3 border"
                >
                  {/* name */}
                  <div className="md:col-span-3">
                    <Input
                      value={v.name}
                      onChange={(e) => updateItem(idx, { name: e.target.value })}
                      placeholder="اسم الملف"
                      className="rounded-lg"
                    />
                  </div>

                  {/* source switcher */}
                  <div className="md:col-span-2">
                    <select
                      className="w-full h-10 rounded-lg border px-2"
                      value={source}
                      onChange={(e) =>
                        updateItem(idx, {
                          source: e.target.value === "upload" ? "upload" : "url",
                          // reset opposite field
                          url: e.target.value === "url" ? (v.url || "") : undefined,
                          file: e.target.value === "upload" ? undefined : v.file,
                        })
                      }
                    >
                      <option value="url">رابط</option>
                      <option value="upload">رفع ملف</option>
                    </select>
                  </div>

                  {/* url OR file */}
                  {source === "url" ? (
                    <div className="md:col-span-5">
                      <Input
                        value={v.url}
                        onChange={(e) => updateItem(idx, { url: e.target.value })}
                        placeholder="رابط (PDF/فيديو/ملف على السحابة)"
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="md:col-span-5">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="file"
                          accept="*/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            updateItem(idx, { file });
                            e.currentTarget.value = ""; // reset so same file can be selected again later
                          }}
                          className="hidden"
                          id={`file-picker-${idx}`}
                        />
                        <Button
                          icon={<UploadOutlined />}
                          onClick={() =>
                            document.getElementById(`file-picker-${idx}`)?.click()
                          }
                        >
                          اختر ملفًا
                        </Button>
                        <span className="text-sm text-gray-600">
                          {v.file?.name ? `تم اختيار: ${v.file.name}` : "لا يوجد ملف محدد"}
                        </span>
                      </label>
                    </div>
                  )}

                  {/* actions */}
                  <div className="md:col-span-2 flex items-center gap-2 justify-start md:justify-end">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeItem(idx)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="mt-3" onClick={addItem}>
            إضافة ملف
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-between space-x-4 space-x-reverse">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${
                currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              السابق
            </button>
            <button
              onClick={() => {
                router.push(`/round_content?id=${id}`)
              }}
              className={`rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition duration-150 hover:bg-blue-700 `}
            >
              {currentStep === STEPS.length ? "إنهاء ونشر" : "التالي"}
            </button>
          </div>

      {/* Duplicate Modal */}
      <Modal
        open={dupOpen}
        onCancel={() => setDupOpen(false)}
        onOk={confirmDuplicate}
        okText={dupLoading ? "جارٍ النسخ..." : "نسخ"}
        cancelText="إلغاء"
        confirmLoading={dupLoading}
        width={560}
        title="نسخ الموارد والملفات إلى دورات أخرى"
      >
        <div className="space-y-3" dir="rtl">
          <Input.Search
            placeholder="ابحث عن دورة هدف..."
            allowClear
            onChange={(e) => setTargetsSearch(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
              onClick={toggleAllTargets}
            >
              {selectedTargets.length === filteredTargets.length
                ? "إلغاء تحديد الكل"
                : "تحديد الكل"}
            </button>
            <div className="text-xs text-gray-500">
              المختار: {selectedTargets.length}/{filteredTargets.length}
            </div>
          </div>

          {filteredTargets.length > 0 ? (
            <div className="max-h-64 overflow-auto space-y-2 pr-1">
              {filteredTargets.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                    selectedTargets.includes(t.id)
                      ? "border-emerald-400 bg-emerald-50/50"
                      : "border-gray-200"
                  }`}
                  onClick={() => toggleTarget(t.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTargets.includes(t.id)}
                      onChange={() => toggleTarget(t.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{t.title}</div>
                      <div className="text-xs text-gray-500">ID: {t.id}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
              لا توجد دورات مطابقة لبحثك.
            </div>
          )}

          {dupError && <div className="text-sm text-red-600">{dupError}</div>}
        </div>
      </Modal>
    </div>
  );
}
