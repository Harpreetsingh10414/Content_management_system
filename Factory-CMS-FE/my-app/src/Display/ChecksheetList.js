import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ChecksheetList = () => {
  const [checksheets, setChecksheets] = useState([]);
  const [checksheetDetails, setChecksheetDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/checksheets")
      .then((response) => {
        setChecksheets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching checksheets:", error);
        setError("Failed to fetch checksheets.");
        setLoading(false);
      });
  }, []);

  const fetchChecksheetDetails = (id) => {
    if (checksheetDetails[id]) return; // Don't fetch again if already fetched

    axios
      .get(`http://localhost:3000/api/checksheets/${id}`)
      .then((response) => {
        setChecksheetDetails((prev) => ({ ...prev, [id]: response.data }));
      })
      .catch((error) => {
        console.error("Error fetching checksheet details:", error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Checksheet List</h2>
      <div className="accordion" id="checksheetAccordion">
        {checksheets.map((checksheet) => (
          <div className="accordion-item" key={checksheet._id}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${checksheet._id}`}
                aria-expanded="false"
                aria-controls={`collapse-${checksheet._id}`}
                onClick={() => fetchChecksheetDetails(checksheet._id)}
              >
                Checksheet ID: {checksheet._id}
              </button>
            </h2>
            <div
              id={`collapse-${checksheet._id}`}
              className="accordion-collapse collapse"
              data-bs-parent="#checksheetAccordion"
            >
              <div className="accordion-body">
                {checksheetDetails[checksheet._id] ? (
                  <table className="table table-bordered mt-3">
                    <thead>
                      <tr>
                        <th>Serial No</th>
                        <th>Check Method</th>
                        <th>Station</th>
                        <th>Permissible</th>
                        <th>Check Point</th>
                        <th>Plan Time</th>
                        <th>Frequency</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checksheetDetails[checksheet._id].checks?.map((check) => (
                        <tr key={check._id}>
                          <td>{check.serialNo}</td>
                          <td>{check.checkMethod}</td>
                          <td>{check.station}</td>
                          <td>{check.permissible}</td>
                          <td>{check.checkPoint}</td>
                          <td>{check.planTime}</td>
                          <td>{check.frequency}</td>
                          <td>{check.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Loading checksheet details...</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecksheetList;
