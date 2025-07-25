import React from "react";
import { usePermissions } from "../../hooks/usePermissions";
import UnauthorizedAccess from "../admin-settings/UnauthorizedAccess";

const RequirePermission = ({ requiredKey, children }) => {
  const { permissions, loading, error } = usePermissions();
  const userData = JSON.parse(localStorage.getItem("user"));

  const role = userData?.role?.toLowerCase();

  if (role === "admin") {
    return <>{children}</>;
  }

  if (loading) return <div>Loading permissions...</div>;
  if (error) return <div>Error loading permissions: {error}</div>;

  if (!permissions) return <UnauthorizedAccess />;

  const hasPermission = permissions?.[requiredKey] === true;

  if (!hasPermission) {
    return <UnauthorizedAccess />;
  }

  return <>{children}</>;
};

export default RequirePermission;