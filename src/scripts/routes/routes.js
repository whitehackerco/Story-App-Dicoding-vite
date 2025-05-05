import LoginPage from "../pages/login-page";
import RegisterPage from "../pages/register/register-page";
import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
};

export default routes;
