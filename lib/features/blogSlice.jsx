import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
    add_blog_loading : false,
    edit_blog_loading : false,
    delete_blog_loading : false,
    show_hide_blog_loading : false,
    blogs_loading : false,
    blogs_data :[],
    blog_comments_loading : false,
    blog_comments_data : [],
    blog_comment_delete_loading : false,
    blog_comment_show_hide_loading : false,
}

export const handleGetAllBlogs = createAsyncThunk("blogSlice/handleGetAllBlogs",async() =>{
    const response = await api.get(apiRoutes.getBlogs);
    return response;
})

export const handleAddBlog = createAsyncThunk("blogSlice/handleAddBlog",async({body}) => {
    const response = await api.post(apiRoutes.add_blog , {body , isFile : true});
    return response
})

export const handleDeleteBlog = createAsyncThunk("blogSlice/handleDeleteBlog" , async({body}) => {
    const response = await api.post(apiRoutes.delete_blog , {body});
    return response;
})

export const handleEditBlog = createAsyncThunk("blogSlice/handleEditBlog", async({body}) => {
    const response = await api.post(apiRoutes.edit_blog , {body , isFile : true});
    return response;
})

export const handleShowHideBlog = createAsyncThunk("blogSlice/handleShowHideBlog",async({body}) => {
    const response = await api.post(apiRoutes.show_hide_blog , {body});
    return response;
})

export const handleGetBlogComments = createAsyncThunk("blogSlice/handleGetBlogComments",async({body}) => {
    const response = await api.post(apiRoutes.getBlogComments , {body});
    return response;
})

export const handleDeleteBlogComment = createAsyncThunk("blogSlice/handleDeleteBlogComment", async({body}) =>{
    const response = await api.post(apiRoutes.delete_blog_comment , {body});
    return response;
})

export const handleShowHideBlogComment = createAsyncThunk("blogSlice/handleShowHideBlogComment", async({body}) =>{
    const response = await api.post(apiRoutes.show_hide_blog_comment , {body});
    return response;
})

export const blogSlice = createSlice({
    name:"blogSlice",
    initialState,
    extraReducers : (builder) => {
        builder
        .addCase(handleGetAllBlogs.pending , (state) => {
            state.blogs_loading = true;
        })
        .addCase(handleGetAllBlogs.fulfilled , (state,action) => {
            state.blogs_loading = false;
            state.blogs_data = action.payload
        })
        .addCase(handleGetAllBlogs.rejected ,(state) => {
            state.blogs_loading = false
        })
        .addCase(handleAddBlog.pending , (state) => {
            state.add_blog_loading = true;
        })
        .addCase(handleAddBlog.fulfilled , (state,action) => {
            state.add_blog_loading = false;
        })
        .addCase(handleAddBlog.rejected ,(state) => {
            state.add_blog_loading = false
        })
        .addCase(handleEditBlog.pending , (state) => {
            state.edit_blog_loading = true;
        })
        .addCase(handleEditBlog.fulfilled , (state,action) => {
            state.edit_blog_loading = false;
        })
        .addCase(handleEditBlog.rejected ,(state) => {
            state.edit_blog_loading = false
        })
        .addCase(handleDeleteBlog.pending , (state) => {
            state.delete_blog_loading = true;
        })
        .addCase(handleDeleteBlog.fulfilled , (state,action) => {
            state.delete_blog_loading = false;
        })
        .addCase(handleDeleteBlog.rejected ,(state) => {
            state.delete_blog_loading = false
        })
        .addCase(handleShowHideBlog.pending , (state) => {
            state.show_hide_blog_loading = true;
        })
        .addCase(handleShowHideBlog.fulfilled , (state,action) => {
            state.show_hide_blog_loading = false;
        })
        .addCase(handleShowHideBlog.rejected ,(state) => {
            state.show_hide_blog_loading = false
        })

        

        .addCase(handleGetBlogComments.pending , (state) => {
            state.blog_comments_loading = true;
        })
        .addCase(handleGetBlogComments.fulfilled , (state,action) => {
            state.blog_comments_loading = false;
            state.blog_comments_data = action.payload;
        })
        .addCase(handleGetBlogComments.rejected ,(state) => {
            state.blog_comments_loading = false
        })
        .addCase(handleDeleteBlogComment.pending , (state) => {
            state.blog_comment_delete_loading = true;
        })
        .addCase(handleDeleteBlogComment.fulfilled , (state,action) => {
            state.blog_comment_delete_loading = false;
        })
        .addCase(handleDeleteBlogComment.rejected ,(state) => {
            state.blog_comment_delete_loading = false
        })
        .addCase(handleShowHideBlogComment.pending , (state) => {
            state.blog_comment_show_hide_loading = true;
        })
        .addCase(handleShowHideBlogComment.fulfilled , (state,action) => {
            state.blog_comment_show_hide_loading = false;
        })
        .addCase(handleShowHideBlogComment.rejected ,(state) => {
            state.blog_comment_show_hide_loading = false
        })
    }
})

export default blogSlice.reducer;