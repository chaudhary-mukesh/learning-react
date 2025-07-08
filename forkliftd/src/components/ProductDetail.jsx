import React, { useState, useEffect } from "react";

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState("soft");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://demodrafts.com/forkliftd/single/product/list?product_id=${productId}`);
        const json = await res.json();
        const found = (json.data || []).find(p => p.id === productId);
        if (found) {
          setProduct(found);
          const imgs = JSON.parse(found.image_url || "[]");
          setImageUrls(imgs);
          setMainImage(imgs.length ? `https://demodrafts.com/forkliftd/${imgs[0].replace(/^\/+/, "")}` : "https://via.placeholder.com/400x400?text=No+Image");
        } else {
          setMainImage("https://via.placeholder.com/400x400?text=Product+Not+Found");
        }
      } catch (e) {
        setMainImage("https://via.placeholder.com/400x400?text=Error+Loading");
      }
    }
    if (productId) fetchProduct();
  }, [productId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const confirmDelete = async (type) => {
    try {
      const res = await fetch("https://demodrafts.com/forkliftd/product/delete?", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, delete_type: type }),
      });
      const data = await res.json();
      if (!data.error) {
        showToast(`Product ${type === "soft" ? "hidden" : "deleted"} successfully.`);
        setTimeout(() => window.location.href = "/all-products", 1500);
      } else {
        showToast(`Error: ${data.message || "Failed to delete."}`);
      }
    } catch {
      showToast("Error processing request.");
    }
  };

  const restoreProduct = async () => {
    try {
      const res = await fetch("https://demodrafts.com/forkliftd/product/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await res.json();
      if (!data.error) {
        showToast("Product restored successfully.");
        setTimeout(() => window.location.href = "/all-products", 1500);
      } else {
        showToast(`Error: ${data.message || "Failed to restore."}`);
      }
    } catch {
      showToast("Error restoring product.");
    }
  };

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

  return (
    <div style={{ marginLeft: 220, paddingTop: 132 }}>
      <div className="px-5 d-flex justify-content-between mb-3">
        <a href="/all-products" className="btn btn-secondary"><i className="fa fa-arrow-left"></i> Back</a>
        {product && <a href={`/edit-product?product_id=${product.id}`} className="btn btn-secondary"><i className="fa fa-pencil"></i> Edit</a>}
      </div>

      <section className="secpd0 forklifts-detail px-5">
        <div className="container">
          <div className="row">
            {/* Image Column */}
            <div className="col-lg-4 col-md-6">
              <div className="fancybox-custom-inner position-relative">
                <img className="img-fluid" src={mainImage} alt="Product" />
              </div>
              <div className="d-flex flex-wrap mt-3 gap-2" id="thumbnailsContainer">
                {imageUrls.map((img, i) => {
                  const fullUrl = img.match(/^https?:\/\//) ? img : `https://demodrafts.com/forkliftd/${img.replace(/^\/+/, "")}`;
                  return (
                    <img
                      key={i}
                      src={fullUrl}
                      alt="Thumbnail"
                      className="thumbnail-image"
                      style={{ width: 60, height: 60, objectFit: "cover", cursor: "pointer", borderRadius: 4, border: fullUrl === mainImage ? "2px solid #007bff" : "2px solid transparent" }}
                      onClick={() => setMainImage(fullUrl)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Details Column */}
            <div className="col-lg-8 col-md-6">
              <div className="productdetail-inner">
                <h2 className="mb-3">{fields.Manufacturer} - {fields.Model}</h2>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <tbody>
                      {Object.entries(fields).map(([label, value]) => (
                        <tr key={label}>
                          <td className="td-heading">{label}</td>
                          <td>{value || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-3">
            {(product?.is_deleted === "1") ? (
              <button className="btn btn-success" onClick={restoreProduct}>
                <i className="fa fa-undo"></i> Restore
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={() => confirmDelete("soft")}>
                <i className="fa fa-eye-slash"></i> Hide
              </button>
            )}
            <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
              <i className="fa fa-trash"></i> Delete
            </button>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="modal-backdrop fade show"></div>
          )}
          <div className={`modal fade ${showDeleteModal ? "show d-block" : ""}`} tabIndex={-1} role="dialog" aria-labelledby="deleteModalLabel" aria-hidden={!showDeleteModal} >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">Are you sure you want to delete this product?</div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>No</button>
                  <button className="btn btn-danger" onClick={() => { confirmDelete("hard"); setShowDeleteModal(false); }}>Yes</button>
                </div>
              </div>
            </div>
          </div>

          {/* Toast */}
          {toastMessage && (
            <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1100 }}>
              <div className="toast show align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                  <div className="toast-body">{toastMessage}</div>
                  <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage("")} aria-label="Close"></button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
