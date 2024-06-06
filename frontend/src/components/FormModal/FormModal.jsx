/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styles from "./styles.module.css";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiRightTopArrowCircle } from "react-icons/bi";
import { useState } from "react";
import Overlay from "../DotLoader/Overlay/Overlay";
import { AiOutlineClose } from "react-icons/ai";

export const FormModal = ({
  handleSubmit,
  handleChange,
  handleNumericChange,
  handleCloseModal,
  loading,
  name,
  start_time,
  close_date,
  duration_in_hours,
  max_cap,
  link,
  registration_end_date,
  title,
  editEvent,
}) => {
  return (
    <Overlay>
      <div className={styles.event__Modal__wrapper}>
        <div style={{ width: "100%" }}>
          <AiOutlineClose
            onClick={handleCloseModal}
            className={styles.close__event__modal}
          />
        </div>
        <form onSubmit={handleSubmit} className={styles.event__form}>
          <h2>{title}</h2>
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
              value={name}
              onChange={(e) => handleChange(e.target.value, e.target.name)}
              disabled={editEvent}
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
                  value={start_time}
                  className={styles.event__input}
                  onChange={(e) => handleChange(e.target.value, e.target.name)}
                />
              </label>
              <label htmlFor="close_date">
                <div>
                  <span>Close Date</span>{" "}
                  <span className={styles.required__indicator}>*</span>
                </div>
                <input
                  type="datetime-local"
                  name={"close_date"}
                  placeholder="Close date"
                  value={close_date}
                  className={styles.event__input}
                  onChange={(e) => handleChange(e.target.value, e.target.name)}
                  disabled={editEvent}
                />
              </label>
              <label htmlFor="registration_end_date">
                <div>
                  <span>Registration End Date</span>{" "}
                  <span className={styles.required__indicator}>*</span>
                </div>
                <input
                  type="datetime-local"
                  name={"registration_end_date"}
                  placeholder="Registration End Date"
                  value={registration_end_date}
                  className={styles.event__input}
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
                  value={duration_in_hours}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, e.target.name)
                  }
                />
              </label>
              <label htmlFor="max_cap">
                <div>
                  <span>Maximum Participants</span>
                </div>
                <input
                  type="text"
                  name={"max_cap"}
                  placeholder="Max participants"
                  value={max_cap}
                  onChange={(e) =>
                    handleNumericChange(e.target.value, e.target.name)
                  }
                />
              </label>
            </div>
            <label htmlFor="link">
              <div>
                <span>Event link</span>{" "}
                <span className={styles.required__indicator}>*</span>
              </div>
              <input
                type="text"
                name={"link"}
                placeholder="Event link"
                value={link}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                disabled={editEvent}
              />
            </label>
          </div>
          <div className={styles.event__actions}>
            <button type="submit" onClick={handleSubmit} disabled={loading}>
              <BiRightTopArrowCircle />
              {loading ? "Saving..." : "Submit"}
            </button>
            <button onClick={handleCloseModal} disabled={loading}>
              <MdOutlineDeleteOutline />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  );
};
