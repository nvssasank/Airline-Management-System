// import React, { useState, useEffect } from 'react';
// import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// const RouteManagement = () => {
//   const [routes, setRoutes] = useState([]);
//   const [filteredRoutes, setFilteredRoutes] = useState([]);
//   const [airports, setAirports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentRoute, setCurrentRoute] = useState(null);
//   const [formData, setFormData] = useState({
//     origin_airport: '',
//     destination_airport: ''
//   });
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [routesPerPage] = useState(10);
  
//   // Fetch routes and airports from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch routes
//         const routesResponse = await fetch('http://localhost:8000/api/routes/');
//         if (!routesResponse.ok) {
//           throw new Error('Failed to fetch routes');
//         }
//         const routesData = await routesResponse.json();
        
//         // Fetch airports for dropdowns
//         const airportsResponse = await fetch('http://localhost:8000/api/airports/');
//         if (!airportsResponse.ok) {
//           throw new Error('Failed to fetch airports');
//         }
//         const airportsData = await airportsResponse.json();
        
//         setRoutes(routesData);
//         setFilteredRoutes(routesData);
//         setAirports(airportsData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);
  
//   // Filter routes based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredRoutes(routes);
//     } else {
//       const results = routes.filter(route => {
//         const originAirport = airports.find(airport => airport.airport_id === route.origin_airport);
//         const destinationAirport = airports.find(airport => airport.airport_id === route.destination_airport);
        
//         if (!originAirport || !destinationAirport) return false;
        
//         const searchTermLower = searchTerm.toLowerCase();
//         return (
//           originAirport.airport_code.toLowerCase().includes(searchTermLower) ||
//           originAirport.airport_name.toLowerCase().includes(searchTermLower) ||
//           originAirport.city.toLowerCase().includes(searchTermLower) ||
//           destinationAirport.airport_code.toLowerCase().includes(searchTermLower) ||
//           destinationAirport.airport_name.toLowerCase().includes(searchTermLower) ||
//           destinationAirport.city.toLowerCase().includes(searchTermLower)
//         );
//       });
//       setFilteredRoutes(results);
//     }
//     // Reset to first page when search changes
//     setCurrentPage(1);
//   }, [searchTerm, routes, airports]);
  
//   // Get current routes for pagination
//   const indexOfLastRoute = currentPage * routesPerPage;
//   const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
//   const currentRoutes = filteredRoutes.slice(indexOfFirstRoute, indexOfLastRoute);
//   const totalPages = Math.ceil(filteredRoutes.length / routesPerPage);
  
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
//       origin_airport: '',
//       destination_airport: ''
//     });
//     setShowAddModal(true);
//   };
  
//   const handleEditClick = (route) => {
//     setCurrentRoute(route);
//     setFormData({
//       origin_airport: route.origin_airport,
//       destination_airport: route.destination_airport
//     });
//     setShowEditModal(true);
//   };
  
//   const handleDeleteClick = (route) => {
//     setCurrentRoute(route);
//     setShowDeleteModal(true);
//   };
  
//   const handleSubmitAdd = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const response = await fetch('http://localhost:8000/api/routes/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to add route');
//       }
      
//       const newRoute = await response.json();
//       setRoutes([...routes, newRoute]);
//       setShowAddModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error adding route:', error);
//       setLoading(false);
//     }
//   };
  
//   const handleSubmitEdit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const response = await fetch(`http://localhost:8000/api/routes/${currentRoute.route_id}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update route');
//       }
      
//       const updatedRoute = await response.json();
//       setRoutes(routes.map(route => 
//         route.route_id === updatedRoute.route_id ? updatedRoute : route
//       ));
//       setShowEditModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error updating route:', error);
//       setLoading(false);
//     }
//   };
  
//   const handleConfirmDelete = async () => {
//     setLoading(true);
    
//     try {
//       const response = await fetch(`http://localhost:8000/api/routes/${currentRoute.route_id}/`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to delete route');
//       }
      
//       setRoutes(routes.filter(route => route.route_id !== currentRoute.route_id));
//       setShowDeleteModal(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error deleting route:', error);
//       setLoading(false);
//     }
//   };
  
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Helper function to get airport details by ID
//   const getAirportById = (airportId) => {
//     return airports.find(airport => airport.airport_id === airportId) || {};
//   };
  
//   if (loading && routes.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Route Management</h1>
      
//       {/* Search and Add Button */}
//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <div className="relative flex items-center w-full md:w-2/3">
//           <Search className="absolute left-3 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search routes by airport code, name, or city..."
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
//           <span>Add Route</span>
//         </button>
//       </div>
      
//       {/* Table */}
//       <div className="overflow-x-auto shadow-md rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Origin</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Origin City</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Origin Country</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Destination</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Destination City</th>
//               <th className="py-3 px-4 text-left font-medium text-gray-600">Destination Country</th>
//               <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {currentRoutes.length > 0 ? (
//               currentRoutes.map((route) => {
//                 const originAirport = getAirportById(route.origin_airport);
//                 const destinationAirport = getAirportById(route.destination_airport);
                
//                 return (
//                   <tr key={route.route_id} className="hover:bg-gray-50">
//                     <td className="py-3 px-4 font-medium">{originAirport.airport_code} - {originAirport.airport_name}</td>
//                     <td className="py-3 px-4">{originAirport.city}</td>
//                     <td className="py-3 px-4">{originAirport.country}</td>
//                     <td className="py-3 px-4 font-medium">{destinationAirport.airport_code} - {destinationAirport.airport_name}</td>
//                     <td className="py-3 px-4">{destinationAirport.city}</td>
//                     <td className="py-3 px-4">{destinationAirport.country}</td>
//                     <td className="py-3 px-4">
//                       <div className="flex justify-center gap-3">
//                         <button
//                           onClick={() => handleEditClick(route)}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="Edit"
//                         >
//                           <Edit size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteClick(route)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="7" className="py-8 text-center text-gray-500">
//                   No routes found matching your search criteria
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination */}
//       {filteredRoutes.length > routesPerPage && (
//         <div className="flex justify-between items-center mt-6">
//           <div className="text-sm text-gray-600">
//             Showing {indexOfFirstRoute + 1} to {Math.min(indexOfLastRoute, filteredRoutes.length)} of {filteredRoutes.length} routes
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
//                   // Add ellipsis
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
      
//       {/* Add Route Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Add New Route</h2>
//             <form onSubmit={handleSubmitAdd}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Origin Airport</label>
//                   <select
//                     name="origin_airport"
//                     value={formData.origin_airport}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Origin Airport</option>
//                     {airports.map(airport => (
//                       <option key={`origin-${airport.airport_id}`} value={airport.airport_id}>
//                         {airport.airport_code} - {airport.airport_name} ({airport.city}, {airport.country})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Destination Airport</label>
//                   <select
//                     name="destination_airport"
//                     value={formData.destination_airport}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Destination Airport</option>
//                     {airports.map(airport => (
//                       <option key={`dest-${airport.airport_id}`} value={airport.airport_id}>
//                         {airport.airport_code} - {airport.airport_name} ({airport.city}, {airport.country})
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
//                   disabled={formData.origin_airport === formData.destination_airport && formData.origin_airport !== ''}
//                 >
//                   Add Route
//                 </button>
//               </div>
//               {formData.origin_airport === formData.destination_airport && formData.origin_airport !== '' && (
//                 <p className="text-red-500 text-sm mt-2">Origin and destination airports cannot be the same.</p>
//               )}
//             </form>
//           </div>
//         </div>
//       )}
      
//       {/* Edit Route Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Edit Route</h2>
//             <form onSubmit={handleSubmitEdit}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 mb-1">Origin Airport</label>
//                   <select
//                     name="origin_airport"
//                     value={formData.origin_airport}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Origin Airport</option>
//                     {airports.map(airport => (
//                       <option key={`origin-edit-${airport.airport_id}`} value={airport.airport_id}>
//                         {airport.airport_code} - {airport.airport_name} ({airport.city}, {airport.country})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 mb-1">Destination Airport</label>
//                   <select
//                     name="destination_airport"
//                     value={formData.destination_airport}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Destination Airport</option>
//                     {airports.map(airport => (
//                       <option key={`dest-edit-${airport.airport_id}`} value={airport.airport_id}>
//                         {airport.airport_code} - {airport.airport_name} ({airport.city}, {airport.country})
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
//                   disabled={formData.origin_airport === formData.destination_airport && formData.origin_airport !== ''}
//                 >
//                   Save Changes
//                 </button>
//               </div>
//               {formData.origin_airport === formData.destination_airport && formData.origin_airport !== '' && (
//                 <p className="text-red-500 text-sm mt-2">Origin and destination airports cannot be the same.</p>
//               )}
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
//               Are you sure you want to delete the route from {getAirportById(currentRoute?.origin_airport).airport_code} to {getAirportById(currentRoute?.destination_airport).airport_code}? This action cannot be undone.
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

// export default RouteManagement;
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState({
    origin_airport: '',
    destination_airport: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [routesPerPage] = useState(10);
  
  // Fetch routes and airports from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch airports first
        const airportsResponse = await fetch('http://localhost:8000/api/airports/');
        if (!airportsResponse.ok) {
          throw new Error('Failed to fetch airports');
        }
        const airportsData = await airportsResponse.json();
        setAirports(airportsData);
        
        // Then fetch routes
        const routesResponse = await fetch('http://localhost:8000/api/routes/');
        if (!routesResponse.ok) {
          throw new Error('Failed to fetch routes');
        }
        const routesData = await routesResponse.json();
        setRoutes(routesData);
        setFilteredRoutes(routesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter routes based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRoutes(routes);
    } else {
      const results = routes.filter(route => 
        route.origin_airport.airport_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.origin_airport.airport_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.origin_airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination_airport.airport_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination_airport.airport_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination_airport.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoutes(results);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, routes]);
  
  // Get current routes for pagination
  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstRoute, indexOfLastRoute);
  const totalPages = Math.ceil(filteredRoutes.length / routesPerPage);
  
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
      origin_airport: '',
      destination_airport: ''
    });
    setShowAddModal(true);
  };
  
  const handleEditClick = (route) => {
    setCurrentRoute(route);
    setFormData({
      origin_airport: route.origin_airport.airport_id,
      destination_airport: route.destination_airport.airport_id
    });
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (route) => {
    setCurrentRoute(route);
    setShowDeleteModal(true);
  };
  
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/routes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add route');
      }
      
      const newRoute = await response.json();
      setRoutes([...routes, newRoute]);
      setShowAddModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding route:', error);
      setLoading(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/routes/${currentRoute.route_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update route');
      }
      
      const updatedRoute = await response.json();
      setRoutes(routes.map(route => 
        route.route_id === updatedRoute.route_id ? updatedRoute : route
      ));
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating route:', error);
      setLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/routes/${currentRoute.route_id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete route');
      }
      
      setRoutes(routes.filter(route => route.route_id !== currentRoute.route_id));
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting route:', error);
      setLoading(false);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Function to get distance between two airports (simplified version)
  const calculateDistance = (origin, destination) => {
    // Earth's radius in miles
    const R = 3958.8;
    
    // Convert latitude and longitude from degrees to radians
    const lat1 = parseFloat(origin.latitude) * Math.PI / 180;
    const lon1 = parseFloat(origin.longitude) * Math.PI / 180;
    const lat2 = parseFloat(destination.latitude) * Math.PI / 180;
    const lon2 = parseFloat(destination.longitude) * Math.PI / 180;
    
    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.sin(dlat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(0);
  };
  
  if (loading && routes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Route Management</h1>
      
      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex items-center w-full md:w-2/3">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search routes by airport code, name, or city..."
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
          <span>Add Route</span>
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Origin</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Origin City</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Destination</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Destination City</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Distance (mi)</th>
              <th className="py-3 px-4 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRoutes.length > 0 ? (
              currentRoutes.map((route) => (
                <tr key={route.route_id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">
                    {route.origin_airport.airport_code} - {route.origin_airport.airport_name}
                  </td>
                  <td className="py-3 px-4">
                    {route.origin_airport.city}, {route.origin_airport.country}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {route.destination_airport.airport_code} - {route.destination_airport.airport_name}
                  </td>
                  <td className="py-3 px-4">
                    {route.destination_airport.city}, {route.destination_airport.country}
                  </td>
                  <td className="py-3 px-4">
                    {calculateDistance(route.origin_airport, route.destination_airport)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(route)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(route)}
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
                  No routes found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredRoutes.length > routesPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRoute + 1} to {Math.min(indexOfLastRoute, filteredRoutes.length)} of {filteredRoutes.length} routes
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
      
      {/* Add Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Route</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Origin Airport</label>
                  <select
                    name="origin_airport"
                    value={formData.origin_airport}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Origin Airport</option>
                    {airports.map(airport => (
                      <option key={`origin-${airport.airport_id}`} value={airport.airport_id}>
                        {airport.airport_code} - {airport.airport_name} ({airport.city}, {airport.country})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Destination Airport</label>
                  <select
                    name="destination_airport"
                    value={formData.destination_airport}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Destination Airport</option>
                    {airports.map(airport => (
                      <option key={`destination-${airport.airport_id}`} value={airport.airport_id}>
                        {airport.airport_code} - {airport.airport_name} ({airport.city}, {airport.country})
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={formData.origin_airport === formData.destination_airport && formData.origin_airport !== ''}
                >
                  Add Route
                </button>
              </div>
              {formData.origin_airport === formData.destination_airport && formData.origin_airport !== '' && (
                <p className="text-red-500 mt-2 text-sm">Origin and destination airports cannot be the same.</p>
              )}
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Route Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Route</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Origin Airport</label>
                  <select
                    name="origin_airport"
                    value={formData.origin_airport}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Origin Airport</option>
                    {airports.map(airport => (
                      <option key={`origin-edit-${airport.airport_id}`} value={airport.airport_id}>
                        {airport.airport_code} - {airport.airport_name} ({airport.city}, {airport.country})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Destination Airport</label>
                  <select
                    name="destination_airport"
                    value={formData.destination_airport}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Destination Airport</option>
                    {airports.map(airport => (
                      <option key={`destination-edit-${airport.airport_id}`} value={airport.airport_id}>
                        {airport.airport_code} - {airport.airport_name} ({airport.city}, {airport.country})
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={formData.origin_airport === formData.destination_airport}
                >
                  Save Changes
                </button>
              </div>
              {formData.origin_airport === formData.destination_airport && formData.origin_airport !== '' && (
                <p className="text-red-500 mt-2 text-sm">Origin and destination airports cannot be the same.</p>
              )}
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
              Are you sure you want to delete the route from <span className="font-semibold">{currentRoute?.origin_airport.airport_code}</span> to <span className="font-semibold">{currentRoute?.destination_airport.airport_code}</span>? This action cannot be undone.
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

export default RouteManagement;