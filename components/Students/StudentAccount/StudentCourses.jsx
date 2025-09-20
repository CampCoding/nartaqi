import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
  Play,
  Plus,
  Trash2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Modal, Select, message, Tooltip, Input } from "antd";
import Button from "../../atoms/Button";

const { Option } = Select;

// Progress bar صغير
const StudentProgressBar = ({ value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ease-out ${
          colorClasses[color] || colorClasses.blue
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default function StudentCourses() {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [openAddCourse, setOpenAddCourse] = useState(false);
  const [pickedCourseId, setPickedCourseId] = useState();

  // ====== Filters state ======
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | completed | pending
  const [difficultyFilter, setDifficultyFilter] = useState("all"); // all | مبتدئ | متوسط | متقدم
  const [instructorFilter, setInstructorFilter] = useState("all"); // all | instructor name

  // مكتبة دورات تجريبية للإضافة
  const availableCourses = useMemo(
    () => [
      {
        id: "c-web",
        title: "تطوير تطبيقات الويب",
        instructor: "أحمد محمد",
        duration: "6 أسابيع",
        difficulty: "متوسط",
        color: "blue",
        banner:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "c-ai",
        title: "علوم البيانات والذكاء الاصطناعي",
        instructor: "فاطمة أحمد",
        duration: "8 أسابيع",
        difficulty: "متقدم",
        color: "green",
        banner:
          "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "c-design",
        title: "التصميم الجرافيكي",
        instructor: "سارة علي",
        duration: "4 أسابيع",
        difficulty: "مبتدئ",
        color: "purple",
        banner:
          "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "c-comm",
        title: "مهارات التواصل الفعال",
        instructor: "محمد سامي",
        duration: "3 أسابيع",
        difficulty: "مبتدئ",
        color: "orange",
        banner:
          "https://images.unsplash.com/photo-1526546342926-7c369de3f529?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    []
  );

  // الحالة الفعلية لدوراتي
  const [courses, setCourses] = useState([
    {
      id: "c-web",
      title: "تطوير تطبيقات الويب",
      instructor: "أحمد محمد",
      status: "نشط",
      progress: 75,
      completedLessons: 15,
      totalLessons: 20,
      nextLesson: "React Hooks المتقدمة",
      color: "blue",
      duration: "6 أسابيع",
      difficulty: "متوسط",
      hidden: false, // <= بدّلنا من visible إلى hidden (لكن لا نختفي من القائمة)
      banner:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "c-ai",
      title: "علوم البيانات والذكاء الاصطناعي",
      instructor: "فاطمة أحمد",
      status: "مكتمل",
      progress: 100,
      completedLessons: 25,
      totalLessons: 25,
      completionDate: "15 يوليو 2024",
      color: "green",
      duration: "8 أسابيع",
      difficulty: "متقدم",
      hidden: false,
      banner:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "c-design",
      title: "التصميم الجرافيكي",
      instructor: "سارة علي",
      status: "نشط",
      progress: 0,
      completedLessons: 0,
      totalLessons: 12,
      nextLesson: "مقدمة في Adobe Illustrator",
      color: "purple",
      duration: "4 أسابيع",
      difficulty: "مبتدئ",
      hidden: false,
      banner:
        "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop",
    },
  ]);

  // === Helpers ===
  const getStatusIcon = (status) => {
    switch (status) {
      case "نشط":
        return <Play className="w-3 h-3" />;
      case "مكتمل":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "مبتدئ":
        return "text-green-600 bg-green-50";
      case "متوسط":
        return "text-yellow-600 bg-yellow-50";
      case "متقدم":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };
  const calculateOverallProgress = () => {
    if (courses.length === 0) return 0;
    const totalProgress = courses.reduce((sum, c) => sum + c.progress, 0);
    return Math.round(totalProgress / courses.length);
  };

  // === Actions: add / delete / toggle label ===
  const addCourse = () => {
    if (!pickedCourseId) return;
    const found = availableCourses.find((c) => c.id === pickedCourseId);
    if (!found) return;

    const exists = courses.some((c) => c.id === found.id);
    if (exists) {
      message.warning("هذه الدورة موجودة بالفعل في قائمتك");
      return;
    }

    const newCourse = {
      id: found.id,
      title: found.title,
      instructor: found.instructor,
      status: "نشط",
      progress: 0,
      completedLessons: 0,
      totalLessons: 12,
      nextLesson: "سيتم تحديدها",
      color: found.color,
      duration: found.duration,
      difficulty: found.difficulty,
      hidden: false, // يبقى معروض، فقط شارة تتغير
      banner: found.banner,
    };
    setCourses((p) => [newCourse, ...p]);
    setOpenAddCourse(false);
    setPickedCourseId(undefined);
    message.success("تمت إضافة الدورة");
  };

  const deleteCourse = (id) => {
    setCourses((p) => p.filter((c) => c.id !== id));
    message.success("تم حذف الدورة");
  };

  const toggleHiddenLabel = (id) => {
    setCourses((p) =>
      p.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c))
    );
  };

  // ====== Build filters ======
  const allInstructors = useMemo(
    () => Array.from(new Set(courses.map((c) => c.instructor))),
    [courses]
  );

  const matchesFilters = (c) => {
    if (statusFilter === "active" && c.status !== "نشط") return false;
    if (statusFilter === "completed" && c.status !== "مكتمل") return false;
    if (statusFilter === "pending" && c.status !== "قيد الانتظار") return false;

    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter)
      return false;

    if (instructorFilter !== "all" && c.instructor !== instructorFilter)
      return false;

    if (q.trim()) {
      const t = q.trim().toLowerCase();
      const hay =
        `${c.title} ${c.instructor} ${c.status} ${c.difficulty}`.toLowerCase();
      if (!hay.includes(t)) return false;
    }
    return true;
  };

  const filtered = courses.filter(matchesFilters);
  const activeCourses = filtered.filter((c) => c.status === "نشط");
  const completedCourses = filtered.filter((c) => c.status === "مكتمل");

  // ====== Small UI helpers ======
  const StatusChip = ({ status }) => (
    <span
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        status === "نشط"
          ? "bg-emerald-50 text-emerald-700"
          : status === "مكتمل"
          ? "bg-blue-50 text-blue-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {getStatusIcon(status)}
      {status}
    </span>
  );

  const HiddenLabel = ({ hidden }) => (
    <span
      className={`px-2 py-1 rounded-md text-[11px] font-semibold ${
        hidden ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"
      }`}
    >
      {hidden ? "مخفي" : "ظاهر"}
    </span>
  );

  const CardShell = ({ course, children }) => (
    <div
      className={`group bg-white rounded-3xl shadow-xl border border-gray-100 p-0 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${
        hoveredCourse === course.id ? "ring-4 ring-blue-100" : ""
      }`}
      onMouseEnter={() => setHoveredCourse(course.id)}
      onMouseLeave={() => setHoveredCourse(null)}
    >
      {/* صورة الهيدر */}
      <div className="relative">
        <img
          src={course.banner}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <StatusChip status={course.status} />
          <HiddenLabel hidden={course.hidden} />
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Overall Progress Card */}
        <div className="relative bg-gradient-to-r from-[#87bac8] via-[#3f90a6] to-[#27829b] rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10 backdrop-blur-sm" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  معدل إنجاز الدورات المشترك بها
                </h2>
                <p className="text-blue-100 mt-1">
                  إجمالي التقدم في جميع الدورات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="bg-white bg-opacity-20 rounded-full h-4 mb-2">
                  <div
                    className="bg-white h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${calculateOverallProgress()}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-blue-100">
                  <span>البداية</span>
                  <span>الإتمام</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {calculateOverallProgress()}%
                </div>
                <div className="text-blue-100 text-sm">مكتمل</div>
              </div>
            </div>
          </div>

          {/* زخرفة */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white bg-opacity-5 rounded-full" />
        </div>

        {/* Toolbar: Search + Filters + Add */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="font-semibold">تصفية النتائج</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setOpenAddCourse(true)}
                type="primary"
                className="!text-white !bg-blue-500"
              >
                إضافة كورس
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {/* بحث */}
            <div className="col-span-1 lg:col-span-2">
              <div className="relative">
                <Input
                  placeholder="ابحث بالعنوان أو المدرّس أو الحالة…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="rounded-xl"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* الحالة */}
            <Select
              className="rounded-xl"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">كل الحالات</Option>
              <Option value="active">نشطة</Option>
              <Option value="completed">مكتملة</Option>
              <Option value="pending">قيد الانتظار</Option>
            </Select>

            {/* المعلّم */}
            <Select
              className="rounded-xl"
              value={instructorFilter}
              onChange={setInstructorFilter}
            >
              <Option value="all">كل المعلّمين</Option>
              {allInstructors.map((n) => (
                <Option key={n} value={n}>
                  {n}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* حسب الفلتر: لو اختار حالة معيّنة نعرض قسمًا واحدًا؛ غير ذلك نعرض النشطة ثم المكتملة */}
        {statusFilter === "active" || statusFilter === "completed" ? (
          <>
            {statusFilter === "active" && (
              <SectionActive
                list={activeCourses}
                onToggleHidden={toggleHiddenLabel}
                onDelete={deleteCourse}
                getDifficultyColor={getDifficultyColor}
                StudentProgressBar={StudentProgressBar}
                CardShell={CardShell}
              />
            )}
            {statusFilter === "completed" && (
              <SectionCompleted
                list={completedCourses}
                onToggleHidden={toggleHiddenLabel}
                onDelete={deleteCourse}
                getDifficultyColor={getDifficultyColor}
                StudentProgressBar={StudentProgressBar}
                CardShell={CardShell}
              />
            )}
          </>
        ) : (
          <>
            <SectionActive
              list={activeCourses}
              onToggleHidden={toggleHiddenLabel}
              onDelete={deleteCourse}
              getDifficultyColor={getDifficultyColor}
              StudentProgressBar={StudentProgressBar}
              CardShell={CardShell}
            />
            <SectionCompleted
              list={completedCourses}
              onToggleHidden={toggleHiddenLabel}
              onDelete={deleteCourse}
              getDifficultyColor={getDifficultyColor}
              StudentProgressBar={StudentProgressBar}
              CardShell={CardShell}
            />
          </>
        )}
      </div>

      {/* Modal إضافة دورة */}
      <Modal
        open={openAddCourse}
        onCancel={() => setOpenAddCourse(false)}
        title="إضافة دورة"
        okText="إضافة"
        okButtonProps={{
          className: "bg-primary text-white", // or use a class if you prefer CSS
        }}
        onOk={addCourse}
        destroyOnClose
      >
        <div className="flex flex-col gap-3">
          <label className="text-sm text-gray-700">اختر الدورة</label>
          <Select
            placeholder="اختر من الدورات المتاحة"
            value={pickedCourseId}
            onChange={setPickedCourseId}
            options={availableCourses.map((c) => ({
              value: c.id,
              label: `${c.title} — ${c.instructor}`,
            }))}
          />
        </div>
      </Modal>
    </div>
  );
}

/* ===== Sections ===== */

function SectionActive({
  list,
  onToggleHidden,
  onDelete,
  getDifficultyColor,
  StudentProgressBar,
  CardShell,
}) {
  return (
    <section>
      <h3 className="text-xl font-extrabold text-orange-500 mb-3">
        الدورات النشطة
      </h3>
      {list.length === 0 ? (
        <div className="text-gray-500">لا توجد دورات نشطة.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {list.map((course) => (
            <CardShell key={course.id} course={course}>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">مع {course.instructor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip title="تبديل الوسم">
                      <button
                        className="px-2 py-1 rounded-md border text-xs hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleHidden(course.id);
                        }}
                      >
                        {course.hidden ? "ظاهر" : "مخفي"}
                      </button>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <button
                        className="p-2 rounded-lg hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(course.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(
                      course.difficulty
                    )}`}
                  >
                    {course.difficulty}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">التقدم</span>
                    <span className="font-bold text-gray-800 text-lg">
                      {course.progress}%
                    </span>
                  </div>
                  <StudentProgressBar
                    value={course.progress}
                    color={course.color}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>
                        {course.completedLessons}/{course.totalLessons} درس
                      </span>
                    </div>
                    {course.progress > 0 && (
                      <div className="text-blue-600 font-medium">
                        {course.totalLessons - course.completedLessons} متبقي
                      </div>
                    )}
                  </div>
                </div>

                <Button type="primary" className="!bg-orange-500 !text-white">
                  متابعة
                </Button>
              </div>
            </CardShell>
          ))}
        </div>
      )}
    </section>
  );
}

function SectionCompleted({
  list,
  onToggleHidden,
  onDelete,
  getDifficultyColor,
  StudentProgressBar,
  CardShell,
}) {
  return (
    <section className="mt-4">
      <h3 className="text-xl font-extrabold text-blue-600 mb-3">
        الدورات المكتملة
      </h3>
      {list.length === 0 ? (
        <div className="text-gray-500">لا توجد دورات مكتملة.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {list.map((course) => (
            <CardShell key={course.id} course={course}>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">مع {course.instructor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip title="تبديل الوسم">
                      <button
                        className="px-2 py-1 rounded-md border text-xs hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleHidden(course.id);
                        }}
                      >
                        {course.hidden ? "ظاهر" : "مخفي"}
                      </button>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <button
                        className="p-2 rounded-lg hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(course.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(
                      course.difficulty
                    )}`}
                  >
                    {course.difficulty}
                  </span>
                </div>

                <div className="space-y-2">
                  <StudentProgressBar value={100} color="green" />
                  <div className="text-xs text-gray-500">
                    تم الإكمال في {course.completionDate || "—"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="!bg-blue-600 !text-white flex-1">
                    مراجعة
                  </Button>
                  <Button className="!bg-gray-100 flex-1">التقييم</Button>
                </div>
              </div>
            </CardShell>
          ))}
        </div>
      )}
    </section>
  );
}
