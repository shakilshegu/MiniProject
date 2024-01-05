import { IoSearch } from "react-icons/io5";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";
import { addItem } from "../utils/cartSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(setCurrentPage);

  const dispatch = useDispatch();

  const {
    isLoading: productsLoading,
    data: productsData,
    error: productsError,
  } = useQuery(["products", currentPage], async () => {
    return await axios.get(
      `https://fakestoreapi.com/products?limit=8&page=${currentPage}`
    );
  });

  const {
    isLoading: categoriesLoading,
    data: categoriesData,
    error: categoriesError,
  } = useQuery("categories", async () => {
    return await axios.get(`https://fakestoreapi.com/products/categories`);
  });

  if (productsLoading || categoriesLoading) {
    return (
      <div className="h-screen flex items-center justify-center dark:bg-gray-900">
        <p className="text-center text-white ">Loading...</p>
      </div>
    );
  }
  if (productsError || categoriesError) {
    return (
      <p>{productsError ? productsError.message : categoriesError.message}</p>
    );
  }

  // Filter products based on the search.
  const filteredProducts = productsData?.data
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    );

  //add item
  const handleAddItem = (product) => {
    dispatch(addItem(product));
  };
   
  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-8 mx-auto">
          <div className="lg:flex lg:-mx-2">
            <div className="space-y-3 lg:w-1/5 lg:px-2 lg:space-y-4">
              <p className="block font-medium text-white dark:text-white hover:underline">
                Category
              </p>
              {categoriesData?.data.map((category) => (
                <button
                  key={category}
                  className={`block text-sm font-medium text-gray-500 dark:text-gray-300 hover:underline ${
                    selectedCategory === category ? "text-blue-500" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-6 lg:mt-0 lg:px-2 lg:w-4/5 ">
              <div className="flex items-center justify-between text-sm tracking-widest uppercase ">
                <div className="relative">
                  <IoSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className="bg-white rounded-md w-full text-black h-8 pl-8"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col items-center justify-center w-full max-w-lg mx-auto"
                  >
                    <img
                      className="object-cover w-full rounded-md h-72 xl:h-80"
                      src={product?.image}
                      alt="T-Shirt"
                    />
                    <h4 className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">
                      {product?.title.length > 10
                        ? `${product.title.substring(0, 10)}...`
                        : product.title}
                    </h4>
                    <p className="text-blue-500">${product?.price}</p>

                    <button
                      onClick={() => handleAddItem(product)}
                      className="flex items-center justify-center w-full px-2 py-2 mt-4 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mx-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span className="mx-1">Add to cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center mt-8">
        <button
          onClick={loadMore}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default Home;
