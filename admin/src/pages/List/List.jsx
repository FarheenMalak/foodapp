import React, { useEffect, useState } from 'react'
import './List.css'
import { toast } from 'react-toastify'
import axios from 'axios'

export const List = ({ url }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    console.log(response.data)

    if (response.data.success) {
      setList(response.data.data)
    } else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // Function to get the correct image URL
  const getImageUrl = (image) => {
    if (!image) return ''; // Handle empty images
    
    if (image.startsWith('http://') || image.startsWith('https://')) {
      // It's already a full URL (Cloudinary)
      return image
    } else {
      // It's a local filename
      return `${url}/images/${image}`
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
    await fetchList()
    
    if (response.data.success) {
      toast.success(response.data.message)
    } else {
      toast.error("Error")
    }
  }

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div className='list-table-format' key={index}>
              <img src={getImageUrl(item.image)} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}