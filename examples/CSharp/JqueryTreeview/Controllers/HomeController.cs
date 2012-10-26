using System.Web.Mvc;

namespace JqueryTreeview.Controllers
{
    using JqueryTreeview.Models;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ShortGetCategories(int upperId)
        {
            var listOfCategories = Category.ShortGetCategories(upperId);

            return Json(listOfCategories);
        }

        public JsonResult LongGetCategories(int upperId)
        {
            var listOfCategories = Category.LongGetCategories(upperId);

            return Json(listOfCategories);
        }
    }
}
