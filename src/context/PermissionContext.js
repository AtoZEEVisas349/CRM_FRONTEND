import React, { createContext, useContext, useEffect, useState } from "react";
import { permissionService } from "../services/permissionService";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id || !user?.role) throw new Error("User info missing");

      const role = user.role.toLowerCase();
      if (role === "admin") { 
        setPermissions("FULL_ACCESS");
        setLoading(false);
        return;
      }

      const res = await permissionService.fetchPermissionsForUser(user.id, user.role);
      setPermissions(res);
    } catch (err) {
      setError(err.message || "Failed to fetch permissions");
      console.error("Permissions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <PermissionContext.Provider
      value={{
        // State
        permissions,
        loading,
        error,
        // Utility
        fetchPermissions,
        // Expose all permission services
        fetchUsers: permissionService.fetchUsers,
        createPermission: permissionService.createPermission,
        fetchAllRolePermissions: permissionService.fetchAllRolePermissions,
        fetchSinglePermission: permissionService.fetchSinglePermission,
        togglePermission: permissionService.togglePermission,
        fetchPermissionsForUser: permissionService.fetchPermissionsForUser,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => useContext(PermissionContext);
