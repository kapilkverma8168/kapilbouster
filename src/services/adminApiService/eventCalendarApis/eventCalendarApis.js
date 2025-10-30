// event calendar related api's

import {
  GET_ALL_EVENT_CALENDAR_DATA,
  POST_EVENT,
  PREVIEW_EVENT_CALENDAR_DATA,
  UPDATE_EVENT_STATUS,
} from "../../../config/adminUrlConfig";
import { ApiService, FileUploadService } from "../../../config/apiServices";

export const addEventCalendar = (paylaod) => {
  return FileUploadService.post(POST_EVENT, paylaod);
};
export const updateEventCalendarStatus = (id, status) => {
  return ApiService.get(`${UPDATE_EVENT_STATUS}/${id}/${status}`);
};
export const getAllEventCalendarData = (payload = {}) => {
  return ApiService.post(GET_ALL_EVENT_CALENDAR_DATA);
};

export const viewEventCalendarDetails = (id) => {
  return ApiService.get(`${PREVIEW_EVENT_CALENDAR_DATA}/${id}`);
};
