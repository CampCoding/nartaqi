"use client"


import React, { useState } from 'react';
import { Button, Table, Tag, Space, Modal, Input, Select, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined, GlobalOutlined, CalculatorOutlined, ExperimentOutlined } from '@ant-design/icons';

const { Option } = Select;

const QuestionManager = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Explain Newton's Second Law",
      category: "Physics",
      difficulty: "Medium",
      tags: ["mechanics", "laws"]
    },
    {
      id: 2,
      question: "What is the capital of France?",
      category: "Geography", 
      difficulty: "Easy",
      tags: ["europe", "capitals"]
    },
    {
      id: 3,
      question: "Solve x^2 - 4 = 0",
      category: "Math",
      difficulty: "Easy",
      tags: ["algebra", "equations"]
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    category: '',
    difficulty: '',
    tags: []
  });

  const categoryIcons = {
    Physics: <ExperimentOutlined className="text-purple-500" />,
    Geography: <GlobalOutlined className="text-green-500" />,
    Math: <CalculatorOutlined className="text-blue-500" />,
    Literature: <BookOutlined className="text-yellow-600" />
  };

  const categoryColors = {
    Physics: 'bg-purple-100 text-purple-800 border-purple-200',
    Geography: 'bg-green-100 text-green-800 border-green-200',
    Math: 'bg-blue-100 text-blue-800 border-blue-200',
    Literature: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      question: '',
      category: '',
      difficulty: '',
      tags: []
    });
    setIsModalVisible(true);
  };

  const handleEditQuestion = (record) => {
    setEditingQuestion(record);
    setFormData(record);
    setIsModalVisible(true);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
    message.success('Question deleted successfully');
  };

  const handleSubmit = () => {
    if (!formData.question || !formData.category || !formData.difficulty) {
      message.error('Please fill in all required fields');
      return;
    }

    if (editingQuestion) {
      setQuestions(questions.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...formData }
          : q
      ));
      message.success('Question updated successfully');
    } else {
      const newQuestion = {
        ...formData,
        id: Math.max(...questions.map(q => q.id)) + 1
      };
      setQuestions([...questions, newQuestion]);
      message.success('Question added successfully');
    }
    setIsModalVisible(false);
    setFormData({
      question: '',
      category: '',
      difficulty: '',
      tags: []
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      className: 'font-medium text-slate-700'
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      className: 'font-medium text-slate-800',
      render: (text) => (
        <div className="max-w-md">
          <Tooltip title={text}>
            <span className="truncate block">{text}</span>
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {categoryIcons[category]}
          <span className="font-medium text-sm">{category}</span>
        </div>
      )
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty) => (
        <Tag className={`border-0 font-medium ${difficultyColors[difficulty] || 'bg-gray-100 text-gray-800'}`}>
          {difficulty}
        </Tag>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags?.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Question">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditQuestion(record)}
              className="text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Question"
            description="Are you sure you want to delete this question?"
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ className: 'bg-red-500 hover:bg-red-600' }}
          >
            <Tooltip title="Delete Question">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
    
    <div style={{ backgroundColor: '#F9FAFC' }} className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200" style={{ backgroundColor: '#F9FAFC' }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#202938' }}>
                  Manage Questions
                </h1>
                <p className="text-slate-600 mt-1">
                  Create, edit, and organize your question bank
                </p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddQuestion}
                size="large"
                className="shadow-sm font-medium"
                style={{ 
                  backgroundColor: '#0F7490',
                  borderColor: '#0F7490',
                  color: 'white'
                }}
              >
                Add Question
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="text-2xl font-bold" style={{ color: '#0F7490' }}>
                  {questions.length}
                </div>
                <div className="text-sm text-slate-600">Total Questions</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="text-2xl font-bold" style={{ color: '#C9AE6C' }}>
                  {new Set(questions.map(q => q.category)).size}
                </div>
                <div className="text-sm text-slate-600">Categories</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                  {questions.filter(q => q.difficulty === 'Easy').length}
                </div>
                <div className="text-sm text-slate-600">Easy Questions</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="text-2xl font-bold" style={{ color: '#202938' }}>
                  {questions.filter(q => q.difficulty === 'Hard').length}
                </div>
                <div className="text-sm text-slate-600">Hard Questions</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-6">
            <Table
              columns={columns}
              dataSource={questions}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} questions`,
                showSizeChanger: true,
                showQuickJumper: true
              }}
              className="border border-slate-200 rounded-lg overflow-hidden"
              rowClassName="hover:bg-slate-50 transition-colors"
            />
          </div>
        </div>

        {/* Add/Edit Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <PlusOutlined style={{ color: '#0F7490' }} />
              <span style={{ color: '#202938' }}>
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </span>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={
            <div className="flex justify-end gap-3">
              <Button onClick={() => setIsModalVisible(false)} className="font-medium">
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                className="font-medium shadow-sm"
                style={{ 
                  backgroundColor: '#0F7490',
                  borderColor: '#0F7490'
                }}
              >
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </Button>
            </div>
          }
          width={600}
          className="top-8"
        >
          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-medium mb-2" style={{ color: '#202938' }}>
                Question <span className="text-red-500">*</span>
              </label>
              <Input.TextArea
                rows={3}
                placeholder="Enter your question here..."
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="border-slate-300 focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2" style={{ color: '#202938' }}>
                  Category <span className="text-red-500">*</span>
                </label>
                <Select 
                  placeholder="Select category" 
                  className="w-full"
                  value={formData.category}
                  onChange={(value) => setFormData({...formData, category: value})}
                >
                  <Option value="Physics">
                    <div className="flex items-center gap-2">
                      {categoryIcons.Physics} Physics
                    </div>
                  </Option>
                  <Option value="Geography">
                    <div className="flex items-center gap-2">
                      {categoryIcons.Geography} Geography
                    </div>
                  </Option>
                  <Option value="Math">
                    <div className="flex items-center gap-2">
                      {categoryIcons.Math} Math
                    </div>
                  </Option>
                  <Option value="Literature">
                    <div className="flex items-center gap-2">
                      {categoryIcons.Literature} Literature
                    </div>
                  </Option>
                </Select>
              </div>

              <div>
                <label className="block font-medium mb-2" style={{ color: '#202938' }}>
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <Select 
                  placeholder="Select difficulty"
                  className="w-full"
                  value={formData.difficulty}
                  onChange={(value) => setFormData({...formData, difficulty: value})}
                >
                  <Option value="Easy">Easy</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Hard">Hard</Option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ color: '#202938' }}>
                Tags
              </label>
              <Select
                mode="tags"
                placeholder="Add tags (press Enter to add)"
                className="w-full"
                value={formData.tags}
                onChange={(value) => setFormData({...formData, tags: value})}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
    </>
  );
};

export default QuestionManager;