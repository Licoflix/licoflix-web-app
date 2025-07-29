import {observer} from 'mobx-react-lite';
import {useEffect} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Container} from 'semantic-ui-react';
import {useStore} from '../store/store';
import LoadingComponent from './component/LoadingComponent';
import NavBar from './component/NavBar';

const App = () => {
    const location = useLocation();
    const shouldShowNavBar = !['/watch', '/login', '/register', '/not-found'].some(route => location.pathname.includes(route));
    const {commonStore: {loading, setLoading, initApp, token}, userStore: {isLoggedIn}} = useStore();

    useEffect(() => {
        const fetchData = async () => {
            await setLoading(true);
            await isLoggedIn();
            if (token) {
                await initApp();
            }
            await setLoading(false);
        };

        fetchData().then();
    }, [token]);

    if (loading) return <LoadingComponent content="Licoflix"/>
    return (
        <>
            <ToastContainer position='bottom-right' theme='colored'/>
            <div className='body'>
                {shouldShowNavBar && <NavBar/>}
                <Container>
                    <Outlet/>
                </Container>
            </div>
        </>
    );
};

export default observer(App);