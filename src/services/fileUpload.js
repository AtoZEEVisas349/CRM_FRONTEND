import apiService from "./apiService";

export const uploadFile = async (file) => {
  if (!file) throw new Error("Please select a file first!");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiService.post("/client-leads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-company-id": "4477079e-c9bf-4f2e-9d9c-3523791c9058", // ⬅️ Manually added here
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "File upload failed!");
  }
};
