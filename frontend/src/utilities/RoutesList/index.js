import { Ingredients, Measurements, Home, Recipes } from "../../pages";
import Login from "../../pages/Login";
import ProtectedRoute from "../../components/ProtectedRoute";

const routeslist = [
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>
    },
    {
        path: "/ingredients",
        element: <ProtectedRoute><Ingredients /></ProtectedRoute>
    },
    {
        path: "/measurements",
        element: <ProtectedRoute><Measurements /></ProtectedRoute>
    },
    {
        path: "/recipes",
        element: <ProtectedRoute><Recipes /></ProtectedRoute>
    },
    {
        path: "*",
        element: <div>404 Not Found</div>
    },
]

export { routeslist }