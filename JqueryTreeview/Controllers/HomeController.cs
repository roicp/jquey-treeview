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

        public JsonResult GetCategories(int upperId)
        {
            var listOfCategories = Category.GetCategories();



            return Json(listOfCategories);
        }
    }
}
