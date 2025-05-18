import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/login-page";
import RegisterPage from "../pages/register/register-page";
import StoriesPage from "../pages/stories/stories-page";
import AddStoryPage from "../pages/stories/add-story";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/stories": new StoriesPage(),
  "/add-story": new AddStoryPage(),
};

export default routes;
