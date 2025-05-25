import apiService from "./apiService";

export const uploadFile = async (file) => {
  if (!file) throw new Error("Please select a file first!");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiService.post("/client-leads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-company-id": "0aa80c0b-0999-4d79-8980-e945b4ea700d", // ⬅️ Manually added here
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "File upload failed!");
  }
};
