import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from './components/SignIn/SignIn';
import Home from './components/Home/Home';
import AdminHome from './components/AdminHome/AdminHome';
import SignUp from './components/SignUp/SignUp';
import UserActivities from './components/UserActivities/UserActivities';
import ManageUsers from './components/ManageUsers/ManageUsers';
import Dashbord from './components/Home/Dashbord/Dashbord';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <ToastContainer position="top-center" style={{marginTop: "70px"}}/>
            <main>
              <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/signup' element={<SignUp/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/adminhome" element={<AdminHome/>}/>
                <Route path="/useractivity" element={<UserActivities/>}/>
                <Route path="/usermanage" element={<ManageUsers/>}/>
                <Route path="/dashboard" element={<Dashbord/>}/>
              </Routes>
            </main>
        </BrowserRouter>
    </div>
  );
}

export default App;
