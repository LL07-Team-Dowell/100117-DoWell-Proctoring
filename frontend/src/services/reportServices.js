import { defaultAxiosInstance } from "./config";
import { eventRoutePrefix } from "./routeUtils";

export const getEventReports = async (userId) => {
  return await defaultAxiosInstance.get(`dashboard/report?userId=${userId}`);
};

export const getSingleEventReport = async (eventId) => {
  return await defaultAxiosInstance.get(
    `/${eventRoutePrefix}/eventreport/${eventId}`
  );
};
