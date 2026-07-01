// Pabna University of Science and Technology (PUST)
// Department of Urban & Regional Planning (URP)
// BURP Curriculum (Session 2024-2025)

export const GRADING_SCALE = [
  { letter: "A+", point: 4.0 },
  { letter: "A", point: 3.75 },
  { letter: "A-", point: 3.5 },
  { letter: "B+", point: 3.25 },
  { letter: "B", point: 3.0 },
  { letter: "B-", point: 2.75 },
  { letter: "C+", point: 2.5 },
  { letter: "C", point: 2.25 },
  { letter: "D", point: 2.0 },
  { letter: "F", point: 0.0 }
];

export const SEMESTERS = [
  { id: 1, label: "1st Year 1st Semester" },
  { id: 2, label: "1st Year 2nd Semester" },
  { id: 3, label: "2nd Year 1st Semester" },
  { id: 4, label: "2nd Year 2nd Semester" },
  { id: 5, label: "3rd Year 1st Semester" },
  { id: 6, label: "3rd Year 2nd Semester" },
  { id: 7, label: "4th Year 1st Semester" },
  { id: 8, label: "4th Year 2nd Semester" }
];

export const COURSES = [
  // 1st Year 1st Semester
  { id: "urp1101", semester: 1, code: "URP 1101", title: "Introduction to Urban and Regional Planning", credits: 3.0, type: "theory" },
  { id: "urp1103", semester: 1, code: "URP 1103", title: "History of Human Settlements Development", credits: 3.0, type: "theory" },
  { id: "hum1151", semester: 1, code: "HUM 1151", title: "Principles of Economics", credits: 3.0, type: "theory" },
  { id: "math1153", semester: 1, code: "MATH 1153", title: "Mathematics-I", credits: 3.0, type: "theory" },
  { id: "hum1155", semester: 1, code: "HUM 1155", title: "Functional English", credits: 3.0, type: "theory" },
  { id: "urp1104", semester: 1, code: "URP 1104", title: "Principles of Cartography - Lab", credits: 1.5, type: "lab" },
  { id: "arch1106", semester: 1, code: "ARCH 1106", title: "Basic Design - Lab", credits: 1.5, type: "lab" },
  { id: "urp1108", semester: 1, code: "URP 1108", title: "Viva-voce", credits: 0.75, type: "viva" },

  // 1st Year 2nd Semester
  { id: "urp1201", semester: 2, code: "URP 1201", title: "Urban Planning Theories and Principles", credits: 3.0, type: "theory" },
  { id: "urp1203", semester: 2, code: "URP 1203", title: "Principles of Engineering Survey", credits: 3.0, type: "theory" },
  { id: "urp1204", semester: 2, code: "URP 1204", title: "Engineering Survey - Lab", credits: 1.5, type: "lab" },
  { id: "arch1205", semester: 2, code: "ARCH 1205", title: "Elements of Architecture", credits: 2.0, type: "theory" },
  { id: "math1251", semester: 2, code: "MATH 1251", title: "Mathematics-II", credits: 3.0, type: "theory" },
  { id: "che1253", semester: 2, code: "CHE 1253", title: "Environmental Chemistry", credits: 3.0, type: "theory" },
  { id: "hum1255", semester: 2, code: "HUM 1255", title: "Bangladesh Studies and Sociology", credits: 3.0, type: "theory" },
  { id: "urp1206", semester: 2, code: "URP 1206", title: "Computer Applications-Lab", credits: 1.5, type: "lab" },
  { id: "urp1208", semester: 2, code: "URP 1208", title: "Viva-voce", credits: 0.75, type: "viva" },

  // 2nd Year 1st Semester
  { id: "urp2101", semester: 3, code: "URP 2101", title: "Land Use Planning", credits: 3.0, type: "theory" },
  { id: "urp2103", semester: 3, code: "URP 2103", title: "Neighbourhood Planning and Landscape Design", credits: 3.0, type: "theory" },
  { id: "urp2104", semester: 3, code: "URP 2104", title: "Site and Area Planning - Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp2105", semester: 3, code: "URP 2105", title: "Statistics for Planners-I", credits: 3.0, type: "theory" },
  { id: "ce2151", semester: 3, code: "CE 2151", title: "Construction Technology and Materials", credits: 3.0, type: "theory" },
  { id: "phy2153", semester: 3, code: "PHY 2153", title: "Fundamentals of Physics", credits: 3.0, type: "theory" },
  { id: "urp2106", semester: 3, code: "URP 2106", title: "Social and Physical Surveys - Lab", credits: 1.5, type: "lab" },
  { id: "urp2108", semester: 3, code: "URP 2108", title: "Viva-voce", credits: 0.75, type: "viva" },

  // 2nd Year 2nd Semester
  { id: "urp2201", semester: 4, code: "URP 2201", title: "Urban Planning Techniques", credits: 3.0, type: "theory" },
  { id: "urp2202", semester: 4, code: "URP 2202", title: "Urban Planning Techniques Lab and Field Work", credits: 2.0, type: "lab" },
  { id: "urp2203", semester: 4, code: "URP 2203", title: "Statistics for Planners-II", credits: 3.0, type: "theory" },
  { id: "arch2204", semester: 4, code: "ARCH 2204", title: "Landscape Planning and Design- Lab", credits: 1.5, type: "lab" },
  { id: "urp2205", semester: 4, code: "URP 2205", title: "Research Methodology", credits: 3.0, type: "theory" },
  { id: "ce2251", semester: 4, code: "CE 2251", title: "Elements of Civil Engineering Structures", credits: 3.0, type: "theory" },
  { id: "urp2206", semester: 4, code: "URP 2206", title: "Computer Applications in Planning-Lab", credits: 2.0, type: "lab" },
  { id: "cse2253", semester: 4, code: "CSE 2253", title: "Programming Techniques for Planners", credits: 3.0, type: "theory" },
  { id: "urp2208", semester: 4, code: "URP 2208", title: "Viva-voce", credits: 0.75, type: "viva" },

  // 3rd Year 1st Semester
  { id: "urp3101", semester: 5, code: "URP 3101", title: "Rural Development Planning-I", credits: 3.0, type: "theory" },
  { id: "urp3102", semester: 5, code: "URP 3102", title: "Rural Development Planning Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp3103", semester: 5, code: "URP 3103", title: "Housing and Real Estate Development", credits: 3.0, type: "theory" },
  { id: "urp3105", semester: 5, code: "URP 3105", title: "Geographic Information System (GIS)-I", credits: 3.0, type: "theory" },
  { id: "urp3106", semester: 5, code: "URP 3106", title: "Geographic Information System (GIS) Lab-I", credits: 3.0, type: "lab" },
  { id: "urp3107", semester: 5, code: "URP 3107", title: "Transportation Planning - I", credits: 3.0, type: "theory" },
  { id: "urp3109", semester: 5, code: "URP 3109", title: "Water Resources Planning", credits: 3.0, type: "theory" },
  { id: "cse3152", semester: 5, code: "CSE 3152", title: "Programming Techniques for Planners - Lab", credits: 1.5, type: "lab" },
  { id: "urp3110", semester: 5, code: "URP 3110", title: "Viva-voce", credits: 0.75, type: "viva" },

  // 3rd Year 2nd Semester
  { id: "urp3201", semester: 6, code: "URP 3201", title: "Regional Development Planning", credits: 3.0, type: "theory" },
  { id: "urp3202", semester: 6, code: "URP 3202", title: "Regional Development Planning - Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp3203", semester: 6, code: "URP 3203", title: "Remote Sensing and Photogrammetry", credits: 3.0, type: "theory" },
  { id: "urp3204", semester: 6, code: "URP 3204", title: "Remote Sensing and Photogrammetry - Lab", credits: 3.0, type: "lab" },
  { id: "urp3206", semester: 6, code: "URP 3206", title: "Geographic Information System (GIS) Lab-II", credits: 3.0, type: "lab" },
  { id: "urp3207", semester: 6, code: "URP 3207", title: "Transportation Planning - II", credits: 3.0, type: "theory" },
  { id: "urp3208", semester: 6, code: "URP 3208", title: "Transportation Planning- Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp3209", semester: 6, code: "URP 3209", title: "Land Development and Management", credits: 3.0, type: "theory" },
  { id: "urp3210", semester: 6, code: "URP 3210", title: "Viva-voce", credits: 0.75, type: "viva" },

  // 4th Year 1st Semester
  { id: "urp4000", semester: 7, code: "URP 4000", title: "Project/Thesis- I", credits: 2.0, type: "thesis" },
  { id: "urp4101", semester: 7, code: "URP 4101", title: "Legal Basis of Planning", credits: 3.0, type: "theory" },
  { id: "urp4103", semester: 7, code: "URP 4103", title: "Project Planning and Management", credits: 3.0, type: "theory" },
  { id: "urp4104", semester: 7, code: "URP 4104", title: "Project Planning and Management-Lab", credits: 2.0, type: "lab" },
  { id: "urp4105", semester: 7, code: "URP 4105", title: "Climate Change and Disaster Management", credits: 3.0, type: "theory" },
  { id: "urp4106", semester: 7, code: "URP 4106", title: "Climate Change and Disaster Management - Lab and Field Work", credits: 1.5, type: "lab" },
  { id: "urp4107", semester: 7, code: "URP 4107", title: "Utility Services and Infrastructure Planning", credits: 3.0, type: "theory" },
  { id: "urp4109", semester: 7, code: "URP 4109", title: "Resettlement Planning (Elective)", credits: 2.0, type: "theory" },
  { id: "urp4111", semester: 7, code: "URP 4111", title: "Rural Development Planning-II (Elective)", credits: 2.0, type: "theory" },
  { id: "urp4113", semester: 7, code: "URP 4113", title: "Coastal Zone Planning and Management (Elective)", credits: 2.0, type: "theory" },
  { id: "urp4115", semester: 7, code: "URP 4115", title: "Tourism Planning (Elective)", credits: 2.0, type: "theory" },
  { id: "urp4118", semester: 7, code: "URP 4118", title: "Viva-voce", credits: 0.75, type: "viva" },

  // 4th Year 2nd Semester
  { id: "urp4002", semester: 8, code: "URP 4002", title: "Project/Thesis- II", credits: 4.0, type: "thesis" },
  { id: "urp4201", semester: 8, code: "URP 4201", title: "Urban Governance and Finance", credits: 3.0, type: "theory" },
  { id: "urp4203", semester: 8, code: "URP 4203", title: "Development Planning (Optional)", credits: 3.0, type: "theory" },
  { id: "urp4205", semester: 8, code: "URP 4205", title: "Environmental Planning and Management (Optional)", credits: 3.0, type: "theory" },
  { id: "urp4206", semester: 8, code: "URP 4206", title: "Environmental Planning and Management- Lab and Field Work", credits: 3.0, type: "lab" },
  { id: "urp4208", semester: 8, code: "URP 4208", title: "Participatory Planning – Field Work", credits: 1.5, type: "lab" },
  { id: "urp4210", semester: 8, code: "URP 4210", title: "Viva-voce", credits: 0.75, type: "viva" }
];
