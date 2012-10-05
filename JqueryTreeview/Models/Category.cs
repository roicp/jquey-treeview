using System.Collections.Generic;
using System.Linq;

namespace JqueryTreeview.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int UpperCategoryId { get; set; }
        public List<Category> Children { get; set; }


        private static IEnumerable<Category> GetAllCategoriesWithChildren()
        {
            var listOfCategories = new List<Category>();

            var level1Item1 = new Category
                {
                    Id = 11,
                    Name = "Book Store",
                    Description = "All the best salers are here",
                    Children = new List<Category>
                        {
                            #region Children

                            new Category
                                {
                                     Id = 1121,
                                     Name = "Books",
                                     Description = "Paper books",
                                     UpperCategoryId = 11,
                                     Children = new List<Category>
                                         {
                                             #region Children

                                             new Category
                                                 {
                                                     Id = 112131,
                                                     Name = "Best Books of the Year So Far",
                                                     Description = "Top 20 Editors' Picks, Mystery, Thriller & Suspense, Teens and more",
                                                     UpperCategoryId = 1121
                                                 },
                                             new Category
                                                 {
                                                     Id = 112132,
                                                     Name = "Fall Reading",
                                                     Description = "New Fiction, Fall Blockbusters, Editors' Picks and more",
                                                     UpperCategoryId = 1121
                                                 },
                                             new Category
                                                 {
                                                     Id = 112133,
                                                     Name = "Best Books of the Month",
                                                     Description = "The End of Your Life Book Club by Will Schwalbe, Live by Night by Dennis Lehane, Back to Blood by Tom Wolfe and more",
                                                     UpperCategoryId = 1121
                                                 },
                                             new Category
                                                 {
                                                     Id = 112134,
                                                     Name = "Textbooks",
                                                     Description = "Up to 30% Off New and Up to 90% Off Used Textbooks, Up to 70% Back for Your Used Textbooks, Amazon Student and more",
                                                     UpperCategoryId = 1121
                                                 },
                                             new Category
                                                 {
                                                     Id = 112135,
                                                     Name = "Award Winners",
                                                     Description = "Pulitzer Prizes, Edgar Awards, James Beard Foundation Book Awards and more",
                                                     UpperCategoryId = 1121
                                                 },
                                             new Category
                                                 {
                                                     Id = 112136,
                                                     Name = "Children's Books",
                                                     Description = "Essential Books for Children, Children's Book Awards, Amazon Kids and more",
                                                     UpperCategoryId = 1121
                                                 }

                                             #endregion
                                         }
                                },

                            new Category
                                {
                                     Id = 1122,
                                     Name = "eBooks",
                                     Description = "Eletronnic versions of all your favorities books",
                                     UpperCategoryId = 11,
                                     Children = new List<Category>
                                         {
                                            #region Children

                                            new Category
                                                { 
                                                    Id = 112231,
                                                    Name = "Best Books of the Month",
                                                    Description = "The End of Your Life Book Club by Will Schwalbe, Live by Night by Dennis Lehane, Back to Blood by Tom Wolfe and more",
                                                    UpperCategoryId = 1122
                                                },
                                            new Category
                                                { 
                                                    Id = 112232,
                                                    Name = "Best Books of the Year So Far",
                                                    Description = "Top 20 Editors' Picks, Mystery, Thriller & Suspense, Teens and more",
                                                    UpperCategoryId = 1122
                                                }

                                            #endregion
                                         }
                                },

                            new Category
                                {
                                     Id = 1123,
                                     Name = "Pre-Owned",
                                     Description = "Used books",
                                     UpperCategoryId = 11,
                                     Children = new List<Category>
                                         {
                                            #region Children

                                            new Category
                                                { 
                                                    Id = 112331,
                                                    Name = "Award Winners",
                                                    Description = "Pulitzer Prizes, Edgar Awards, James Beard Foundation Book Awards and more",
                                                    UpperCategoryId = 1123
                                                },
                                            new Category
                                                { 
                                                    Id = 112332,
                                                    Name = "Fall Reading",
                                                    Description = "New Fiction, Fall Blockbusters, Editors' Picks and more",
                                                    UpperCategoryId = 1123
                                                },
                                            new Category
                                                { 
                                                    Id = 112333,
                                                    Name = "Best Books of the Month",
                                                    Description = "The End of Your Life Book Club by Will Schwalbe, Live by Night by Dennis Lehane, Back to Blood by Tom Wolfe and more",
                                                    UpperCategoryId = 1123
                                                }
                                            #endregion
                                         }
                                }
                            
                            #endregion
                        }
                };

            var level1Item2 = new Category
                {
                    Id = 12,
                    Name = "Electronics & Computers",
                    Description = "All the new stuff right here",
                    Children = new List<Category>
                        {
                            #region Children

                            new Category
                                { 
                                    Id = 1221,
                                    Name = "Electronics",
                                    Description = "TV & Video, Home Audio & Theater",
                                    UpperCategoryId = 12
                                },
                            new Category
                                { 
                                    Id = 1222,
                                    Name = "Computers",
                                    Description = "Laptops, Tablets & Netbooks",
                                    UpperCategoryId = 12,
                                    Children = new List<Category>
                                        {
                                            #region Children

                                            new Category
                                                { 
                                                    Id = 122231,
                                                    Name = "Laptop & Tablet Categories",
                                                    Description = "Best Sellers, Hot New Releases and Most Gifted",
                                                    UpperCategoryId = 1222
                                                }

                                            #endregion
                                        }
                                }

                            #endregion
                        }
                };

            var level1Item3 = new Category
                {
                    Id = 13,
                    Name = "Home, Garden & Tools",
                    Description = "Everything for your well living"
                };

            listOfCategories.Add(level1Item1);
            listOfCategories.Add(level1Item2);
            listOfCategories.Add(level1Item3);

            return listOfCategories;
        }

        private static IEnumerable<Category> GetAllCategoriesAsFlatList()
        {
            var listOfCategories = new List<Category>
                {
                    new Category
                        {
                            Id = 112131,
                            Name = "Best Books of the Year So Far",
                            Description = "Top 20 Editors' Picks, Mystery, Thriller & Suspense, Teens and more",
                            UpperCategoryId = 1121
                        },
                    new Category
                        {
                            Id = 112132,
                            Name = "Fall Reading",
                            Description = "New Fiction, Fall Blockbusters, Editors' Picks and more",
                            UpperCategoryId = 1121
                        },
                    new Category
                        {
                            Id = 112133,
                            Name = "Best Books of the Month",
                            Description = "The End of Your Life Book Club by Will Schwalbe, Live by Night by Dennis Lehane, Back to Blood by Tom Wolfe and more",
                            UpperCategoryId = 1121
                        },
                    new Category
                        {
                            Id = 1121,
                            Name = "Books",
                            Description = "Paper books",
                            UpperCategoryId = 11
                        },
                    new Category
                        {
                            Id = 11,
                            Name = "Book Store",
                            Description = "All the best salers are here"
                        },
                    new Category
                        {
                            Id = 112134,
                            Name = "Textbooks",
                            Description = "Up to 30% Off New and Up to 90% Off Used Textbooks, Up to 70% Back for Your Used Textbooks, Amazon Student and more",
                            UpperCategoryId = 1121
                        },
                    new Category
                        {
                            Id = 112135,
                            Name = "Award Winners",
                            Description = "Pulitzer Prizes, Edgar Awards, James Beard Foundation Book Awards and more",
                            UpperCategoryId = 1121
                        },
                    new Category
                        {
                            Id = 112136,
                            Name = "Children's Books",
                            Description = "Essential Books for Children, Children's Book Awards, Amazon Kids and more",
                            UpperCategoryId = 1121
                        },
                    new Category
                        {
                            Id = 1122,
                            Name = "eBooks",
                            Description = "Eletronnic versions of all your favorities books",
                            UpperCategoryId = 11
                        },
                    new Category
                        {
                            Id = 112231,
                            Name = "Best Books of the Month",
                            Description = "The End of Your Life Book Club by Will Schwalbe, Live by Night by Dennis Lehane, Back to Blood by Tom Wolfe and more",
                            UpperCategoryId = 1122
                        },
                    new Category
                        {
                            Id = 112232,
                            Name = "Best Books of the Year So Far",
                            Description = "Top 20 Editors' Picks, Mystery, Thriller & Suspense, Teens and more",
                            UpperCategoryId = 1122
                        },
                    new Category
                        {
                            Id = 1123,
                            Name = "Pre-Owned",
                            Description = "Used books",
                            UpperCategoryId = 11
                        },
                    new Category
                        {
                            Id = 112331,
                            Name = "Award Winners",
                            Description = "Pulitzer Prizes, Edgar Awards, James Beard Foundation Book Awards and more",
                            UpperCategoryId = 1123
                        },
                    new Category
                        {
                            Id = 112333,
                            Name = "Best Books of the Month",
                            Description = "The End of Your Life Book Club by Will Schwalbe, Live by Night by Dennis Lehane, Back to Blood by Tom Wolfe and more",
                            UpperCategoryId = 1123
                        },
                    new Category
                        {
                            Id = 112332,
                            Name = "Fall Reading",
                            Description = "New Fiction, Fall Blockbusters, Editors' Picks and more",
                            UpperCategoryId = 1123
                        },
                    new Category
                        {
                            Id = 13,
                            Name = "Home, Garden & Tools",
                            Description = "Everything for your well living"
                        },
                    new Category
                        {
                            Id = 1221,
                            Name = "Electronics",
                            Description = "TV & Video, Home Audio & Theater",
                            UpperCategoryId = 12
                        },
                    new Category
                        {
                            Id = 1222,
                            Name = "Computers",
                            Description = "Laptops, Tablets & Netbooks",
                            UpperCategoryId = 12
                        },
                    new Category
                        {
                            Id = 12,
                            Name = "Electronics & Computers",
                            Description = "All the new stuff right here"
                        },
                    new Category
                        {
                            Id = 122231,
                            Name = "Laptop & Tablet Categories",
                            Description = "Best Sellers, Hot New Releases and Most Gifted",
                            UpperCategoryId = 1222
                        }
                };

            return listOfCategories;
        }

        public static IEnumerable<Category> GetCategories(int upperId = 0)
        {
            var listOfCategories = Category.GetAllCategoriesAsFlatList();

            return listOfCategories.Where(c => upperId.Equals(c.UpperCategoryId));
        }
    }
}