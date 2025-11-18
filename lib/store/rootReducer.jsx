import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import blogReducer from '../features/blogSlice';
import teamReducer from  '../features/teamSlice';
import faqReducer from '../features/faqSlice';
import marketerReducer from '../features/marketersSlice';
import roundesReducer from '../features/roundsSlice';
import categoriesReducer from '../features/categoriesSlice';
import teachersReducer from '../features/teacherSlice';

export const rootReducer = combineReducers({
   auth : authReducer,
   blogs : blogReducer,
   team  : teamReducer,
   faq :  faqReducer,
   marketer :  marketerReducer,
   rounds : roundesReducer,
   categories: categoriesReducer,
   teachers : teachersReducer
});