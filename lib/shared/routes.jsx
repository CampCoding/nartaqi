export const apiRoutes = {
  login: "admins/login",

  // blogs
  add_blog:"admin/blogs/add_blog",
  edit_blog:"admin/blogs/update_blog",
  delete_blog:"admin/blogs/delete_blog",
  show_hide_blog:"admin/blogs/show_blog",
  getBlogs:"admin/blogs",
  getBlogComments:"admin/blogs/comments",
  delete_blog_comment:"admin/blogs/delete_comment",
  show_hide_blog_comment:"admin/blogs/show_comment",

  // teams
  getTeams : "admin/team",
  add_team :"admin/team/add_member",
  edit_team:"admin/team/update_member",
  show_hide_team:"admin/team/show_member",

  // faqs 
  getFaqs : "admin/faqs",
  add_faq:"admin/faqs/add_faq",
  edit_faq:"admin/faqs/update_faq",
  show_hide_faq:"admin/faqs/show_faq",

  // marketers
  get_marketeres:"admin/marketers",
  generate_code:"admin/marketers/generate_code",

  // rounds
  get_rounds:"admin/rounds/get_all_rounds",
  get_source_rounds:"admin/rounds/getsourceRound",
  add_basic_round :"admin/rounds/store_round",
  edit_basic_round:"admin/rounds/edit_round",
  active_round :"admin/rounds/active_round",
  copy_round:"admin/rounds/makeCopyRoundWithAllData",
  delete_round:"admin/rounds/delete_round",

  // categories
  get_applications:"admin/certificates/applications",
  get_categories:"admin/categories/get_all_course_categories",
  add_category:"admin/categories/store_course_category",
  edit_category:"admin/categories/edit_course_category",
  delete_category:"admin/categories/delete_course_category",
  active_category:"admin/categories/active_course_category",

  // parts
  get_parts:"admin/categories/parts/get_category_parts_by_course_category_id",
  add_part:"admin/categories/parts/add_category_part",
  edit_part:"admin/categories/parts/edit_category_part",
  delete_part:"admin/categories/parts/delete_category_part",

  // teachers
  get_teacher : "admin/teachers/getTeachers",
  add_teacher:"admin/teachers/add_teacher",
  edit_teacher:"admin/teachers/edit_teacher",
  delete_teacher:"admin/teachers/delete_teacher",

  // resources
  get_resources : "admin/rounds-resources/getRoundResources",
  add_resources:"admin/rounds-resources/addRoundResource",
  edit_resources:"admin/rounds-resources/editRoundResource",
  delete_resource:"admin/rounds-resources/deleteRoundResource",

  //certificates
  get_certificates : "admin/certificates/applications",
  add_certificates:"admin/certificates/generate",
  edit_certificate:"",
  delete_certificate:"",

  // badges
  get_badges:"admin/badges",
  add_badge:"admin/badges/create_badge",
  edit_badge:"admin/badges/update_badge",
  delete_badge:"admin/badges/delete_badge",
  studuent_badges:"admin/badges/student_badges",
  assign_page_to_student:'admin/badges/assign_badge_to_student',

  //exams
  get_exams : "admin/exams/getAllExams",
  add_exam:"admin/exams/store_exam",
  edit_exam:"admin/exams/edit_exam",
  delete_exam:"admin/exams/delete_exam",

  get_exam_sections:"admin/exams/exam-sections/GetAllExamSectionsByExamId",
  add_exam_sections:"admin/exams/exam-sections/store_exam_section",
  delete_exam_sections:"admin/exams/exam-sections/delete_exam_section",
  update_exam_sections:"admin/exams/exam-sections/edit_exam_section",
  assign_exam:"admin/exams/assign_exam_round",

  //exam questions
  get_questions :"admin/questions/get_questions",
  store_question:"admin/questions/StoreQuestionWithAnswers",

  //lessons
  get_lessons:"admin/contents/lessons/get_all_lessons",
  add_lesson:"admin/contents/lessons/store_lesson",
  edit_lesson:"admin/contents/lessons/edit_lesson",
  delete_lesson:"admin/contents/lessons/delete_lesson",

  //video
  get_videos:"admin/contents/lessons/videos/get_all_videos",
  add_video:"admin/contents/lessons/videos/add_video",
  delete_video:"admin/contents/lessons/videos/delete_video",
  edit_video:"admin/contents/lessons/videos/edit_video",

  //features
  get_features:"admin/rounds/features/get_all_round_features",
  add_feature:"admin/rounds/features/add_round_feature",
  edit_feature:"admin/rounds/features/edit_round_feature",
  delete_feature:"admin/rounds/features/delete_round_feature",

  //store
  get_store:"",
  add_store:"user/store/addStoreItem",
  edit_store:"",
  delete_store:""
};
