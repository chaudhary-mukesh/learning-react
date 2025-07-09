import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditProduct({ token }) {
  const { productId } = useParams();
  const location = useLocation();
  const product = location.state?.product || null;

  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    manufacturer: '',
    model: '',
    year_of_manufacture: '',
    capacity: '',
    closed_height: '',
    lift_height: '',
    mast_type: '',
    extras: '',
    hours: '',
    warranty: '',
    price: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalMainImageIndex, setModalMainImageIndex] = useState(0);

  const fileInputRef = useRef();

  useEffect(() => {
    if (!product) return;

    setFormFields({
      manufacturer: product.manufacturer ?? '',
      model: product.model ?? '',
      year_of_manufacture: product.year_of_manufacture ?? '',
      capacity: product.capacity ?? '',
      closed_height: product.closed_height ?? '',
      lift_height: product.lift_height ?? '',
      mast_type: product.mast_type ?? '',
      extras: product.extras ?? '',
      hours: product.hours ?? '',
      warranty: product.warranty ?? '',
      price: product.price ?? '',
    });

    const baseImageUrl = 'https://demodrafts.com/forkliftd/';
    // const baseImageUrl = '/api/'; 
    let imgs = [];
    try {
      imgs = JSON.parse(product.image_url || '[]');
    } catch {}

    const fullUrls = imgs.map(url =>
      url.match(/^https?:\/\//) ? url : baseImageUrl + url.replace(/^\/+/, '')
    );

    setExistingImages(fullUrls);
  }, [product]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImages = e => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      setNewImages(prev => [...prev, ...files]);
    }
    e.target.value = null;
  };

  const removeExistingImage = index => {
    setRemovedImages(prev => [...prev, existingImages[index]]);
    setExistingImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (mainImageIndex >= updated.length) setMainImageIndex(0);
      return updated;
    });
  };

  const removeNewImage = index => {
    setNewImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (mainImageIndex >= existingImages.length + updated.length) setMainImageIndex(0);
      return updated;
    });
  };

const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);

const formData = new FormData();

// Add form fields
Object.entries(formFields).forEach(([key, value]) => {
  formData.append(key, value ?? '');
});

// Add removed images
formData.append('removed_images', JSON.stringify(removedImages));

// Filter existing images that are not removed
const keptExistingImages = existingImages.filter(url => !removedImages.includes(url));

// Fetch and convert existing image URLs into File objects
const existingFiles = await Promise.all(
  keptExistingImages.map(async (url, index) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const blob = await response.blob();
      const filename = url.split('/').pop() || `existing_${index}.jpg`;
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error converting existing image:', error);
      return null;
    }
  })
);

// Append existing image files to formData as image[]
existingFiles.forEach(file => {
  if (file) {
    formData.append('image[]', file);
  }
});

// Append new image files to formData as image[]
newImages.forEach(file => {
  formData.append('image[]', file);
});


  // Debug log to verify images are added
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }

  // `https://demodrafts.com/forkliftd/product/save/${encodeURIComponent(productId)}`,
  try {
    const res = await axios.post(
      `https://demodrafts.com/forkliftd/product/save/${encodeURIComponent(productId)}`,
      // `/api/product/save/${encodeURIComponent(productId)}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data?.status === 1) {
      toast.success('Product updated successfully!');
    } else {
      toast.error(res.data?.message || 'Failed to update product');
    }
  } catch (err) {
    toast.error('Error submitting form: ' + err.message);
  } finally {
    setLoading(false);
  }
};









  const getAllImages = () => [
    ...existingImages,
    ...newImages.map(f => URL.createObjectURL(f)),
  ];

  const openPreview = () => {
    if (getAllImages().length === 0) {
      toast.error('Please add at least one product image before preview.');
      return;
    }
    setModalMainImageIndex(mainImageIndex);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  if (loading) return <div className="ml-[220px] p-6">Loading...</div>;

  return (
    <div className="ml-[220px] container mx-auto p-6" style={{ width: 'calc(100% - 220px)' }}>
      <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-6">
          <div className="w-72 flex flex-col items-center border rounded p-3">
            <div className="w-72 h-80 border mb-3 flex items-center justify-center bg-gray-100 relative">
              {getAllImages().length > 0 ? (
                <img
                  src={getAllImages()[mainImageIndex]}
                  alt="Main"
                  className="object-contain max-h-full max-w-full"
                />
              ) : (
                <div className="text-gray-400 text-center">No Image</div>
              )}
            </div>
            <div className="flex space-x-2 overflow-x-auto w-full mb-3">
              {getAllImages().map((src, i) => (
                <div
                  key={i}
                  className={`relative border cursor-pointer ${i === mainImageIndex ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => setMainImageIndex(i)}
                >
                  <img
                    src={src}
                    alt={`thumb-${i}`}
                    className="h-20 w-20 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1"
                    onClick={e => {
                      e.stopPropagation();
                      i < existingImages.length
                        ? removeExistingImage(i)
                        : removeNewImage(i - existingImages.length);
                    }}
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded text-3xl text-gray-500 hover:bg-gray-100"
                title="Add Image"
              >
                +
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddImages}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {[
  { label: 'Manufacturer', name: 'manufacturer', type: 'text' },
  { label: 'Model', name: 'model', type: 'text' },
  { label: 'Year of Manufacture', name: 'year_of_manufacture', type: 'number' },
  { label: 'Capacity', name: 'capacity', type: 'text' },
  { label: 'Closed Height', name: 'closed_height', type: 'text' },
  { label: 'Lift Height', name: 'lift_height', type: 'text' },
  { label: 'Mast Type', name: 'mast_type', type: 'text' },
  { label: 'Extras', name: 'extras', type: 'text' },
  { label: 'Hours', name: 'hours', type: 'number' },
  { label: 'Warranty', name: 'warranty', type: 'text' },
  { label: 'Price', name: 'price', type: 'number' },
].map(({ label, name, type }) => (
  <div key={name} className="flex items-center space-x-4">
    <label htmlFor={name} className="w-40 font-medium">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={formFields[name]}
      onChange={handleInputChange}
      className="border p-2 rounded flex-1"
    />
  </div>
))}

          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="button"
            onClick={openPreview}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Preview Product
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg relative max-w-3xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Product Preview</h3>
            <div className="flex space-x-6">
              <div className="flex-1">
                <img
                  src={getAllImages()[modalMainImageIndex]}
                  alt="Preview"
                  className="w-full max-h-[400px] object-contain mb-4"
                />
                <div className="flex space-x-2 overflow-x-auto">
                  {getAllImages().map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`preview-thumb-${i}`}
                      className={`h-20 w-20 object-cover cursor-pointer border ${i === modalMainImageIndex ? 'border-blue-600' : ''}`}
                      onClick={() => setModalMainImageIndex(i)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-2 text-sm">
                {Object.entries(formFields).map(([key, value]) => (
                  <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default EditProduct;
