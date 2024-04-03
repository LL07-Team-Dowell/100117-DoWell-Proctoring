import EventRegistrationPage from "../pages/PublicUserPages/EventRegistrationPage/EventRegistrationPage";

export const publicUserRoutes = [
    {
        route: '/',
        component: EventRegistrationPage
    },
    {
        route: '*',
        component: () => {
            return <>Page not found</>
        }
    },
]