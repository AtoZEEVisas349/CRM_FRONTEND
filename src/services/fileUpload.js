import apiService from "./apiService";

export const uploadFile = async (file) => {
  if (!file) throw new Error("Please select a file first!");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiService.post("/client-leads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-company-id": "ac907b89-6a1e-4438-8032-b8ae8c45382a", // ⬅️ Manually added here
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "File upload failed!");
  }
};
