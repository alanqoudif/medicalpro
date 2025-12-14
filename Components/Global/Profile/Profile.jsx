import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

//INTERNAL IMPORT
import Header from "./Header";
import {
  DoctorDetails2,
  DoctorDetails1,
  DoctorDetails3,
  DoctorDetails4,
  DoctorDetails5,
  Profile1,
} from "../../SVG/index";
import {
  FaStethoscope,
  TiSocialTwitter,
  TiSocialFacebook,
  TiSocialLinkedin,
} from "../../ReactICON/index";
import { FaRegCopy } from "../../ReactICON/index";
import {
  SHORTEN_ADDRESS,
  CHECK_DOCTOR_REGISTERATION,
} from "../../../Context/constants";
import Card from "./Card";

const Profile = ({ user, setOpenComponent, setDoctorDetails }) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const [doctor, setDoctor] = useState();

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess("Copied successfully");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.doctorAddress) {
          CHECK_DOCTOR_REGISTERATION(user.doctorAddress).then((doctor) => {
            setDoctor(doctor);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="container-fluid">
      <Header
        user={user}
        doctor={doctor}
      />
      <div className="row">
        <div className="col-xl-6 col-xxl-8">
          <div className="card">
            <div className="card-body">
              <div className="media d-sm-flex d-block text-center text-sm-start pb-4 mb-4 border-bottom">
                <img
                  alt="image"
                  className="rounded me-sm-4 me-0"
                  width={130}
                  src={user?.image || "images/users/pic1.jpg"}
                />
                <div className="media-body align-items-center">
                  <div className="d-sm-flex d-block justify-content-between my-3 my-sm-0">
                    <div>
                      <h3 className="fs-22 text-black font-w600 mb-0">
                        {user?.title} {user?.firstName} {user?.lastName}
                        {!user?.firstName && `Patient #${user?.patientID}`}
                      </h3>
                      <p className="mb-2 mb-sm-2">
                        {SHORTEN_ADDRESS(user?.walletAddress)}{" "}
                        <a onClick={() => copyText(user?.walletAddress)}>
                          {" "}
                          <FaRegCopy />
                        </a>
                      </p>
                    </div>
                    <span>#P00-{user?.patientID}</span>
                  </div>
                  <a
                    href="javascript:void(0);"
                    className="btn btn-primary light btn-rounded mb-2 me-2"
                  >
                    <DoctorDetails1 />
                    {user?.gender || "N/A"}
                  </a>
                  <a
                    href="javascript:void(0);"
                    className="btn btn-primary light btn-rounded mb-2"
                  >
                    <DoctorDetails2 />
                    {user?.city || "N/A"}
                  </a>
                </div>
              </div>
              <div className="row">
                <Card
                  icon={<DoctorDetails3 />}
                  title={"Address"}
                  name={user?.yourAddress || "N/A"}
                />
                <Card
                  icon={<DoctorDetails4 />}
                  title={"Phone"}
                  name={user?.mobile || "N/A"}
                />
                <Card
                  icon={<DoctorDetails5 />}
                  title={"EmailID"}
                  name={user?.emailID || "N/A"}
                />
                <Card
                  icon={<DoctorDetails3 />}
                  title={"Date of Birth "}
                  name={user?.birth || "N/A"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-md-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="fs-20 font-w600">Medical History</h4>
            </div>
            <div className="card-body">
              <div className="widget-timeline-icon2">
                <ul className="timeline">
                  {user?.medicalHistory && user.medicalHistory.length > 0 ? (
                    user.medicalHistory.map((item, index) => (
                      <li key={index}>
                        <div className="icon bg-primary">
                          <i className="las">
                            <FaStethoscope />
                          </i>
                        </div>
                        <a
                          className="timeline-panel text-muted"
                          href="javascript:void(0);"
                        >
                          <h4 className="mb-2 mt-1">{item}</h4>
                        </a>
                      </li>
                    ))
                  ) : (
                    <p>No medical history available.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-xxl-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="fs-20 font-w600">Assigned Doctor</h4>
            </div>
            <div className="card-body">
              <div className="media d-sm-flex text-sm-start d-block text-center">
                <img
                  alt="image"
                  className="rounded me-sm-4 me-0 mb-2 mb-sm-0"
                  width={130}
                  src={doctor?.image || "images/doctors/1.jpg"}
                />
                <div className="media-body">
                  <h3 className="fs-22 text-black font-w600 mb-0">
                    Dr.{doctor?.title} {doctor?.firstName} {doctor?.lastName}
                    {!doctor?.firstName && doctor?.doctorID && `DR. #${doctor?.doctorID}`}
                  </h3>
                  <p className="text-primary">{doctor?.specialization}</p>

                </div>
                <div className="text-center">
                  <span
                    onClick={() => (
                      setDoctorDetails(doctor),
                      setOpenComponent("DoctorDetails")
                    )}
                    className="num"
                    style={{ cursor: "pointer" }}
                  >
                    View
                  </span>
                </div>
              </div>
              <p>{doctor?.biography ? doctor.biography.slice(0, 300) + ".." : "No biography available."}</p>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-xxl-6">
          <div className="card patient-detail">
            <div className="card-header border-0 pb-0">
              <h4 className="fs-20 font-w600 text-white">
                About {user?.title} {user?.firstName} {user?.lastName}
              </h4>
              <a href="javascript:void(0);">
                <Profile1 />
              </a>
            </div>
            <div className="card-body fs-14 font-w300">{user?.message || "No specific details."}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
