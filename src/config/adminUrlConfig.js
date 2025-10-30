export const BASE_URL = process.env.REACT_APP_BASE_URL;

//auth url
export const LOGIN_URL = "/api/admin/login/admin";

// User url
export const GET_USER_URL = "/api/admin/getUserLevel";

//  CATEGORIES TYPE
export const GET_ADMIN_CATEGORY_TYPE_URL =
  "/api/admin/findUserCategoryTypeBYMainCategory/2";

// SUB CATEGORIES URL
export const GET_ADMIN_SUB_CATEGORY_URL =
  "/api/admin/findUserCategorySubTypeByUserCategoryTypeId/";

//INSITUTE REGISTRATION EXCEL IMPORT
export const IMPORT_ADMIN_EXCEL = "/api/admin/importRegistration";
export const GET_ORGANISATION_LIST =
  "/api/admin/getRegistrationOrganizationData";

// INSITUTE VERFICATION
export const GET_ID_INSITUTE_VERFICATION_URL =
  "/api/admin/getRegistrationOrganizationDataById/";
export const INSERT_INCORRECT_VERIFICATION_FORM_URL =
  "/api/admin/insertCorrection";
export const GET_ID_INSITUTE_CLEAR_VERFIDATION_URL =
  "/api/admin/generateOrganizationAtom";

// INDIVIDUAL URL
export const GET_INDIVIDUAL_LIST = "/api/admin/getRegisteredUser";
export const GET_ID_INDIVIDUAL_VERFICATION_URL =
  "/api/admin/getRegisteredUserById/";
export const GET_ID_INDIVIDUAL_CLEAR_VERFIDATION_URL =
  "/api/admin/generateIndivisualAtom";

// PASS VERIFY LIST URL
export const GET_VERIFIED_LIST = "/api/admin/getUsersVerifiedList";
export const GET_VERIFIED_VIEW_LIST = "/api/admin/getUsersVerifiedListById/";

// GET CORRECTION API
export const GET_CORRECTION_LIST = "/api/admin/getCorrection";
// Admin Communicate
export const GET_NOTIFICATION_FOR_VALUES = "api/getAllNotificationForData";
export const GET_CATEGORIES = "api/admin/getUserCategiryMain";
export const GET_CATEGORIES_TYPE = "api/admin/findUserCategoryType";
export const GET_CATEGORY_SUB_TYPE =
  "api/admin/findUserCategorySubTypeByUserCategoryTypeId";
export const POST_DATA = "api/addNotificationAndSendNotification";
export const GET_COMMUNICATION_DATA = "api/getAllNotificationData";
export const GET_NEW_NOTIFICATION_DETAILS_BY_ID =
  "api/getViewUsersNotificationDetailsBYID";
export const GET_ALL_WEBSITE_NOTIFICATION = "api/getAllWebsiteNotification";

export const VIEW_WEBSITE_NOTIFICATION =
  "api/getViewWebsiteNotificationDetailsBYID";

export const UPDATE_USER_NOTIFICATION_STATUS =
  "api/getUpdateUsersNotificationStatus";

export const UPDATE_WEBSITE_NOTIFICATION_STATUS =
  "api/getUpdateWebsiteNotificationStatus";

// event related api
export const POST_EVENT = "api/addEventCalenderData";
export const UPDATE_EVENT_STATUS = "api/getUpdateEventCalenderStatus";
export const GET_ALL_EVENT_CALENDAR_DATA = "api/getEventCalenderAllData";
export const PREVIEW_EVENT_CALENDAR_DATA =
  "api/getViewEvenCalendertDetailsBYID";

// Accreditation API endpoints - Using environment configuration
export const ACCREDITATION_BASE_URL = process.env.REACT_APP_BASE_URL;
export const GET_ACCREDITATION_SUMMARY = "/user/summary";
export const GET_ACCREDITATION_USER_TYPES = "/user/usertype";
export const GET_ACCREDITATION_CARDS = "/user/cards";
export const UPDATE_ACCREDITATION_PRINT_STATUS = "/user/cards/print-status";
export const UPDATE_ACCREDITATION_BLACKLIST = "/user/cards/blacklist";
export const UPDATE_ACCREDITATION_HANDOVER = "/user/cards/handover";
