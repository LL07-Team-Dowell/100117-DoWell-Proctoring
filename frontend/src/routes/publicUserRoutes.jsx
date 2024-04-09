import LiveEventPage from "../pages/PublicUserPages/LiveEventPage/LiveEventPage";

export const publicUserRoutes = [
    {
        route: '/',
        component: LiveEventPage,
    },
    {
        route: '*',
        component: () => {
            return <>Page not found</>
        }
    },
]