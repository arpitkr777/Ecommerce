import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";

const Productmanagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const { photo, name, price, stock, category, description } =
    data?.product || {
      photo: "",
      name: "",
      price: 0,
      stock: 0,
      description: "",
      category: "",
    };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);

  const [photoFile, setPhotoFile] = useState<File[]>([]);
  const [photoUpdate, setPhotoUpdate] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [updateProduct] = useUpdateProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    const allFiles: File[] = [];
    const allFilePrevs: string[] = [];

    if (files) {
      const promises = Array.from(files).map((file, index) => {
        return new Promise((resolve, reject) => {
          const reader: FileReader = new FileReader();

          reader.readAsDataURL(file);
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              allFilePrevs[index] = reader.result;
              allFiles[index] = file;
              resolve(null);
            } else {
              reject();
            }
          };
        });
      });

      Promise.all(promises).then(() => {
        setPhotoUpdate(allFilePrevs);
        setPhotoFile(allFiles);
      });
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData();
    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", String(priceUpdate));
    if (stockUpdate !== undefined) formData.set("stock", String(stockUpdate));
    if (categoryUpdate) formData.set("category", categoryUpdate);
    if (descriptionUpdate) formData.set("description", descriptionUpdate);

    if (photoFile.length != 0) {
      photoFile.forEach((photo) => {
        formData.append("photo", photo);
      });
    }

    const res = await updateProduct({
      formData,
      userId: user?._id!,
      productId: data?.product._id!,
    });
    responseToast(res, navigate, "/admin/product");
  };
  const [deleteProduct] = useDeleteProductMutation();
  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });
    setIsProcessing(false)
    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data?.product.name!);
      setPriceUpdate(data?.product.price!);
      setStockUpdate(data?.product.stock!);
      setCategoryUpdate(data?.product.category!);
      setDescriptionUpdate(data?.product.description!);
    }
  }, [data]);
  let photoArray = Array.isArray(photo) ? photo : [photo];
  if (isError) return <Navigate to="/404" />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <article>
            <section>
              <strong>Id: {data?.product._id}</strong>

              <img src={photoArray[0]} alt="Product" />

              <aside>
                {photoArray.slice(1).map((photo, index) => (
                  <img key={index} src={photo} alt="Product" />
                ))}
              </aside>
              <p>
                {name} ({category})
              </p>
              <div>{description}</div>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <button className="product-delete-btn" onClick={deleteHandler}>
              <FaTrash />
            </button>
            <main>
              <form onSubmit={submitHandler}>
                <header>
                  <h2>Manage</h2>
                </header>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input type="file" multiple onChange={changeImageHandler} />
                </div>
                <aside>
                  {photoUpdate.map((photoUpdate, index) => (
                    <img key={index} src={photoUpdate} alt="preview" />
                  ))}
                </aside>

                <button type="submit">{!isProcessing?"Update":"Processing..."}</button>
              </form>
            </main>
          </article>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
