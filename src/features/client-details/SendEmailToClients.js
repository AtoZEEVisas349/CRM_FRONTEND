import React, { useEffect, useState } from "react";
import { useExecutiveActivity } from "../../context/ExecutiveActivityContext";
import { useApi } from "../../context/ApiContext";
import { getEmailTemplates } from "../../static/emailTemplates";

export const SendEmailToClients = ({ clientInfo, onTemplateSelect }) => {
  const { executiveInfo } = useApi();
  const { handleSendEmail } = useExecutiveActivity();
  const { fetchAllTemplates, fetchTemplateById, templateLoading } = useApi();

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [emailTemplates, setEmailTemplates] = useState([]);
  const user=localStorage.getItem("user")
  useEffect(() => {
    // Fetch templates from the static file since fetchAllTemplates might be an API call
    const templates = getEmailTemplates(clientInfo, executiveInfo);
    setEmailTemplates(templates);
  }, [clientInfo, executiveInfo]);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
    if (templateId) {
      const selectedTemplate = emailTemplates.find((t) => t.id === templateId);
      if (selectedTemplate) {
        onTemplateSelect(selectedTemplate, clientInfo.email);
      }
    } else {
      onTemplateSelect(null, clientInfo.email);
    }
  };

  if (!clientInfo?.email) {
    return <p>Client info not available</p>;
  }

  return (
    <div>
      <h4 style={{ marginBottom: "0.5rem" }}>Send Email to Client</h4>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>
            From:
            <input
              type="email"
              value={executiveInfo.email}
              readOnly
              style={{
                marginLeft: "0.5rem",
                padding: "8px",
                borderRadius: "5px",
              }}
            />
          </label>
        </div>

        <div>
          <label>
            To:
            <input
              type="email"
              value={clientInfo.email}
              readOnly
              style={{
                marginLeft: "0.5rem",
                padding: "8px",
                borderRadius: "5px",
              }}
            />
          </label>
        </div>

        <div>
          <label>
            Template:
            <select
              value={selectedTemplateId}
              onChange={handleTemplateChange}
              required
              style={{ marginLeft: "0.5rem" }}
              disabled={templateLoading}
            >
              <option value="">Select</option>
              {emailTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SendEmailToClients;