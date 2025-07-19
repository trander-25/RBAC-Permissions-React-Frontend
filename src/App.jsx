import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'
import RbacRoute from './components/core/RbacRoute'
import { permissions } from './config/rbacConfig'

/**
 * Protected routes that require authentication
 * Uses <Outlet /> to render child routes
 */
const ProtectRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const UnauthoziedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (user) return <Navigate to='/dashboard' replace={true} />
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />

      <Route element={<UnauthoziedRoutes />}>
        <Route path='/login' element={<Login />} />
      </Route>

      <Route element={<ProtectRoutes />}>
        {/* Dashboard component used for all routes - for testing purposes */}

        {/* If RoleAccessRoute is coded to return children, use this method (commonly used for older react-router-dom projects from version 5.x.x downwards */}
        {/* <Route
          path='/dashboard'
          element={<RbacRoute requiredPermission={permissions.VIEW_DASHBOARD} >
            <Dashboard />
          </RbacRoute>} /> */}

        {/* If RoleAccessRoute is coded to return Outlet, use this method (commonly used for react-router-dom projects from version 6.x.x onwards) for modern and easier maintenance */}
        <Route element={<RbacRoute requiredPermission={permissions.VIEW_DASHBOARD} />} >
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermission={permissions.VIEW_SUPPORT} />} >
          <Route path='/support' element={<Dashboard />} />
          {/* <Route path='/support/create' element={<Dashboard />} />
          <Route path='/support/delete' element={<Dashboard />} />
          <Route path='/support/update' element={<Dashboard />} /> */}
        </Route>

        <Route element={<RbacRoute requiredPermission={permissions.VIEW_MESSAGES} />} >
          <Route path='/messages' element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermission={permissions.VIEW_REVENUE} />} >
          <Route path='/revenue' element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermission={permissions.VIEW_ADMIN_TOOLS} />} >
          <Route path='/admin-tools' element={<Dashboard />} />
        </Route>

      </Route>

      {/* 404 */}
      <Route path='/access-denied' element={<div>Access Denied</div>} />
      <Route path='*' element={<div>404 Not Found</div>} />

    </Routes>
  )
}

export default App
