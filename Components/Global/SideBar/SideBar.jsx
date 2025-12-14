import React from "react";

//INTERNAL IMPORT
import {
  CgMenuGridR,
  FaUserAlt,
  SlCalender,
  FaArrowRightLong,
} from "../../ReactICON/index";
import Link from "./Link";

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

const SideBar = ({
  openComponent,
  setOpenComponent,
  user,
  setPatientDetails,
  userType,
  address,
}) => {
  return (
    <div className="deznav">
      <div className="deznav-scroll">
        <ul className="metismenu" id="menu">
          {address == ADMIN_ADDRESS.toLowerCase() && (
            <li>
              <a className="has-arrow ai-icon" aria-expanded="false">
                <i>
                  <CgMenuGridR />
                </i>
                <span
                  onClick={() => setOpenComponent("Home")}
                  className="nav-text"
                >
                  Dashboard
                </span>
              </a>
              <ul aria-expanded="false">
                <Link
                  name={"Patient"}
                  handleClick={() => setOpenComponent("Patient")}
                />
                <Link
                  name={"Doctor"}
                  handleClick={() => setOpenComponent("Doctor")}
                />
                <Link
                  name={"User"}
                  handleClick={() => setOpenComponent("User")}
                />
                <Link
                  name={"Update"}
                  handleClick={() => setOpenComponent("UpdateAdmin")}
                />
              </ul>
            </li>
          )}

          <li>
            <a className="has-arrow ai-icon" aria-expanded="false">
              <i>
                <FaUserAlt />
              </i>
              <span className="nav-text">Account</span>
            </a>
            <ul aria-expanded="false">
              <li>
                <a
                  onClick={() => {
                    if (userType === "Patient") {
                      setPatientDetails(user);
                      setOpenComponent("Profile");
                    } else {
                      setPatientDetails(user);
                      setOpenComponent("DoctorProfile");
                    }
                  }}
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    setOpenComponent("Notifications");
                  }}
                >
                  Notifications
                </a>
              </li>
              {userType == "Patient" && (
                <Link
                  name={"Medical History"}
                  handleClick={() => setOpenComponent("MedicialHistory")}
                />
              )}
            </ul>
          </li>
        </ul>
        <div className="plus-box">
          <p className="fs-16 font-w500 mb-1">Healthcare DApp</p>
          <p className="fs-12 font-w200">Secure Medical Records on Blockchain</p>
        </div>
        <div className="copyright">
          <p className="fs-14 font-w200">
            <strong className="font-w400">TBC Hospital Admin Dashboard</strong>©
            2023 All Rights Reserved
          </p>
          <p className="fs-12">
            Made by @me ai
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
