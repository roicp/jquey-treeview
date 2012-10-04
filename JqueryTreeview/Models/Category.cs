using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JqueryTreeview.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Category Upper { get; set; }
    }
}