import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import NotFoundPage from "../../feature/error/NotFoundPage";
import FilmDetailsPage from "../../feature/film/details/FilmDetailsPage";
import ManagePage from "../../feature/film/manage/ManagePage";
import FilmPlayerPage from "../../feature/film/player/FilmPlayerPage";
import SearchPage from "../../feature/film/search/SearchPage";
import HomePage from "../../feature/home/HomePage";
import App from "../layout/App";
import RegisterForm from "../../feature/user/RegisterForm";
import LoginForm from "../../feature/user/LoginForm";
import ProfilePage from "../../feature/profile/ProfilePage";

const sideBarRoutes: RouteObject[] = [
    { path: '/', element: <HomePage /> },
    { path: '/my-area', element: <></> },
    { path: '/home', element: <HomePage /> },
    { path: '/manage', element: <ManagePage /> },
    { path: '/search', element: <SearchPage /> },
    { path: '/profile', element: <ProfilePage /> },
    { path: '/film/:id', element: <FilmDetailsPage /> },
    { path: '/film/watch/:title', element: <FilmPlayerPage /> },
];

const otherRoutes: RouteObject[] = [
    { path: '/login', element: <LoginForm /> },
    { path: '/register', element: <RegisterForm /> },
    { path: '/not-found', element: <NotFoundPage /> },
    { path: '*', element: <Navigate to="/not-found" replace /> },
];

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <Navigate to="/home" replace /> },
            ...sideBarRoutes,
            ...otherRoutes,
        ],
    },
];

export const router = createBrowserRouter(routes);