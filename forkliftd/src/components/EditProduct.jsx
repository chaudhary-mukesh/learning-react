import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditProduct({ productId, token }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // Images management
  const [existingImages, setExistingImages] = useState([]); // URLs strings
  const [newImages, setNewImages] = useState([]); // File objects
  const [removedImages, setRemovedImages] = useState([]); // URLs to remove

  // Form fields
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

  const fileInputRef = useRef();

  // Fetch product data on mount
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(
          `https://demodrafts.com/forkliftd/single/product/list?product_id=${encodeURIComponent(productId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data?.data?.find(p => p.id.toString() === productId.toString());
        if (!data) throw new Error('Product not found');

        setProduct(data);

        // Set form fields
        setFormFields({
          manufacturer: data.manufacturer || '',
          model: data.model || '',
          year_of_manufacture: data.year_of_manufacture || '',
          capacity: data.capacity || '',
          closed_height: data.closed_height || '',
          lift_height: data.lift_height || '',
          mast_type: data.mast_type || '',
          extras: data.extras || '',
          hours: data.hours || '',
          warranty: data.warranty || '',
          price: data.price || '',
        });

        // Decode images
        let imgs = [];
        try {
          imgs = JSON.parse(data.image_url || '[]');
        } catch { }

        // Normalize URLs (prepend base if relative)
        const baseImageUrl = 'https://demodrafts.com/forkliftd/';
        const fullUrls = imgs.map(url =>
          url.match(/^https?:\/\//) ? url : baseImageUrl + url.replace(/^\/+/, '')
        );

        setExistingImages(fullUrls);
      } catch (error) {
        toast.error('Failed to load product: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId, token]);

  // Handle input changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  }

  // Handle adding new images
  function handleAddImages(e) {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setNewImages(prev => [...prev, ...files]);
    }
    e.target.value = null; // reset input
  }

  // Remove existing image by index
  function removeExistingImage(idx) {
    const urlToRemove = existingImages[idx];
    setRemovedImages(prev => [...prev, urlToRemove]);
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  }

  // Remove new image by index
  function removeNewImage(idx) {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  }

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      toast.error('You must be logged in');
      return;
    }

    const apiUrl = `https://demodrafts.com/forkliftd/product/save/${encodeURIComponent(productId)}`;
    const formData = new FormData();

    // Append existing images URLs (that are kept)
    existingImages.forEach((url, i) => {
      formData.append(`image[${i}]`, url);
    });

    // Append new image files
    newImages.forEach((file, i) => {
      formData.append(`image[${existingImages.length + i}]`, file);
    });

    // Append removed images
    removedImages.forEach((url, i) => {
      formData.append(`removed_images[${i}]`, url);
    });

    // Append other form fields
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.status === 1) {
        toast.success('Product updated successfully!');
        // Optionally redirect or refresh page
      } else {
        toast.error(res.data?.message || 'Failed to update product');
      }
    } catch (err) {
      toast.error('Error submitting form: ' + err.message);
    }
  }

  if (loading) return <p>Loading product...</p>;

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <ToastContainer position="top-right" autoClose={4000} />
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Images */}
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 320,
                height: 320,
                border: '1px solid #ccc',
                marginBottom: 10,
                objectFit: 'contain',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#fafafa',
              }}
            >
              {existingImages.length + newImages.length > 0 ? (
                <img
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                  src={
                    existingImages[0] ||
                    (newImages[0] && URL.createObjectURL(newImages[0]))
                  }
                  alt="Main"
                />
              ) : (
                <span>No Image</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              style={{ padding: '8px 12px' }}
            >
              Add Images
            </button>

            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleAddImages}
            />
          </div>

          {/* Thumbnails */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              maxWidth: 550,
              maxHeight: 320,
              overflowY: 'auto',
            }}
          >
            {existingImages.map((url, i) => (
              <div
                key={`existing-${i}`}
                style={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={url}
                  alt={`Existing ${i}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    background: 'red',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                  }}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}

            {newImages.map((file, i) => (
              <div
                key={`new-${i}`}
                style={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New ${i}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    background: 'red',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                  }}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}

            {(existingImages.length + newImages.length) === 0 && (
              <p>No images selected</p>
            )}
          </div>
        </div>

        {/* Form fields */}
        <div style={{ marginTop: 20 }}>
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
            { label: 'Warranty (months)', name: 'warranty', type: 'number' },
            { label: 'Price', name: 'price', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name} style={{ marginBottom: 10 }}>
              <label htmlFor={name} style={{ display: 'block', fontWeight: 'bold' }}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formFields[name]}
                onChange={handleInputChange}
                style={{ width: '100%', padding: 6, fontSize: 16 }}
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: '10px 16px',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
