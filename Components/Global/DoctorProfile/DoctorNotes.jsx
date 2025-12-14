import React from "react";

const DoctorNotes = ({
  setDoctorNotes,
  handleClick,
  setShowNotesModal,
  doctorNotes,
  existingNotes,
  isViewMode = false,
}) => {
  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isViewMode ? "Doctor Notes" : "Add Doctor Notes"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowNotesModal(false)}
            />
          </div>
          <div className="modal-body">
            <div>
              <div className="mb-3">
                <label className="form-label">
                  {isViewMode
                    ? "Notes about patient condition:"
                    : "Write notes about patient condition:"}
                </label>
                <textarea
                  className="form-control"
                  placeholder={
                    isViewMode
                      ? "No notes available"
                      : "Enter your notes about the patient's condition..."
                  }
                  rows={6}
                  value={
                    isViewMode
                      ? existingNotes || ""
                      : doctorNotes?.notes !== undefined
                      ? doctorNotes.notes
                      : existingNotes || ""
                  }
                  readOnly={isViewMode}
                  onChange={(e) => {
                    if (!isViewMode) {
                      setDoctorNotes({
                        ...doctorNotes,
                        notes: e.target.value,
                      });
                    }
                  }}
                />
              </div>
              {!isViewMode && (
                <button
                  onClick={handleClick}
                  className="btn btn-success btn-block w-100"
                >
                  Save Notes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" onClick={() => setShowNotesModal(false)}></div>
    </div>
  );
};

export default DoctorNotes;