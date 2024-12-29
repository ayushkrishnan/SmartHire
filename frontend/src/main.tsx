import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import "./index.css"

import Redirect from './routes/Redirect'
import Login from './routes/Login'
import SignUp from './routes/SignUp'
import Onboard from './routes/Onboard'
import AdminLayout from './routes/admin/AdminLayout'
import AdminUsersPage from './routes/admin/AdminUsers'
import AdminNewUser from './routes/admin/AdminNewUser'
import DashboardLayout from './routes/dashboard/DashboardLayout'
import DashboardJobs from './routes/dashboard/DashboardJobs'
import DashboardJobStatus from './routes/dashboard/DashboardJobStatus'
import JobListings from './routes/apply/JobListings'
import JobStatisticsDashboard from './routes/dashboard/DashboardReport'
import ApplicantLayout from './routes/apply/JobLayout'
import ApplicantEditUser from './routes/apply/JobEdit'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Redirect/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/onboard' element={<Onboard/>}/>
            <Route path='/admin' element={<AdminLayout/>}>
                <Route index element={<AdminUsersPage/>}/>
                <Route path="users/new" element={<AdminNewUser/>}/>
            </Route>
            <Route path='/dashboard' element={<DashboardLayout/>}>
                <Route index element={<DashboardJobs/>}/>
                <Route path="job/:id" element={<DashboardJobStatus/>}/>
                <Route path="reports" element={<JobStatisticsDashboard/>}/>
            </Route>
            <Route path='/apply' element={<ApplicantLayout/>}>
                <Route index element={<JobListings/>}/>
                <Route path='edit' element={<ApplicantEditUser/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
)
