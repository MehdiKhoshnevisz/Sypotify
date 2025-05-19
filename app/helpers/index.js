const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

module.exports = { getAuthHeaders };
