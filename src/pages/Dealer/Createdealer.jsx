import { useNavigate } from 'react-router-dom'
import DealerForm from '../../components/Dealers/DealerForm'

const Dealer = () => {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header">
                        <h5>Create Dealer</h5>
                        <button className="btn" style={{ backgroundColor: "black", color: "white" }} onClick={() => navigate(-1)}>
                            <i className="fas fa-arrow-left me-2"></i> Back
                        </button>
                    </div>
                </div>
                <DealerForm />
            </div>
        </div>
    )
}

export default Dealer;