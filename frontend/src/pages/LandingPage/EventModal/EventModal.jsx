/* eslint-disable no-undef */
import { useState } from "react";
import Overlay from "../../../components/DotLoader/Overlay/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiRightTopArrowCircle } from "react-icons/bi";
import styles from "./styles.module.css";

const AddEventModal = ({ handleCloseModal }) => {
  const [title, setTitle] = useState("");
  const [event, setEvent] = useState({
    start_time: "",
    duration_in_hours: "",
    max_cap: 0,
    event_link: "",
  });

  const handleTitleChange = (value) => {
    setTitle(value);
  };

  const handleChange = (valueEntered, inputName) => {
    setEvent((prevValue) => ({
      ...prevValue,
      [inputName]: valueEntered,
    }));
  };

  const handleAddEvent = (newEvent) => {
    setEvent((event) => [...event, newEvent]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      start_time: event.start_time,
      duration_in_hours: event.duration_in_hours,
      max_cap: event.max_cap,
      event_link: event.event_link,
      event_title: title,
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
          <label htmlFor="title">
            <span>Event Title</span>
            <input
              type="text"
              name="title"
              placeholder="Event title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </label>
          <div className={styles.event_body}>
            <label htmlFor="timeline">
              <span>Timeline</span>
              <input
                type="datetime-local"
                name={"start_time"}
                placeholder="timeline"
                value={event.start_time}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </label>
            <label htmlFor="event_link">
              <span>Event Link</span>
              <input
                type="text"
                name={"event_link"}
                placeholder="Event link"
                value={event.event_link}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </label>
            <label htmlFor="duration">
              <span>Duration in Hours</span>
              <input
                type="text"
                name={"duration_in_hours"}
                placeholder="Duration in Hours"
                value={event.duration_in_hours}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </label>
            <label htmlFor="max-cap">
              <span>Maximum Participants</span>
              <input
                type="number"
                name={"max_cap"}
                placeholder="Max participants"
                value={event.max_cap}
                onChange={(e) =>
                  handleChange(Number(e.target.value), e.target.name)
                }
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
