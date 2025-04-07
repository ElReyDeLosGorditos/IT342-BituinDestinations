// import { useState, useEffect } from 'react'
//
// function Home() {
//   const [tourPackages, setTourPackages] = useState([])
//   const [loading, setLoading] = useState(true)
//
//   useEffect(() => {
//     // TODO: Fetch tour packages from backend
//     // This is a placeholder for demonstration
//     const fetchTourPackages = async () => {
//       try {
//         // Replace with actual API call
//         const response = await fetch('http://localhost:8080/api/tourpackages')
//         const data = await response.json()
//         setTourPackages(data)
//       } catch (error) {
//         console.error('Error fetching tour packages:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//
//     fetchTourPackages()
//   }, [])
//
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center pt-16">
//         <div className="text-2xl text-gray-600">Loading...</div>
//       </div>
//     )
//   }
//
//   return (
//     <div className="min-h-screen bg-gray-50 pt-16">
//       <div className="max-w-7xl mx-auto px-8 py-16">
//         <div className="flex justify-between items-center mb-16">
//           <h1 className="text-5xl font-bold text-gray-900">Tour Packages</h1>
//           <div className="flex space-x-6">
//             <select className="border-2 border-gray-300 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option value="">Sort by</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="duration">Duration</option>
//             </select>
//             <input
//               type="text"
//               placeholder="Search destinations..."
//               className="border-2 border-gray-300 rounded-xl px-6 py-3 text-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>
//
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
//           {tourPackages.map((tourPackage) => (
//             <div
//               key={tourPackage.packageId}
//               className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
//             >
//               {tourPackage.imageUrl && (
//                 <div className="relative h-80">
//                   <img
//                     src={tourPackage.imageUrl}
//                     alt={tourPackage.name}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-xl text-lg font-medium">
//                     {tourPackage.duration}
//                   </div>
//                 </div>
//               )}
//               <div className="p-8">
//                 <h2 className="text-3xl font-semibold text-gray-900 mb-4">
//                   {tourPackage.name}
//                 </h2>
//                 <p className="text-xl text-gray-600 mb-6 flex items-center">
//                   <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   {tourPackage.location}
//                 </p>
//                 <div className="flex justify-between items-center">
//                   <p className="text-3xl font-bold text-blue-600">
//                     ${tourPackage.price}
//                   </p>
//                   <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors">
//                     Book Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
//
// export default Home


import { useState, useEffect } from 'react'

function Home() {
  const [tourPackages, setTourPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => {
    const fetchTourPackages = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams()
        if (keyword) query.append('keyword', keyword)
        if (sortBy) {
          query.append('sortBy', sortBy)
          query.append('sortDir', sortDir)
        }

        const response = await fetch(`http://localhost:8080/tourpackage/search?${query}`)
        const data = await response.json()
        setTourPackages(data)
      } catch (error) {
        console.error('Error fetching tour packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTourPackages()
  }, [keyword, sortBy, sortDir])

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-2xl text-gray-600">Loading...</div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex justify-between items-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900">Tour Packages</h1>
            <div className="flex space-x-6">
              <select
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-2 border-gray-300 rounded-xl px-6 py-3 text-lg"
              >
                <option value="">Sort by</option>
                <option value="price">Price</option>
                <option value="duration">Duration</option>
              </select>
              <select
                  onChange={(e) => setSortDir(e.target.value)}
                  className="border-2 border-gray-300 rounded-xl px-6 py-3 text-lg"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <input
                  type="text"
                  placeholder="Search destinations..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="border-2 border-gray-300 rounded-xl px-6 py-3 text-lg w-80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {tourPackages.map((tourPackage) => (
                <div key={tourPackage.packageId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {tourPackage.imageUrl && (
                      <div className="relative h-80">
                        <img src={tourPackage.imageUrl} alt={tourPackage.name} className="w-full h-full object-cover" />
                        <div className="absolute top-6 right-6 bg-black text-white px-4 py-2 rounded-xl text-lg font-medium">
                          {tourPackage.duration}
                        </div>
                      </div>
                  )}
                  <div className="p-8">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">{tourPackage.name}</h2>
                    <p className="text-xl text-gray-600 mb-6 flex items-center">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {tourPackage.location}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-3xl font-bold text-white-600">Php {tourPackage.price}</p>
                      <button className="bg-black text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-grey transition-colors">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default Home
