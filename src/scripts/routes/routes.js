import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/login-page";
import RegisterPage from "../pages/register/register-page";
import StoriesPage from "../pages/stories/stories-page";
import AddStoryPage from "../pages/stories/add-story";
import DetailStoryPage from "../pages/stories/detail-story";
import BookmarkPage from "../pages/bookmark-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/stories": new StoriesPage(),
  "/add-story": new AddStoryPage(),
  "/stories/:id": new DetailStoryPage(),
  "/bookmark": new BookmarkPage(),
};

export default routes;
