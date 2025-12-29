import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import blogReducer from '../features/blogSlice';
import teamReducer from  '../features/teamSlice';
import faqReducer from '../features/faqSlice';
import marketerReducer from '../features/marketersSlice';
import roundesReducer from '../features/roundsSlice';
import categoriesReducer from '../features/categoriesSlice';
import teachersReducer from '../features/teacherSlice';
import certificateReducer from '../features/certificateSlice';
import badegReducer from '../features/badgeSlice';
import resourceReducer from '../features/resourcesSlice';
import examReducer from '../features/examSlice';
import roundContentReducer from '../features/roundContentSlice';
import lessonReducer from '../features/lessonSlice';
import videoReducer from '../features/videoSlice';
import featureReducer from '../features/featuresSlice';
import storeReducer from '../features/storeSlice';
import studentReducer from  '../features/studentSlice';
import livesReducer from '../features/livesSlice';
import termsConditionReducer from '../features/termsConditionSlice';
import freeVideoReducer from '../features/freeVideoSlice';
import ratingReducer from '../features/ratingSlice';


export const rootReducer = combineReducers({
   auth : authReducer,
   blogs : blogReducer,
   team  : teamReducer,
   faq :  faqReducer,
   marketer :  marketerReducer,
   rounds : roundesReducer,
   categories: categoriesReducer,
   teachers : teachersReducer,
   certificate : certificateReducer,
   badges : badegReducer,
   resource:resourceReducer,
   exam: examReducer,
   content : roundContentReducer,
   lesson: lessonReducer,
   videos: videoReducer,
   features : featureReducer,
   store: storeReducer,
   students: studentReducer,
   lives: livesReducer,
   terms : termsConditionReducer,
   free_videos: freeVideoReducer,
   rating  : ratingReducer
});