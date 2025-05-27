import express from "express"
import { searchCollege, searchCourse } from "../controllers/collegeController.js"

const CollegeRoutes = express.Router()

CollegeRoutes.get("/searchCollegeName" , searchCollege)
CollegeRoutes.get("/searchCourseName" , searchCourse)


export default CollegeRoutes

