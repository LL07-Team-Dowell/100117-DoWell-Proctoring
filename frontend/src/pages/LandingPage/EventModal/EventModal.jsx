/* eslint-disable no-undef */
import { useState } from "react";
import Overlay from "../../../components/DotLoader/Overlay/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiRightTopArrowCircle } from "react-icons/bi";
import styles from "./styles.module.css";

const AddEventModal = ({ handleCloseModal }) => {
  const [event, setEvent] = useState({
    name: "",
    start_time: "",
    close_time: "",
    duration_in_hours: "",
    max_cap: "",
    event_link: "",
  });

  const handleChange = (valueEntered, inputName) => {
    setEvent((prevValue) => ({
      ...prevValue,
      [inputName]: valueEntered,
    }));
  };

  const handleNumericChange = (valueEntered, inputName) => {
    const filteredValue = valueEntered.replace(/[^0-9]/g, "");
    setEvent((prevValue) => ({
      ...prevValue,
      [inputName]: filteredValue,
    }));
  };

  const handleAddEvent = (newEvent) => {
    setEvent((event) => [...event, newEvent]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      name: event.name,
      start_time: event.start_time,
      close_time: event.close_time,
      duration_in_hours: event.duration_in_hours,
      max_cap: event.max_cap,
      event_link: event.event_link,
    };
    // handleAddEvent(newEvent);
    console.log(newEvent);
  };

  return (
    <Overlay>
      <section className={styles.event__Modal__wrapper}>
        <div style={{ width: "100%" }}>
          <AiOutlineClose
            onClick={handleCloseModal}
            className={styles.close__event__modal}
          />
        </div>
        <form onSubmit={() => {}} className={styles.event__form}>
          <h2>Add Event</h2>
          <p className={styles.required__indicator__label}>*Required</p>
          <label htmlFor="name">
            <div>
              <span>Event Title</span>{" "}
              <span className={styles.required__indicator}>*</span>
            </div>
            <input
              type="text"
              name={"name"}
              placeholder="Event title"
              value={event.name}
              onChange={(e) => handleChange(e.target.value, e.target.name)}
            />
          </label>
          <div className={styles.event_body}>
            <div className={styles.event_desc}>
              <label htmlFor="start_time">
                <div>
                  <span>Start Date</span>{" "}
                  <span className={styles.required__indicator}>*</span>
                </div>
                <input
                  type="datetime-local"
                  name={"start_time"}
                  placeholder="Start date"
                  value={event.start_time}
                  onChange={(e) => handleChange(e.target.value, e.target.name)}
                />
              </label>
              <label htmlFor="close_time">
                <div>
                  <span>Close Date</span>{" "}
                  <span className={styles.required__indicator}>*</span>
                </div>
                <input
                  type="datetime-local"
                  name={"close_time"}
                  placeholder="Close date"
                  value={event.close_time}
                  onChange={(e) => handleChange(e.target.value, e.target.name)}
                />
              </label>
            </div>
            <div className={styles.event_desc}>
              <label htmlFor="duration_in_hours">
                <div>
                  <span>Duration in Hours</span>{" "}
                  <span className={styles.required__indicator}>*</span>
                </div>
                <input
                  type="text"
                  name={"duration_in_hours"}
                  placeholder="Duration in Hours"
                  value={event.duration_in_hours}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, e.target.name)
                  }
                />
              </label>
              <label htmlFor="max_cap">
                <span>Maximum Participants</span>
                <input
                  type="text"
                  name={"max_cap"}
                  placeholder="Max participants"
                  value={event.max_cap}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, e.target.name)
                  }
                />
              </label>
            </div>
            <label htmlFor="event_link">
              <div>
                <span>Event link</span>{" "}
                <span className={styles.required__indicator}>*</span>
              </div>
              <input
                type="text"
                name={"event_link"}
                placeholder="Event link"
                value={event.event_link}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </label>
          </div>
          <div className={styles.event__actions}>
            <button type="submit" onClick={handleSubmit}>
              <BiRightTopArrowCircle />
              Submit
            </button>
            <button onClick={handleCloseModal}>
              <MdOutlineDeleteOutline />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </section>
    </Overlay>
  );
};

export default AddEventModal;
