import {
  GET_ALL_WEBSITE_NOTIFICATION,
  GET_CATEGORIES,
  GET_CATEGORIES_TYPE,
  GET_CATEGORY_SUB_TYPE,
  GET_COMMUNICATION_DATA,
  GET_NEW_NOTIFICATION_DETAILS_BY_ID,
  GET_NOTIFICATION_FOR_VALUES,
  POST_DATA,
  UPDATE_USER_NOTIFICATION_STATUS,
  UPDATE_WEBSITE_NOTIFICATION_STATUS,
  VIEW_WEBSITE_NOTIFICATION,
} from "../../../config/adminUrlConfig";
import { ApiService } from "../../../config/apiServices";
export const getNotificationValues = () => {
  return ApiService.get(GET_NOTIFICATION_FOR_VALUES);
};
export const getMainCategories = () => {
  return ApiService.get(GET_CATEGORIES);
};

export const getCategories = () => {
  return ApiService.get(GET_CATEGORIES_TYPE);
};

export const getSubCategoryType = (categoryvalue) => {
  return ApiService.get(`${GET_CATEGORY_SUB_TYPE}/${categoryvalue.id}`);
};

export const postCommunicateData = (payload) => {
  return ApiService.post(POST_DATA, payload);
};

export const getCommunicationData = (payload = {}) => {
  return ApiService.post(GET_COMMUNICATION_DATA, payload);
};

export const getNotificationDetailsById = (id) => {
  return ApiService.get(`${GET_NEW_NOTIFICATION_DETAILS_BY_ID}/${id}`);
};

export const getWebsiteNotificationDetailsById = (id) => {
  return ApiService.get(`${VIEW_WEBSITE_NOTIFICATION}/${id}`);
};

export const getAllNotificationDetails = (payload = {}) => {
  return ApiService.post(GET_ALL_WEBSITE_NOTIFICATION, payload);
};

export const updateUserNotificationStatus = (id, statusValue) => {
  return ApiService.get(
    `${UPDATE_USER_NOTIFICATION_STATUS}/${id}/${statusValue}`
  );
};

export const updateWebsiteNotificationStatus = (id, statusValue) => {
  return ApiService.get(
    `${UPDATE_WEBSITE_NOTIFICATION_STATUS}/${id}/${statusValue}`
  );
};
