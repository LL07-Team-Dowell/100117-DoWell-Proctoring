import LandingPage from "../pages/LandingPage/LandingPage";

export const loggedInUserRoutes = [
    {
        route: '/',
        component: LandingPage
    },
    {
        route: '*',
        component: () => {
            return <>Page not found</>
        }
    },
]