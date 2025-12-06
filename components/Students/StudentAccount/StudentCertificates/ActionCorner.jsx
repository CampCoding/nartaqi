import { Edit, Trash2 } from "lucide-react";

 const ActionCorner = ({ onEdit, onDelete }) => (
    <div className="absolute top-3 left-3 z-10 flex gap-2">
      <button
        onClick={onEdit}
        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
        title="تعديل"
      >
        <Edit size={14}/>
      </button>
      <button
        onClick={onDelete}
        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
        title="حذف"
      >
        <Trash2 size={14}/>
      </button>
    </div>
  );

  export default ActionCorner