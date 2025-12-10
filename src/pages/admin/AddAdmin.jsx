import { useNavigate } from 'react-router-dom'
import CreateForm from '../../components/Admin/AddAdmin/CreateForm'
const AddAdmin = () => {
  const navigate = useNavigate();
  return (
    <>

      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Create Admin</h5>
              <button className="btn" style={{backgroundColor:"black",color:"white"}} onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left me-2"></i> Back
              </button>
            </div>
          </div>
          <CreateForm />
        </div>
      </div>

    </>

  )
}

export default AddAdmin