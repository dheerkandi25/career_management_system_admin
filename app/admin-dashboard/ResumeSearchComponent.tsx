import React from "react";
import { Applicant } from "../types";

interface ResumeSearchComponentProps {
  resumeKeywords: string;
  setResumeKeywords: (keywords: string) => void;
  onResumeSearch: () => void;
  filteredApplicants: Applicant[];
}

const ResumeSearchComponent: React.FC<ResumeSearchComponentProps> = ({
  resumeKeywords,
  setResumeKeywords,
  onResumeSearch,
  filteredApplicants,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-black">Search Resumes</h2>
      {/* Resume keywords input */} 
      <input
        type="text"
        placeholder="Enter keywords (comma-separated)..."
        value={resumeKeywords}
        onChange={(e) => setResumeKeywords(e.target.value)} // Update the resume keywords in the parent
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <button
        onClick={onResumeSearch} // Trigger the resume search function in the parent
        className="mb-4 p-2 bg-green-500 text-white rounded"
      >
        Search Resumes
      </button>
      {filteredApplicants.length > 0 && (
        <div className="overflow-auto max-h-screen">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-black">Name</th>
                <th className="py-2 px-4 border-b text-black">Years of Experience</th>
                <th className="py-2 px-4 border-b text-black">Phone</th>
                <th className="py-2 px-4 border-b text-black">Email</th>
                <th className="py-2 px-4 border-b text-black">Address</th>
                <th className="py-2 px-4 border-b text-black">Resume Name</th>
                <th className="py-2 px-4 border-b text-black">Experience</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td className="py-2 px-4 border-b text-black">{`${applicant.first_name} ${applicant.last_name}`}</td>
                  <td className="py-2 px-4 border-b text-black">
                    {applicant.experience.length > 0
                      ? applicant.experience
                          .map(
                            (exp) =>
                              `${exp.title} at ${exp.company} (${new Date(
                                exp.start_date
                              ).toLocaleDateString()} - ${
                                exp.end_date
                                  ? new Date(exp.end_date).toLocaleDateString()
                                  : "Present"
                              })`
                          )
                          .join(", ")
                      : "No experience"}
                  </td>
                  <td className="py-2 px-4 border-b text-black">{applicant.phone}</td>
                  <td className="py-2 px-4 border-b text-black">{applicant.email_id}</td>
                  <td className="py-2 px-4 border-b text-black">{applicant.address || "N/A"}</td>
                  <td className="py-2 px-4 border-b text-black">{applicant.resume_name}</td>
                  <td className="py-2 px-4 border-b text-black">
                    {applicant.experience.map((exp, index) => (
                      <div key={index}>
                        <strong>{exp.title}</strong> at {exp.company} <br />
                        {new Date(exp.start_date).toLocaleDateString()} -{" "}
                        {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "Present"}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResumeSearchComponent;