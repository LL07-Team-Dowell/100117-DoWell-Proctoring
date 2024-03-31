import { useUserContext } from './contexts'
import LoadingPage from './pages/LoadingPage/LoadingPage'
import useDowellLogin from './hooks/useDowellLogin'
import { Route, Routes } from 'react-router-dom'
import React from 'react'
import { publicUserRoutes } from './routes/publicUserRoutes'
import { loggedInUserRoutes } from './routes/loggedInUserRoutes'
import AppLayout from './layouts/AppLayout/AppLayout'

function App() {
  const {
    currentUser,
    isPublicUser,
    userDetailLoading,
  } = useUserContext();

  useDowellLogin();

  if (userDetailLoading) return <Routes>
    <Route path='*' element={<LoadingPage />} />  
  </Routes>

  if (isPublicUser) return <Routes>
    {
      React.Children.toArray(publicUserRoutes.map(item => {
        return <Route 
          path={item.route}
          element={<item.component />}
        />
      }))
    }
  </Routes>

  if (!currentUser) return <Routes>
    <Route path='*' element={<>User detail not found</>} />
  </Routes>
  
  return <Routes>
    {
      React.Children.toArray(loggedInUserRoutes.map(item => {
        return <Route 
          path={item.route}
          element={
            <AppLayout>
              <item.component />  
            </AppLayout>
          }
        />
      }))
    }
  </Routes>
}

export default App
