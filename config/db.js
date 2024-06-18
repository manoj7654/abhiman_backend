// importing sequelize for making connection my sql database
const Sequelize=require("sequelize")
require("dotenv").config()

// creating connection
const connection=new Sequelize(process.env.dataBaseName,process.env.user_name,process.env.mySqlPassword,{
    host:process.env.host,
    dialect:"mysql",
    port:process.env.mySqlPort
})

// exporting connection
module.exports={connection}