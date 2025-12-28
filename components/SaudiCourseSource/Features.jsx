import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllRoundFeatures } from "../../lib/features/featuresSlice";
import { Spin, Tooltip } from "antd";
import PagesHeader from "../ui/PagesHeader";
import Button from "../atoms/Button";
import AddFeatureModal from "../RoundContent/Features/AddFeatureModal";
import { Edit, Trash } from "lucide-react";
import EditFeatureModal from "../RoundContent/Features/EditFeatureModal";
import DeleteFeatureModal from "../RoundContent/Features/DeleteFeatureModal";

export default function Features({
  roundId,
  currentStep,
  goToNextStep,
  goToPrevStep,
  STEPS,
  isSource
}) {
  const dispatch = useDispatch();
  const { all_features_loading, all_features_list } = useSelector(
    (state) => state?.features
  );
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    dispatch(
      handleGetAllRoundFeatures({
        body: {
          round_id: roundId,
        },
      })
    );
  }, [roundId, dispatch]);

  // Handle Loading State
  if (all_features_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning />
      </div>
    );
  }

  const features = all_features_list?.data?.message || [];
  
  // --- Card Render Logic ---
  const renderFeatureCard = (feature) => (
   <div
  key={feature.id}
  className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden 
             hover:shadow-2xl hover:scale-[1.05] transition-all duration-300"
>
  {/* Feature Image Area */}
  <div className="relative w-full h-[250px]">
    <img
      src={feature?.image ? (feature?.image_url) : "/images/logo.svg"}
      alt={feature.title}
      className="w-full h-full object-cover rounded-t-xl"
      onError={(e) => {
        e.target.src =
          "/images/logo.svg";
        e.target.className =
          "w-full h-full object-contain bg-gray-100 p-8 opacity-80"; // Adjust styling for placeholder
      }}
    />
  </div>

  {/* Feature Content */}
  <div className="px-6 py-4">
    <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
      {feature.title}
    </h2>

    <p className="text-gray-600 text-sm overflow-hidden mb-4 line-clamp-3">
      {feature.description}
    </p>
  </div>

  {/* Feature Actions Footer */}
  <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
    <div className="flex gap-4 text-gray-500">
      <Tooltip title="Edit">
        <Edit
          size={20}
          className="cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => {
            setRowData({
              ...feature,
              feature_id: feature.id, // Ensure the feature ID is correctly mapped for editing
              image: feature.image_url, // Pass the image URL for the edit modal
            });
            setOpenEditModal(true);
          }}
        />
      </Tooltip>

      <Tooltip title="Delete">
        <Trash
          size={20}
          className="cursor-pointer hover:text-red-600 transition-colors"
          onClick={() => {
            setRowData({
              ...feature,
              feature_id: feature.id, // Ensure ID is mapped for deletion
            });
            setOpenDeleteModal(true);
          }}
        />
      </Tooltip>
    </div>
  </div>
</div>

  );

  // --- Main Component Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <PagesHeader
          title={"مميزات الدورة"}
          subtitle={"قم بإدارة وتنظيم مميزات الدورة وإمكانياتها"}
          extra={
            <Button
              className="!bg-indigo-600 hover:!bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors"
              onClick={() => {
                console.log("setOpenAddModal(true)")
                setOpenAddModal(true)
              }}
            >
              إضافة مميزة جديدة
            </Button>
          }
        />

           {features?.length == 0 && <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16 px-4">
        <p className="text-gray-500 text-lg mb-4">
          لا تتوفر مميزات حالياً لهذه الدورة.
        </p>
        <Button
        className="!bg-indigo-600 hover:!bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors"
        onClick={() => {
          console.log("jello")
          setOpenAddModal(true)
        }}>إضافة مميزة جديدة</Button>
      </div>}
      
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {features.map(renderFeatureCard)}
        </div>
      </div>

      {/* Modals */}
      <AddFeatureModal
        id={roundId}
        open={openAddModal}
        setOpen={setOpenAddModal}
      />
      <EditFeatureModal
        id={roundId}
        open={openEditModal}
        setOpen={setOpenEditModal}
        rowData={rowData}
        setRowData={setRowData}
      />
      <DeleteFeatureModal
        id={roundId}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        rowData={rowData}
      />

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
          onClick={goToNextStep}
          // disabled={currentStep === STEPS.length}
          className={`rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition duration-150 hover:bg-blue-700 
            `}
        >
          {currentStep === STEPS.length ? "إنهاء ونشر" : "التالي"}
        </button>
      </div>
    </div>
  );
}
