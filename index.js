const express = require("express")
const { initializeDatabase } = require("./db/db.connect")
const app = express()
const Hotels = require("./models/Hotel.model")

app.use(express.json())
initializeDatabase()

async function createHotel(newHotel){
   try{
const hotel = new Hotels(newHotel)
const saveHotel = await hotel.save()
return saveHotel
   }catch(error){
throw error
   }
} 

app.post("/hotels", async(req, res) =>{
    try{
const savedHotel = await createHotel(req.body)
res.status(201).json({message: "Hotel added successfully.", hotel: savedHotel})
    }catch(error){
        res.status(500).json({error: "Failed to add hotel."})
    }
})

async function deleteHotel(hotelId) {
    try{
        const deletedHotel = await Hotels.findByIdAndDelete(hotelId)
        return deletedHotel
    } catch (error){
        console.log(error)
        }
}

app.delete("/hotels/:hotelId", async(req, res) =>{
    try{
        const hotel = await deleteHotel(req.params.hotelId)
        res.status(200).json({message: "Hotel deleted succesfully.", hotel: hotel})
        
    } catch (error){
        res.status(500).json({error: "Failed to delete hotel."})
        }
})

async function updateHotel(hotelId, dataToUpdate){
    try{
        const updatedHotel = await Hotels.findByIdAndUpdate(hotelId, dataToUpdate, {new: true});
        return updatedHotel  
    } catch (error){
        console.log(error)
        }
}


app.post("/hotels/:hotelId", async(req,res)=>{
    try{
const hotel = await updateHotel(req.params.hotelId, req.body)
if(hotel){
res.status(200).json({message: "Hotel updated successfully.", hotel: hotel})
} else{
    res.status(404).json({message: "Hotel not found."})
}
    }catch(error){
        res.status(500).json({error: "Failed to update hotel."})
        }
})


const PORT = 3000
app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})