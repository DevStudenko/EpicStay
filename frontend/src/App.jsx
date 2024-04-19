
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import Spots from './components/Spots';
import SpotDetail from './components/SpotDetail';
import CreateNewSpot from './components/CreateNewSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpotForm from './components/UpdateSpotForm';


const Layout = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetail />
      },
      {
        path: '/spots/new',
        element: <CreateNewSpot />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },
      {
        path: '/spots/:id/edit',
        element: <UpdateSpotForm />
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
}

export default App
