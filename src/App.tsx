import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import RequireAuth from './providers/Auth/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
