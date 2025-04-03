import React, { useState } from "react";

const RescheduleModal = ({ meeting, onUpdate, onCancel }) => {
    const [newTime, setNewTime] = useState(meeting.scheduleTime);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Reschedule Meeting</h3>
                <input
                    type="datetime-local"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                />
                <div>
                    <button onClick={() => onUpdate({ ...meeting, scheduleTime: newTime })}>Save</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleModal;
