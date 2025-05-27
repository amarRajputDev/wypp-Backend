

const searchCollege = async(req,res) => {
    const searchQuery = req.query.search;

    const colleges = [
        { id: 1, name: "GLA University", location: "Mathura, Uttar Pradesh" },
        { id: 2, name: "Sanskriti University", location: "Mathura, Uttar Pradesh" },
        { id: 3, name: "Hindustan College of Science and Technology", location: "Mathura, Uttar Pradesh" },
        { id: 4, name: "KD Dental College and Hospital", location: "Mathura, Uttar Pradesh" },
        { id: 5, name: "Babu Shivnath Agrawal College", location: "Mathura, Uttar Pradesh" },
        { id: 6, name: "Rajiv Academy for Technology and Management", location: "Mathura, Uttar Pradesh" },
        { id: 7, name: "Shri R.C. College of Education", location: "Mathura, Uttar Pradesh" },
        { id: 8, name: "Shri Varshney College", location: "Mathura, Uttar Pradesh" },
        { id: 9, name: "Sachdeva Institute of Technology", location: "Mathura, Uttar Pradesh" },
        { id: 10, name: "Narayana College of Science and Arts", location: "Mathura, Uttar Pradesh" },
        { id: 11, name: "Rajeev Academy for Pharmacy", location: "Mathura, Uttar Pradesh" },
        { id: 12, name: "Rajeev Academy for Teacher Education", location: "Mathura, Uttar Pradesh" },
        { id: 13, name: "Raja Balwant Singh Engineering Technical Campus", location: "Mathura, Uttar Pradesh" },
        { id: 14, name: "Raja Balwant Singh College", location: "Mathura, Uttar Pradesh" },
        { id: 15, name: "Deen Dayal Upadhyaya Government Girls P.G. College", location: "Mathura, Uttar Pradesh" },
        { id: 16, name: "Agra Public College of Technology and Management", location: "Mathura, Uttar Pradesh" },
        { id: 17, name: "Excel Institute of Education and Research", location: "Mathura, Uttar Pradesh" },
        { id: 18, name: "Rajiv International School of Management", location: "Mathura, Uttar Pradesh" },
        { id: 19, name: "Brijwasi College of Education", location: "Mathura, Uttar Pradesh" },
        { id: 20, name: "Krishna College of Education", location: "Mathura, Uttar Pradesh" },
        { id: 21, name: "BSA College of Engineering and Technology", location: "Mathura, Uttar Pradesh" },
        { id: 22, name: "Mathura Devi Institute of Technology", location: "Mathura, Uttar Pradesh" },
        { id: 23, name: "Kailash Institute of Pharmacy and Management", location: "Mathura, Uttar Pradesh" },
        { id: 24, name: "Raja Balwant Singh Agriculture College", location: "Mathura, Uttar Pradesh" }
    ];
    
 
    
    
    if (!searchQuery) {
        return res.status(400).json({ error: "Please provide a search query." });
    }

    // Convert search query to lowercase for case-insensitive search
    const filteredColleges = colleges
        .filter(college => college.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
        .slice(0, 5); // Return only the first 5 matches

    res.json(filteredColleges);

}

const searchCourse = async(req,res) => {
    const searchQuery = req.query.search;

    const courses = [
        { id: 1, name: "Bachelor of Technology (B.Tech)", category: "Engineering" },
        { id: 2, name: "Master of Technology (M.Tech)", category: "Engineering" },
        { id: 3, name: "Diploma in Engineering", category: "Engineering" },
        { id: 4, name: "Bachelor of Science (B.Sc)", category: "Science" },
        { id: 5, name: "Master of Science (M.Sc)", category: "Science" },
        { id: 6, name: "Bachelor of Commerce (B.Com)", category: "Commerce" },
        { id: 7, name: "Master of Commerce (M.Com)", category: "Commerce" },
        { id: 8, name: "Bachelor of Business Administration (BBA)", category: "Management" },
        { id: 9, name: "Master of Business Administration (MBA)", category: "Management" },
        { id: 10, name: "Bachelor of Computer Applications (BCA)", category: "Computer Science" },
        { id: 11, name: "Master of Computer Applications (MCA)", category: "Computer Science" },
        { id: 12, name: "Diploma in Computer Applications (DCA)", category: "Computer Science" },
        { id: 13, name: "Bachelor of Arts (BA)", category: "Arts & Humanities" },
        { id: 14, name: "Master of Arts (MA)", category: "Arts & Humanities" },
        { id: 15, name: "Bachelor of Education (B.Ed)", category: "Education" },
        { id: 16, name: "Master of Education (M.Ed)", category: "Education" },
        { id: 17, name: "Bachelor of Pharmacy (B.Pharm)", category: "Pharmacy" },
        { id: 18, name: "Master of Pharmacy (M.Pharm)", category: "Pharmacy" },
        { id: 19, name: "Diploma in Pharmacy (D.Pharm)", category: "Pharmacy" },
        { id: 20, name: "Bachelor of Law (LLB)", category: "Law" },
        { id: 21, name: "Master of Law (LLM)", category: "Law" },
        { id: 22, name: "Doctor of Philosophy (PhD)", category: "Research" },
        { id: 23, name: "Doctor of Medicine (MD)", category: "Medical" },
        { id: 24, name: "Bachelor of Medicine, Bachelor of Surgery (MBBS)", category: "Medical" },
        { id: 25, name: "Bachelor of Dental Surgery (BDS)", category: "Medical" },
        { id: 26, name: "Bachelor of Homeopathic Medicine and Surgery (BHMS)", category: "Medical" },
        { id: 27, name: "Bachelor of Ayurvedic Medicine and Surgery (BAMS)", category: "Medical" },
        { id: 28, name: "Bachelor of Nursing (B.Sc Nursing)", category: "Medical" },
        { id: 29, name: "Diploma in Hotel Management", category: "Hospitality" },
        { id: 30, name: "Bachelor of Hotel Management (BHM)", category: "Hospitality" },
    ];

    if (!searchQuery) {
        return res.status(400).json({ error: "Please provide a search query." });
    }

    // Convert search query to lowercase for case-insensitive search
    const filteredcourses = courses
        .filter(course => course.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
        .slice(0, 5); // Return only the first 5 matches

    res.json(filteredcourses);

}

export {searchCollege , searchCourse}