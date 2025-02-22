import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [parentDetails, setParentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchParentDetails = async (parentId) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!parentId) {
        setError('No parent ID available');
        return;
      }

      const response = await axios.get(`/api/parent/${parentId}`);
      setParentDetails(response.data);
    } catch (error) {
      console.error('Error fetching parent details:', error);
      setError('Failed to fetch parent details');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    if (student?.parentId) {
      fetchParentDetails(student.parentId);
    } else {
      setParentDetails(null); // Clear parent details if no parent ID
    }
  };

  return (
    <div>
      {/* Your existing classroom content */}
      
      {/* Student details section */}
      {selectedStudent && (
        <div>
          <h3>Student Details</h3>
          <p>Name: {selectedStudent.name}</p>
          {/* Other student details */}
          
          {/* Parent details section */}
          {loading && <p>Loading parent details...</p>}
          {error && <p className="error">{error}</p>}
          {parentDetails && (
            <div>
              <h4>Parent Details</h4>
              <p>Name: {parentDetails.name}</p>
              {/* Other parent details */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TeacherPage;