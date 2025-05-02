import React, { useState, useEffect } from 'react';

const CustomerFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [formData, setFormData] = useState({
    passenger: '',
    flight: '',
    rating: '',
    comment: '',
    submission_date: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacksPerPage] = useState(10);

  // Fetch feedbacks from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/customer-feedback/');
        if (!response.ok) {
          throw new Error('Failed to fetch feedbacks');
        }
        const data = await response.json();
        setFeedbacks(data);
        setFilteredFeedbacks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Filter feedbacks based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFeedbacks(feedbacks);
    } else {
      const results = feedbacks.filter(feedback =>
        feedback.passenger_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (feedback.comment && feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredFeedbacks(results);
    }
    setCurrentPage(1);
  }, [searchTerm, feedbacks]);

  // Get current feedbacks for pagination
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddClick = () => {
    setFormData({
      passenger: '',
      flight: '',
      rating: '',
      comment: '',
      submission_date: ''
    });
    setShowAddModal(true);
  };

  const handleEditClick = (feedback) => {
    setCurrentFeedback(feedback);
    setFormData({
      passenger: feedback.passenger.passenger_id,
      flight: feedback.flight.flight_id,
      rating: feedback.rating,
      comment: feedback.comment || '',
      submission_date: feedback.submission_date.slice(0, 16) // Format for datetime-local input
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (feedback) => {
    setCurrentFeedback(feedback);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/customer-feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add feedback');
      }

      const newFeedback = await response.json();
      setFeedbacks([...feedbacks, newFeedback]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding feedback:', error);
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/customer-feedback/${currentFeedback.feedback_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback');
      }

      const updatedFeedback = await response.json();
      setFeedbacks(feedbacks.map(feedback =>
        feedback.feedback_id === updatedFeedback.feedback_id ? updatedFeedback : feedback
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating feedback:', error);
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/customer-feedback/${currentFeedback.feedback_id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      setFeedbacks(feedbacks.filter(feedback => feedback.feedback_id !== currentFeedback.feedback_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && feedbacks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Customer Feedback Management</h1>

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <span className="absolute left-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search feedback by passenger, flight, or comment..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={handleAddClick}
        >
          <span>+</span>
          <span>Add Feedback</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Passenger</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Flight</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Rating</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Comment</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Submission Date</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentFeedbacks.length > 0 ? (
              currentFeedbacks.map((feedback) => (
                <tr key={feedback.feedback_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{feedback.passenger_name}</td>
                  <td className="py-3 px-4">{feedback.flight_number}</td>
                  <td className="py-3 px-4">{feedback.rating}/5</td>
                  <td className="py-3 px-4">{feedback.comment ? feedback.comment.substring(0, 50) + (feedback.comment.length > 50 ? '...' : '') : 'N/A'}</td>
                  <td className="py-3 px-4">{new Date(feedback.submission_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(feedback)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(feedback)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No feedback found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredFeedbacks.length > feedbacksPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstFeedback + 1} to {Math.min(indexOfLastFeedback, filteredFeedbacks.length)} of {filteredFeedbacks.length} feedbacks
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(Math.pages(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">←</span>
              <span>Prev</span>
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(num => (
                  num === 1 ||
                  num === totalPages ||
                  (num >= currentPage - 1 && num <= currentPage + 1)
                ))
                .map((number, idx, array) => {
                  if (idx > 0 && array[idx - 1] !== number - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${number}`}>
                        <span className="px-3 py-1 text-gray-400">...</span>
                        <button
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {number}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Feedback Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Feedback</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Passenger ID</label>
                  <input
                    type="number"
                    name="passenger"
                    value={formData.passenger}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Flight ID</label>
                  <input
                    type="number"
                    name="flight"
                    value={formData.flight}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Submission Date</label>
                  <input
                    type="datetime-local"
                    name="submission_date"
                    value={formData.submission_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-1">Comment</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Feedback Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Feedback</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Passenger ID</label>
                  <input
                    type="number"
                    name="passenger"
                    value={formData.passenger}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Flight ID</label>
                  <input
                    type="number"
                    name="flight"
                    value={formData.flight}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Submission Date</label>
                  <input
                    type="datetime-local"
                    name="submission_date"
                    value={formData.submission_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-1">Comment</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete the feedback from{' '}
              <span className="font-semibold">{currentFeedback?.passenger_name}</span> for flight{' '}
              <span className="font-semibold">{currentFeedback?.flight_number}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerFeedbackManagement;