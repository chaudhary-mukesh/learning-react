// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// // const API_URL = 'https://demodrafts.com/forkliftd/product/list';
// const API_URL = 'api/product/list';

// const AllProducts = () => {
//   const navigate = useNavigate();

//   // Redirect if no token in localStorage
// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //     }
// //   }, [navigate]);

//   // State for filters and data
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   const [models, setModels] = useState([]);
//   const [manufacturers, setManufacturers] = useState([]);
//   const [years, setYears] = useState([]);

//   const [currentStatus, setCurrentStatus] = useState('visible'); // visible or hidden
//   const [currentModel, setCurrentModel] = useState('');
//   const [currentManufacturer, setCurrentManufacturer] = useState('');
//   const [currentYear, setCurrentYear] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch products and populate filters
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(API_URL);
//         const json = await res.json();

//         if (json.error) {
//           setProducts([]);
//           setModels([]);
//           setManufacturers([]);
//           setYears([]);
//           return;
//         }

//         const data = json.data || [];

//         setProducts(data);

//         // Extract unique filter values
//         setModels([...new Set(data.map(p => p.model).filter(Boolean))]);
//         setManufacturers([...new Set(data.map(p => p.manufacturer).filter(Boolean))]);
//         setYears([...new Set(data.map(p => p.year_of_manufacture).filter(Boolean))].sort());
//       } catch (err) {
//         console.error('Error fetching products:', err);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter products when any filter/search/status changes
//   useEffect(() => {
//     let filtered = [...products];

//     // Filter by status
//     if (currentStatus === 'visible') {
//       filtered = filtered.filter(p => p.is_deleted === "0");
//     } else {
//       filtered = filtered.filter(p => p.is_deleted === "1");
//     }

//     if (currentModel) {
//       filtered = filtered.filter(p => p.model === currentModel);
//     }
//     if (currentManufacturer) {
//       filtered = filtered.filter(p => p.manufacturer === currentManufacturer);
//     }
//     if (currentYear) {
//       filtered = filtered.filter(p => p.year_of_manufacture === currentYear);
//     }

//     if (searchTerm.trim()) {
//       const lower = searchTerm.toLowerCase();
//       filtered = filtered.filter(p =>
//         p.model?.toLowerCase().includes(lower) ||
//         p.manufacturer?.toLowerCase().includes(lower)
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [products, currentStatus, currentModel, currentManufacturer, currentYear, searchTerm]);

//   return (
//     <div className="ml-[220px] pt-[132px] px-5">
//       {/* Tabs */}
//       <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//         <div className="btn-group flex space-x-2">
//           <button
//             onClick={() => setCurrentStatus('visible')}
//             className={`btn btn-outline-primary px-4 py-2 rounded ${
//               currentStatus === 'visible' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
//             }`}
//           >
//             Visible
//           </button>
//           <button
//             onClick={() => setCurrentStatus('hidden')}
//             className={`btn btn-outline-primary px-4 py-2 rounded ${
//               currentStatus === 'hidden' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
//             }`}
//           >
//             Hidden
//           </button>
//         </div>

//         {/* Filters + Search */}
//         <div className="flex flex-wrap gap-3 items-center">
//           <select
//             className="border border-gray-300 rounded px-3 py-2 min-w-[150px]"
//             value={currentModel}
//             onChange={e => setCurrentModel(e.target.value)}
//           >
//             <option value="">Select Model</option>
//             {models.map(model => (
//               <option key={model} value={model}>{model}</option>
//             ))}
//           </select>

//           <select
//             className="border border-gray-300 rounded px-3 py-2 min-w-[150px]"
//             value={currentManufacturer}
//             onChange={e => setCurrentManufacturer(e.target.value)}
//           >
//             <option value="">Select Manufacturer</option>
//             {manufacturers.map(manufacturer => (
//               <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
//             ))}
//           </select>

//           <select
//             className="border border-gray-300 rounded px-3 py-2 min-w-[150px]"
//             value={currentYear}
//             onChange={e => setCurrentYear(e.target.value)}
//           >
//             <option value="">Select Year</option>
//             {years.map(year => (
//               <option key={year} value={year}>{year}</option>
//             ))}
//           </select>

//           <input
//             type="text"
//             className="border border-gray-300 rounded px-3 py-2 min-w-[200px]"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Products Grid */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredProducts.length === 0 ? (
//           <p className="text-center col-span-full text-gray-500">No products found.</p>
//         ) : (
//           filteredProducts.map(product => {
//             const imageUrls = (() => {
//               try {
//                 return JSON.parse(product.image_url) || [];
//               } catch {
//                 return [];
//               }
//             })();

//             const imageUrl = imageUrls.length > 0
//               ? `https://demodrafts.com/forkliftd/${imageUrls[0]}`
//               : '/assets/images/default.jpg';

//             return (
//               <div key={product.id} className="bg-white rounded shadow-md overflow-hidden">
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={imageUrl}
//                     alt={product.model}
//                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h4 className="text-lg font-semibold mb-1">{product.manufacturer?.trim()}</h4>
//                   <p className="text-gray-600 mb-3">Model - {product.model?.trim()}</p>
//                   <a
//                     href={`product-detail.php?product_id=${product.id}`}
//                     className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                   >
//                     View Product
//                   </a>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </section>
//     </div>
//   );
// };

// export default AllProducts;







// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const API_URL = '/api/product/list';

// const AllProducts = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [manufacturers, setManufacturers] = useState([]);
//   const [years, setYears] = useState([]);
//   const [currentStatus, setCurrentStatus] = useState('visible');
//   const [currentModel, setCurrentModel] = useState('');
//   const [currentManufacturer, setCurrentManufacturer] = useState('');
//   const [currentYear, setCurrentYear] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return navigate('/login');

//     const fetchData = async () => {
//       try {
//         const res = await fetch(API_URL, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const json = await res.json();
//         const data = json.data || [];

//         setProducts(data);
//         setModels([...new Set(data.map(p => p.model).filter(Boolean))]);
//         setManufacturers([...new Set(data.map(p => p.manufacturer).filter(Boolean))]);
//         setYears([...new Set(data.map(p => p.year_of_manufacture).filter(Boolean))].sort());
//       } catch (err) {
//         console.error('Error fetching products:', err);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   useEffect(() => {
//     let filtered = [...products];
//     filtered = filtered.filter(p => p.is_deleted === (currentStatus === 'visible' ? "0" : "1"));
//     if (currentModel) filtered = filtered.filter(p => p.model === currentModel);
//     if (currentManufacturer) filtered = filtered.filter(p => p.manufacturer === currentManufacturer);
//     if (currentYear) filtered = filtered.filter(p => p.year_of_manufacture === currentYear);
//     if (searchTerm.trim()) {
//       const lower = searchTerm.toLowerCase();
//       filtered = filtered.filter(p =>
//         p.model?.toLowerCase().includes(lower) || p.manufacturer?.toLowerCase().includes(lower)
//       );
//     }
//     setFilteredProducts(filtered);
//   }, [products, currentStatus, currentModel, currentManufacturer, currentYear, searchTerm]);

//   return (
//     <div className="ml-[220px] pt-[132px] px-5">
//       <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//         <div className="btn-group flex space-x-2">
//           {['visible', 'hidden'].map(status => (
//             <button
//               key={status}
//               onClick={() => setCurrentStatus(status)}
//               className={`px-4 py-2 rounded ${
//                 currentStatus === status
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-white text-blue-600 border border-blue-600'
//               }`}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-wrap gap-3 items-center">
//           {[{ label: 'Model', state: currentModel, setter: setCurrentModel, list: models },
//             { label: 'Manufacturer', state: currentManufacturer, setter: setCurrentManufacturer, list: manufacturers },
//             { label: 'Year', state: currentYear, setter: setCurrentYear, list: years }
//           ].map(({ label, state, setter, list }) => (
//             <select
//               key={label}
//               value={state}
//               onChange={e => setter(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2 min-w-[150px]"
//             >
//               <option value="">{`Select ${label}`}</option>
//               {list.map(val => <option key={val} value={val}>{val}</option>)}
//             </select>
//           ))}
//           <input
//             type="text"
//             className="border border-gray-300 rounded px-3 py-2 min-w-[200px]"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredProducts.length === 0 ? (
//           <p className="text-center col-span-full text-gray-500">No products found.</p>
//         ) : (
//           filteredProducts.map(product => {
//             const images = (() => {
//               try { return JSON.parse(product.image_url) || []; }
//               catch { return []; }
//             })();

//             // ? `https://demodrafts.com/forkliftd/${images[0]}`
//             const imageUrl = images.length
//               ? `api/${images[0].replace(/^\/+/, "")}`
//               : '/assets/images/default.jpg';

//             return (
//               <div key={product.id} className="bg-white rounded shadow-md overflow-hidden">
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={imageUrl}
//                     alt={product.model}
//                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h4 className="text-lg font-semibold mb-1">{product.manufacturer?.trim()}</h4>
//                   <p className="text-gray-600 mb-3">Model - {product.model?.trim()}</p>
//                   <button
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                     onClick={() => navigate(`/product-detail/${product.id}`)}
//                   >
//                     View Product
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </section>
//     </div>
//   );
// };

// export default AllProducts;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const API_URL = '/api/product/list';

// const AllProducts = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);

//   // For filtering/search if needed
//   const [currentStatus, setCurrentStatus] = useState('visible'); 
//   const [models, setModels] = useState([]);
//   const [manufacturers, setManufacturers] = useState([]);
//   const [years, setYears] = useState([]);
//   const [currentModel, setCurrentModel] = useState('');
//   const [currentManufacturer, setCurrentManufacturer] = useState('');
//   const [currentYear, setCurrentYear] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return navigate('/login');

//     const fetchData = async () => {
//       try {
//         const res = await fetch(API_URL, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const json = await res.json();
//         const data = json.data || [];
//         setProducts(data);

//         // Prepare filter options
//         setModels([...new Set(data.map(p => p.model).filter(Boolean))]);
//         setManufacturers([...new Set(data.map(p => p.manufacturer).filter(Boolean))]);
//         setYears([...new Set(data.map(p => p.year_of_manufacture).filter(Boolean))].sort());
//       } catch (err) {
//         console.error('Error fetching products:', err);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   // Filtering products if needed (optional)
//   const filteredProducts = products.filter(p => {
//     if (currentStatus === 'visible' && p.is_deleted !== "0") return false;
//     if (currentStatus === 'hidden' && p.is_deleted !== "1") return false;
//     if (currentModel && p.model !== currentModel) return false;
//     if (currentManufacturer && p.manufacturer !== currentManufacturer) return false;
//     if (currentYear && p.year_of_manufacture !== currentYear) return false;
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       if (!(p.model?.toLowerCase().includes(term) || p.manufacturer?.toLowerCase().includes(term))) return false;
//     }
//     return true;
//   });

//   return (
//     <div className="ml-[220px] pt-6 px-5">
//       <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//         <div className="btn-group flex space-x-2">
//           {['visible', 'hidden'].map(status => (
//             <button
//               key={status}
//               onClick={() => setCurrentStatus(status)}
//               className={`px-4 py-2 rounded ${
//                 currentStatus === status
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-white text-blue-600 border border-blue-600'
//               }`}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-wrap gap-3 items-center">
//           {[{ label: 'Model', state: currentModel, setter: setCurrentModel, list: models },
//             { label: 'Manufacturer', state: currentManufacturer, setter: setCurrentManufacturer, list: manufacturers },
//             { label: 'Year', state: currentYear, setter: setCurrentYear, list: years }
//           ].map(({ label, state, setter, list }) => (
//             <select
//               key={label}
//               value={state}
//               onChange={e => setter(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2 min-w-[150px]"
//             >
//               <option value="">{`Select ${label}`}</option>
//               {list.map(val => <option key={val} value={val}>{val}</option>)}
//             </select>
//           ))}
//           <input
//             type="text"
//             className="border border-gray-300 rounded px-3 py-2 min-w-[200px]"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredProducts.length === 0 ? (
//           <p className="text-center col-span-full text-gray-500">No products found.</p>
//         ) : (
//           filteredProducts.map(product => {
//             const images = (() => {
//               try { return JSON.parse(product.image_url) || []; }
//               catch { return []; }
//             })();

//             const imageUrl = images.length
//               ? `api/${images[0].replace(/^\/+/, "")}`
//               : '/assets/images/default.jpg';

//             return (
//               <div key={product.id} className="bg-white rounded shadow-md overflow-hidden">
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={imageUrl}
//                     alt={product.model}
//                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h4 className="text-lg font-semibold mb-1">{product.manufacturer?.trim()}</h4>
//                   <p className="text-gray-600 mb-3">Model - {product.model?.trim()}</p>
//                   <button
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                     onClick={() => navigate(`/product-detail/${product.id}`, { state: { product } })}
//                   >
//                     View Product
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </section>
//     </div>
//   );
// };

// export default AllProducts;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://demodrafts.com/forkliftd/product/list';
// const API_URL = '/api/product/list'; // Adjusted to use relative path for proxy
const BASE_URL = "https://demodrafts.com/forkliftd/";

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Filter states (initialize with empty or default values)
  const [currentStatus, setCurrentStatus] = useState('visible');
  const [currentModel, setCurrentModel] = useState('');
  const [currentManufacturer, setCurrentManufacturer] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data lists for filters — replace with real data or dynamically generate
  const models = Array.from(new Set(products.map(p => p.model).filter(Boolean)));
  const manufacturers = Array.from(new Set(products.map(p => p.manufacturer).filter(Boolean)));
  const years = Array.from(new Set(products.map(p => p.year_of_manufacture).filter(Boolean)));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchData = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchData();
  }, [navigate]);

// Map currentStatus string to is_deleted value
const isDeletedFilter = currentStatus === 'visible' ? '0' : '1';

const filteredProducts = products.filter(product => {
  if (currentStatus && product.is_deleted !== isDeletedFilter) return false;
  if (currentModel && product.model !== currentModel) return false;
  if (currentManufacturer && product.manufacturer !== currentManufacturer) return false;
  if (currentYear && product.year_of_manufacture !== currentYear) return false;
  if (
    searchTerm &&
    !(
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
    return false;
  return true;
});


  return (
    <div className="ml-[220px] pt-6 px-5">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="btn-group flex space-x-2">
          {['visible', 'hidden'].map(status => (
            <button
              key={status}
              onClick={() => setCurrentStatus(status)}
              className={`px-4 py-2 rounded ${
                currentStatus === status
                  ? 'bg-[#ff9925] text-white'
                  : 'bg-white text-blue-600 border border-blue-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center" >
          {[{ label: 'Model', state: currentModel, setter: setCurrentModel, list: models },
            { label: 'Manufacturer', state: currentManufacturer, setter: setCurrentManufacturer, list: manufacturers },
            { label: 'Year', state: currentYear, setter: setCurrentYear, list: years }
          ].map(({ label, state, setter, list }) => (
            <select
              key={label}
              value={state}
              onChange={e => setter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 min-w-[150px]"
              style={{display: 'none'}}
            >
              <option value="">{`Select ${label}`}</option>
              {list.map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          ))}
          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2 min-w-[200px]"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map(product => {
            let images = [];
            try {
              images = JSON.parse(product.image_url) || [];
            } catch {
              images = [];
            }

            const imageUrl = images.length
              ? BASE_URL + images[0].replace(/^\/+/, "")
              : '/assets/images/default.jpg';

            return (
              <div key={product.id} className="bg-white rounded shadow-md overflow-hidden">
                <div className="h-[328px] flex align-items-center justify-center overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.model}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h4 className="text-lg font-semibold mb-1">{product.manufacturer?.trim()}</h4>
                  <p className="text-gray-600 mb-3">Model - {product.model?.trim()}</p>
                  <button
                    className="bg-[#ff9925] text-white px-7 py-2 rounded-[30px] hover:bg-blue-700 transition"
                    onClick={() => navigate(`/product-detail/${product.id}`, { state: { product } })}
                  >
                    View Product
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default AllProducts;
