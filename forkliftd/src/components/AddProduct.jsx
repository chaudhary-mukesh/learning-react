import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProduct() {
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [capacity, setCapacity] = useState('');
  const [closedHeight, setClosedHeight] = useState('');
  const [liftHeight, setLiftHeight] = useState('');
  const [mastType, setMastType] = useState('');
  const [extras, setExtras] = useState('');
  const [hours, setHours] = useState('');
  const [warranty, setWarranty] = useState('');
  const [price, setPrice] = useState('');

  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalMainImageIndex, setModalMainImageIndex] = useState(0);

  const fileInputRef = useRef();

  // Trigger hidden file input
  const triggerAddImage = () => {
    fileInputRef.current.click();
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      setImages(prev => [...prev, ...files]);
    }
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (index === mainImageIndex) {
        setMainImageIndex(0);
      } else if (index < mainImageIndex) {
        setMainImageIndex(prevMain => prevMain - 1);
      }
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please add at least one product image.');
      return;
    }

    const formData = new FormData();
    formData.append('manufacturer', manufacturer);
    formData.append('model', model);
    formData.append('year_of_manufacture', year);
    formData.append('capacity', capacity);
    formData.append('closed_height', closedHeight);
    formData.append('lift_height', liftHeight);
    formData.append('mast_type', mastType);
    formData.append('extras', extras);
    formData.append('hours', hours);
    formData.append('warranty', warranty);
    formData.append('price', price);

    images.forEach((file, i) => {
      formData.append(`image[${i}]`, file);
    });

    try {
      const response = await fetch('https://demodrafts.com/forkliftd/product/add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      toast.success('Product added successfully!');

      // Reset form
      setManufacturer('');
      setModel('');
      setYear('');
      setCapacity('');
      setClosedHeight('');
      setLiftHeight('');
      setMastType('');
      setExtras('');
      setHours('');
      setWarranty('');
      setPrice('');
      setImages([]);
      setMainImageIndex(0);
    } catch (error) {
      toast.error(`Failed to add product: ${error.message}`);
    }
  };

  const openPreview = () => {
    if (images.length === 0) {
      toast.error('Please add at least one product image before preview.');
      return;
    }
    setModalMainImageIndex(mainImageIndex);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="ml-[220px] container mx-auto p-6 " style={{ width: 'calc(100% - 220px)' }}>
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>

      {/* Success and error toasts handled by react-toastify */}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Images Section */}
        <div className="flex space-x-6">
          <div className="w-72 flex flex-col items-center border rounded p-3">
            <div className="w-72 h-80 border mb-3 flex items-center justify-center bg-gray-100 relative">
              {images.length > 0 ? (
                <img
                  src={URL.createObjectURL(images[mainImageIndex])}
                  alt="Main"
                  className="object-contain max-h-full max-w-full"
                />
              ) : (
                <div className="text-gray-400 text-center">No Image</div>
              )}
            </div>

            <div className="flex space-x-2 overflow-x-auto w-full mb-3">
              {images.map((file, i) => (
                <div
                  key={i}
                  className={`relative border cursor-pointer ${i === mainImageIndex ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => setMainImageIndex(i)}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`thumb-${i}`}
                    className="h-20 w-20 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={triggerAddImage}
                className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded text-3xl text-gray-500 hover:bg-gray-100"
                title="Add Image"
              >
                +
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddImages}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium mb-1">Manufacturer<span className="text-red-600">*</span></label>
              <input
                type="text"
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Model<span className="text-red-600">*</span></label>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Year of Manufacturer<span className="text-red-600">*</span></label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Capacity</label>
              <input
                type="text"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Closed Height</label>
              <input
                type="text"
                value={closedHeight}
                onChange={e => setClosedHeight(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Lift Height</label>
              <input
                type="text"
                value={liftHeight}
                onChange={e => setLiftHeight(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Mast Type</label>
              <input
                type="text"
                value={mastType}
                onChange={e => setMastType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Extras</label>
              <input
                type="text"
                value={extras}
                onChange={e => setExtras(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={e => setHours(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Warranty (months)</label>
              <input
                type="number"
                value={warranty}
                onChange={e => setWarranty(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Price</label>
              <input
                type="text"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={openPreview}
            className="bg-gray-600 hover:bg-gray-800 text-white px-6 py-2 rounded"
          >
            Preview Product
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </form>

      {/* Modal Preview */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-5xl w-full p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-gray-900"
              onClick={closeModal}
              aria-label="Close preview"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4">Product Preview</h3>

            <div className="flex flex-col md:flex-row space-x-0 md:space-x-6">
              <div className="md:w-1/2">
                <div className="border h-80 mb-3 flex items-center justify-center bg-gray-100">
                  <img
                    src={URL.createObjectURL(images[modalMainImageIndex])}
                    alt="Modal Main"
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((file, i) => (
                    <div
                      key={i}
                      className={`relative border cursor-pointer ${i === modalMainImageIndex ? 'border-blue-500' : 'border-gray-300'}`}
                      onClick={() => setModalMainImageIndex(i)}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`modal-thumb-${i}`}
                        className="h-20 w-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-1/2 mt-4 md:mt-0">
                <div className="space-y-2 text-gray-700">
                  <p><strong>Manufacturer:</strong> {manufacturer}</p>
                  <p><strong>Model:</strong> {model}</p>
                  <p><strong>Year:</strong> {year}</p>
                  <p><strong>Capacity:</strong> {capacity}</p>
                  <p><strong>Closed Height:</strong> {closedHeight}</p>
                  <p><strong>Lift Height:</strong> {liftHeight}</p>
                  <p><strong>Mast Type:</strong> {mastType}</p>
                  <p><strong>Extras:</strong> {extras}</p>
                  <p><strong>Hours:</strong> {hours}</p>
                  <p><strong>Warranty:</strong> {warranty} months</p>
                  <p><strong>Price:</strong> {price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
