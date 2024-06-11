import AppLayout from "../layouts/AppLayout/AppLayout";
import EventsPage from "../pages/EventsPage/EventsPage";
import SinglePageEvent from "../pages/EventsPage/SinglePageEvent/SinglePageEvent";
import LandingPage from "../pages/LandingPage/LandingPage";
import ProctorLiveEventPage from "../pages/ProctorLiveEventPage/ProctorLiveEventPage";
import ReportsPage from "../pages/ReportsPage/ReportsPage";

export const loggedInUserRoutes = [
  {
    route: "/",
    component: () => {
      return (
        <AppLayout>
          <LandingPage />
        </AppLayout>
      );
    },
  },
  {
    route: "/events",
    component: () => {
      return (
        <AppLayout>
          <EventsPage />
        </AppLayout>
      );
    },
  },
  {
    route: "/events/:eventId",
    component: () => {
      return (
        <AppLayout>
          <SinglePageEvent />
        </AppLayout>
      );
    },
  },
  {
    route: "/live/:eventId",
    component: ProctorLiveEventPage,
  },
  {
    route: "/reports",
    component: () => {
      return <AppLayout>
        <ReportsPage />
      </AppLayout>;
    },
  },
  {
    route: "*",
    component: () => {
      return <>Page not found</>;
    },
  },
];
