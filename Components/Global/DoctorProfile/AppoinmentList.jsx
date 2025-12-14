import React, { useState, useEffect } from "react";

//INTERNAL IMPORT
import { DoctorDetails1 } from "../../SVG/index";

import { GET_PATIENT_DETAILS, GET_DOCTOR_NOTES } from "../../../Context/constants";
import { useStateContext } from "../../../Context/index";

const AppoinmentList = ({
  item,
  index,
  setUpdateCondition,
  conditionUpdate,
  setConditionUpdate,
  setShowNotesModal,
  setNotesData,
}) => {
  const { COMPLETE_APPOINTMENT } = useStateContext();
  const [patient, setPatient] = useState();

  useEffect(() => {
    if (item) {
      const fetchData = async () => {
        GET_PATIENT_DETAILS(item?.patientId).then((patient) => {
          setPatient(patient);
        });
      };
      fetchData();
    }
  }, [item]);

  return (
    <li key={index}>
      <div className="timeline-panel bgl-dark flex-wrap border-0 p-3 rounded">
        <div className="media bg-transparent me-2">
          <img
            className="rounded-circle"
            alt="image"
            width={48}
            src={patient?.image}
          />
        </div>
        <div className="media-body">
          <h5 className="mb-1 fs-18">
            {patient?.title} {patient?.firstName} {patient?.lastName}
          </h5>
          <span>Phone: {patient?.mobile}</span>
        </div>
        <ul className="mt-3 d-flex flex-wrap text-primary font-w600">
          <li className="me-2 fs-15">Time: {item?.date}</li>
        </ul>
        <div className="mt-3 d-flex flex-wrap text-primary font-w600">
          <a
            onClick={(e) => (
              setConditionUpdate({
                ...conditionUpdate,
                patientID: item.patientId,
              }),
              setUpdateCondition(true)
            )}
            className="btn btn-primary light btn-rounded mb-2 me-2"
          >
            <DoctorDetails1 />
            Update Condition
          </a>
          <a
            onClick={async () => {
              try {
                const existingNotes = await GET_DOCTOR_NOTES(item?.appoinmnetID);
                setNotesData({
                  appointmentId: item?.appoinmnetID,
                  existingNotes: existingNotes || item?.doctorNotes || "",
                  patientName: `${patient?.title} ${patient?.firstName} ${patient?.lastName}`,
                });
                setShowNotesModal(true);
              } catch (error) {
                console.log("Error loading notes:", error);
                setNotesData({
                  appointmentId: item?.appoinmnetID,
                  existingNotes: item?.doctorNotes || "",
                  patientName: `${patient?.title} ${patient?.firstName} ${patient?.lastName}`,
                });
                setShowNotesModal(true);
              }
            }}
            className="btn btn-info light btn-rounded mb-2 me-2"
          >
            <DoctorDetails1 />
            {item?.doctorNotes && item?.doctorNotes.length > 0
              ? "View/Edit Notes"
              : "Add Notes"}
          </a>
          <a
            onClick={() => COMPLETE_APPOINTMENT(item?.appoinmnetID)}
            className="btn btn-primary light btn-rounded mb-2 me-2"
          >
            <DoctorDetails1 />
            Complete Appoint
          </a>
        </div>
      </div>
    </li>
  );
};

export default AppoinmentList;
