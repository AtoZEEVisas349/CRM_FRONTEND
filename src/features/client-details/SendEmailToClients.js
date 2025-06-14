import React, { useEffect, useState } from "react";
import { useExecutiveActivity } from "../../context/ExecutiveActivityContext";
import { useApi } from "../../context/ApiContext";

export const SendEmailToClients = ({ clientInfo }) => {
  const { executiveInfo } = useApi();
  const { handleSendEmail } = useExecutiveActivity();
  const {
    emailTemplates,
    fetchAllTemplates,
    fetchTemplateById,
    templateLoading,
  } = useApi(); // ✅ Destructure values from context

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // ✅ Fetch templates on mount
  useEffect(() => {
    fetchAllTemplates();
  }, [fetchAllTemplates]);

  const handleTemplateChange = (e) => {
    setSelectedTemplateId(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSendingEmail(true);

    if (!selectedTemplateId) {
      alert("Please select a template.");
      setSendingEmail(false);
      return;
    }

    try {
      const selectedTemplate = await fetchTemplateById(selectedTemplateId);

      const emailPayload = {
        templateId: selectedTemplate.id,
        executiveName: executiveInfo.username,
        executiveEmail: executiveInfo.email,
        clientEmail: clientInfo.email,
        emailBody: selectedTemplate.body,
        emailSubject: selectedTemplate.subject,
      };

      await handleSendEmail(emailPayload);
      alert("Email sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    } finally {
      setSendingEmail(false);
    }
  };

  if (!clientInfo?.email) {
    return <p>Client info not available</p>;
  }

  return (
    <div>
      <h4 style={{ marginBottom: "0.5rem" }}>Send Email to Client</h4>

      <form
        onSubmit={handleEmailSubmit}
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

        <button type="submit" className="sendEmail-btn" disabled={sendingEmail}>
          {sendingEmail ? "Sending..." : "Send Email"}
        </button>
      </form>
    </div>
  );
};

export default SendEmailToClients;
