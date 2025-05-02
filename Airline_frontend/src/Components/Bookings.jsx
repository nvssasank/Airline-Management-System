// import React, { useState, useEffect } from 'react';
// import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// const BookingManagement = () => {
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [passengers, setPassengers] = useState([]);
//   const [travelAgents, setTravelAgents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentBooking, setCurrentBooking] = useState(null);
//   const [formData, setFormData] = useState({
//     booking_reference: '',
//     passenger: '',
//     booking_date: '',
//     booking_status: '',
//     booking_source: '',
//     total_amount: '',
//     currency: '',
//     travel_agent: ''
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bookingsPerPage] = useState(10);

//   // Fetch bookings, passengers, and travel agents from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch bookings
//         const bookingResponse = await fetch('http://localhost:8000/api/bookings/');
//         if (!bookingResponse.ok) {
//           throw new Error('Failed to fetch bookings');
//         }
//         const bookingData = await bookingResponse.json();
//         setBookings(bookingData);
//         setFilteredBookings(bookingData);

//         // Fetch passengers
//         const passengerResponse = await fetch('http://localhost:8000/api/passengers/');
//         if (!passengerResponse.ok) {
//           throw new Error('Failed to fetch passengers');
//         }
//         const passengerData = await passengerResponse.json();
//         setPassengers(passengerData);

//         // Fetch travel agents
//         const agentResponse = await fetch('http://localhost:8000/api/travel-agents/');
//         if (!agentResponse.ok) {
//           throw new Error('Failed to fetch travel agents');
//         }
//         const agentData = await agentResponse.json();
//         setTravelAgents(agentData);

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter bookings based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredBookings(bookings);
//     } else {
//       const results = bookings.filter(booking =>
//         booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         booking.passenger.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         booking.passenger.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         booking.booking_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         booking.booking_source.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredBookings(results);
//     }
//     // Reset to first page when search changes
//     setCurrentPage(1);
//   }, [searchTerm, bookings]);

//   // Get current bookings for pagination
//   const indexOfLastBooking = currentPage * bookingsPerPage;
//   const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
//   const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
//   const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleAddClick = () => {
//     setFormData({
//       booking_reference: '',
//       passenger: '',
//       booking_date: '',
//       booking_status: '',
//       booking_source: '',
//       total_amount: '',
//       currency: '',
//       travel_agent: ''
//     });
//     setShowAddModal(true);
//   };

//   const handleEditClick = (booking) => {
//     setCurrentBooking(booking);
//     setFormData({
//       booking_reference: booking.booking_reference,
//       passenger: booking.passenger.passenger_id,
//       booking_date: booking.booking_date.split('T')[0], // Format for date input
//       booking_status: booking.booking_status,
//       booking_source: booking.booking_source,
//       total_amount: booking.total_amount,
//       currency: booking.currency,
//       travel_agent: booking.travel_agent ? booking.travel_agent.agent_id : ''
//     });
//     setShowEditModal(true);
//   };

//   const handleDeleteClick = (booking) => {
//     setCurrentBooking(booking);
//     setShowDeleteModal(true);
//   };

//   const handleSubmitAdd = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:8000/api/bookings/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           passenger: parseInt(formData.passenger),
//           travel_agent: formData.travel_agent ? parseInt(formData.travel_agent) : null
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add booking');
//       }

//       const newBooking = await response.json();
//       setBookings([...bookings, newBooking]);
//       setShowAddModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error adding booking:', error);
//       setLoading(false);
//     }
//   };

//   const handleSubmitEdit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`http://localhost:8000/api/bookings/${currentBooking.booking_id}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           passenger: parseInt(formData.passenger),
//           travel_agent: formData.travel_agent ? parseInt(formData.travel_agent) : null
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update booking');
//       }

//       const updatedBooking = await response.json();
//       setBookings(bookings.map(booking =>
//         booking.booking_id === updatedBooking.booking_id ? updatedBooking : booking
//       ));
//       setShowEditModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error updating booking:', error);
//       setLoading(false);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(`http://localhost:8000/api/bookings/${currentBooking.booking_id}/`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete booking');
//       }

//       setBookings(bookings.filter(booking => booking.booking_id !== currentBooking.booking_id));
//       setShowDeleteModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error deleting booking:', error);
//       setLoading(false);
//     }
//   };

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading && bookings.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

//       {/* Search and Add Button */}
//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <div className="relative flex items-center w-full md:w-2/3">
//           <Search className="absolute left-3 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search by reference, passenger name, status, or source..."
//             className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
//           onClick={handleAddClick}
//         >
//           <PlusCircle size={20} />
//           <span>Add Booking</span>
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto shadow-md rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Reference</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Passenger</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Booking Date</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Source</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Amount</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Travel Agent</th>
//               <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {currentBookings.length > 0 ? (
//               currentBookings.map((booking) => (
//                 <tr key={booking.booking_id} className="hover:bg-gray-50">
//                   <td className="py-3 px-4 font-medium">{booking.booking_reference}</td>
//                   <td className="py-3 px-4">{booking.passenger.first_name} {booking.passenger.last_name}</td>
//                   <td className="py-3 px-4">{booking.booking_date.split('T')[0]}</td>
//                   <td className="py-3 px-4">{booking.booking_status}</td>
//                   <td className="py-3 px-4">{booking.booking_source}</td>
//                   <td className="py-3 px-4">{booking.total_amount} {booking.currency}</td>
//                   <td className="py-3 px-4">{booking.travel_agent ? booking.travel_agent.agency_name : '-'}</td>
//                   <td className="py-3 px-4">
//                     <div className="flex justify-center gap-3">
//                       <button
//                         onClick={() => handleEditClick(booking)}
//                         className="text-blue-600 hover:text-blue-800"
//                         title="Edit"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(booking)}
//                         className="text-red-600 hover:text-red-800"
//                         title="Delete"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="py-8 text-center text-gray-500">
//                   No bookings found matching your search criteria
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {filteredBookings.length > bookingsPerPage && (
//         <div className="flex justify-between items-center mt-6">
//           <div className="text-sm text-gray-600">
//             Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} bookings
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => paginate(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//               className={`flex items-center px-3 py-1 rounded border ${
//                 currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <ChevronLeft size={16} />
//               <span className="ml-1">Prev</span>
//             </button>

//             <div className="flex gap-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter(num => (
//                   num === 1 ||
//                   num === totalPages ||
//                   (num >= currentPage - 1 && num <= currentPage + 1)
//                 ))
//                 .map((number, idx, array) => {
//                   if (idx > 0 && array[idx - 1] !== number - 1) {
//                     return (
//                       <React.Fragment key={`ellipsis-${number}`}>
//                         <span className="px-3 py-1 text-gray-400">...</span>
//                         <button
//                           onClick={() => paginate(number)}
//                           className={`px-3 py-1 rounded border ${
//                             currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
//                           }`}
//                         >
//                           {number}
//                         </button>
//                       </React.Fragment>
//                     );
//                   }
//                   return (
//                     <button
//                       key={number}
//                       onClick={() => paginate(number)}
//                       className={`px-3 py-1 rounded border ${
//                         currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       {number}
//                     </button>
//                   );
//                 })}
//             </div>

//             <button
//               onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//               className={`flex items-center px-3 py-1 rounded border ${
//                 currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <span className="mr-1">Next</span>
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Booking Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Add New Booking</h2>
//             <form onSubmit={handleSubmitAdd}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking Reference</label>
//                   <input
//                     type="text"
//                     name="booking_reference"
//                     value={formData.booking_reference}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={20}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Passenger</label>
//                   <select
//                     name="passenger"
//                     value={formData.passenger}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Passenger</option>
//                     {passengers.map(passenger => (
//                       <option key={passenger.passenger_id} value={passenger.passenger_id}>
//                         {passenger.first_name} {passenger.last_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking Date</label>
//                   <input
//                     type="date"
//                     name="booking_date"
//                     value={formData.booking_date}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking Status</label>
//                   <input
//                     type="text"
//                     name="booking_status"
//                     value={formData.booking_status}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={20}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking Source</label>
//                   <input
//                     type="text"
//                     name="booking_source"
//                     value={formData.booking_source}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={50}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Total Amount</label>
//                   <input
//                     type="number"
//                     name="total_amount"
//                     value={formData.total_amount}
//                     onChange={handleInputChange}
//                     required
//                     step="0.01"
//                     min="0"
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Currency</label>
//                   <input
//                     type="text"
//                     name="currency"
//                     value={formData.currency}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={3}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Travel Agent</label>
//                   <select
//                     name="travel_agent"
//                     value={formData.travel_agent}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">No Travel Agent</option>
//                     {travelAgents.map(agent => (
//                       <option key={agent.agent_id} value={agent.agent_id}>
//                         {agent.agency_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Add Booking
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Booking Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
//             <form onSubmit={handleSubmitEdit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking Reference</label>
//                   <input
//                     type="text"
//                     name="booking_reference"
//                     value={formData.booking_reference}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={20}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Passenger</label>
//                   <select
//                     name="passenger"
//                     value={formData.passenger}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Passenger</option>
//                     {passengers.map(passenger => (
//                       <option key={passenger.passenger_id} value={passenger.passenger_id}>
//                         {passenger.first_name} {passenger.last_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking Date</label>
//                   <input
//                     type="date"
//                     name="booking_date"
//                     value={formData.booking_date}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking Status</label>
//                   <input
//                     type="text"
//                     name="booking_status"
//                     value={formData.booking_status}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={20}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking Source</label>
//                   <input
//                     type="text"
//                     name="booking_source"
//                     value={formData.booking_source}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={50}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Total Amount</label>
//                   <input
//                     type="number"
//                     name="total_amount"
//                     value={formData.total_amount}
//                     onChange={handleInputChange}
//                     required
//                     step="0.01"
//                     min="0"
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Currency</label>
//                   <input
//                     type="text"
//                     name="currency"
//                     value={formData.currency}
//                     onChange={handleInputChange}
//                     required
//                     maxLength={3}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Travel Agent</label>
//                   <select
//                     name="travel_agent"
//                     value={formData.travel_agent}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">No Travel Agent</option>
//                     {travelAgents.map(agent => (
//                       <option key={agent.agent_id} value={agent.agent_id}>
//                         {agent.agency_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
//             <p className="mb-6">
//               Are you sure you want to delete the booking <span className="font-semibold">{currentBooking?.booking_reference}</span> for {currentBooking?.passenger.first_name} {currentBooking?.passenger.last_name}? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingManagement;
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [travelAgents, setTravelAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [formData, setFormData] = useState({
    booking_reference: '',
    passenger: '',
    booking_date: '',
    booking_status: '',
    booking_source: '',
    total_amount: '',
    currency: '',
    travel_agent: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);

  // Utility function to convert YYYY-MM-DD to ISO 8601 datetime
  const toISODateTime = (dateString) => {
    if (!dateString) return null;
    return `${dateString}T00:00:00Z`; // Append time and UTC timezone
  };

  // Fetch bookings, passengers, and travel agents from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [bookingResponse, passengerResponse, agentResponse] = await Promise.all([
          fetch('http://localhost:8000/api/bookings/'),
          fetch('http://localhost:8000/api/passengers/'),
          fetch('http://localhost:8000/api/travel-agents/')
        ]);

        if (!bookingResponse.ok || !passengerResponse.ok || !agentResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const bookingData = await bookingResponse.json();
        const passengerData = await passengerResponse.json();
        const agentData = await agentResponse.json();

        console.log('Bookings Data:', JSON.stringify(bookingData, null, 2));
        console.log('Passengers Data:', JSON.stringify(passengerData, null, 2));
        console.log('Travel Agents Data:', JSON.stringify(agentData, null, 2));

        if (!passengerData.length) {
          console.warn('No passengers found in the database.');
        }
        if (!agentData.length) {
          console.warn('No travel agents found in the database.');
        }

        setBookings(bookingData);
        setFilteredBookings(bookingData);
        setPassengers(passengerData);
        setTravelAgents(agentData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter bookings based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const results = bookings.filter(booking =>
        (booking.booking_reference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.passenger?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.passenger?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.booking_status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.booking_source || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(results);
    }
    setCurrentPage(1);
  }, [searchTerm, bookings]);

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

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
    if (passengers.length === 0) {
      alert('No passengers available. Please add a passenger first.');
      return;
    }
    setFormData({
      booking_reference: '',
      passenger: passengers[0].passenger_id,
      booking_date: new Date().toISOString().split('T')[0],
      booking_status: 'Confirmed',
      booking_source: 'Online',
      total_amount: '0.00',
      currency: 'USD',
      travel_agent: ''
    });
    setShowAddModal(true);
  };

  const handleEditClick = (booking) => {
    setCurrentBooking(booking);
    setFormData({
      booking_reference: booking.booking_reference || '',
      passenger: booking.passenger?.passenger_id || booking.passenger_id || '',
      booking_date: booking.booking_date ? booking.booking_date.split('T')[0] : '',
      booking_status: booking.booking_status || '',
      booking_source: booking.booking_source || '',
      total_amount: booking.total_amount ? booking.total_amount.toString() : '',
      currency: booking.currency || '',
      travel_agent: booking.travel_agent?.agent_id || booking.agent_id || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (booking) => {
    setCurrentBooking(booking);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const passengerId = parseInt(formData.passenger);
    const agentId = formData.travel_agent ? parseInt(formData.travel_agent) : null;

    if (!formData.booking_reference || isNaN(passengerId) || !formData.booking_date ||
        !formData.booking_status || !formData.booking_source || !formData.total_amount ||
        !formData.currency) {
      alert('Please fill in all required fields with valid values.');
      setLoading(false);
      return;
    }

    const payload = {
      booking_reference: formData.booking_reference,
      passenger_id: passengerId,
      booking_date: toISODateTime(formData.booking_date),
      booking_status: formData.booking_status,
      booking_source: formData.booking_source,
      total_amount: parseFloat(formData.total_amount),
      currency: formData.currency,
      agent_id: agentId
    };

    console.log('Add Booking Payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('http://localhost:8000/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', JSON.stringify(errorData, null, 2));
        throw new Error(JSON.stringify(errorData, null, 2));
      }

      const newBooking = await response.json();
      setBookings([...bookings, newBooking]);
      setFilteredBookings([...bookings, newBooking]);
      setShowAddModal(false);
      setLoading(false);
      alert('Booking added successfully!');
    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Failed to add booking: ' + error.message);
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const passengerId = parseInt(formData.passenger);
    const agentId = formData.travel_agent ? parseInt(formData.travel_agent) : null;

    if (!formData.booking_reference || isNaN(passengerId) || !formData.booking_date ||
        !formData.booking_status || !formData.booking_source || !formData.total_amount ||
        !formData.currency) {
      alert('Please fill in all required fields with valid values.');
      setLoading(false);
      return;
    }

    const payload = {
      booking_reference: formData.booking_reference,
      passenger_id: passengerId,
      booking_date: toISODateTime(formData.booking_date),
      booking_status: formData.booking_status,
      booking_source: formData.booking_source,
      total_amount: parseFloat(formData.total_amount),
      currency: formData.currency,
      agent_id: agentId
    };

    console.log('Edit Booking Payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${currentBooking.booking_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', JSON.stringify(errorData, null, 2));
        throw new Error(JSON.stringify(errorData, null, 2));
      }

      const updatedBooking = await response.json();
      setBookings(bookings.map(booking =>
        booking.booking_id === updatedBooking.booking_id ? updatedBooking : booking
      ));
      setFilteredBookings(bookings.map(booking =>
        booking.booking_id === updatedBooking.booking_id ? updatedBooking : booking
      ));
      setShowEditModal(false);
      setLoading(false);
      alert('Booking updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking: ' + error.message);
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${currentBooking.booking_id}/`, {
        method: 'DELETE',
        headers: {},
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', JSON.stringify(errorData, null, 2));
        throw new Error(JSON.stringify(errorData, null, 2));
      }

      setBookings(bookings.filter(booking => booking.booking_id !== currentBooking.booking_id));
      setFilteredBookings(filteredBookings.filter(booking => booking.booking_id !== currentBooking.booking_id));
      setShowDeleteModal(false);
      setLoading(false);
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking: ' + error.message);
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by reference, passenger name, status, or source..."
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
          <span>Add Booking</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Reference</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Passenger</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Booking Date</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Source</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Amount</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Travel Agent</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentBookings.length > 0 ? (
              currentBookings.map((booking) => {
                console.log('Booking:', JSON.stringify(booking, null, 2));
                return (
                  <tr key={booking.booking_id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{booking.booking_reference || 'N/A'}</td>
                    <td className="py-3 px-4">
                      {booking.passenger ? `${booking.passenger.first_name || 'N/A'} ${booking.passenger.last_name || ''}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4">{booking.booking_date ? booking.booking_date.split('T')[0] : 'N/A'}</td>
                    <td className="py-3 px-4">{booking.booking_status || 'N/A'}</td>
                    <td className="py-3 px-4">{booking.booking_source || 'N/A'}</td>
                    <td className="py-3 px-4">{booking.total_amount ? `${booking.total_amount} ${booking.currency}` : 'N/A'}</td>
                    <td className="py-3 px-4">
                      {booking.travel_agent ? booking.travel_agent.agency_name || '-' : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(booking)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(booking)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
                  No bookings found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredBookings.length > bookingsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} bookings
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

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Booking</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Booking Reference</label>
                  <input
                    type="text"
                    name="booking_reference"
                    value={formData.booking_reference}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  <label className="block text-gray-700 mb-1">Booking Date</label>
                  <input
                    type="date"
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Booking Status</label>
                  <select
                    name="booking_status"
                    value={formData.booking_status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Booking Source</label>
                  <input
                    type="text"
                    name="booking_source"
                    value={formData.booking_source}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    maxLength={3}
                    pattern="[A-Z]{3}"
                    title="Currency must be a 3-letter code (e.g., USD)"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Travel Agent</label>
                  <select
                    name="travel_agent"
                    value={formData.travel_agent}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Travel Agent</option>
                    {travelAgents.map(agent => (
                      <option key={agent.agent_id} value={agent.agent_id}>
                        {agent.agency_name}
                      </option>
                    ))}
                  </select>
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
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Add Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Booking Reference</label>
                  <input
                    type="text"
                    name="booking_reference"
                    value={formData.booking_reference}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  <label className="block text-gray-700 mb-1">Booking Date</label>
                  <input
                    type="date"
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Booking Status</label>
                  <select
                    name="booking_status"
                    value={formData.booking_status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Booking Source</label>
                  <input
                    type="text"
                    name="booking_source"
                    value={formData.booking_source}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    maxLength={3}
                    pattern="[A-Z]{3}"
                    title="Currency must be a 3-letter code (e.g., USD)"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Travel Agent</label>
                  <select
                    name="travel_agent"
                    value={formData.travel_agent}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Travel Agent</option>
                    {travelAgents.map(agent => (
                      <option key={agent.agent_id} value={agent.agent_id}>
                        {agent.agency_name}
                      </option>
                    ))}
                  </select>
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
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              Are you sure you want to delete the booking <span className="font-semibold">{currentBooking?.booking_reference || 'N/A'}</span> for {currentBooking?.passenger?.first_name || 'N/A'} {currentBooking?.passenger?.last_name || ''}? This action cannot be undone.
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
                disabled={loading}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default BookingManagement;