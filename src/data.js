export const departmentColors = {
  "Department of Bioprocess Technology": { bg: "#e6f4ea", text: "#137333" }, // Greenish
  "Department of Electrical and Electronic Technology": { bg: "#e8f0fe", text: "#1a73e8" }, // Blueish
  "Department of Food Technology": { bg: "#fce8e6", text: "#c5221f" }, // Reddish
  "Department of Information and Communication Technology": { bg: "#fef7e0", text: "#b06000" }, // Yellow/Orange
  "Department of Materials Technology": { bg: "#f3e8fd", text: "#681da8" } // Purple
};

export const departments = Object.keys(departmentColors);

export const initialReviews = [
  {
    id: 1,
    reviewerName: "Nimal Perera",
    contactNumber: "0771234567",
    isAnonymous: false,
    department: "Department of Information and Communication Technology",
    companyName: "TechCorp Solutions",
    website: "https://techcorp.example.com",
    location: "Colombo 04",
    experience: "Great experience overall. I was able to get hands-on experience in Software Engineering. Had the opportunity to work on real-world projects using React and Node.js.",
    image: null,
    creatorId: "mock-id-1",
    date: "2023-08-15"
  },
  {
    id: 2,
    reviewerName: "",
    contactNumber: "",
    isAnonymous: true,
    department: "Department of Electrical and Electronic Technology",
    companyName: "ElectroTech Industries",
    website: "",
    location: "Katunayake EPZ",
    experience: "Gained a good understanding of electronic component maintenance and industrial automation within a factory environment. The working environment is very friendly.",
    image: null,
    creatorId: "mock-id-2",
    date: "2023-09-02"
  },
  {
    id: 3,
    reviewerName: "Kamal Silva",
    contactNumber: "",
    isAnonymous: false,
    department: "Department of Food Technology",
    companyName: "Lanka Foods PLC",
    website: "",
    location: "Minuwangoda",
    experience: "Worked in the Quality Control and R&D department. Got to learn the practical application of modern food processing machinery.",
    image: null,
    creatorId: "mock-id-3",
    date: "2023-10-11"
  }
];
