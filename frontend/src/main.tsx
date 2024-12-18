import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import "./index.css"

import Login from './routes/Login'
import SignUp from './routes/SignUp'
import Onboard from './routes/Onboard'
import AdminLayout from './routes/admin/AdminLayout'
import AdminUsersPage from './routes/admin/AdminUsers'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/onboard' element={<Onboard/>}/>
            <Route path='/admin' element={<AdminLayout/>}>
                <Route index element={<AdminUsersPage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
)
