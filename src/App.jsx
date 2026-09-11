import { useState, useEffect } from 'react'

import './App.css'

const App_URL = "https://sms-backend-production-ed63.up.railway.app";

function App() {
  const [students, setStudents] = useState([])
  const [fromdata, setFormData] = useState({
    name: "",
    email: "",
    course: ""
  })

  const [editId, setEditId] = useState(null)

  //tO READ THE STUDENT DATA  
  const getstudent = () => {
    fetch(`${App_URL}/student`)
      .then(response => response.json())
      .then(data => {
        setStudents(data)
      })
  };

  useEffect(() => {
    getstudent()
  }, [])

 
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(editId === null) {
      //Post Data = Add Student
      fetch(`${App_URL}/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fromdata)
    })
      .then(response => response.json())
      .then( data => {
        setStudents([...students, data])
        setFormData({
          name: "",
          email: "",
          course: ""
        })
      } 
      )
    }
    
    else{
      //Put Data = Edit Student Data
      fetch(`${App_URL}/student/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fromdata) //sends actual form data
      })
        .then(response => response.json())
        .then(data => {
          setStudents(
            students.map(student => student._id === editId ? data : student)
          )
          setFormData({
            name: "",
            email: "",
            course: ""
          })
          setEditId(null)
        })
    }
    
  }

  const hanldeChange = (e) =>{
    setFormData({
      ...fromdata,                    // ... spread operator
      [e.target.name]: e.target.value // name: Hassan, email: hassan@gmail.com
    })
  }

  const handleDelete = (id) => {

    const deleteStudent = confirm("Are you sure you want to delete the student data?")

    if(!deleteStudent){
      return
    }

    fetch(`${App_URL}/student/${id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(data => {
        setStudents(students.filter(student => student._id !== id))
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name='name' value={fromdata.name} placeholder='Enter your name'  onChange={hanldeChange} />
        <input type="text" name='email' value={fromdata.email} placeholder='Enter your email' onChange={hanldeChange} />
        <input type="text" name='course' value={fromdata.course} placeholder='Enter your course' onChange={hanldeChange}/>
        <button type='submit'>Add Student</button>
      </form>

      <h1>Student Management System</h1>
      { 
        students.map(student => (
          <div key={student._id}>
            <p>{student.name}</p>
            <p>{student.email}</p>
            <p>{student.course}</p>
            <button onClick={() => {
              setEditId(student._id)
              setFormData({
                name: student.name,
                email:  student.email,
                course: student.course
              })
            }}>Edit</button>
            <button onClick={() => handleDelete(student._id)}>Delete</button>
          </div>
        ))
      }
    </>
  )
}

export default App
