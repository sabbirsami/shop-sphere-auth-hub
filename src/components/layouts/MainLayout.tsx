import { Outlet } from 'react-router-dom';
import '../../index.css';
import Navbar from '../shared/Navbar';

const MainLayout = () => {
  return (
    <section className="">
      <Navbar />
      <Outlet />
    </section>
  );
};

export default MainLayout;
