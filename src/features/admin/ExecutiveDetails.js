import React, { useState} from "react";
import img2 from '../../assets/img3.jpg'
import SidebarToggle from "./SidebarToggle";


const ExecutiveDetails = () => {
    const people = [
        {
          id: 1,
          image: img2,
          name: 'Alice Johnson',
          profession: 'Team Lead',
          technology: 'React, JavaScript, CSS',
          emailId: 'alice.johnson@example.com',
          country: 'USA',
          city: 'New York'
        },
        {
          id: 2,
          image: img2,
          name: 'Bob Smith',
          profession: 'Backend Developer',
          technology: 'Node.js, Express, MongoDB',
          emailId: 'bob.smith@example.com',
          country: 'USA',
          city: 'San Francisco'
        },
        {
          id: 3,
          image: img2,
          name: 'Charlie Brown',
          profession: 'Fullstack Developer',
          technology: 'React, Node.js, AWS',
          emailId: 'charlie.brown@example.com',
          country: 'Canada',
          city: 'Toronto'
        },
        {
          id: 4,
          image: img2,
          name: 'Diana Prince',
          profession: 'Frontend Developer',
          technology: 'React, JavaScript, CSS',
          emailId: 'diana.prince@example.com',
          country: 'UK',
          city: 'London'
        },
        {
          id: 5,
          image: img2,
          name: 'Evan Stone',
          profession: 'Backend Developer',
          technology: 'Node.js, Express, MongoDB',
          emailId: 'evan.stone@example.com',
          country: 'Australia',
          city: 'Sydney'
        },
        {
          id: 6,
          image: img2,
          name: 'Fiona Green',
          profession: 'Fullstack Developer',
          technology: 'React, Node.js, AWS',
          emailId: 'fiona.green@example.com',
          country: 'India',
          city: 'Bangalore'
        },
        {
          id: 7,
          image: img2,
          name: 'George White',
          profession: 'Frontend Developer',
          technology: 'HTML, CSS, JavaScript',
          emailId: 'george.white@example.com',
          country: 'Germany',
          city: 'Berlin'
        },
        {
          id: 8,
          image: img2,
          name: 'Hannah Black',
          profession: 'Backend Developer',
          technology: 'Python, Django, PostgreSQL',
          emailId: 'hannah.black@example.com',
          country: 'France',
          city: 'Paris'
        }
      
      ];
      
      
    const [filter, setFilter] = useState('All');
    const [viewMode, setViewMode] = useState('grid');

  const filteredPeople = people.filter((person) => {
    if (filter === 'All') return true;
    if (filter === 'Team Lead') return person.profession.includes('Team Lead');
    return true;
  });
    
      

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar Toggle */}
      <SidebarToggle />
  <div  >
    <h1 style={{textAlign:"center",padding:"20px"
    }}>Executive Details</h1>
  <div className="filter-buttons">
    <button onClick={() => setFilter('All')}>All</button>
    <button onClick={() => setFilter('Team Lead')}>Team Lead</button>
    <div  >
  <button
    onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
    
  >
    {viewMode === 'grid' ? 'Table View' : 'Grid View'}
  </button>
</div>
  </div>
{viewMode === 'grid' ? (
        <div className="boxes-container">
          {filteredPeople.map((person) => (
            <div key={person.id} className="box1">
              <img src={person.image} alt={person.name} className="avatar" />
              <div className="text-content">
               
                <div>
                <span className="field-value"> User Id:</span>
                <span className="field-value"> {person.id}</span></div>
                
                <span className="field-value"> {person.name}</span>
                <span className="field-value"> {person.emailId}</span>
                <span className="field-value"> {person.profession}</span>
<span className="field-value"> {person.country}</span>
<span className="field-value"> {person.city}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="people-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>UserID</th>
              <th>Profession</th>
              <th>Technology</th>
              <th>Email ID</th>
              <th>City</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map((person) => (
              <tr key={person.id}>
                <td>
                  <img src={person.image} alt={person.name} className="avatar-small" />
                </td>
                <td>{person.name}</td>
                <td>{person.id}</td>
                <td>{person.profession}</td>
                <td>{person.technology}</td>
                <td>{person.emailId}</td>
                <td>{person.city}</td>
                <td>{person.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    <div className="invoice-pagination">
        <span className="invoice-page-nav">« Prev</span>
        <span>Page 1 of 5</span>
        <span className="invoice-page-nav">Next »</span>
      </div>
    </div>
    </div>
  );
};

export default ExecutiveDetails;
