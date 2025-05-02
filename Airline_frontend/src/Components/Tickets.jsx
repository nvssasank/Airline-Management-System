// import React, { useState, useEffect } from 'react';
// import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// const TicketsManagement = () => {
//   const [tickets, setTickets] = useState([]);
//   const [filteredTickets, setFilteredTickets] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [passengers, setPassengers] = useState([]);
//   const [flights, setFlights] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentTicket, setCurrentTicket] = useState(null);
//   const [formData, setFormData] = useState({
//     booking: '',
//     passenger: '',
//     flight: '',
//     ticket_type: '',
//     status: '',
//     issue_date: '',
//     price: ''
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ticketsPerPage] = useState(10);

//   // Fetch tickets, bookings, passengers, and flights from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch tickets
//         const ticketsResponse = await fetch('http://localhost:8000/api/tickets/');
//         if (!ticketsResponse.ok) {
//           throw new Error('Failed to fetch tickets');
//         }
//         const ticketsData = await ticketsResponse.json();
//         console.log('Tickets API response:', ticketsData); // Debug response
//         setTickets(ticketsData);
//         setFilteredTickets(ticketsData);

//         // Fetch bookings
//         const bookingsResponse = await fetch('http://localhost:8000/api/bookings/');
//         if (!bookingsResponse.ok) {
//           throw new Error('Failed to fetch bookings');
//         }
//         const bookingsData = await bookingsResponse.json();
//         setBookings(bookingsData);

//         // Fetch passengers
//         const passengersResponse = await fetch('http://localhost:8000/api/passengers/');
//         if (!passengersResponse.ok) {
//           throw new Error('Failed to fetch passengers');
//         }
//         const passengersData = await passengersResponse.json();
//         setPassengers(passengersData);

//         // Fetch flights
//         const flightsResponse = await fetch('http://localhost:8000/api/flights/');
//         if (!flightsResponse.ok) {
//           throw new Error('Failed to fetch flights');
//         }
//         const flightsData = await flightsResponse.json();
//         setFlights(flightsData);

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setErrorMessage('Failed to load data. Please try again.');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter tickets based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredTickets(tickets);
//     } else {
//       const results = tickets.filter(ticket =>
//         ticket.passenger && `${ticket.passenger.first_name} ${ticket.passenger.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (ticket.flight && ticket.flight.flight_number && ticket.flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (ticket.ticket_type && ticket.ticket_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (ticket.status && ticket.status.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredTickets(results);
//     }
//     setCurrentPage(1);
//   }, [searchTerm, tickets]);

//   // Get current tickets for pagination
//   const indexOfLastTicket = currentPage * ticketsPerPage;
//   const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
//   const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
//   const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

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
//       booking: '',
//       passenger: '',
//       flight: '',
//       ticket_type: '',
//       status: '',
//       issue_date: '',
//       price: ''
//     });
//     setErrorMessage('');
//     setShowAddModal(true);
//   };

//   const handleEditClick = (ticket) => {
//     setCurrentTicket(ticket);
//     setFormData({
//       booking: ticket.booking ? ticket.booking.booking_id : '',
//       passenger: ticket.passenger ? ticket.passenger.passenger_id : '',
//       flight: ticket.flight ? ticket.flight.flight_id : '',
//       ticket_type: ticket.ticket_type || '',
//       status: ticket.status || '',
//       issue_date: ticket.issue_date || '',
//       price: ticket.price || ''
//     });
//     setErrorMessage('');
//     setShowEditModal(true);
//   };

//   const handleDeleteClick = (ticket) => {
//     setCurrentTicket(ticket);
//     setShowDeleteModal(true);
//   };

//   const handleSubmitAdd = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage('');

//     const payload = {
//       ...formData,
//       booking: parseInt(formData.booking, 10) || null,
//       passenger: parseInt(formData.passenger, 10) || null,
//       flight: parseInt(formData.flight, 10) || null,
//       price: parseFloat(formData.price) || null
//     };

//     console.log('Submitting payload:', payload);

//     try {
//       const response = await fetch('http://localhost:8000/api/tickets/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Server response:', errorData);
//         throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to add ticket');
//       }

//       const newTicket = await response.json();
//       setTickets([...tickets, newTicket]);
//       setShowAddModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error adding ticket:', error);
//       setErrorMessage(error.message || 'Failed to add ticket. Please check the form and try again.');
//       setLoading(false);
//     }
//   };

//   const handleSubmitEdit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage('');

//     const payload = {
//       ...formData,
//       booking: parseInt(formData.booking, 10) || null,
//       passenger: parseInt(formData.passenger, 10) || null,
//       flight: parseInt(formData.flight, 10) || null,
//       price: parseFloat(formData.price) || null
//     };

//     try {
//       const response = await fetch(`http://localhost:8000/api/tickets/${currentTicket.ticket_id}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || JSON.stringify(errorData) || 'Failed to update ticket');
//       }

//       const updatedTicket = await response.json();
//       setTickets(tickets.map(ticket =>
//         ticket.ticket_id === updatedTicket.ticket_id ? updatedTicket : ticket
//       ));
//       setShowEditModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error updating ticket:', error);
//       setErrorMessage(error.message || 'Failed to update ticket. Please check the form and try again.');
//       setLoading(false);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     setLoading(true);
//     setErrorMessage('');

//     try {
//       const response = await fetch(`http://localhost:8000/api/tickets/${currentTicket.ticket_id}/`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete ticket');
//       }

//       setTickets(tickets.filter(ticket => ticket.ticket_id !== currentTicket.ticket_id));
//       setShowDeleteModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error deleting ticket:', error);
//       setErrorMessage('Failed to delete ticket. Please try again.');
//       setLoading(false);
//     }
//   };

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading && tickets.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Ticket Management</h1>

//       {errorMessage && (
//         <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
//           {errorMessage}
//         </div>
//       )}

//       {/* Search and Add Button */}
//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <div className="relative flex items-center w-full md:w-2/3">
//           <Search className="absolute left-3 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search tickets by passenger, flight, type, or status..."
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
//           <span>Add Ticket</span>
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto shadow-md rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Passenger</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Flight</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Ticket Type</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Issue Date</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Price</th>
//               <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {currentTickets.length > 0 ? (
//               currentTickets.map((ticket) => (
//                 <tr key={ticket.ticket_id} className="hover:bg-gray-50">
//                   <td className="py-3 px-4 font-medium">
//                     {ticket.passenger ? `${ticket.passenger.first_name} ${ticket.passenger.last_name}` : '-'}
//                   </td>
//                   <td className="py-3 px-4">
//                     {ticket.flight && ticket.flight.flight_number ? ticket.flight.flight_number : '-'}
//                   </td>
//                   <td className="py-3 px-4">{ticket.ticket_type || '-'}</td>
//                   <td className="py-3 px-4">{ticket.status || '-'}</td>
//                   <td className="py-3 px-4">{ticket.issue_date || '-'}</td>
//                   <td className="py-3 px-4">
//                     {ticket.price ? `$${parseFloat(ticket.price).toFixed(2)}` : '-'}
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex justify-center gap-3">
//                       <button
//                         onClick={() => handleEditClick(ticket)}
//                         className="text-blue-600 hover:text-blue-800"
//                         title="Edit"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(ticket)}
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
//                 <td colSpan="7" className="py-8 text-center text-gray-500">
//                   No tickets found matching your search criteria
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {filteredTickets.length > ticketsPerPage && (
//         <div className="flex justify-between items-center mt-6">
//           <div className="text-sm text-gray-600">
//             Showing {indexOfFirstTicket + 1} to {Math.min(indexOfLastTicket, filteredTickets.length)} of {filteredTickets.length} tickets
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

//       {/* Add Ticket Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Add New Ticket</h2>
//             {errorMessage && (
//               <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
//                 {errorMessage}
//               </div>
//             )}
//             <form onSubmit={handleSubmitAdd}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking</label>
//                   <select
//                     name="booking"
//                     value={formData.booking}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Booking</option>
//                     {bookings.map(booking => (
//                       <option key={booking.booking_id} value={booking.booking_id}>
//                         Booking #{booking.booking_id}
//                       </option>
//                     ))}
//                   </select>
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
//                   <label className="block text-gray-700 mb-1">Flight</label>
//                   <select
//                     name="flight"
//                     value={formData.flight}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Flight</option>
//                     {flights.map(flight => (
//                       <option key={flight.flight_id} value={flight.flight_id}>
//                         {flight.flight_number || `Flight #${flight.flight_id}`} ({flight.departure_airport} to {flight.arrival_airport})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Ticket Type</label>
//                   <input
//                     type="text"
//                     name="ticket_type"
//                     value={formData.ticket_type}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Status</label>
//                   <input
//                     type="text"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Issue Date</label>
//                   <input
//                     type="date"
//                     name="issue_date"
//                     value={formData.issue_date}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Price</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
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
//                   disabled={loading}
//                 >
//                   {loading ? 'Adding...' : 'Add Ticket'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Ticket Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
//             {errorMessage && (
//               <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
//                 {errorMessage}
//               </div>
//             )}
//             <form onSubmit={handleSubmitEdit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Booking</label>
//                   <select
//                     name="booking"
//                     value={formData.booking}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Booking</option>
//                     {bookings.map(booking => (
//                       <option key={booking.booking_id} value={booking.booking_id}>
//                         Booking #{booking.booking_id}
//                       </option>
//                     ))}
//                   </select>
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
//                   <label className="block text-gray-700 mb-1">Flight</label>
//                   <select
//                     name="flight"
//                     value={formData.flight}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Flight</option>
//                     {flights.map(flight => (
//                       <option key={flight.flight_id} value={flight.flight_id}>
//                         {flight.flight_number || `Flight #${flight.flight_id}`} ({flight.departure_airport} to {flight.arrival_airport})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Ticket Type</label>
//                   <input
//                     type="text"
//                     name="ticket_type"
//                     value={formData.ticket_type}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Status</label>
//                   <input
//                     type="text"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Issue Date</label>
//                   <input
//                     type="date"
//                     name="issue_date"
//                     value={formData.issue_date}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Price</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
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
//                   disabled={loading}
//                 >
//                   {loading ? 'Saving...' : 'Save Changes'}
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
//               Are you sure you want to delete the ticket for{' '}
//               <span className="font-semibold">
//                 {currentTicket?.passenger ? `${currentTicket.passenger.first_name} ${currentTicket.passenger.last_name}` : 'Unknown'}
//               </span> on flight{' '}
//               <span className="font-semibold">
//                 {currentTicket?.flight && currentTicket.flight.flight_number ? currentTicket.flight.flight_number : 'Unknown'}
//               </span>? This action cannot be undone.
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
//                 disabled={loading}
//               >
//                 {loading ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketsManagement;

import React, { useState, useEffect } from 'react';

const TicketsManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [formData, setFormData] = useState({
    booking: '',
    flight: '',
    passenger: '',
    ticket_number: '',
    fare_class: '',
    tax_amount: '',
    base_amount: '',
    issue_date: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tickets/');
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        const data = await response.json();
        setTickets(data);
        setFilteredTickets(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter tickets based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTickets(tickets);
    } else {
      const results = tickets.filter(ticket =>
        ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.passenger_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.flight_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTickets(results);
    }
    setCurrentPage(1);
  }, [searchTerm, tickets]);

  // Get current tickets for pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

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
      booking: '',
      flight: '',
      passenger: '',
      ticket_number: '',
      fare_class: '',
      tax_amount: '',
      base_amount: '',
      issue_date: ''
    });
    setShowAddModal(true);
  };

  const handleEditClick = (ticket) => {
    setCurrentTicket(ticket);
    setFormData({
      booking: ticket.booking.booking_id,
      flight: ticket.flight.flight_id,
      passenger: ticket.passenger.passenger_id,
      ticket_number: ticket.ticket_number,
      fare_class: ticket.fare_class,
      tax_amount: ticket.tax_amount,
      base_amount: ticket.base_amount,
      issue_date: ticket.issue_date.slice(0, 16) // Format for datetime-local input
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (ticket) => {
    setCurrentTicket(ticket);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/tickets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add ticket');
      }

      const newTicket = await response.json();
      setTickets([...tickets, newTicket]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding ticket:', error);
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/tickets/${currentTicket.ticket_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      const updatedTicket = await response.json();
      setTickets(tickets.map(ticket =>
        ticket.ticket_id === updatedTicket.ticket_id ? updatedTicket : ticket
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating ticket:', error);
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/tickets/${currentTicket.ticket_id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      setTickets(tickets.filter(ticket => ticket.ticket_id !== currentTicket.ticket_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ticket Management</h1>

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <span className="absolute left-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search tickets by number, passenger, or flight..."
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
          <span>Add Ticket</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Ticket Number</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Passenger</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Flight</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Fare Class</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Total Amount</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Issue Date</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTickets.length > 0 ? (
              currentTickets.map((ticket) => (
                <tr key={ticket.ticket_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{ticket.ticket_number}</td>
                  <td className="py-3 px-4">{ticket.passenger_name}</td>
                  <td className="py-3 px-4">{ticket.flight_number}</td>
                  <td className="py-3 px-4">{ticket.fare_class}</td>
                  <td className="py-3 px-4">${(parseFloat(ticket.base_amount) + parseFloat(ticket.tax_amount)).toFixed(2)}</td>
                  <td className="py-3 px-4">{new Date(ticket.issue_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(ticket)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(ticket)}
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
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No tickets found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredTickets.length > ticketsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstTicket + 1} to {Math.min(indexOfLastTicket, filteredTickets.length)} of {filteredTickets.length} tickets
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
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

      {/* Add Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Ticket</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Booking ID</label>
                  <input
                    type="number"
                    name="booking"
                    value={formData.booking}
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
                  <label className="block text-gray-700 mb-1">Ticket Number</label>
                  <input
                    type="text"
                    name="ticket_number"
                    value={formData.ticket_number}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Fare Class</label>
                  <input
                    type="text"
                    name="fare_class"
                    value={formData.fare_class}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Tax Amount</label>
                  <input
                    type="number"
                    name="tax_amount"
                    value={formData.tax_amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Base Amount</label>
                  <input
                    type="number"
                    name="base_amount"
                    value={formData.base_amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Issue Date</label>
                  <input
                    type="datetime-local"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleInputChange}
                    required
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
                  Add Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Booking ID</label>
                  <input
                    type="number"
                    name="booking"
                    value={formData.booking}
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
                  <label className="block text-gray-700 mb-1">Ticket Number</label>
                  <input
                    type="text"
                    name="ticket_number"
                    value={formData.ticket_number}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Fare Class</label>
                  <input
                    type="text"
                    name="fare_class"
                    value={formData.fare_class}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Tax Amount</label>
                  <input
                    type="number"
                    name="tax_amount"
                    value={formData.tax_amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Base Amount</label>
                  <input
                    type="number"
                    name="base_amount"
                    value={formData.base_amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Issue Date</label>
                  <input
                    type="datetime-local"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleInputChange}
                    required
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
              Are you sure you want to delete the ticket <span className="font-semibold">{currentTicket?.ticket_number}</span>? This action cannot be undone.
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

export default TicketsManagement;