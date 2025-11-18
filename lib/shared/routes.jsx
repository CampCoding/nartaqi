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
  show_hide_blog_comment:"admin/blogs/delete_comment",

  // teams
  getTeams : "admin/team",
  add_team :"admin/team/add_member",

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
  active_round :"admin/rounds/active_round",


  // categories
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
  get_resources : "admin/rounds-resources/getRoundResources"
};
