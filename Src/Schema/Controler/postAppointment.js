const { createAppointments } = require("../../Handler/appointment");

module.exports= {
    createAppointments: async(req, res)=>{
        try{
            const response = await createAppointments(req);
            res.send(response)
        }
        catch{
            res.send("Something wrong!");
        }
    }
}