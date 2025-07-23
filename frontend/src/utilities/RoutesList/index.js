import { Ingredients, Measurements, Home, Recipes } from "../../pages";


const routeslist = [
    {
        path: "/",
        component: <Home />
    },
    {
        path: "/ingredients",
        component: <Ingredients />
    },
    {
        path: "/measurements",
        component: <Measurements />
    },
    {
        path: "/recipes",
        component: <Recipes />
    },
]

export { routeslist }