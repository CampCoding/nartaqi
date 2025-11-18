import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
    all_courses_categories_list : [],
    all_courses_categories_loading : false,

    add_course_category_loading : false,
    edit_course_category_loading : false,
    delete_course_category_loading : false,
    active_course_category_loading : false,

    get_categories_parts_list:[],
    get_categories_parts_loading:false,
    add_categories_parts:false,
    edit_categories_parts : false,
    delete_categories_parts : false
}

export const handleGetAllCoursesCategories = createAsyncThunk(
  "categoriesSlice/handleGetAllCoursesCategories",
  async ({ per_page = 3, page = 1 } = {}) => {
    console.log("tesss");
    if (page && per_page) {
      const response = await api.get(
        `${apiRoutes.get_categories}?per_page=${per_page}&page=${page}`
      );
      return response;
    }
    // fallback if page/per_page not valid
    const response = await api.get(
      `${apiRoutes.get_categories}?per_page=3&page=1`
    );
    return response;
  }
);

export const handleAddCategory = createAsyncThunk("categoriesSlice/handleAddCategory",async({body}) =>{
    const response = await api.post(apiRoutes.add_category , {body , isFile : true});
    return response;
})

export const handleEditCategory = createAsyncThunk("categoriesSlice/handleEditCategory",async({body}) =>{
    const response = await api.post(apiRoutes.edit_category , {body , isFile : true});
    return response;
})

export const handleDeleteCategory = createAsyncThunk("categoriesSlice/handleDeleteCategory", async({body}) => {
    const response = await api.post(apiRoutes.delete_category , {body , isFile : true});
    return response;
})

export const handleShowHideCategory = createAsyncThunk("categoriesSlice/handleShowHideCategory", async({body}) => {
    const response = await api.post(apiRoutes.show_hide_blog , {body , isFile : true});
    return response;
})

export const handleGetCategoryParts = createAsyncThunk("categoriesSlice/handleGetCategoryParts",async({body}) => {
    const response = await api.post(apiRoutes.get_parts , {body});
    return response;
})

export const handleAddCategoryPart = createAsyncThunk("categoriesSlice/handleAddCategoryPart",async({body}) =>{
    const response = await api.post(apiRoutes.add_part , {body , isFile: true});
    return response;
})

export const handleEditCategoryPart = createAsyncThunk("categoriesSlice/handleEditCategoryPart",async({body}) =>{
    const response = await api.post(apiRoutes.edit_part , {body , isFile: true});
    return response;
})

export const handleDeleteCategoryPart = createAsyncThunk("categoriesSlice/handleDeleteCategoryPart",async({body}) =>{
    const response = await api.post(apiRoutes.delete_part , {body});
    return response;
})


export const categoriesSlice = createSlice({
    name:"categoriesSlice",
    initialState,
    extraReducers : (builder) => {
        builder
        .addCase(handleGetAllCoursesCategories.pending ,(state) => {
            state.all_courses_categories_loading = true;
        })
        .addCase(handleGetAllCoursesCategories.fulfilled ,(state , action) => {
            state.all_courses_categories_list = action.payload;
            state.all_courses_categories_loading = false;
        })
        .addCase(handleGetAllCoursesCategories.rejected , (state) => {
            state.all_courses_categories_loading = false;
        })
          .addCase(handleAddCategory.pending ,(state) => {
            state.add_course_category_loading = true;
        })
        .addCase(handleAddCategory.fulfilled ,(state , action) => {
            state.add_course_category_loading = false;
        })
        .addCase(handleAddCategory.rejected , (state) => {
            state.add_course_category_loading = false;
        })
          .addCase(handleEditCategory.pending ,(state) => {
            state.edit_course_category_loading = true;
        })
        .addCase(handleEditCategory.fulfilled ,(state , action) => {
            state.edit_course_category_loading = false;
        })
        .addCase(handleEditCategory.rejected , (state) => {
            state.edit_course_category_loading = false;
        })
          .addCase(handleDeleteCategory.pending ,(state) => {
            state.delete_course_category_loading = true;
        })
        .addCase(handleDeleteCategory.fulfilled ,(state , action) => {
            state.delete_course_category_loading = false;
        })
        .addCase(handleDeleteCategory.rejected , (state) => {
            state.delete_course_category_loading = false;
        })
         .addCase(handleShowHideCategory.pending ,(state) => {
            state.active_course_category_loading = true;
        })
        .addCase(handleShowHideCategory.fulfilled ,(state , action) => {
            state.active_course_category_loading = false;
        })
        .addCase(handleShowHideCategory.rejected , (state) => {
            state.active_course_category_loading = false;
        })

         .addCase(handleGetCategoryParts.pending ,(state) => {
            state.get_categories_parts_loading = true;
        })
        .addCase(handleGetCategoryParts.fulfilled ,(state , action) => {
            state.get_categories_parts_loading = false;
            state.get_categories_parts_list = action.payload;
        })
        .addCase(handleGetCategoryParts.rejected , (state) => {
            state.get_categories_parts_loading = false;
        })
         .addCase(handleAddCategoryPart.pending ,(state) => {
            state.add_categories_parts = true;
        })
        .addCase(handleAddCategoryPart.fulfilled ,(state , action) => {
            state.add_categories_parts = false;
        })
        .addCase(handleAddCategoryPart.rejected , (state) => {
            state.add_categories_parts = false;
        })
        
          .addCase(handleEditCategoryPart.pending ,(state) => {
            state.edit_categories_parts = true;
        })
        .addCase(handleEditCategoryPart.fulfilled ,(state , action) => {
            state.edit_categories_parts = false;
        })
        .addCase(handleEditCategoryPart.rejected , (state) => {
            state.edit_categories_parts = false;
        })

          .addCase(handleDeleteCategoryPart.pending ,(state) => {
            state.delete_categories_parts = true;
        })
        .addCase(handleDeleteCategoryPart.fulfilled ,(state , action) => {
            state.delete_categories_parts = false;
        })
        .addCase(handleDeleteCategoryPart.rejected , (state) => {
            state.delete_categories_parts = false;
        })
    }
})

export default categoriesSlice.reducer;