import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const FlightCrewManagement = () => {
  const [crewMembers, setCrewMembers] = useState([]);
  const [filteredCrewMembers, setFilteredCrewMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCrewMember, setCurrentCrewMember] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    airline: '',
    staff_id: '',
    position: '',
    hire_date: '',
    certification: '',
    duty_hours: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [crewPerPage] = useState(10);

  // Fetch crew members from API
  useEffect(() => {
    const fetchCrewMembers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/crew-members/');
        if (!response.ok) {
          throw new Error('Failed to fetch crew members');
        }
        const data = await response.json();
        setCrewMembers(data);
        setFilteredCrewMembers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crew members:', error);
        setLoading(false);
      }
    };

    fetchCrewMembers();
  }, []);

  // Filter crew members based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCrewMembers(crewMembers);
    } else {
      const results = crewMembers.filter(crew =>
        crew.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crew.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crew.staff_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crew.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCrewMembers(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, crewMembers]);

  // Get current crew members for pagination
  const indexOfLastCrew = currentPage * crewPerPage;
  const indexOfFirstCrew = indexOfLastCrew - crewPerPage;
  const currentCrewMembers = filteredCrewMembers.slice(indexOfFirstCrew, indexOfLastCrew);
  const totalPages = Math.ceil(filteredCrewMembers.length / crewPerPage);

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
      first_name: '',
      last_name: '',
      airline: '',
      staff_id: '',
      position: '',
      hire_date: '',
      certification: '',
      duty_hours: ''
    });
    setShowAddModal(true);
  };

  const handleEditClick = (crew) => {
    setCurrentCrewMember(crew);
    setFormData({
      first_name: crew.first_name,
      last_name: crew.last_name,
      airline: crew.airline,
      staff_id: crew.staff_id,
      position: crew.position,
      hire_date: crew.hire_date,
      certification: crew.certification || '',
      duty_hours: crew.duty_hours || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (crew) => {
    setCurrentCrewMember(crew);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/crew-members/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add crew member');
      }

      const newCrewMember = await response.json();
      setCrewMembers([...crewMembers, newCrewMember]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding crew member:', error);
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/crew-members/${currentCrewMember.crew_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update crew member');
      }

      const updatedCrewMember = await response.json();
      setCrewMembers(crewMembers.map(crew =>
        crew.crew_id === updatedCrewMember.crew_id ? updatedCrewMember : crew
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating crew member:', error);
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/crew-members/${currentCrewMember.crew_id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete crew member');
      }

      setCrewMembers(crewMembers.filter(crew => crew.crew_id !== currentCrewMember.crew_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting crew member:', error);
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && crewMembers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Flight Crew Management</h1>

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search crew by name, staff ID, or position..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={handleAddClick}
        >
          <PlusCircle size={20} />
          <span>Add Crew Member</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Staff ID</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Name</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Position</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Airline</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Hire Date</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Duty Hours</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCrewMembers.length > 0 ? (
              currentCrewMembers.map((crew) => (
                <tr key={crew.crew_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{crew.staff_id}</td>
                  <td className="py-3 px-4">{crew.first_name} {crew.last_name}</td>
                  <td className="py-3 px-4">{crew.position}</td>
                  <td className="py-3 px-4">{crew.airline?.airline_name || 'N/A'}</td>
                  <td className="py-3 px-4">{crew.hire_date}</td>
                  <td className="py-3 px-4">{crew.duty_hours || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(crew)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(crew)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No crew members found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCrewMembers.length > crewPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstCrew + 1} to {Math.min(indexOfLastCrew, filteredCrewMembers.length)} of {filteredCrewMembers.length} crew members
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Prev</span>
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(num => (
                  num === 1 || 
                  num === totalPages || 
                  (num >= currentPage - 1 && num <= currentPage + 1)
                ))
                .map((number, idx, array) => {
                  // Add ellipsis
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
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Crew Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Crew Member</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Airline ID</label>
                  <input
                    type="number"
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Staff ID</label>
                  <input
                    type="text"
                    name="staff_id"
                    value={formData.staff_id}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Hire Date</label>
                  <input
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Certification</label>
                  <input
                    type="text"
                    name="certification"
                    value={formData.certification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Duty Hours</label>
                  <input
                    type="number"
                    name="duty_hours"
                    value={formData.duty_hours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  Add Crew Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Crew Member Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Crew Member</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Airline ID</label>
                  <input
                    type="number"
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Staff ID</label>
                  <input
                    type="text"
                    name="staff_id"
                    value={formData.staff_id}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Hire Date</label>
                  <input
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Certification</label>
                  <input
                    type="text"
                    name="certification"
                    value={formData.certification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Duty Hours</label>
                  <input
                    type="number"
                    name="duty_hours"
                    value={formData.duty_hours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
              Are you sure you want to delete the crew member <span className="font-semibold">{currentCrewMember?.first_name} {currentCrewMember?.last_name}</span> ({currentCrewMember?.staff_id})? This action cannot be undone.
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

export default FlightCrewManagement;