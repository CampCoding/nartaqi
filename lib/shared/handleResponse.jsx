export const handleRespons = (response) => {
    return {
      status: response?.status,
      data: response?.data,
      message: response?.message,
      error: response?.error,
      pagination: response?.pagination
    };
  };
  