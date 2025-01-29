import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import { useStore } from '../store/store';
import LoadingComponent from './component/LoadingComponent';
import NavBar from './component/NavBar';
import { useEffect } from 'react';

const App = () => {
  const location = useLocation();
  const shouldShowNavBar = !['/watch', '/login', '/register', '/not-found'].some(route => location.pathname.includes(route));
  const { commonStore: { loading, setLoading, initApp, token }, userStore: { isLoggedIn } } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await isLoggedIn();

      if (token) {
        await initApp();
      }

      setLoading(false);
    };

    fetchData();
  }, [token]);

  if (loading) return <LoadingComponent content='' />
  return (
    <>
      <ToastContainer position='bottom-right' theme='colored' />
      <div className='body'>
        {shouldShowNavBar && <NavBar />}
        <Container>
          <Outlet />
        </Container>
      </div>
    </>
  );
};

export default observer(App);