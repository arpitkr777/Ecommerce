import { useState } from "react";
import ProductCard from "../components/product-card";
import {
  useAllcategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { CartItem, WishlistItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../redux/reducer/wishlistReducer";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError: productIsError,
    error: productError,
  } = useAllcategoriesQuery("");

  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { isLoading: productLoading, data: searchData } =
    useSearchProductsQuery({
      search,
      sort,
      category,
      page,
      price: maxPrice,
    });

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem?.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart({ ...cartItem }));
    toast.success("Added to Cart");
  };
  const addtoWishlistHandler = (wishlistItem: WishlistItem) => {
    if (wishlistItem?.stock < 1) return toast.error("Out of Stock");
    dispatch(
      addToWishlist({ ...wishlistItem, quantity: wishlistItem.quantity })
    );
    toast.success("Added to Wishlist");
  };

  const isPrevPage = page < 2;
  const isNextPage = page > searchData?.totalPage! - 1;
  return (
    <div className="product-search-name">
      <h1>Products</h1>
      <aside>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
       
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>


        <div>
          <h4>Max Price:{maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Search </h4>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </aside>
      <main>
        {searchData?.products.length === 0 ? (<h2>No Items Found</h2>):(<div></div>)}
        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className="search-product-list">
            {searchData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photo={i.photo[0]}
                wishHandler={addtoWishlistHandler}
              />
            ))}
          </div>
        )}

        {searchData && searchData.totalPage > 1 && (
          <article>
            <button
              disabled={isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchData.totalPage}
            </span>
            <button
              disabled={isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
