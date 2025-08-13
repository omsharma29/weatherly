import axios from "axios"

type Coordinates = {
    latitude : string;
    longitude : string
}

export  const FetchData = async({latitude, longitude} : Coordinates)=>{
    const response = await axios.get(`${import.meta.env.VITE_URL}/forecast?latitude=${latitude}&longitude=${longitude}`)
    return response.data
   
}

