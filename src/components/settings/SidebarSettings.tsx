import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useUser';

const SidebarSettings = () => {
  const activeClass = 'bg-gray-300 font-bold text-gray-900';
  const inactiveClass = 'hover:bg-gray-200';
  const { user } = useAuth();
  const role = user?.['custom:role'];

  return (
    <div className="w-64 bg-gray-100 text-gray-800 flex flex-col justify-between h-screen py-6 px-4 shadow-lg">
      <div>
        <h2 className="text-lg font-bold mb-6">Configuraciones</h2>
        <NavLink
          to="/settings/change-password"
          className={({ isActive }) =>
            `block py-2 px-4 mb-4 rounded text-left transition-colors ${
              isActive ? activeClass : inactiveClass
            }`
          }
        >
          Actualiza datos
        </NavLink>

        {role === 'ADMIN' && (
          <NavLink
            to="/settings/crear-usuarios"
            className={({ isActive }) =>
              `block py-2 px-4 mb-4 rounded text-left transition-colors ${
                isActive ? activeClass : inactiveClass
              }`
            }
          >
            Crear Usuarios
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default SidebarSettings;
