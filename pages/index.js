import React, { useState, useEffect } from "react";

//INTERNAL IMPRORT
import {
  Header,
  NavHeader,
  SideBar,
  Preloader,
  Home,
  Patient,
  Doctor,
  Profile,
  DoctorProfile,
  DoctorDetails,
  AllAppoinments,
  PatientProfile,
  User,
  AddDoctor,
  AddPatient,
  Auth,
  MedicialHistory,
  Notifications,
  Loader,
  UpdateAdmin,
} from "../Components/Global/index";

import {
  CHECK_PATIENT_REGISTERATION,
  CHECK_DOCTOR_REGISTERATION,
  GET_ALL_APPROVE_DOCTORS,
  GET_ALL_REGISTERED_PATIENTS,
  GET_USERNAME_TYPE,
  PARSED_ERROR_MSG,
  SHORTEN_ADDRESS,
  GET_NOTIFICATION,
} from "../Context/constants";

import { useStateContext } from "../Context/index";

const index = () => {
  const {
    address,
    setAddress,
    SEND_MESSAGE,
    reCall,
    loader,
    setOpenComponent,
    openComponent,
    notifySuccess,
    notifyError,
    accountBalance,
    currency,
  } = useStateContext();

  const [user, setUser] = useState();
  const [registerDoctors, setRegisterDoctors] = useState();
  const [registeredPatient, setRegisteredPatient] = useState();
  const [userType, setUserType] = useState();
  const [checkRegistration, setCheckRegistration] = useState();
  const [addDocotr, setAddDocotr] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [authComponent, setAuthComponent] = useState(true);
  const [doctorDetails, setDoctorDetails] = useState();
  const [patientDetails, setPatientDetails] = useState();
  const [invoic, setInvoic] = useState();
  const [notifications, setNotifications] = useState();
  const [notificationCount, setNotificationCount] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (address) {
          setAuthComponent(false);

          GET_NOTIFICATION(address).then((notification) => {
            const reversedArray = [...notification].reverse();
            setNotifications(reversedArray);

            if (reversedArray?.length) {
              let NOTIFICATION = 0;
              const ALL_NOTIFICATION = localStorage.getItem("ALL_NOTIFICATION");
              if (ALL_NOTIFICATION) {
                NOTIFICATION = JSON.parse(
                  localStorage.getItem("ALL_NOTIFICATION")
                );
                setNotificationCount(reversedArray?.length - NOTIFICATION);
              } else {
                setNotificationCount(reversedArray?.length);
              }
            }
          });

          //CALLING DATA

          GET_ALL_APPROVE_DOCTORS().then((doctors) => {
            setRegisterDoctors(doctors);
          });

          GET_ALL_REGISTERED_PATIENTS().then((patients) => {
            setRegisteredPatient(patients);
          });

          const checkUserType = await GET_USERNAME_TYPE(address);

          if (checkUserType?.userType == "Doctor") {
            setOpenComponent("DoctorProfile");
            setUserType("Doctor");
            const doctor = await CHECK_DOCTOR_REGISTERATION(address);
            setUser(doctor);
          } else {
            const patient = await CHECK_PATIENT_REGISTERATION(address);

            setUser(patient);
            setOpenComponent("Profile");
            setUserType("Patient");
          }
        }
      } catch (error) {
        const ErrorMsg = PARSED_ERROR_MSG(error);
        console.log(ErrorMsg);
        if (ErrorMsg == "User is not registered") {
          setAuthComponent(true);
        }
        notifyError(ErrorMsg);
      }
    };

    fetchData();
  }, [address, reCall]);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
        notifySuccess("Connected successfully");
      } catch (error) {
        notifyError("Error connecting to MetaMask:");
      }
    } else {
      notifyError("MetaMask is not installed.");
    }
  };

  return (
    <>
      <Preloader />
      <div id="main-wrapper">
        <NavHeader />

        <Header
          user={user}
          setAddress={setAddress}
          setOpenComponent={setOpenComponent}
          setPatientDetails={setPatientDetails}
          setDoctorDetails={setDoctorDetails}
          userType={userType}
          checkRegistration={checkRegistration}
          notifications={notifications}
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
        />
        <SideBar
          setOpenComponent={setOpenComponent}
          openComponent={openComponent}
          user={user}
          setPatientDetails={setPatientDetails}
          userType={userType}
          address={address}
        />
        <div className="content-body">
          {openComponent == "Home" ? (
            <Home
              setPatientDetails={setPatientDetails}
              setOpenComponent={setOpenComponent}
              registerDoctors={registerDoctors}
              registeredPatient={registeredPatient}
              notifications={notifications}
              setDoctorDetails={setDoctorDetails}
              accountBalance={accountBalance}
              currency={currency}
            />
          ) : openComponent == "Patient" ? (
            <Patient
              setPatientDetails={setPatientDetails}
              setOpenComponent={setOpenComponent}
            />
          ) : openComponent == "Doctor" ? (
            <Doctor
              setOpenComponent={setOpenComponent}
              setDoctorDetails={setDoctorDetails}
            />
          ) : openComponent == "All Appoinments" ? (
            <AllAppoinments
              setDoctorDetails={setDoctorDetails}
              setOpenComponent={setOpenComponent}
              setPatientDetails={setPatientDetails}
            />
          ) : openComponent == "Notifications" ? (
            <Notifications
              notifications={notifications}
              setOpenComponent={setOpenComponent}
            />
          ) : openComponent == "Profile" ? (
            <Profile
              user={user}
              setOpenComponent={setOpenComponent}
              setDoctorDetails={setDoctorDetails}
            />
          ) : openComponent == "PatientProfile" ? (
            <PatientProfile
              patientDetails={patientDetails}
              setOpenComponent={setOpenComponent}
              setDoctorDetails={setDoctorDetails}
            />
          ) : openComponent == "DoctorProfile" ? (
            <DoctorProfile
              setPatientDetails={setPatientDetails}
              setOpenComponent={setOpenComponent}
              user={user}
            />
          ) : openComponent == "DoctorDetails" ? (
            <DoctorDetails
              setPatientDetails={setPatientDetails}
              setOpenComponent={setOpenComponent}
              doctorDetails={doctorDetails}
            />
          ) : openComponent == "MedicialHistory" ? (
            <MedicialHistory setOpenComponent={setOpenComponent} />
          ) : openComponent == "User" ? (
            <User setOpenComponent={setOpenComponent} />
          ) : openComponent == "UpdateAdmin" ? (
            <UpdateAdmin setOpenComponent={setOpenComponent} />
          ) : (
            ""
          )}
        </div>
      </div>
      {authComponent && (
        <Auth
          setAddDocotr={setAddDocotr}
          setAddPatient={setAddPatient}
          address={address}
          connectMetaMask={connectMetaMask}
          SHORTEN_ADDRESS={SHORTEN_ADDRESS}
        />
      )}

      {addDocotr && <AddDoctor setAddDocotr={setAddDocotr} />}
      {addPatient && (
        <AddPatient
          setAddPatient={setAddPatient}
          registerDoctors={registerDoctors}
        />
      )}
      {loader && <Loader />}
    </>
  );
};

export default index;
