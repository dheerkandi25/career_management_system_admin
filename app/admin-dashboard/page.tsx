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
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [router]);

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [resumeKeywords, setResumeKeywords] = useState<string>("");
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email_id: "",
    address: "",
  });

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openUpdateForm = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setFormData({
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      phone: applicant.phone,
      email_id: applicant.email_id,
      address: applicant.address || "",
    });
  };

  const handleUpdate = () => {
    if (!editingApplicant) return;

    // Merge the updated fields with the existing applicant data
    const updatedData = {
      ...editingApplicant, // Keep all existing fields
      ...formData, // Override only the fields being updated
    };

    fetch(`http://127.0.0.1:5000/api/applicant/${editingApplicant.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update applicant");
        }
        return response.json(); // Expecting only the `id` in the response
      })
      .then(() => {
        // Update the applicants list with the updated formData
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === editingApplicant.id ? updatedData : applicant
          )
        );
        setFilteredApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === editingApplicant.id ? updatedData : applicant
          )
        );
        setEditingApplicant(null);
        setPopupMessage("Applicant updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating applicant:", error);
        setError("Failed to update applicant.");
      });
  };

  const handleDelete = (id: number) => {
    fetch(`http://127.0.0.1:5000/api/applicant/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete applicant");
        setApplicants((prev) => prev.filter((app) => app.id !== id));
        setFilteredApplicants((prev) => prev.filter((app) => app.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting applicant:", error);
        setError("Failed to delete applicant.");
      });
  };

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
          setPopupMessage(data);
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
        console.log("Filtered Applicants:", filtered);
        setFilteredApplicants(filtered);
      })
      .catch((error) => {
        console.error("Error fetching resume search results:", error);
        setError(error.message);
      });
  };

  return (
    <div className="p-8 relative">
      <h1 className="text-3xl font-bold mb-6 text-black">Admin Dashboard</h1>
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <>
{/* Applicants List Section */}
          <h2 className="text-2xl font-bold mb-4 text-black">Applicants List</h2>
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
                  <th className="py-2 px-4 border-b text-black">Actions</th>
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
                    <td className="py-2 px-4 border-b text-black">
                      <button
                        onClick={() => handleDelete(applicant.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openUpdateForm(applicant)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editingApplicant && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-black text-xl font-bold mb-4">Update Applicant</h2>
                <form>
                  <div className="mb-4">
                    <label className="block text-black mb-2">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-black mb-2">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-black mb-2">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-black mb-2">Email</label>
                    <input
                      type="email"
                      name="email_id"
                      value={formData.email_id}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-black mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingApplicant(null)}
                      className="ml-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} searchResults={searchResults} />
          <ResumeSearchComponent resumeKeywords={resumeKeywords} setResumeKeywords={setResumeKeywords} onResumeSearch={handleResumeSearch} filteredApplicants={filteredApplicants} />
        </>
      )}
      {popupMessage && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-black">{popupMessage}</p>
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