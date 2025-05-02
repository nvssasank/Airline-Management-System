import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const FrequentFlyerManagement = () => {
  const [frequentFlyers, setFrequentFlyers] = useState([]);
  const [filteredFrequentFlyers, setFilteredFrequentFlyers] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFrequentFlyer, setCurrentFrequentFlyer] = useState(null);
  const [formData, setFormData] = useState({
    passenger: '',
    airline: '',
    membership_number: '',
    tier_status: '',
    join_date: '',
    tier_expiry: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [flyersPerPage] = useState(10);
  
  // Fetch frequent flyers, passengers, and airlines from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch frequent flyers
        const ffResponse = await fetch('http://localhost:8000/api/frequent-flyers/');
        if (!ffResponse.ok) {
          throw new Error('Failed to fetch frequent flyers');
        }
        const ffData = await ffResponse.json();
        setFrequentFlyers(ffData);
        setFilteredFrequentFlyers(ffData);
        
        // Fetch passengers
        const passengerResponse = await fetch('http://localhost:8000/api/passengers/');
        if (!passengerResponse.ok) {
          throw new Error('Failed to fetch passengers');
        }
        const passengerData = await passengerResponse.json();
        setPassengers(passengerData);
        
        // Fetch airlines
        const airlineResponse = await fetch('http://localhost:8000/api/airlines/');
        if (!airlineResponse.ok) {
          throw new Error('Failed to fetch airlines');
        }
        const airlineData = await airlineResponse.json();
        setAirlines(airlineData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter frequent flyers based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFrequentFlyers(frequentFlyers);
    } else {
      const results = frequentFlyers.filter(flyer => 
        flyer.membership_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flyer.tier_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flyer.passenger.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flyer.passenger.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flyer.airline.airline_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFrequentFlyers(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, frequentFlyers]);
  
  // Get current frequent flyers for pagination
  const indexOfLastFlyer = currentPage * flyersPerPage;
  const indexOfFirstFlyer = indexOfLastFlyer - flyersPerPage;
  const currentFlyers = filteredFrequentFlyers.slice(indexOfFirstFlyer, indexOfLastFlyer);
  const totalPages = Math.ceil(filteredFrequentFlyers.length / flyersPerPage);
  
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
      airline: '',
      membership_number: '',
      tier_status: '',
      join_date: '',
      tier_expiry: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (flyer) => {
    setCurrentFrequentFlyer(flyer);
    setFormData({
      passenger: flyer.passenger.passenger_id,
      airline: flyer.airline.airline_id,
      membership_number: flyer.membership_number,
      tier_status: flyer.tier_status,
      join_date: flyer.join_date,
      tier_expiry: flyer.tier_expiry || ''
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (flyer) => {
    setCurrentFrequentFlyer(flyer);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/frequent-flyers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          passenger: parseInt(formData.passenger),
          airline: parseInt(formData.airline)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add frequent flyer');
      }
      
      const newFlyer = await response.json();
      setFrequentFlyers([...frequentFlyers, newFlyer]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding frequent flyer:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/frequent-flyers/${currentFrequentFlyer.ff_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          passenger: parseInt(formData.passenger),
          airline: parseInt(formData.airline)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update frequent flyer');
      }
      
      const updatedFlyer = await response.json();
      setFrequentFlyers(frequentFlyers.map(flyer => 
        flyer.ff_id === updatedFlyer.ff_id ? updatedFlyer : flyer
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating frequent flyer:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/frequent-flyers/${currentFrequentFlyer.ff_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete frequent flyer');
      }
      
      setFrequentFlyers(frequentFlyers.filter(flyer => flyer.ff_id !== currentFrequentFlyer.ff_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting frequent flyer:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading && frequentFlyers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Frequent Flyer Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by passenger name, airline, membership number, or tier..."
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
          <span>Add Frequent Flyer</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Passenger</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Airline</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Membership Number</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Tier Status</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Join Date</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentFlyers.length > 0 ? (
              currentFlyers.map((flyer) => (
                <tr key={flyer.ff_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{flyer.passenger.first_name} {flyer.passenger.last_name}</td>
                  <td className="py-3 px-4">{flyer.airline.airline_name}</td>
                  <td className="py-3 px-4">{flyer.membership_number}</td>
                  <td className="py-3 px-4">{flyer.tier_status}</td>
                  <td className="py-3 px-4">{flyer.join_date}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(flyer)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(flyer)}
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
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No frequent flyers found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredFrequentFlyers.length > flyersPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstFlyer + 1} to {Math.min(indexOfLastFlyer, filteredFrequentFlyers.length)} of {filteredFrequentFlyers.length} frequent flyers
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
      
      {/* Add Frequent Flyer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Frequent Flyer</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Passenger</label>
                  <select
                    name="passenger"
                    value={formData.passenger}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Passenger</option>
                    {passengers.map(passenger => (
                      <option key={passenger.passenger_id} value={passenger.passenger_id}>
                        {passenger.first_name} {passenger.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Airline</label>
                  <select
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Airline</option>
                    {airlines.map(airline => (
                      <option key={airline.airline_id} value={airline.airline_id}>
                        {airline.airline_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Membership Number</label>
                  <input
                    type="text"
                    name="membership_number"
                    value={formData.membership_number}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Tier Status</label>
                  <input
                    type="text"
                    name="tier_status"
                    value={formData.tier_status}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    name="join_date"
                    value={formData.join_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Tier Expiry</label>
                  <input
                    type="date"
                    name="tier_expiry"
                    value={formData.tier_expiry}
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
                  Add Frequent Flyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Frequent Flyer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Frequent Flyer</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Passenger</label>
                  <select
                    name="passenger"
                    value={formData.passenger}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Passenger</option>
                    {passengers.map(passenger => (
                      <option key={passenger.passenger_id} value={passenger.passenger_id}>
                        {passenger.first_name} {passenger.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Airline</label>
                  <select
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Airline</option>
                    {airlines.map(airline => (
                      <option key={airline.airline_id} value={airline.airline_id}>
                        {airline.airline_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Membership Number</label>
                  <input
                    type="text"
                    name="membership_number"
                    value={formData.membership_number}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Tier Status</label>
                  <input
                    type="text"
                    name="tier_status"
                    value={formData.tier_status}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    name="join_date"
                    value={formData.join_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Tier Expiry</label>
                  <input
                    type="date"
                    name="tier_expiry"
                    value={formData.tier_expiry}
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
              Are you sure you want to delete the frequent flyer account for <span className="font-semibold">{currentFrequentFlyer?.passenger.first_name} {currentFrequentFlyer?.passenger.last_name}</span> with {currentFrequentFlyer?.airline.airline_name}? This action cannot be undone.
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

export default FrequentFlyerManagement;