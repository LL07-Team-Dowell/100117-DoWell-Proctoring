import AppLayout from "../layouts/AppLayout/AppLayout";
import LandingPage from "../pages/LandingPage/LandingPage";
import ProctorLiveEventPage from "../pages/ProctorLiveEventPage/ProctorLiveEventPage";

export const loggedInUserRoutes = [
    {
        route: '/',
        component: () => {
            return <AppLayout>
                <LandingPage />
            </AppLayout>
        }
    },
    {
        route: '/live/:eventId',
        component: ProctorLiveEventPage,
    },
    {
        route: '*',
        component: () => {
            return <>Page not found</>
        }
    },
]