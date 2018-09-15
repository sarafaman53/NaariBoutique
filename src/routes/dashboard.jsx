import ClientSearch from "views/ClientSearch/ClientSearch";
import AddClient from "views/AddClient/AddClient";


const dashboardRoutes = [
  {
    path: "/addClient",
    name: "Add Client",
    icon: "pe-7s-bell",
    component: AddClient,
  },
  {
    path: "/clientSearch",
    name: "Search Client",
    icon: "pe-7s-bell",
    component: ClientSearch
  },
  { redirect: true, path: "/", to: "/addClient", name: "Add Client" }
  
];

export default dashboardRoutes;
