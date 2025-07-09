// import React, { useState, useEffect } from "react";

// export default function ProductDetail({ productId }) {
//   const [product, setProduct] = useState(null);
//   const [mainImage, setMainImage] = useState("");
//   const [imageUrls, setImageUrls] = useState([]);
//   const [toastMessage, setToastMessage] = useState("");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteType, setDeleteType] = useState("soft");

//   useEffect(() => {
//     async function fetchProduct() {
//       try {
//         const res = await fetch(`https://demodrafts.com/forkliftd/single/product/list?product_id=${productId}`);
//         const json = await res.json();
//         const found = (json.data || []).find(p => p.id === productId);
//         if (found) {
//           setProduct(found);
//           const imgs = JSON.parse(found.image_url || "[]");
//           setImageUrls(imgs);
//           setMainImage(imgs.length ? `https://demodrafts.com/forkliftd/${imgs[0].replace(/^\/+/, "")}` : "https://via.placeholder.com/400x400?text=No+Image");
//         } else {
//           setMainImage("https://via.placeholder.com/400x400?text=Product+Not+Found");
//         }
//       } catch (e) {
//         setMainImage("https://via.placeholder.com/400x400?text=Error+Loading");
//       }
//     }
//     if (productId) fetchProduct();
//   }, [productId]);

//   const showToast = (msg) => {
//     setToastMessage(msg);
//     setTimeout(() => setToastMessage(""), 3000);
//   };

//   const confirmDelete = async (type) => {
//     try {
//       const res = await fetch("https://demodrafts.com/forkliftd/product/delete?", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ product_id: productId, delete_type: type }),
//       });
//       const data = await res.json();
//       if (!data.error) {
//         showToast(`Product ${type === "soft" ? "hidden" : "deleted"} successfully.`);
//         setTimeout(() => window.location.href = "/all-products", 1500);
//       } else {
//         showToast(`Error: ${data.message || "Failed to delete."}`);
//       }
//     } catch {
//       showToast("Error processing request.");
//     }
//   };

//   const restoreProduct = async () => {
//     try {
//       const res = await fetch("https://demodrafts.com/forkliftd/product/restore", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ product_id: productId }),
//       });
//       const data = await res.json();
//       if (!data.error) {
//         showToast("Product restored successfully.");
//         setTimeout(() => window.location.href = "/all-products", 1500);
//       } else {
//         showToast(`Error: ${data.message || "Failed to restore."}`);
//       }
//     } catch {
//       showToast("Error restoring product.");
//     }
//   };

//   const fields = product ? {
//     Manufacturer: product.manufacturer || "-",
//     Model: product.model || "-",
//     "Year of Manufacturer": product.year_of_manufacture || "-",
//     Capacity: product.capacity || "-",
//     "Closed Height": product.closed_height || "-",
//     "Lift Height": product.lift_height || "-",
//     "Mast Type": product.mast_type || "-",
//     Extras: product.extras || "-",
//     Hours: product.hours || "-",
//     Warranty: product.warranty || "-",
//     Price: product.price || "-",
//   } : {};

//   return (
//     <div style={{ marginLeft: 220, paddingTop: 132 }}>
//       <div className="px-5 d-flex justify-content-between mb-3">
//         <a href="/all-products" className="btn btn-secondary"><i className="fa fa-arrow-left"></i> Back</a>
//         {product && <a href={`/edit-product?product_id=${product.id}`} className="btn btn-secondary"><i className="fa fa-pencil"></i> Edit</a>}
//       </div>

//       <section className="secpd0 forklifts-detail px-5">
//         <div className="container">
//           <div className="row">
//             {/* Image Column */}
//             <div className="col-lg-4 col-md-6">
//               <div className="fancybox-custom-inner position-relative">
//                 <img className="img-fluid" src={mainImage} alt="Product" />
//               </div>
//               <div className="d-flex flex-wrap mt-3 gap-2" id="thumbnailsContainer">
//                 {imageUrls.map((img, i) => {
//                   const fullUrl = img.match(/^https?:\/\//) ? img : `https://demodrafts.com/forkliftd/${img.replace(/^\/+/, "")}`;
//                   return (
//                     <img
//                       key={i}
//                       src={fullUrl}
//                       alt="Thumbnail"
//                       className="thumbnail-image"
//                       style={{ width: 60, height: 60, objectFit: "cover", cursor: "pointer", borderRadius: 4, border: fullUrl === mainImage ? "2px solid #007bff" : "2px solid transparent" }}
//                       onClick={() => setMainImage(fullUrl)}
//                     />
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Details Column */}
//             <div className="col-lg-8 col-md-6">
//               <div className="productdetail-inner">
//                 <h2 className="mb-3">{fields.Manufacturer} - {fields.Model}</h2>
//                 <div className="table-responsive">
//                   <table className="table table-striped">
//                     <tbody>
//                       {Object.entries(fields).map(([label, value]) => (
//                         <tr key={label}>
//                           <td className="td-heading">{label}</td>
//                           <td>{value || "-"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-flex justify-content-between mt-3">
//             {(product?.is_deleted === "1") ? (
//               <button className="btn btn-success" onClick={restoreProduct}>
//                 <i className="fa fa-undo"></i> Restore
//               </button>
//             ) : (
//               <button className="btn btn-secondary" onClick={() => confirmDelete("soft")}>
//                 <i className="fa fa-eye-slash"></i> Hide
//               </button>
//             )}
//             <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
//               <i className="fa fa-trash"></i> Delete
//             </button>
//           </div>

//           {/* Delete Confirmation Modal */}
//           {showDeleteModal && (
//             <div className="modal-backdrop fade show"></div>
//           )}
//           <div className={`modal fade ${showDeleteModal ? "show d-block" : ""}`} tabIndex={-1} role="dialog" aria-labelledby="deleteModalLabel" aria-hidden={!showDeleteModal} >
//             <div className="modal-dialog modal-dialog-centered" role="document">
//               <div className="modal-content">
//                 <div className="modal-header bg-danger text-white">
//                   <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)} aria-label="Close"></button>
//                 </div>
//                 <div className="modal-body">Are you sure you want to delete this product?</div>
//                 <div className="modal-footer">
//                   <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>No</button>
//                   <button className="btn btn-danger" onClick={() => { confirmDelete("hard"); setShowDeleteModal(false); }}>Yes</button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Toast */}
//           {toastMessage && (
//             <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1100 }}>
//               <div className="toast show align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
//                 <div className="d-flex">
//                   <div className="toast-body">{toastMessage}</div>
//                   <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage("")} aria-label="Close"></button>
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </section>
//     </div>
//   );
// }





// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// export default function ProductDetail() {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [mainImage, setMainImage] = useState(null);
//   const [imageUrls, setImageUrls] = useState([]);
//   const [toastMessage, setToastMessage] = useState("");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return navigate('/login');

//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`api/single/product/list?product_id=${productId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const json = await res.json();
//         const found = (json.data || []).find(p => p.id === productId || p.id === parseInt(productId));
//         if (found) {
//           setProduct(found);
//           const imgs = JSON.parse(found.image_url || "[]");
//           setImageUrls(imgs);
//           if (imgs.length > 0) {
//             const cleaned = imgs[0].replace(/^\/+/, "").replace(/\\/g, '/');
//             setMainImage(`api/${cleaned}`);
//           } else {
//             setMainImage(null);
//           }
//         } else {
//           setMainImage(null);
//         }
//       } catch {
//         setMainImage(null);
//       }
//     };

//     if (productId) fetchProduct();
//   }, [productId, navigate]);

//   const showToast = (msg) => {
//     setToastMessage(msg);
//     setTimeout(() => setToastMessage(""), 3000);
//   };

//   const confirmDelete = async (type) => {
//     try {
//       const res = await fetch("api/product/delete?", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ product_id: productId, delete_type: type }),
//       });
//       const data = await res.json();
//       if (!data.error) {
//         showToast(`Product ${type === "soft" ? "hidden" : "deleted"} successfully.`);
//         setTimeout(() => navigate("/all-products"), 1500);
//       } else {
//         showToast(`Error: ${data.message || "Failed to delete."}`);
//       }
//     } catch {
//       showToast("Error processing request.");
//     }
//   };

//   const restoreProduct = async () => {
//     try {
//       const res = await fetch("api/product/restore", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ product_id: productId }),
//       });
//       const data = await res.json();
//       if (!data.error) {
//         showToast("Product restored successfully.");
//         setTimeout(() => navigate("/all-products"), 1500);
//       } else {
//         showToast(`Error: ${data.message || "Failed to restore."}`);
//       }
//     } catch {
//       showToast("Error restoring product.");
//     }
//   };

//   const fields = product ? {
//     Manufacturer: product.manufacturer || "-",
//     Model: product.model || "-",
//     "Year of Manufacturer": product.year_of_manufacture || "-",
//     Capacity: product.capacity || "-",
//     "Closed Height": product.closed_height || "-",
//     "Lift Height": product.lift_height || "-",
//     "Mast Type": product.mast_type || "-",
//     Extras: product.extras || "-",
//     Hours: product.hours || "-",
//     Warranty: product.warranty || "-",
//     Price: product.price || "-",
//   } : {};

//   return (
//     <div style={{ marginLeft: 220, paddingTop: 132 }}>
//       <div className="px-5 mb-3 flex justify-between">
//         <button className="btn btn-secondary" onClick={() => navigate('/all-products')}>← Back</button>
//         {product && (
//           <button className="btn btn-secondary" onClick={() => navigate(`/edit-product/${product.id}`)}>✏️ Edit</button>
//         )}
//       </div>

//       <section className="px-5">
//         <div className="flex flex-wrap gap-6">
//           {/* Image & Thumbnails */}
//           <div className="w-full sm:w-1/3">
//             {mainImage ? (
//               <img className="w-full rounded" src={mainImage} alt="Main Product" />
//             ) : (
//               <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
//                 No Image Available
//               </div>
//             )}
//             <div className="flex flex-wrap gap-2 mt-3">
//               {imageUrls.map((img, i) => {
//                 const cleaned = img.replace(/^\/+/, "").replace(/\\/g, '/');
//                 const fullUrl = `api/${cleaned}`;
//                 return (
//                   <img
//                     key={i}
//                     src={fullUrl}
//                     alt={`Thumbnail ${i}`}
//                     onClick={() => setMainImage(fullUrl)}
//                     className={`w-14 h-14 object-cover cursor-pointer rounded border-2 ${mainImage === fullUrl ? 'border-blue-500' : 'border-transparent'}`}
//                   />
//                 );
//               })}
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="w-full sm:w-2/3">
//             <h2 className="text-2xl font-semibold mb-4">{fields.Manufacturer} - {fields.Model}</h2>
//             <table className="table-auto w-full text-left">
//               <tbody>
//                 {Object.entries(fields).map(([label, value]) => (
//                   <tr key={label}>
//                     <th className="py-2 pr-4 font-medium">{label}</th>
//                     <td className="py-2">{value}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4 mt-6">
//           {product?.is_deleted === "1" ? (
//             <button className="btn btn-success" onClick={restoreProduct}>↩️ Restore</button>
//           ) : (
//             <button className="btn btn-warning" onClick={() => confirmDelete("soft")}>🙈 Hide</button>
//           )}
//           <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>🗑️ Delete</button>
//         </div>

//         {/* Confirm Delete Modal */}
//         {showDeleteModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
//               <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
//               <p className="mb-4">Are you sure you want to delete this product?</p>
//               <div className="flex justify-end gap-3">
//                 <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
//                 <button className="btn btn-danger" onClick={() => { confirmDelete("hard"); setShowDeleteModal(false); }}>Delete</button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Toast Notification */}
//         {toastMessage && (
//           <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50">
//             {toastMessage}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const BASE_URL = "https://demodrafts.com/forkliftd/";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Product passed from navigation state
  const passedProduct = location.state?.product;

  const [product, setProduct] = useState(passedProduct || null);
  const [mainImage, setMainImage] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (passedProduct) {
      let imgs = [];
      try {
        imgs = JSON.parse(passedProduct.image_url || "[]");
      } catch {
        imgs = [];
      }
      setImageUrls(imgs);
      setMainImage(imgs.length ? BASE_URL + imgs[0].replace(/^\/+/, "") : "https://via.placeholder.com/400x400?text=No+Image");
    } else {
      // No product data passed - redirect back or show message
      setProduct(null);
      setMainImage("https://via.placeholder.com/400x400?text=No+Product+Data");
    }
  }, [passedProduct]);

  const fields = product ? {
    Manufacturer: product.manufacturer || "-",
    Model: product.model || "-",
    "Year of Manufacturer": product.year_of_manufacture || "-",
    Capacity: product.capacity || "-",
    "Closed Height": product.closed_height || "-",
    "Lift Height": product.lift_height || "-",
    "Mast Type": product.mast_type || "-",
    Extras: product.extras || "-",
    Hours: product.hours || "-",
    Warranty: product.warranty || "-",
    Price: product.price || "-",
  } : {};

  if (!product) {
    return (
      <div style={{ marginLeft: 220, paddingTop: 20, textAlign: 'center' }}>
        <p>No product data available.</p>
        <button onClick={() => navigate('/all-products')} className="btn btn-secondary mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className='ml-[220px] px-3 pt-6'>
      <div className="px-5 mb-3 flex justify-between">
        <button
  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
  onClick={() => navigate('/all-products')}
>
  ← Back
</button>
        <button
  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
  onClick={() => navigate(`/edit-product/${product.id}`, { state: { product } })}
>
  ✏️ Edit
</button>
      </div>

      <section className="px-3 pt-6">
        <div className="flex gap-8">
          <div className="w-[30%] flex flex-col justify-between max-h-[520px]">
            <img className="w-full rounded max-h-[420px]" src={mainImage} alt="Main" />
            <div className="flex flex-wrap gap-2 mt-3">
              {imageUrls.map((img, i) => {
                const fullUrl = BASE_URL + img.replace(/^\/+/, "");
                return (
                  <img
                    key={i}
                    src={fullUrl}
                    alt={`Thumbnail ${i}`}
                    onClick={() => setMainImage(fullUrl)}
                    className={`w-14 h-14 object-cover cursor-pointer rounded border-2  ${mainImage === fullUrl ? 'border-blue-500' : 'border-transparent'}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="w-[70%]">
            <h2 className="text-2xl font-semibold mb-4">{fields.Manufacturer} - {fields.Model}</h2>
            <table className="table-auto w-full text-left">
              <tbody>
                {Object.entries(fields).map(([label, value]) => (
                  <tr key={label}>
                    <th className="py-2 pr-4 font-medium">{label}</th>
                    <td className="py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add your delete/restore buttons and toast here if needed */}
      </section>
    </div>
  );
}
