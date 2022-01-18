import { Navigate, useRoutes } from 'react-router-dom';
import Home from '../Components/Home';

export default function Router() {
  return useRoutes([
    { path: '/', element: <Home /> },
  ]);
}
