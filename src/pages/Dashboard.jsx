import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT, TAB_URLS } from '~/utils/constants'
import { Button } from '@mui/material'
import { handleLogoutAPI } from '~/apis'
import TranderIcon from '../assets/trander-logo.png'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { usePermission } from '~/hooks/usePermission'
import { permissions } from '~/config/rbacConfig'

function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { hasPermission } = usePermission(user?.role)



  useEffect(() => {
    const fetchData = async () => {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboards/access`)
      // const userinfoFromLocalStorage = localStorage.getItem('userInfo')
      // console.log('userinfoFromLocalStorage:', JSON.parse(userinfoFromLocalStorage))
      setUser(res.data)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    // Call logout API
    await handleLogoutAPI()
    // Remove user info from localStorage
    localStorage.removeItem('userInfo')

    // Navigate to login page
    navigate('/login')
  }

  // Get active tab based on current URL
  const getDefaultActiveTab = () => {
    let activeTab = TAB_URLS.DASHBOARD
    Object.values(TAB_URLS).forEach(tab => {
      if (location.pathname.includes(tab)) activeTab = tab
    })
    return activeTab
  }

  const [tab, setTab] = useState(getDefaultActiveTab())
  const handleChange = (event, newTab) => {
    setTab(newTab)
  }

  if (!user) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      maxWidth: '1200px',
      // marginTop: '1em',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 1em',
      gap: 2
    }}>
      <Box as={Link} to='/dashboard'>
        <a style={{ color: 'inherit', textDecoration: 'none' }} href="https://github.com/trander-25"
          target="_blank" rel="noreferrer">
          <Box
            component="img"
            sx={{ width: '100%', height: '180px', borderRadius: '6px', objectFit: 'cover' }}
            src={TranderIcon}
            alt="trander"
          />
        </a>
      </Box>

      <Alert severity="info" sx={{
        '.MuiAlert-message': { overflow: 'hidden' },
        width: { md: 'max-content' }
      }}>
        This is the Dashboard page accessible after user:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{user?.email}</Typography>
        &nbsp; successfully logs in.
      </Alert>

      <Alert severity="success" sx={{
        '.MuiAlert-message': { overflow: 'hidden' },
        width: { md: 'max-content' }
      }}>
        Current logged in role:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{user?.role}</Typography>
      </Alert>

      {/* RBAC permissions section */}
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Trander RBAC Permissions Tabs">
            {hasPermission(permissions.VIEW_DASHBOARD) &&
              <Tab label="Dashboard" value={TAB_URLS.DASHBOARD} component={Link} to={'/dashboard'} />
            }
            {hasPermission(permissions.VIEW_SUPPORT) &&
              <Tab label="Support" value={TAB_URLS.SUPPORT} component={Link} to={'/support'} />
            }
            {hasPermission(permissions.VIEW_MESSAGES) &&
              <Tab label="Message" value={TAB_URLS.MESSAGES} component={Link} to={'/messages'} />
            }
            {hasPermission(permissions.VIEW_REVENUE) &&
              <Tab label="Revenue" value={TAB_URLS.REVENUE} component={Link} to={'/revenue'} />
            }
            {hasPermission(permissions.VIEW_ADMIN_TOOLS) &&
              <Tab label="Admin Tools" value={TAB_URLS.ADMIN_TOOLS} component={Link} to={'/admin-tools'} />
            }
          </TabList>
        </Box>
        {hasPermission(permissions.VIEW_DASHBOARD) &&
          <TabPanel value={TAB_URLS.DASHBOARD}>
            <Alert severity="success" sx={{ width: 'max-content' }}>
              Dashboard page content!
            </Alert>
          </TabPanel>
        }
        {hasPermission(permissions.VIEW_SUPPORT) &&
          <TabPanel value={TAB_URLS.SUPPORT}>
            <Alert severity="success" sx={{ width: 'max-content' }}>
              Support page content!
            </Alert>
          </TabPanel>
        }
        {hasPermission(permissions.VIEW_MESSAGES) &&
          <TabPanel value={TAB_URLS.MESSAGES}>
            <Alert severity="info" sx={{ width: 'max-content' }}>
              Messages page content!
            </Alert>
          </TabPanel>
        }
        {hasPermission(permissions.VIEW_REVENUE) &&
          <TabPanel value={TAB_URLS.REVENUE}>
            <Alert severity="warning" sx={{ width: 'max-content' }}>
              Revenue page content!
            </Alert>
          </TabPanel>
        }
        {hasPermission(permissions.VIEW_ADMIN_TOOLS) &&
          <TabPanel value={TAB_URLS.ADMIN_TOOLS}>
            <Alert severity="error" sx={{ width: 'max-content' }}>
              Admin Tools page content!
            </Alert>
          </TabPanel>
        }
      </TabContext>

      <Divider />

      <Button
        type='button'
        variant='contained'
        color='info'
        size='large'
        sx={{ mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end' }}
        onClick={handleLogout}
      >
        Logout
      </Button>
      <Box
        component="img"
        sx={{ width: '77%' }}
        src={TranderIcon}
        alt="trander"
      />
    </Box>
  )
}

export default Dashboard
