// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Healthcare {
    
    struct Doctor {
        uint id;
        string IPFS_URL;  
        address accountAddress;
        uint successfulTreatmentCount;
        bool isApproved;
    }

    struct Patient {
        uint id;
        string IPFS_URL; 
        string[] medicalHistory; 
        address accountAddress;
    }

    struct Notification {
        uint id;
        address userAddress;
        string message;
        uint timestamp;
        string categoryType;
    }

    mapping(address => Notification[]) private notifications;
    mapping(uint => Doctor) public doctors;
    mapping(uint => Patient) public patients;
    mapping(address => bool) public registeredDoctors;
    mapping(address => bool) public registeredPatients;

    uint public doctorCount;
    uint public patientCount;

    address payable public admin;
    uint public registrationDoctorFee = 0.0025 ether;
    uint public registrationPatientFee = 0.00025 ether;
  

    //DOCTOR
     event DOCTOR_REGISTERED(uint id, string IPFS_URL, address accountAddress);
     event APPROVE_DOCTOR_STATUSD(uint id, bool isApproved);
    //END DOCTOR

   //PATIENTS
    event PATIENT_ADDED(uint id, string _IPFS_URL, string[] medicalHistory);
    event NOTIFICATiON_SENT(address indexed user, string message, uint timestamp);
   //END PATIENTS

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyDoctor() {
        require(registeredDoctors[msg.sender], "Only registered doctors can perform this action");
        _;
    }

    constructor() {
        admin = payable(msg.sender);
    }

    //NOTIFICATIOn
    function ADD_NOTIFICATION(address _userAddress, string memory _message, string memory _type) internal {
        Notification memory newNotification = Notification({
            id: notifications[_userAddress].length,
            userAddress: _userAddress,
            message: _message,
            timestamp: block.timestamp,
            categoryType: _type
        });

        notifications[_userAddress].push(newNotification);
        emit NOTIFICATiON_SENT(_userAddress, _message, block.timestamp);
    }

    function GET_NOTIFICATIONS(address _userAddress) external view returns (Notification[] memory) {
        return notifications[_userAddress];
    }

    //--------------DOCTOR------------------

    //ADD DOCTOR
    function ADD_DOCTOR(string memory _IPFS_URL, address _address, string calldata _name,  string memory _type) public payable {
        require(msg.value == registrationDoctorFee, "Incorrect registration fee");
        require(!registeredDoctors[_address], "Doctor is already registered");
        
        doctorCount++;
        doctors[doctorCount] = Doctor(doctorCount, _IPFS_URL, _address, 0, false);
        registeredDoctors[_address] = true;

        payable(admin).transfer(msg.value);

         ADD_NOTIFICATION(_address, "You have successfully completed the registration, now wating for approval", "Doctor");
         ADD_NOTIFICATION(admin, "New doctor is registor, now wating for approval", "Doctor");

        emit DOCTOR_REGISTERED(doctorCount, _IPFS_URL, _address);
    }

    // APPROVE DOCTOR STATUS
    function APPROVE_DOCTOR_STATUS(uint _doctorId) public onlyAdmin {
        require(_doctorId <= doctorCount, "Doctor does not exist");
        require(!doctors[_doctorId].isApproved, "Doctor is already approved");

        doctors[_doctorId].isApproved = !doctors[_doctorId].isApproved;

        ADD_NOTIFICATION(msg.sender, "You have approved Docotr registration", "Doctor");
        ADD_NOTIFICATION(doctors[_doctorId].accountAddress, "Your registration is approved", "Doctor");

        emit APPROVE_DOCTOR_STATUSD(_doctorId, doctors[_doctorId].isApproved);
    }

    // UPDATE BY DOCTOR
    function UPDATE_PATIENT_MEDICAL_HISTORY(uint _patientId, string memory _newMedicalHistory) public onlyDoctor {
            require(_patientId <= patientCount, "Patient does not exist");
            patients[_patientId].medicalHistory.push(_newMedicalHistory);

            ADD_NOTIFICATION(msg.sender, "You have successfully update, patient medical history", "Doctor");

            ADD_NOTIFICATION(patients[_patientId].accountAddress, "Your medical history updated by doctor", "Doctor");

            ADD_NOTIFICATION(msg.sender, "Patient medicial history is updated", "Doctor");
    }

    //--------------END OF DOCTOR------------------

    //--------------PATIENT------------------

    /// ADD PATIENTS
    function ADD_PATIENTS(string memory _IPFS_URL, string[] memory _medicalHistory, address _accountAddress, string memory _type) public payable {
            require(msg.value == registrationPatientFee, "Incorrect registration fee");
            require(!registeredPatients[_accountAddress], "Patient is already registered");

            patientCount++;
            patients[patientCount] = Patient(patientCount, _IPFS_URL, _medicalHistory, _accountAddress);
            registeredPatients[_accountAddress] = true;

            payable(admin).transfer(msg.value);

            ADD_NOTIFICATION(_accountAddress, "You have successfully completed registration", "Patient");

            ADD_NOTIFICATION(admin, "New Patient is registor successfully", "Patient");

            emit PATIENT_ADDED(patientCount, _IPFS_URL, _medicalHistory);
    }

    //--------------END OF PATIENT------------------



     //--------------ADMIN------------------

    //UPADTE ONLY ADMIN
    function UPDATE_REGISTRATION_FEE(uint _newFee) public onlyAdmin {
        registrationDoctorFee = _newFee;

         ADD_NOTIFICATION(admin, "You have successfully updated Registration fee", "Admin");
    }

    function UPDATE_REGISTRATION_PATIENT_FEE(uint _newFee) public onlyAdmin {
        registrationPatientFee = _newFee;

         ADD_NOTIFICATION(admin, "You have successfully updated Patient Registration fee", "Admin");
    }

    function UPDATE_ADMIN_ADDRESS(address payable _newAddress) public onlyAdmin {
        admin = _newAddress;

         ADD_NOTIFICATION(admin, "You have successfully updated admin address", "Admin");
    }

    //--------------END OF ADMIN------------------

    
    //--------------GET APTIENT------------------

    function GET_ALL_REGISTERED_PATIENTS() public view returns (Patient[] memory) {
        Patient[] memory allPatients = new Patient[](patientCount);
        uint counter = 0;
        for (uint i = 1; i <= patientCount; i++) {
            allPatients[counter] = patients[i];
            counter++;
        }
        return allPatients;
    }

    function GET_PATIENT_ID(address _patientAddress) public view returns (uint) {
        for (uint i = 1; i <= patientCount; i++) {
            if (patients[i].accountAddress == _patientAddress) {
                return i;
            }
        }
        revert("Patient not found");
    }

    function GET_PATIENT_MEDICIAL_HISTORY(uint _patientId) public view returns (string[] memory) {
        require(_patientId <= patientCount, "Patient does not exist");
        require(patients[_patientId].accountAddress == msg.sender || msg.sender == admin, "Only the patient or admin can view the medical history");
        return patients[_patientId].medicalHistory;
    }

    function GET_PATIENT_DETAILS(uint _patientId) public view returns (Patient memory) {
        return patients[_patientId];
    }

    //--------------END OF GET APTIENT------------------


    //-------------- GET OF  DOCTOR------------------

    //GET FUNCTION FOR DOCTORS
    function GET_ALL_REGISTERED_DOCTORS() public view returns (Doctor[] memory) {
        Doctor[] memory allDoctors = new Doctor[](doctorCount);
        uint counter = 0;
        for (uint i = 1; i <= doctorCount; i++) {
            allDoctors[counter] = doctors[i];
            counter++;
        }
        return allDoctors;
    }

    function GET_ALL_APPROVED_DOCTORS() public view returns (Doctor[] memory) {
        uint approvedCount = 0;
        for (uint i = 1; i <= doctorCount; i++) {
            if (doctors[i].isApproved) {
                approvedCount++;
            }
        }

        Doctor[] memory approvedDoctors = new Doctor[](approvedCount);
        uint counter = 0;
        for (uint i = 1; i <= doctorCount; i++) {
            if (doctors[i].isApproved) {
                approvedDoctors[counter] = doctors[i];
                counter++;
            }
        }
        return approvedDoctors;
    }

    function GET_MOST_POPULAR_DOCTOR() public view returns (Doctor memory) {
        Doctor memory bestDoctor;
        uint highestScore = 0;
        for (uint i = 1; i <= doctorCount; i++) {
            uint score = doctors[i].successfulTreatmentCount;
            if (score > highestScore) {
                highestScore = score;
                bestDoctor = doctors[i];
            }
        }
        return bestDoctor;
    }

    function GET_DOCTOR_DETAILS(uint _doctorId) public view returns (Doctor memory) {
        return doctors[_doctorId];
    }

    function GET_DOCTOR_ID(address _doctorAddress) public view returns (uint) {
        for (uint i = 1; i <= doctorCount; i++) {
            if (doctors[i].accountAddress == _doctorAddress) {
                return i;
            }
        }
        revert("Doctor not found");
    }

    //--------------END OF GET DOCTOR------------------
}
