using System.Web.Mvc;

namespace JqueryTreeview.Controllers
{
    using JqueryTreeview.Models;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var listOfCategories = Category.GetCategories();

            return View();
        }

        public JsonResult GetCategories(int upperId)
        {
            var listOfCategories = Category.GetCategories(upperId);

            return Json(listOfCategories);
        }
    }
}
