import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";

import Healthcare from "./Healthcare.json";

const HEALTH_CARE_ABI = Healthcare.abi;
const HEALTH_CARE_ADDRESS = process.env.NEXT_PUBLIC_HEALTH_CARE;

//ADMIN
const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
const NETWORK = process.env.NEXT_PUBLIC_NETWORK;

//NETWORK
const networks = {
  holesky: {
    chainId: `0x${Number(17000).toString(16)}`,
    chainName: "Holesky",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/eth_holesky"],
    blockExplorerUrls: ["https://holesky.etherscan.io/"],
  },
  polygon_amoy: {
    chainId: `0x${Number(80002).toString(16)}`,
    chainName: "Polygon Amoy",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-amoy.polygon.technology/"],
    blockExplorerUrls: ["https://www.oklink.com/amoy"],
  },
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/polygon"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/bsc"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  base_mainnet: {
    chainId: `0x${Number(8453).toString(16)}`,
    chainName: "Base Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.base.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  base_sepolia: {
    chainId: `0x${Number(84532).toString(16)}`,
    chainName: "Base Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.base.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  localhost: {
    chainId: `0x${Number(1337).toString(16)}`,
    chainName: "localhost",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
};

const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    const network = await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName],
        },
      ],
    });
    return network;
  } catch (err) {
    console.log(err.message);
  }
};

export const HANDLE_NETWORK_SWITCH = async () => {
  const networkName = NETWORK;
  const network = await changeNetwork({ networkName });
  return network;
};

export const SHORTEN_ADDRESS = (address) =>
  `${address?.slice(0, 8)}...${address?.slice(address.length - 4)}`;

export const PARSED_ERROR_MSG = (e) => {
  const json = JSON.parse(JSON.stringify(e));
  return json?.reason || json?.error?.message;
};

export function CONVERT_TIMESTAMP_TO_READABLE(timeStamp) {
  const date = new Date(timeStamp * 1000);

  const readableTime = date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return readableTime;
}

//HELPER to fetch IPFS data safely
const fetchIPFSData = async (ipfsUrl) => {
  try {
    if (!ipfsUrl || ipfsUrl === "no-ipfs-data") return {};
    const response = await axios.get(ipfsUrl);
    return response.data || {};
  } catch (error) {
    console.log("Error fetching IPFS data", error);
    return {};
  }
};

//CONTRACT

//---FETCHING SMART CONTRACT
const FETCH_CONTRACT = (address, abi, signer) =>
  new ethers.Contract(address, abi, signer);

export const HEALTH_CARE_CONTARCT = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const contract = FETCH_CONTRACT(HEALTH_CARE_ADDRESS, HEALTH_CARE_ABI, signer);
  return contract;
};

//CONTRACT FUNCTIONS
export const CHECKI_IF_CONNECTED = async () => {
  if (!window.ethereum) return "Install MetaMask";
  const network = await HANDLE_NETWORK_SWITCH();
  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  });
  if (accounts.length) {
    return accounts[0];
  } else {
    return "No account";
  }
};

//----DOCTORS----

//GET ALL APPROVE DOCTORS
export const GET_ALL_APPROVE_DOCTORS = async () => {
  const contract = await HEALTH_CARE_CONTARCT();

  const doctors = await contract.GET_ALL_APPROVED_DOCTORS();

  const _doctorsArray = await Promise.all(
    doctors.map(
      async ({
        id,
        IPFS_URL,
        accountAddress,
        appointmentCount,
        successfulTreatmentCount,
        isApproved,
      }) => {
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
        } = await fetchIPFSData(IPFS_URL);

        return {
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
          doctorID: id.toNumber(),
          IPFS_URL,
          accountAddress,

        }
    )
  );
  return _doctorsArray;
};

//GET REGISTER DOCTORS
export const GET_ALL_REGISTERED_DOCTORS = async () => {
  const contract = await HEALTH_CARE_CONTARCT();

  const doctors = await contract.GET_ALL_REGISTERED_DOCTORS();

  const _doctorsArray = await Promise.all(
    doctors.map(
      async ({
        id,
        IPFS_URL,
        accountAddress,
        appointmentCount,
        successfulTreatmentCount,
        isApproved,
      }) => {
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
        } = await fetchIPFSData(IPFS_URL);

        return {
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
          doctorID: id.toNumber(),
          IPFS_URL,
          accountAddress,

          isApproved,
        };
      }
    )
  );

  return _doctorsArray;
};

///GET DOCTOR APPOINMENTS HISTORY
export const GET_DOCTOR_APPOINTMENTS_HISTORYS = async (_doctorID) => {
  const contract = await HEALTH_CARE_CONTARCT();

  const appointments = await contract.GET_DOCTOR_APPOINTMENTS_HISTORYS(
    _doctorID
  );

  const _appointmentArray = Promise.all(
    appointments.map(
      async ({
        id,
        patientId,
        doctorId,
        date,
        from,
        to,
        appointmentDate,
        condition,
        message,
        isOpen,
      }) => {
        const patient = await GET_PATIENT_DETAILS(patientId);
        // Get doctor notes if available
        let doctorNotes = "";
        try {
          doctorNotes = await contract.appointmentDoctorNotes(id.toNumber());
          if (doctorNotes && doctorNotes.length > 0) {
            doctorNotes = doctorNotes;
          } else {
            doctorNotes = "";
          }
        } catch (error) {
          console.log("Error fetching doctor notes:", error);
          doctorNotes = "";
        }
        return {
          appoinmnetID: id.toNumber(),
          doctorNotes: doctorNotes,
          patientId: patientId.toNumber(),
          doctorId: doctorId.toNumber(),
          date: CONVERT_TIMESTAMP_TO_READABLE(date.toNumber()),
          isOpen: isOpen,
          from: from,
          to: to,
          appointmentDate: appointmentDate,
          condition: condition,
          message: message,
          patient,
          ...patient,
        };
      }
    )
  );

  return _appointmentArray;
};

//GET BEST DOCTOR
export const GET_MOST_POPULAR_DOCTOR = async () => {
  const contract = await HEALTH_CARE_CONTARCT();

  const doctor = await contract.GET_MOST_POPULAR_DOCTOR();

  const result = {
    name: doctor.name,
    image: doctor.image,
    accountAddress: doctor.accountAddress,
    id: doctor.id.toNumber(),
    specialization: doctor.specialization,

    isApproved: doctor.isApproved,
  };

  return result;
};

//GET DOCTORS DETAILS
export const GET_DOCTOR_DETAILS = async (_doctorId) => {
  const contract = await HEALTH_CARE_CONTARCT();

  const doctor = await contract.GET_DOCTOR_DETAILS(Number(_doctorId));

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
  } = await fetchIPFSData(doctor.IPFS_URL);

  const doctorDetails = {
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
    IPFS_URL: doctor.IPFS_URL,
    accountAddress: doctor.accountAddress,
    doctorID: doctor.id.toNumber(),

    isApproved: doctor.isApproved,
  };
  return doctorDetails;
};

//GET DOCTOR ID DETAILS
export const GET_DOCTOR_ID = async (_doctorAddress) => {
  const contract = await HEALTH_CARE_CONTARCT();

  const doctor = await contract.GET_DOCTOR_ID(_doctorAddress);

  return doctor.toNumber();
};

//CHECK DOCTOR ALREADY REGISTER
export const CHECK_DOCTOR_REGISTERATION = async (_doctorAddress) => {
  if (!_doctorAddress) return console.log("Data Missing");

  const contract = await HEALTH_CARE_CONTARCT();

  const doctor = await contract.GET_DOCTOR_ID(_doctorAddress);

  const doctorDetail = await GET_DOCTOR_DETAILS(doctor?.toNumber());
  return doctorDetail;
};

//----END OF DOCTORS------

//----PATIENTS-----------

//GET REGISTER PATIENTS
export const GET_ALL_REGISTERED_PATIENTS = async () => {
  const contract = await HEALTH_CARE_CONTARCT();

  const patients = await contract.GET_ALL_REGISTERED_PATIENTS();

  const _patientsArray = await Promise.all(
    patients.map(async ({ id, IPFS_URL, medicalHistory, accountAddress }) => {
      const {
        title,
        firstName,
        lastName,
        gender,
        yourAddress,
        mobile,
        emailID,
        birth,
        doctorAddress,
        walletAddress,
        image,
        message,
        city,
      } = await fetchIPFSData(IPFS_URL);

      return {
        title,
        firstName,
        lastName,
        gender,
        yourAddress,
        mobile,
        emailID,
        birth,
        doctorAddress,
        walletAddress,
        image,
        message,
        city,
        patientID: id.toNumber(),
        IPFS_URL,
        medicalHistory,
        accountAddress,
      };
    })
  );
  return _patientsArray;
};

//GET PATIENT APPOINMENT
export const GET_PATIENT_APPOINTMENT = async (_appointmentId) => {
  const contract = await HEALTH_CARE_CONTARCT();

  const appointments = await contract.GET_PATIENT_APPOINTMENT(
    Number(_appointmentId)
  );

  const _appointment = {
    id: appointments.id.toNumber(),
    patientId: appointments.patientId.toNumber(),
    doctorId: appointments.doctorId.toNumber(),
    date: appointments.date.toNumber(),
  };

  return _appointment;
};

///GET ALL PATIENT APPOINMENT HISTORY
export const GET_PATIENT_APPOINTMENT_HISTORYS = async (_patientID) => {
  const contract = await HEALTH_CARE_CONTARCT();

  const appointments = await contract.GET_PATIENT_APPOINTMENT_HISTORYS(
    Number(_patientID)
  );

  console.log(appointments);

  const _appointmentArray = Promise.all(
    appointments.map(
      async ({
        id,
        patientId,
        doctorId,
        date,
        from,
        to,
        appointmentDate,
        condition,
        message,
        isOpen,
      }) => {
        console.log(id.toNumber());
        const doctor = await GET_DOCTOR_DETAILS(doctorId.toNumber());
        // Get doctor notes if available
        let doctorNotes = "";
        try {
          doctorNotes = await contract.appointmentDoctorNotes(id.toNumber());
          if (doctorNotes && doctorNotes.length > 0) {
            doctorNotes = doctorNotes;
          } else {
            doctorNotes = "";
          }
        } catch (error) {
          console.log("Error fetching doctor notes:", error);
          doctorNotes = "";
        }
        return {
          appointmentID: id.toNumber(),
          patientId: patientId.toNumber(),
          doctorId: doctorId.toNumber(),
          date: CONVERT_TIMESTAMP_TO_READABLE(date.toNumber()),
          from: from,
          to: to,
          appointmentDate: appointmentDate,
          condition: condition,
          message: message,
          doctorNotes: doctorNotes,
          doctor,
          isOpen,
        };
      }
    )
  );

  return _appointmentArray;
};

//GET PATIENT DETAILS
export const GET_PATIENT_DETAILS = async (_patientId) => {
  const contract = await HEALTH_CARE_CONTARCT();

  const patient = await contract.GET_PATIENT_DETAILS(Number(_patientId));

  const {
    title,
    firstName,
    lastName,
    gender,
    yourAddress,
    mobile,
    emailID,
    birth,
    doctorAddress,
    walletAddress,
    image,
    message,
    city,
  } = await fetchIPFSData(patient.IPFS_URL);

  const patientDetails = {
    patientID: patient.id.toNumber(),
    IPFS_URL: patient.IPFS_URL,
    medicalHistory: patient.medicalHistory,
    accountAddress: patient.accountAddress,
    title,
    firstName,
    lastName,
    gender,
    yourAddress,
    mobile,
    emailID,
    birth,
    doctorAddress,
    walletAddress,
    image,
    message,
    city,
  };
  return patientDetails;
};

//GET PATIENT ID DETAILS
export const GET_PATIENT_ID = async () => {
  const address = await CHECKI_IF_CONNECTED();
  const contract = await HEALTH_CARE_CONTARCT();

  if (address) {
    const patient = await contract.GET_PATIENT_ID(address);

    return patient.toNumber();
  }
};

//CHECK PATIENT ALREADY REGISTER
export const CHECK_PATIENT_REGISTERATION = async (_patientAddress) => {
  if (!_patientAddress) return console.log("Data Missing");

  const contract = await HEALTH_CARE_CONTARCT();

  const patient = await contract.GET_PATIENT_ID(_patientAddress);
  const patientDetail = await GET_PATIENT_DETAILS(patient.toNumber());

  return patientDetail;
};

//GET DOCTOR NOTES FOR APPOINTMENT
export const GET_DOCTOR_NOTES = async (_appointmentId) => {
  const contract = await HEALTH_CARE_CONTARCT();
  try {
    const notes = await contract.GET_DOCTOR_NOTES(Number(_appointmentId));
    return notes;
  } catch (error) {
    console.log("Error getting doctor notes:", error);
    return "";
  }
};

//GET MEDICAL HISTORY
export const GET_PATIENT_MEDICIAL_HISTORY = async (_patientID) => {
  const contract = await HEALTH_CARE_CONTARCT();

  const history = await contract.GET_PATIENT_MEDICIAL_HISTORY(_patientID);

  return history;
};

//-----END OF PATIENTS

//GET USERNAME TYPE
export const GET_USERNAME_TYPE = async (_userAddress) => {
  if (!_userAddress) return console.log("No Address");

  const contract = await HEALTH_CARE_CONTARCT();

  const user = await contract.GET_USERNAME_TYPE(_userAddress);

  const _userDetail = {
    name: user.name,
    userType: user.userType,
  };

  return _userDetail;
};

//GET ALL APP USERS
export const GET_ALL_APP_USER = async () => {
  const contract = await HEALTH_CARE_CONTARCT();

  const users = await contract.GET_ALL_APP_USER();

  const _userArray = await Promise.all(
    users.map(async ({ accountAddress, name }) => {
      return {
        accountAddress: accountAddress,
        name: name,
      };
    })
  );
  return _userArray;
};

//GET NOTIFICATIONS
export const GET_NOTIFICATION = async (_address) => {
  const contract = await HEALTH_CARE_CONTARCT();

  const notifications = await contract.GET_NOTIFICATIONS(_address);

  const _notificationArray = await Promise.all(
    notifications.map(
      async ({ id, userAddress, message, timestamp, categoryType }) => {
        return {
          notificationId: id.toNumber(),
          userAddress: SHORTEN_ADDRESS(userAddress),
          message: message,
          date: CONVERT_TIMESTAMP_TO_READABLE(timestamp.toNumber()),
          categoryType: categoryType,
        };
      }
    )
  );
  return _notificationArray;
};

//GET FEES
export const GET_FEE = async () => {
  const contract = await HEALTH_CARE_CONTARCT();

  const _doctorFee = await contract.registrationDoctorFee();
  const _patientFee = await contract.registrationPatientFee();
  const _admin = await contract.admin();

  const fee = {
    doctorFee: ethers.utils.formatUnits(_doctorFee, "ether"),
    patientFee: ethers.utils.formatUnits(_patientFee, "ether"),
    admin: SHORTEN_ADDRESS(_admin),
  };

  return fee;
};
