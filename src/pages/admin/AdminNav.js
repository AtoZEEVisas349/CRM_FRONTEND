import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMessage,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";


function AdminNav() {
  return (
    <div className="admin-logo">
            <FontAwesomeIcon className="admin-logo_name" icon={faPhone} />
            <FontAwesomeIcon className="admin-logo_name" icon={faMessage} />
            <FontAwesomeIcon className="admin-logo_name" icon={faBell} />
            <FontAwesomeIcon className="admin-logo_name" icon={faUser} />
      </div>
  )
}

export default AdminNav