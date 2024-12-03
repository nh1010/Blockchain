// Function to extract error message from the error object
export const parseErrorMessage = (error) => {
  try {
    // Parse the error message from the error object
    const parsedError = JSON.parse(error.message);
    if (parsedError?.data?.message) {
      return parsedError.data.message;
    }
    return parsedError.message || "An unknown error occurred.";
  } catch {
    return error.message || "An unknown error occurred.";
  }
};