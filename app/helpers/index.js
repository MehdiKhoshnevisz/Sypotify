const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export { getAuthHeaders };
