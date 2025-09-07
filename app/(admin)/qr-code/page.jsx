"use client";
import Button from "@/components/atoms/Button";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import SearchAndFilters from "@/components/ui/SearchAndFilters";
import { Modal, Table, Dropdown, Menu, Form, Select } from "antd";
import {
  BarChart3,
  Download,
  Edit,
  Plus,
  QrCode,
  Trash,
  Upload,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "QR Code", href: "#", icon: QrCode, current: true },
];

const data = [
  {
    id: 1,
    title: "Book 1",
    categories: [
      {
        id: 1,
        title: "Fiction",
        subcategories: [
          { id: 1, title: "Fantasy" },
          { id: 2, title: "Science Fiction" },
          { id: 3, title: "Adventure" },
        ],
      },
      {
        id: 2,
        title: "Non-fiction",
        subcategories: [
          { id: 4, title: "Biography" },
          { id: 5, title: "Self-help" },
          { id: 6, title: "History" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Book 2",
    categories: [
      {
        id: 3,
        title: "Children",
        subcategories: [
          { id: 7, title: "Picture Books" },
          { id: 8, title: "Early Reader" },
          { id: 9, title: "Chapter Books" },
        ],
      },
      {
        id: 4,
        title: "Educational",
        subcategories: [
          { id: 10, title: "Science" },
          { id: 11, title: "Mathematics" },
          { id: 12, title: "Language Arts" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Book 3",
    categories: [
      {
        id: 5,
        title: "Mystery",
        subcategories: [
          { id: 13, title: "Detective" },
          { id: 14, title: "Thriller" },
        ],
      },
      {
        id: 6,
        title: "Romance",
        subcategories: [
          { id: 15, title: "Contemporary" },
          { id: 16, title: "Historical" },
          { id: 17, title: "Romantic Comedy" },
        ],
      },
    ],
  },
];

export default function Page() {
  const [newModal, setNewModal] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [qrData, setQrData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editQRCode, setEditQRCode] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const form = Form.useForm();

  // Update categories when book selection changes
  useEffect(() => {
    if (selectedBook) {
      const book = data.find(book => book.id === selectedBook);
      setCategories(book?.categories || []);
    } else {
      setCategories([]);
    }
    setSelectedCategory(null);
  }, [selectedBook]);

  const handleGenerateQRCode = () => {
    const book = data.find(b => b.id === selectedBook);
    const category = categories.find(c => c.id === selectedCategory);
    
    const qrValue = JSON.stringify({
      url: url,
      book: book?.title || "",
      category: category?.title || ""
    });
    
    if(!book?.title) {
      toast.warn("اختر كتاب أولا!");
      return
    }

    if(!category?.title) {
      toast.warn("اختر قسم أولا !");
      return;
    }
     
    const newQr = {
      id: new Date().getTime(),
      url: url,
      book: book?.title || "",
      category: category?.title || "",
      qrCode: qrValue,
    };
    
    setQrData([...qrData, newQr]);
    setUrl("");
    setSelectedBook(null);
    setSelectedCategory(null);
    setNewModal(false);
  };

  const handleEditQRCode = (record) => {
    setEditQRCode(record);
    setUrl(record.url);
    
    // Find the book and category from the record
    const book = data.find(b => b.title === record.book);
    if (book) {
      setSelectedBook(book.id);
      const category = book.categories.find(c => c.title === record.category);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
    
    setEditModal(true);
  };

  const handleDeleteQRCode = (id) => {
    const updatedData = qrData.filter((item) => item.id !== id);
    setQrData(updatedData);
  };

  const handleSaveEditQRCode = () => {
    const book = data.find(b => b.id === selectedBook);
    const category = categories.find(c => c.id === selectedCategory);
    
    const qrValue = JSON.stringify({
      url: url,
      book: book?.title || "",
      category: category?.title || ""
    });
    
    const updatedData = qrData.map((item) =>
      item.id === editQRCode.id 
        ? { 
            ...item, 
            url: url, 
            book: book?.title || "",
            category: category?.title || "",
            qrCode: qrValue 
          } 
        : item
    );
    
    setQrData(updatedData);
    setEditModal(false);
    setUrl("");
    setSelectedBook(null);
    setSelectedCategory(null);
  };

  const columns = [
    { title: "رقم التعريف", dataIndex: "id", key: "id" },
    { title: "الرابط", dataIndex: "url", key: "url" },
    { title: "الكتاب", dataIndex: "book", key: "book" },
    { title: "الفئة", dataIndex: "category", key: "category" },
    {
      title: "QR Code",
      key: "qrCode",
      render: (text, record) => <QRCode value={record.qrCode} size={100} />,
    },
    {
      title: "اكشن",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleEditQRCode(record)}
            className="border rounded-md hover:bg-green-500 hover:text-white transition-all duration-100 border-green-500 text-green-500 flex justify-center items-center p-2"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDeleteQRCode(record.id)}
            className="border rounded-md hover:bg-red-500 hover:text-white transition-all duration-100 border-red-500 text-red-500 flex justify-center items-center p-2"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<Upload />}>
        استيراد
      </Menu.Item>
      <Menu.Item key="2" icon={<Download />}>
        تصدير
      </Menu.Item>
    </Menu>
  );

  return (
    <PageLayout>
      <div style={{ dir: "rtl" }}>
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title={"إدارة QR Code "}
          subtitle={"نظّم وأدر QR Code "}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button type="default" icon={<Upload className="w-4 h-4" />}>
                  استيراد / تصدير
                </Button>
              </Dropdown>
              <Button
                onClick={() => setNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة QR Code
              </Button>
            </div>
          }
        />

        <Table
          columns={columns}
          dataSource={qrData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="mt-6"
          rowClassName="hover:bg-gray-50 cursor-pointer"
        />

        {/* Create QR Code Modal */}
        <Modal
          open={newModal}
          onCancel={() => {
            setNewModal(false);
            setSelectedBook(null);
            setSelectedCategory(null);
            setUrl("");
          }}
          footer={null}
          title="إنشاء QR Code"
          className="modal"
        >
          <div className="modal-content">
            <div className="flex flex-col gap-4">
              <div label="الكتاب" className="flex flex-col gap-2">
                <label>الكتاب</label>
                <Select
                  placeholder="اختر الكتاب"
                  value={selectedBook}
                  onChange={setSelectedBook}
                  options={data?.map((item) => ({
                    label: item?.title,
                    value: item?.id,
                  }))}
                />
              </div>

              {categories.length > 0 && (
                <div label="الفئة" className="flex flex-col gap-2">
                  <label htmlFor="">الفئة</label>
                  <Select
                    placeholder="اختر الفئة"
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categories?.map((item) => ({
                      label: item?.title,
                      value: item?.id,
                    }))}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label>ادخل اللينك</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="أدخل الرابط هنا"
                  className="input border border-gray-200 rounded-md p-2 w-full"
                />
              </div>
              
              <Button 
                onClick={handleGenerateQRCode} 
                className="mt-4"
                disabled={!url || !selectedBook}
              >
                إنشاء QR Code
              </Button>
              
              {url && (
                <div className="mt-4 text-center">
                  <QRCode 
                    value={JSON.stringify({
                      url: url,
                      book: data.find(b => b.id === selectedBook)?.title || "",
                      category: categories.find(c => c.id === selectedCategory)?.title || ""
                    })} 
                    size={256} 
                  />
                  <p className="mt-2 text-gray-500">رابط: {url}</p>
                </div>
              )}
            </div>
          </div>
        </Modal>

        {/* Edit QR Code Modal */}
        <Modal
          open={editModal}
          onCancel={() => {
            setEditModal(false);
            setSelectedBook(null);
            setSelectedCategory(null);
            setUrl("");
          }}
          footer={null}
          title="تعديل QR Code"
          className="modal"
        >
          <div className="modal-content">
            <div className="flex flex-col gap-4">
              <div label="الكتاب" className="flex flex-col gap-2">
                <label>الكتاب</label>
                <Select
                  placeholder="اختر الكتاب"
                  value={selectedBook}
                  onChange={setSelectedBook}
                  options={data?.map((item) => ({
                    label: item?.title,
                    value: item?.id,
                  }))}
                />
              </div>

              {categories.length > 0 && (
                <div label="الفئة" className="flex flex-col gap-2">
                  <label>الفئة</label>
                  <Select
                    placeholder="اختر الفئة"
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categories?.map((item) => ({
                      label: item?.title,
                      value: item?.id,
                    }))}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label>ادخل اللينك</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="أدخل الرابط هنا"
                  className="input border border-gray-200 rounded-md p-2 w-full"
                />
              </div>
              
              <Button 
                onClick={handleSaveEditQRCode} 
                className="mt-4"
                disabled={!url || !selectedBook}
              >
                حفظ التعديلات
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}