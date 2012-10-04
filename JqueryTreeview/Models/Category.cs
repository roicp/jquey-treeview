
using System.Collections.Generic;

namespace JqueryTreeview.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Category Upper { get; set; }
        public List<Category> Children { get; set; }

        public static List<Category> GetCategories(int upperId = 0)
        {
            var listOfCategories = new List<Category>();

            var level0Item1 = new Category
                {
                    Id = 1,
                    Name = "Books",
                    Description = "Books, eBooks, Pre-Owned"
                };

            var level0Item2 = new Category
            {
                Id = 2,
                Name = "Electronics & Computers",
                Description = "All the new stuff right here"
            };

            var level0Item3 = new Category
            {
                Id = 3,
                Name = "Home, Garden & Tools",
                Description = "Everything for your well living"
            };

            listOfCategories.Add(level0Item1);
            listOfCategories.Add(level0Item2);
            listOfCategories.Add(level0Item3);

            return listOfCategories;
        }
    }
}