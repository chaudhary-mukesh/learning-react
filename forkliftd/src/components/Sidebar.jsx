import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-[220px] h-[calc(100vh-112px)] bg-[#000101de] text-white fixed mt-[112px]">
      <nav>
        <ul className="list-none p-0">
          <li>
            <NavLink
              to="/add-product"
              className={({ isActive }) =>
                `flex px-5 py-3 no-underline text-white ${isActive ? 'bg-gray-800 font-semibold' : ''}`
              }
            >
              Add New Product
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/all-products"
              className={({ isActive }) =>
                `flex px-5 py-3 no-underline text-white ${isActive ? 'bg-gray-800 font-semibold' : ''}`
              }
            >
              All Products
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
