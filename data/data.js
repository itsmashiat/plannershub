// Pabna University of Science and Technology (PUST)
// Department of Urban & Regional Planning (URP)
// BURP Curriculum (Session 2024-2025)

const SEMESTERS = [
  { id: 1, name: "1st Year 1st Semester" },
  { id: 2, name: "1st Year 2nd Semester" },
  { id: 3, name: "2nd Year 1st Semester" },
  { id: 4, name: "2nd Year 2nd Semester" },
  { id: 5, name: "3rd Year 1st Semester" },
  { id: 6, name: "3rd Year 2nd Semester" },
  { id: 7, name: "4th Year 1st Semester" },
  { id: 8, name: "4th Year 2nd Semester" }
];

const COURSES = [
  // 1st Year 1st Semester
  { id: "urp1101", semester: 1, code: "URP 1101", name: "Introduction to Urban and Regional Planning", credits: 3.0, type: "theory" },
  { id: "urp1103", semester: 1, code: "URP 1103", name: "History of Human Settlements Development", credits: 3.0, type: "theory" },
  { id: "hum1151", semester: 1, code: "HUM 1151", name: "Principles of Economics", credits: 3.0, type: "theory" },
  { id: "math1153", semester: 1, code: "MATH 1153", name: "Mathematics-I", credits: 3.0, type: "theory" },
  { id: "hum1155", semester: 1, code: "HUM 1155", name: "Functional English", credits: 3.0, type: "theory" },
  { id: "urp1104", semester: 1, code: "URP 1104", name: "Principles of Cartography - Lab", credits: 1.5, type: "lab" },
  { id: "arch1106", semester: 1, code: "ARCH 1106", name: "Basic Design - Lab", credits: 1.5, type: "lab" },
  { id: "urp1108", semester: 1, code: "URP 1108", name: "Viva-voce", credits: 0.75, type: "viva" },

  // 1st Year 2nd Semester
  { id: "urp1201", semester: 2, code: "URP 1201", name: "Urban Planning Theories and Principles", credits: 3.0, type: "theory" },
  { id: "urp1203", semester: 2, code: "URP 1203", name: "Principles of Engineering Survey", credits: 3.0, type: "theory" },
  { id: "urp1204", semester: 2, code: "URP 1204", name: "Engineering Survey - Lab", credits: 1.5, type: "lab" },
  { id: "arch1205", semester: 2, code: "ARCH 1205", name: "Elements of Architecture", credits: 2.0, type: "theory" },
  { id: "math1251", semester: 2, code: "MATH 1251", name: "Mathematics-II", credits: 3.0, type: "theory" },
  { id: "che1253", semester: 2, code: "CHE 1253", name: "Environmental Chemistry", credits: 3.0, type: "theory" },
  { id: "hum1255", semester: 2, code: "HUM 1255", name: "Bangladesh Studies and Sociology", credits: 3.0, type: "theory" },
  { id: "urp1206", semester: 2, code: "URP 1206", name: "Computer Applications-Lab", credits: 1.5, type: "lab" },
  { id: "urp1208", semester: 2, code: "URP 1208", name: "Viva-voce", credits: 0.75, type: "viva" },

  // 2nd Year 1st Semester
  { id: "urp2101", semester: 3, code: "URP 2101", name: "Land Use Planning", credits: 3.0, type: "theory" },
  { id: "urp2103", semester: 3, code: "URP 2103", name: "Neighbourhood Planning and Landscape Design", credits: 3.0, type: "theory" },
  { id: "urp2104", semester: 3, code: "URP 2104", name: "Site and Area Planning - Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp2105", semester: 3, code: "URP 2105", name: "Statistics for Planners-I", credits: 3.0, type: "theory" },
  { id: "ce2151", semester: 3, code: "CE 2151", name: "Construction Technology and Materials", credits: 3.0, type: "theory" },
  { id: "phy2153", semester: 3, code: "PHY 2153", name: "Fundamentals of Physics", credits: 3.0, type: "theory" },
  { id: "urp2106", semester: 3, code: "URP 2106", name: "Social and Physical Surveys - Lab", credits: 1.5, type: "lab" },
  { id: "urp2108", semester: 3, code: "URP 2108", name: "Viva-voce", credits: 0.75, type: "viva" },

  // 2nd Year 2nd Semester
  { id: "urp2201", semester: 4, code: "URP 2201", name: "Urban Planning Techniques", credits: 3.0, type: "theory" },
  { id: "urp2202", semester: 4, code: "URP 2202", name: "Urban Planning Techniques Lab and Field Work", credits: 2.0, type: "lab" },
  { id: "urp2203", semester: 4, code: "URP 2203", name: "Statistics for Planners-II", credits: 3.0, type: "theory" },
  { id: "arch2204", semester: 4, code: "ARCH 2204", name: "Landscape Planning and Design- Lab", credits: 1.5, type: "lab" },
  { id: "urp2205", semester: 4, code: "URP 2205", name: "Research Methodology", credits: 3.0, type: "theory" },
  { id: "ce2251", semester: 4, code: "CE 2251", name: "Elements of Civil Engineering Structures", credits: 3.0, type: "theory" },
  { id: "urp2206", semester: 4, code: "URP 2206", name: "Computer Applications in Planning-Lab", credits: 2.0, type: "lab" },
  { id: "cse2253", semester: 4, code: "CSE 2253", name: "Programming Techniques for Planners", credits: 3.0, type: "theory" },
  { id: "urp2208", semester: 4, code: "URP 2208", name: "Viva-voce", credits: 0.75, type: "viva" },

  // 3rd Year 1st Semester
  { id: "urp3101", semester: 5, code: "URP 3101", name: "Rural Development Planning-I", credits: 3.0, type: "theory" },
  { id: "urp3102", semester: 5, code: "URP 3102", name: "Rural Development Planning Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp3103", semester: 5, code: "URP 3103", name: "Housing and Real Estate Development", credits: 3.0, type: "theory" },
  { id: "urp3105", semester: 5, code: "URP 3105", name: "Geographic Information System (GIS)-I", credits: 3.0, type: "theory" },
  { id: "urp3106", semester: 5, code: "URP 3106", name: "Geographic Information System (GIS) Lab-I", credits: 3.0, type: "lab" },
  { id: "urp3107", semester: 5, code: "URP 3107", name: "Transportation Planning - I", credits: 3.0, type: "theory" },
  { id: "urp3109", semester: 5, code: "URP 3109", name: "Water Resources Planning", credits: 3.0, type: "theory" },
  { id: "cse3152", semester: 5, code: "CSE 3152", name: "Programming Techniques for Planners - Lab", credits: 1.5, type: "lab" },
  { id: "urp3110", semester: 5, code: "URP 3110", name: "Viva-voce", credits: 0.75, type: "viva" },

  // 3rd Year 2nd Semester
  { id: "urp3201", semester: 6, code: "URP 3201", name: "Regional Development Planning", credits: 3.0, type: "theory" },
  { id: "urp3202", semester: 6, code: "URP 3202", name: "Regional Development Planning - Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp3203", semester: 6, code: "URP 3203", name: "Remote Sensing and Photogrammetry", credits: 3.0, type: "theory" },
  { id: "urp3204", semester: 6, code: "URP 3204", name: "Remote Sensing and Photogrammetry - Lab", credits: 3.0, type: "lab" },
  { id: "urp3206", semester: 6, code: "URP 3206", name: "Geographic Information System (GIS) Lab-II", credits: 3.0, type: "lab" },
  { id: "urp3207", semester: 6, code: "URP 3207", name: "Transportation Planning - II", credits: 3.0, type: "theory" },
  { id: "urp3208", semester: 6, code: "URP 3208", name: "Transportation Planning- Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp3209", semester: 6, code: "URP 3209", name: "Land Development and Management", credits: 3.0, type: "theory" },
  { id: "urp3210", semester: 6, code: "URP 3210", name: "Viva-voce", credits: 0.75, type: "viva" },

  // 4th Year 1st Semester
  { id: "urp4000", semester: 7, code: "URP 4000", name: "Project/Thesis- I", credits: 2.0, type: "thesis" },
  { id: "urp4101", semester: 7, code: "URP 4101", name: "Legal Basis of Planning", credits: 3.0, type: "theory" },
  { id: "urp4103", semester: 7, code: "URP 4103", name: "Project Planning and Management", credits: 3.0, type: "theory" },
  { id: "urp4104", semester: 7, code: "URP 4104", name: "Project Planning and Management-Lab", credits: 2.0, type: "lab" },
  { id: "urp4105", semester: 7, code: "URP 4105", name: "Climate Change and Disaster Management", credits: 3.0, type: "theory" },
  { id: "urp4106", semester: 7, code: "URP 4106", name: "Climate Change and Disaster Management - Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp4107", semester: 7, code: "URP 4107", name: "Utility Services and Infrastructure Planning", credits: 3.0, type: "theory" },
  { id: "urp4109", semester: 7, code: "URP 4109", name: "Resettlement Planning (Elective)", credits: 2.0, type: "theory" },
  { id: "urp4111", semester: 7, code: "URP 4111", name: "Rural Development Planning-II (Elective)", credits: 2.0, type: "theory" },
  { id: "urp4113", semester: 7, code: "URP 4113", name: "Coastal Zone Planning and Management (Elective)", credits: 2.0, type: "theory" },
  { id: "urp4115", semester: 7, code: "URP 4115", name: "Tourism Planning (Elective)", credits: 2.0, type: "theory" },
  { id: "urp4118", semester: 7, code: "URP 4118", name: "Viva-voce", credits: 0.75, type: "viva" },

  // 4th Year 2nd Semester
  { id: "urp4002", semester: 8, code: "URP 4002", name: "Project/Thesis- II", credits: 4.0, type: "thesis" },
  { id: "urp4201", semester: 8, code: "URP 4201", name: "Urban Governance and Finance", credits: 3.0, type: "theory" },
  { id: "urp4203", semester: 8, code: "URP 4203", name: "Development Planning (Optional)", credits: 3.0, type: "theory" },
  { id: "urp4205", semester: 8, code: "URP 4205", name: "Environmental Planning and Management (Optional)", credits: 3.0, type: "theory" },
  { id: "urp4206", semester: 8, code: "URP 4206", name: "Environmental Planning and Management- Lab and Field Work", credits: 3.0, type: "lab" },
  { id: "urp4208", semester: 8, code: "URP 4208", name: "Participatory Planning – Field Work", credits: 1.5, type: "lab" },
  { id: "urp4210", semester: 8, code: "URP 4210", name: "Viva-voce", credits: 0.75, type: "viva" }
];

const RESOURCES = [
  // Lecture Notes
  {
    id: "n1",
    courseId: "urp1101",
    type: "note",
    title: "Definition, Scope and Principles of Urban and Regional Planning",
    author: "Dr. Md. Ashrafuzzaman Pramanik",
    size: "3.8 MB",
    downloads: 410,
    rating: 4.8
  },
  {
    id: "n2",
    courseId: "urp1103",
    type: "note",
    title: "Ancient City Planning: The Indus Valley, Nile, and Mesopotamian Settlements",
    author: "Md. Kamrul Hasan",
    size: "5.4 MB",
    downloads: 285,
    rating: 4.7
  },
  {
    id: "n3",
    courseId: "urp2101",
    type: "note",
    title: "Land Use Zoning Regulations in Bangladesh Context",
    author: "URP Faculty Committee",
    size: "6.2 MB",
    downloads: 320,
    rating: 4.9
  },
  {
    id: "n4",
    courseId: "urp3105",
    type: "note",
    title: "GIS Data Structures: Vector vs Raster Representations",
    author: "GIS Lab Instructors",
    size: "8.1 MB",
    downloads: 680,
    rating: 4.9
  },
  {
    id: "n5",
    courseId: "urp3107",
    type: "note",
    title: "The Four-Step Travel Demand Forecasting Model",
    author: "Saimunnahar Ritu",
    size: "9.2 MB",
    downloads: 412,
    rating: 4.8
  },
  {
    id: "n6",
    courseId: "urp4105",
    type: "note",
    title: "Vulnerability Assessments and Disaster Risk Reduction (DRR) in Bangladesh",
    author: "Dr. Md. Ashrafuzzaman Pramanik",
    size: "7.0 MB",
    downloads: 540,
    rating: 5.0
  },
  {
    id: "n7",
    courseId: "urp1104",
    type: "note",
    title: "Principles of Map Scales and Area Measurements",
    author: "Sessional Instructors",
    size: "4.5 MB",
    downloads: 198,
    rating: 4.6
  },

  // Reference Textbooks
  {
    id: "b1",
    courseId: "urp1101",
    type: "book",
    title: "Urban and Regional Planning (5th Edition)",
    author: "Peter Hall, Mark Tewdwr-Jones",
    size: "28.5 MB",
    downloads: 1420,
    rating: 4.9
  },
  {
    id: "b2",
    courseId: "urp3105",
    type: "book",
    title: "Geographical Information Systems for Geoscientists: Modelling with GIS",
    author: "Graeme F. Bonham-Carter",
    size: "42.0 MB",
    downloads: 980,
    rating: 4.8
  },
  {
    id: "b3",
    courseId: "urp3107",
    type: "book",
    title: "Traffic Engineering (4th Edition)",
    author: "Louis J. Pignataro",
    size: "34.1 MB",
    downloads: 740,
    rating: 4.7
  },
  {
    id: "b4",
    courseId: "urp2103",
    type: "book",
    title: "Site Planning (3rd Edition)",
    author: "Kevin Lynch",
    size: "18.7 MB",
    downloads: 1890,
    rating: 5.0
  },
  {
    id: "b5",
    courseId: "hum1151",
    type: "book",
    title: "Economics (19th Edition)",
    author: "Paul A. Samuelson, William D. Nordhaus",
    size: "21.4 MB",
    downloads: 512,
    rating: 4.6
  },
  {
    id: "b6",
    courseId: "urp4105",
    type: "book",
    title: "At Risk: Natural Hazards, People's Vulnerability and Disasters",
    author: "Ben Wisner, Piers Blaikie, Terry Cannon, Ian Davis",
    size: "16.8 MB",
    downloads: 890,
    rating: 4.9
  },

  // PYQs
  {
    id: "p1",
    courseId: "urp1101",
    type: "pyq",
    title: "URP 1101 Term Final Question Paper (2025)",
    author: "Academic Committee",
    size: "1.3 MB",
    downloads: 940,
    rating: 4.6
  },
  {
    id: "p2",
    courseId: "urp1103",
    type: "pyq",
    title: "URP 1103 Settlement History Exam Papers (2024)",
    author: "Academic Committee",
    size: "1.0 MB",
    downloads: 430,
    rating: 4.4
  },
  {
    id: "p3",
    courseId: "urp2105",
    type: "pyq",
    title: "URP 2105 Statistics for Planners-I Written Board Question (2025)",
    author: "Academic Committee",
    size: "1.8 MB",
    downloads: 650,
    rating: 4.8
  },
  {
    id: "p4",
    courseId: "urp3105",
    type: "pyq",
    title: "URP 3106 GIS Lab Practical Examination Guide (2025)",
    author: "Lab Committee",
    size: "2.5 MB",
    downloads: 1120,
    rating: 4.9
  },
  {
    id: "p5",
    courseId: "urp4105",
    type: "pyq",
    title: "URP 4105 Disaster Management Board Final Question (2025)",
    author: "Academic Committee",
    size: "1.1 MB",
    downloads: 510,
    rating: 4.7
  }
];

const YOUTUBE_RECOMMENDATIONS = [
  {
    id: "yt1",
    courseId: "urp1101",
    title: "What is Urban Planning? Crash Course for Beginners",
    channel: "City Beautiful",
    duration: "12:15",
    url: "https://www.youtube.com/watch?v=3z-gEwzKmsE",
    thumbnail: "https://img.youtube.com/vi/3z-gEwzKmsE/0.jpg",
    views: "245K views",
    rating: 4.9
  },
  {
    id: "yt2",
    courseId: "urp1103",
    title: "The Garden City Movement & Ebenezer Howard Concept",
    channel: "Planning Digest",
    duration: "8:45",
    url: "https://www.youtube.com/watch?v=d_k5sL2Tq1M",
    thumbnail: "https://img.youtube.com/vi/d_k5sL2Tq1M/0.jpg",
    views: "42K views",
    rating: 4.7
  },
  {
    id: "yt3",
    courseId: "urp3105",
    title: "Introduction to ArcGIS Pro for Beginners",
    channel: "Esri Community",
    duration: "25:30",
    url: "https://www.youtube.com/watch?v=kYJjT7mDkQA",
    thumbnail: "https://img.youtube.com/vi/kYJjT7mDkQA/0.jpg",
    views: "1.2M views",
    rating: 5.0
  },
  {
    id: "yt4",
    courseId: "urp3105",
    title: "GIS Projections, Datums, & Coordinate Systems Explained",
    channel: "Geospatial School",
    duration: "14:20",
    url: "https://www.youtube.com/watch?v=kIq51_nbe8g",
    thumbnail: "https://img.youtube.com/vi/kIq51_nbe8g/0.jpg",
    views: "89K views",
    rating: 4.8
  },
  {
    id: "yt5",
    courseId: "urp3107",
    title: "The Four-Step Transportation Planning Model Process",
    channel: "Urban Mobility Channel",
    duration: "15:40",
    url: "https://www.youtube.com/watch?v=Zc21m2wEwM0",
    thumbnail: "https://img.youtube.com/vi/Zc21m2wEwM0/0.jpg",
    views: "32K views",
    rating: 4.6
  },
  {
    id: "yt6",
    courseId: "urp2103",
    title: "Kevin Lynch's 5 Elements of the City Layout",
    channel: "City Designing",
    duration: "11:40",
    url: "https://www.youtube.com/watch?v=wXwQY0p7h1Q",
    thumbnail: "https://img.youtube.com/vi/wXwQY0p7h1Q/0.jpg",
    views: "150K views",
    rating: 5.0
  },
  {
    id: "yt7",
    courseId: "urp4105",
    title: "Disaster Risk Reduction and Climate Adaptation Strategies",
    channel: "UN Disaster Risk Office",
    duration: "6:20",
    url: "https://www.youtube.com/watch?v=y16aM3BJHb8",
    thumbnail: "https://img.youtube.com/vi/y16aM3BJHb8/0.jpg",
    views: "110K views",
    rating: 4.7
  }
];
