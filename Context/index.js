import React, { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
//INTERNAL IMPORT
import {
  HANDLE_NETWORK_SWITCH,
  HEALTH_CARE_CONTARCT,
  PARSED_ERROR_MSG,
} from "./constants";

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //STATE VERIABLE
  const [address, setAddress] = useState();
  const [accountBalance, setAccountBalance] = useState(null);
  const [loader, setLoader] = useState(false);
  const [reCall, setReCall] = useState(0);
  const [currency, setCurrency] = useState(CURRENCY);
  const [openComponent, setOpenComponent] = useState("Home");
  const [registerDoctors, setRegisterDoctors] = useState();
  const [registeredPatient, setRegisteredPatient] = useState();

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  //CHECK WALLET CONNECT
  const CHECKI_IF_CONNECTED_LOAD = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");
      HANDLE_NETWORK_SWITCH();
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const getBalance = await provider.getBalance(accounts[0]);
        const bal = ethers.utils.formatEther(getBalance);

        setAccountBalance(bal);
        return accounts[0];
      } else {
        return "No account";
      }
    } catch (error) {
      return "not connected";
    }
  };

  //CONNECT WALLET
  const CONNECT_WALLET = async () => {
    try {
      if (!window.ethereum) return console.log("Install MateMask");
      await HANDLE_NETWORK_SWITCH();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const firstAccount = accounts[0];

      setAddress(firstAccount);
      return firstAccount;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    CHECKI_IF_CONNECTED_LOAD();
  }, []);

  ///REGISTER DOCTOR
  const ADD_DOCTOR = async (doctor) => {
    try {
      const {
        title,
        firstName,
        lastName,
        gender,
        degrer,
        yourAddress,
        designation,
        lastWork,
        mobile,
        emailID,
        collageName,
        collageID,
        joiningYear,
        endYear,
        specialization,
        registrationID,
        collageAddress,
        walletAddress,
        image,
        biography,
      } = doctor;
      if (
        !title ||
        !firstName ||
        !lastName ||
        !gender ||
        !degrer ||
        !yourAddress ||
        !designation ||
        !lastWork ||
        !mobile ||
        !emailID ||
        !collageName ||
        !collageID ||
        !joiningYear ||
        !endYear ||
        !specialization ||
        !registrationID ||
        !collageAddress ||
        !walletAddress ||
        !image ||
        !biography
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _fee = await contract.registrationDoctorFee();

        // Pass dummy IPFS URL as we removed Pinata
        const _IPFS_URL = "no-ipfs-data";

        const accountName = `${title} ${firstName} ${lastName}`;

        const _type = "Doctor";

        const transaction = await contract.ADD_DOCTOR(
          _IPFS_URL,
          walletAddress,
          accountName,
          _type,
          {
            value: _fee.toString(),
            gasLimit: ethers.utils.hexlify(800000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // DOCTOR APPROVE
  const APPROVE_DOCTOR_STATUS = async (_doctorId) => {
    try {
      if (!_doctorId) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations Approve is processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.APPROVE_DOCTOR_STATUS(
          Number(_doctorId),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations Approve conplete");
          setReCall(reCall + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPDATE_PATIENT_MEDICAL_HISTORY
  const UPDATE_PATIENT_MEDICAL_HISTORY = async (conditionUpdate) => {
    try {
      const { message, patientID } = conditionUpdate;
      if (!patientID || !message) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_PATIENT_MEDICAL_HISTORY(
          Number(patientID),
          message,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //COMPLETE APPOINMENT
  const COMPLETE_APPOINTMENT = async (_appointmentId) => {
    try {
      if (!_appointmentId) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.COMPLETE_APPOINTMENT(
          Number(_appointmentId),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //ADD DOCTOR NOTES FOR APPOINTMENT
  const ADD_DOCTOR_NOTES = async (notesData) => {
    try {
      const { appointmentId, notes } = notesData;
      if (!appointmentId || !notes) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Adding notes...");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.ADD_DOCTOR_NOTES(
          Number(appointmentId),
          notes,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Notes added successfully");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //------PATIENT-------

  ///ADD PATIENT
  const ADD_PATIENTS = async (patient) => {
    try {
      const {
        title,
        firstName,
        lastName,
        gender,
        medicialHistory,
        yourAddress,
        mobile,
        emailID,
        birth,
        walletAddress,
        image,
        message,
        city,
      } = patient;
      if (
        !title ||
        !firstName ||
        !lastName ||
        !gender ||
        !medicialHistory ||
        !yourAddress ||
        !mobile ||
        !emailID ||
        !birth ||
        !walletAddress ||
        !image ||
        !message ||
        !city
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _fee = await contract.registrationPatientFee();

        // Pass dummy IPFS URL as we removed Pinata
        const _IPFS_URL = "no-ipfs-data";

        const _type = "Patient";

        const transaction = await contract.ADD_PATIENTS(
          _IPFS_URL,
          [medicialHistory],
          walletAddress,
          _type,
          {
            value: _fee.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  ///BOOK APPOINTMENT
  const BOOK_APPOINTMENT = async (booking, bookingDoctor) => {
    try {
      const { from, to, appointmentDate, condition, message } = booking;
      console.log(from, to, appointmentDate, condition, message);
      const { accountAddress, title, firstName, lastName, doctorID } =
        bookingDoctor;

      if (
        !from ||
        !to ||
        !appointmentDate ||
        !condition ||
        !message ||
        !accountAddress
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _fee = await contract.appointmentFee();
        const _patientID = await contract.GET_PATIENT_ID(address);

        const transaction = await contract.BOOK_APPOINTMENT(
          _patientID.toNumber(),
          Number(doctorID),
          from,
          to,
          appointmentDate,
          condition,
          message,
          accountAddress,
          `${title} ${firstName} ${lastName}`,
          {
            value: _fee.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  ///CHAT
  const SEND_MESSAGE = async (activeChat, messageChat) => {
    try {
      const { name, userAddress } = activeChat;
      const { message } = messageChat;

      if (!message || !userAddress) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract._SEND_MESSAGE(
          userAddress,
          address,
          message,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall(reCall + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  //-----ADMIN--------

  //UPADTE REGSITRATION FEE
  const UPDATE_REGISTRATION_DOCTOR_FEE = async (_newFee) => {
    try {
      if (!_newFee) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_REGISTRATION_FEE(
          ethers.utils.parseEther(_newFee),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPADTE PATIENT_REGISTRATION FEE
  const UPDATE_REGISTRATION_PATIENT_FEE = async (_newFee) => {
    try {
      if (!_newFee) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_REGISTRATION_PATIENT_FEE(
          ethers.utils.parseEther(_newFee),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPDATE_ADMIN_ADDRESS
  const UPDATE_ADMIN_ADDRESS = async (_newAddress) => {
    try {
      if (!_newAddress) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_ADMIN_ADDRESS(_newAddress, {
          gasLimit: ethers.utils.hexlify(8000000),
        });

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        UPDATE_ADMIN_ADDRESS,
        UPDATE_REGISTRATION_PATIENT_FEE,
        UPDATE_REGISTRATION_DOCTOR_FEE,
        CHECKI_IF_CONNECTED_LOAD,
        CONNECT_WALLET,
        //ADD DOCOTR
        ADD_DOCTOR,
        APPROVE_DOCTOR_STATUS,
        ADD_PATIENTS,
        UPDATE_PATIENT_MEDICAL_HISTORY,
        BOOK_APPOINTMENT,
        COMPLETE_APPOINTMENT,
        ADD_DOCTOR_NOTES,
        SEND_MESSAGE,
        //VERIBALES
        notifySuccess,
        notifyError,
        setLoader,
        setAddress,
        setAccountBalance,
        setOpenComponent,
        openComponent,
        currency,
        address,
        loader,
        accountBalance,
        reCall,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
