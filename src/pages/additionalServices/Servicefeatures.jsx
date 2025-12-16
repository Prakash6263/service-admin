import React from 'react'

const Servicefeatures = () => {
  return (
    <>
      
     <div className="page-wrapper mt-5">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Create Service Feature</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <a className="btn btn-primary" href="service-features.html">
                      <i className="fa fa-eye me-2" aria-hidden="true" />
                      View All
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-3">
                <div className="card-body">
                  <form>
                    <div className="form-group-item">
                      <div className="row">
                        <div className="input-block col-lg-6 mb-3">
                          <label className="form-control-label" htmlFor="role">
                            Service Name
                          </label>
                          <select
                            className="form-control select2"
                            data-placeholder="-- Select Service --"
                            dir=""
                            name="roles[]"
                            required=""
                          >
                            <option value="-- Select Service --">
                              --Select Service--
                            </option>
                            <option value="670e1e140231afbe1f371fba">
                              TT TRAVEL (sapna sangeeta road, tower square,
                              transport nagar, indore, madhya pradesh,
                              india,indore)
                            </option>
                            <option value="66fa2702a2fb86f91bee19e7">
                              MINER REPAIRS (pocharam,hyderabad)
                            </option>
                            <option value="664c44c67ed9f666206c530b">
                              ROAD SIDE ASSIT (RSA) (infosys sez campus, pocharam,
                              hyderabad, telangana, india,hyderabad)
                            </option>
                            <option value="663488abaecb817464f18c7d">
                              GENERAL SERVICE (infosys sez campus, pocharam,
                              hyderabad, telangana, india,hyderabad)
                            </option>
                            <option value="661acf9751d98a9a59f9e0e4">
                              ROAD SIDE ASSIT (RSA) (modi emarald park,hyderabad)
                            </option>
                            <option value="6613d24df205fe553f4481dc">
                              1 rupe (vijay nagar, indore, madhya pradesh,
                              india,indore)
                            </option>
                            <option value="660fd554c9c6826a5ecdcdce">
                              General sevices (vijay nagar, indore, madhya
                              pradesh, india,indore)
                            </option>
                            <option value="660c51b3c14f9b753f2a96f3">
                              GENERAL SERVICE (emarald park
                              annojiguda,secundrabad)
                            </option>
                            <option value="660ba497c14f9b753f2a9179">
                              ROAD SIDE ASSIT (RSA) (pocharam ,secundrabad)
                            </option>
                            <option value="659636a0ec0c893dfdf0ca7c">
                              GENERAL SERVICE (pocharam,secunderabad)
                            </option>
                          </select>
                        </div>
                        <div className="input-block col-lg-6 mb-3">
                          <label
                            className="form-control-label"
                            htmlFor="name_create"
                          >
                            Feature Name
                          </label>
                          <input
                            className="form-control"
                            id="name_create"
                            name="name"
                            placeholder="Feature Name"
                            type="text"
                            required=""
                            defaultValue=""
                          />
                        </div>
                        <div className="input-block col-lg-6 mb-3">
                          <label
                            className="form-control-label"
                            htmlFor="image_create"
                          >
                            Image
                          </label>
                          <input
                            className="form-control"
                            id="image_create"
                            name="images"
                            placeholder="Image link"
                            type="file"
                            required=""
                          />
                        </div>
                        <div className="input-block col-lg-12 mb-3">
                          <label
                            className="form-control-label"
                            htmlFor="description"
                          >
                            Description
                          </label>
                          <textarea
                            className="form-control"
                            placeholder="Description"
                            defaultValue={""}
                          />
                        </div>
                        <div className="input-block col-lg-12 mb-3">
                          <button
                            className="btn btn-primary mt-4 mb-5"
                            id="create_btn"
                            type="submit"
                          >
                            Create
                          </button>
                          <button
                            className="btn btn-danger mt-4 mb-5"
                            type="submit"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     
  </>
  
  )
}

export default Servicefeatures