'use client'
import React, { useEffect, useState } from "react";
import Chatbot from "./Chatbot";
import SearchComponent from "./SearchComponent";
import ResumeSearchComponent from "./ResumeSearchComponent";
import { Applicant } from "./types";
import { useRouter } from "next/navigation";

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      router.push("/");
    }
  }, [router]);

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [resumeKeywords, setResumeKeywords] = useState<string>("");
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null); // State for popup message

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/applicant")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setApplicants(data))
      .catch((error) => {
        console.error("Error fetching applicants:", error);
        setError(error.message);
      });
  }, []);

  const calculateExperience = (experience: { start_date: string; end_date: string | null }[]) => {
    let totalExperience = 0;
    experience.forEach((exp) => {
      const startDate = new Date(exp.start_date);
      const endDate = exp.end_date ? new Date(exp.end_date) : new Date();
      totalExperience += (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 365);
    });
    return totalExperience.toFixed(1);
  };

  const handleSearch = () => {
    // Mock data to test the table display functionality
    // const mockData1 = [
    //   { id: 1, first_name: "Dheeraj", last_name: "Kandikattu", city: "New York" },
    //   { id: 2, first_name: "Debasmitha", last_name: "Biswas", city: "Los Angeles" },
    //   { id: 3, first_name: "John", last_name: "Doe", city: "New York" },
    //   { id: 4, first_name: "Jane", last_name: "Doe", city: "Los Angeles" },
    // ];

    // setSearchResults(mockData1);

    // Uncomment the following lines to use the actual API
    
    fetch("http://127.0.0.1:5000/api/generateData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchTerm }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (typeof data === "string") {
          setPopupMessage(data); // Set the popup message
        } else if (Array.isArray(data)) {
          setSearchResults(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setError(error.message);
      });
  };

  const handleResumeSearch = () => {
    // Mock data to test the functionality
    // const mockResumeNames = ["resume1.pdf", "resume2.pdf"]; // Mock resume file names
    // const filtered = applicants.filter((applicant) =>
    //   mockResumeNames.includes(applicant.resumeName)
    // );
    // setFilteredApplicants(filtered);

    // Uncomment the following lines to use the actual API
    
    fetch("http://127.0.0.1:5000/api/searchresume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keywords: resumeKeywords }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((resumeNames: string[]) => {
        const filtered = applicants.filter((applicant) =>
          resumeNames.includes(applicant.resume_name)
        );
        console.log("Filtered Applicants:", filtered); // Debugging
        setFilteredApplicants(filtered);
      })
      .catch((error) => {
        console.error("Error fetching resume search results:", error);
        setError(error.message);
      });
  };

  return (
    <div className="p-8 relative">
      <h1 className="text-2xl font-bold mb-6">Applicants</h1>
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <>
          <div className="overflow-auto max-h-screen mb-8">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-black">Name</th>
                  <th className="py-2 px-4 border-b text-black">Years of Experience</th>
                  <th className="py-2 px-4 border-b text-black">Phone</th>
                  <th className="py-2 px-4 border-b text-black">Email</th>
                  <th className="py-2 px-4 border-b text-black">Address</th>
                  <th className="py-2 px-4 border-b text-black">Resume Name</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td className="py-2 px-4 border-b text-black">{`${applicant.first_name} ${applicant.last_name}`}</td>
                    <td className="py-2 px-4 border-b text-black">{calculateExperience(applicant.experience)}</td>
                    <td className="py-2 px-4 border-b text-black">{applicant.phone}</td>
                    <td className="py-2 px-4 border-b text-black">{applicant.email_id}</td>
                    <td className="py-2 px-4 border-b text-black">{applicant.address || "N/A"}</td>
                    <td className="py-2 px-4 border-b text-black">{applicant.resume_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} searchResults={searchResults} />
          <ResumeSearchComponent resumeKeywords={resumeKeywords} setResumeKeywords={setResumeKeywords} onResumeSearch={handleResumeSearch} filteredApplicants={filteredApplicants} />
        </>
      )}
      {popupMessage && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>{popupMessage}</p>
            <button
              onClick={() => setPopupMessage(null)}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
};

export default AdminDashboard;