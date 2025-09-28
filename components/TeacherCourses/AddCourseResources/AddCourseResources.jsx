import {
  Button,
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Radio,
  Switch,
  Tooltip,
} from "antd";
import React from "react";
import {
  FolderOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";



export default function AddCourseResources({
  videos,
  setVideos,
}) {
  const [form] = Form.useForm();

  // يساعد على عرض "الموعد الفعّال" (المخصص إن وُجد، وإلا العام، وإلا فوري)
  const getEffectiveDt = (custom, globalMode, globalDt) => {
    if (custom) return custom;
    if (globalMode === "schedule" && globalDt) {
      return dayjs(globalDt).toISOString();
    }
    return undefined; // فوري
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FolderOutlined className="text-purple-600" />
          المصادر والملفات
        </h3>

        {/* ======= جدولة عامة للمصادر ككل ======= */}
        <div className="rounded-xl border border-purple-200 bg-white p-4 mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold text-gray-800">جدولة ظهور المصادر (ككل)</div>
            <Tooltip title="يمكنك اختيار موعد عام لكل المصادر، ويمكنك لاحقًا تخصيص الموعد لعناصر معينة.">
              <InfoCircleOutlined className="text-gray-400" />
            </Tooltip>
          </div>

          <Row gutter={16} className="mt-3">
            <Col xs={24} md={10}>
              <Form.Item
                name={["resources", "releaseMode"]}
                initialValue="now"
                label="طريقة الظهور"
              >
                <Radio.Group className="flex gap-4">
                  <Radio value="now">فوري</Radio>
                  <Radio value="schedule">تحديد موعد</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={14}>
              <Form.Item
                noStyle
                shouldUpdate={(p, c) =>
                  p?.resources?.releaseMode !== c?.resources?.releaseMode
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue(["resources", "releaseMode"]) === "schedule" ? (
                    <Form.Item
                      name={["resources", "visibleAt"]}
                      label="الموعد العام"
                      tooltip="يُستخدم لجميع العناصر ما لم تحدد موعدًا مخصصًا لها"
                      rules={[{ required: true, message: "اختر الموعد العام" }]}
                    >
                      <DatePicker showTime className="w-full" />
                    </Form.Item>
                  ) : (
                    <div className="text-sm text-gray-500 mt-2">
                      سيتم الظهور <b>فورًا</b> لكل العناصر التي لا تملك موعدًا مخصصًا.
                    </div>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* ======= روابط الموارد + مواعيد الظهور ======= */}
        <Form form={form} layout="vertical">
          <Row gutter={24}>
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

              <Form.Item
                label="موعد مخصص؟"
                valuePropName="checked"
                name={["resources", "telegramUseCustom"]}
                initialValue={false}
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(p, c) =>
                  p?.resources?.telegramUseCustom !==
                  c?.resources?.telegramUseCustom ||
                  p?.resources?.releaseMode !== c?.resources?.releaseMode ||
                  p?.resources?.visibleAt !== c?.resources?.visibleAt
                }
              >
                {({ getFieldValue }) => {
                  const useCustom = getFieldValue(["resources", "telegramUseCustom"]);
                  const mode = getFieldValue(["resources", "releaseMode"]);
                  const globalDt = getFieldValue(["resources", "visibleAt"]);

                  return (
                    <>
                      {useCustom ? (
                        <Form.Item
                          label="موعد الظهور (مخصص)"
                          name={["resources", "telegramVisibleAt"]}
                          rules={[{ required: true, message: "اختر موعد الظهور" }]}
                        >
                          <DatePicker
                            showTime
                            className="w-full"
                            placeholder="اختر تاريخ/وقت لظهور رابط التليجرام"
                          />
                        </Form.Item>
                      ) : (
                        <div className="text-xs text-gray-600 -mt-2 mb-4">
                          الموعد الفعّال:{" "}
                          {mode === "schedule" && globalDt
                            ? dayjs(globalDt).format("YYYY/MM/DD HH:mm")
                            : "فوري"}
                        </div>
                      )}
                    </>
                  );
                }}
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

              <Form.Item
                label="موعد مخصص؟"
                valuePropName="checked"
                name={["resources", "whatsappUseCustom"]}
                initialValue={false}
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(p, c) =>
                  p?.resources?.whatsappUseCustom !==
                    c?.resources?.whatsappUseCustom ||
                  p?.resources?.releaseMode !== c?.resources?.releaseMode ||
                  p?.resources?.visibleAt !== c?.resources?.visibleAt
                }
              >
                {({ getFieldValue }) => {
                  const useCustom = getFieldValue(["resources", "whatsappUseCustom"]);
                  const mode = getFieldValue(["resources", "releaseMode"]);
                  const globalDt = getFieldValue(["resources", "visibleAt"]);

                  return (
                    <>
                      {useCustom ? (
                        <Form.Item
                          label="موعد الظهور (مخصص)"
                          name={["resources", "whatsappVisibleAt"]}
                          rules={[{ required: true, message: "اختر موعد الظهور" }]}
                        >
                          <DatePicker
                            showTime
                            className="w-full"
                            placeholder="اختر تاريخ/وقت لظهور رابط الواتساب"
                          />
                        </Form.Item>
                      ) : (
                        <div className="text-xs text-gray-600 -mt-2 mb-4">
                          الموعد الفعّال:{" "}
                          {mode === "schedule" && globalDt
                            ? dayjs(globalDt).format("YYYY/MM/DD HH:mm")
                            : "فوري"}
                        </div>
                      )}
                    </>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* ======= ملفات إضافية + مواعيد الظهور لكل عنصر ======= */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FolderOutlined className="text-blue-600" />
            ملفات إضافية
          </h4>

          <Form
            form={form}
            layout="vertical"
            // نحتاج القيم العامة لعرض الموعد الفعّال للملفات
            onValuesChange={() => {}}
          >
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const mode = getFieldValue(["resources", "releaseMode"]);
                const globalDt = getFieldValue(["resources", "visibleAt"]);

                return (
                  <>
                    <div className="space-y-3">
                      {videos.map((v, idx) => {
                        const effective = getEffectiveDt(
                          v.useCustomVisibleAt ? v.visibleAt : undefined,
                          mode,
                          globalDt
                        );

                        return (
                          <div
                            key={v.id}
                            className="grid grid-cols-1 md:grid-cols-6 gap-3 rounded-lg border bg-white p-3"
                          >
                            {/* اسم الملف */}
                            <div className="md:col-span-2">
                              <Input
                                value={v.name}
                                onChange={(e) =>
                                  setVideos((arr) =>
                                    arr.map((x, i) =>
                                      i === idx ? { ...x, name: e.target.value } : x
                                    )
                                  )
                                }
                                placeholder="اسم الملف"
                                className="rounded-lg"
                              />
                            </div>

                            {/* اختيار الملف / الرابط */}
                            <div className="md:col-span-2">
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  setVideos((arr) =>
                                    arr.map((x, i) =>
                                      i === idx
                                        ? {
                                            ...x,
                                            url: file ? file.name : "",
                                          }
                                        : x
                                    )
                                  );
                                }}
                                className="rounded-lg"
                              />
                            </div>

                            {/* تفعيل موعد مخصص */}
                            <div className="md:col-span-1 flex items-center gap-2">
                              <span className="text-sm text-gray-700">موعد مخصص؟</span>
                              <Switch
                                checked={!!v.useCustomVisibleAt}
                                onChange={(checked) =>
                                  setVideos((arr) =>
                                    arr.map((x, i) =>
                                      i === idx
                                        ? {
                                            ...x,
                                            useCustomVisibleAt: checked,
                                            // إذا أُطفئ التخصيص، امسح التاريخ المخصص
                                            visibleAt: checked ? x.visibleAt : undefined,
                                          }
                                        : x
                                    )
                                  )
                                }
                              />
                            </div>

                            {/* موعد الظهور (مخصص/فعّال) */}
                            <div className="md:col-span-1">
                              {v.useCustomVisibleAt ? (
                                <DatePicker
                                  showTime
                                  className="w-full"
                                  placeholder="موعد مخصص"
                                  value={v.visibleAt ? dayjs(v.visibleAt) : undefined}
                                  onChange={(val) =>
                                    setVideos((arr) =>
                                      arr.map((x, i) =>
                                        i === idx
                                          ? {
                                              ...x,
                                              visibleAt: val
                                                ? val.toISOString()
                                                : undefined,
                                            }
                                          : x
                                      )
                                    )
                                  }
                                />
                              ) : (
                                <div className="text-xs text-gray-600 mt-1">
                                  فعّال:{" "}
                                  {effective
                                    ? dayjs(effective).format("YYYY/MM/DD HH:mm")
                                    : "فوري"}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      className="mt-3"
                      onClick={() =>
                        setVideos((arr) => [
                          ...arr,
                          {
                            id: Date.now(),
                            name: "",
                            url: "",
                            useCustomVisibleAt: false,
                            visibleAt: undefined,
                          },
                        ])
                      }
                    >
                      إضافة ملف
                    </Button>
                  </>
                );
              }}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
