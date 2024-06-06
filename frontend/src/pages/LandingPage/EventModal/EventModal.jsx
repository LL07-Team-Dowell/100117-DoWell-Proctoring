/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { useState } from "react";
import Overlay from "../../../components/DotLoader/Overlay/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiRightTopArrowCircle } from "react-icons/bi";
import styles from "./styles.module.css";
import { toast } from "sonner";
import { addNewEvent } from "../../../services/eventServices";
import { useEventsContext, useUserContext } from "../../../contexts";
import EmailInput from "../../../components/ValidatingEmail/validatingEmail";
import { TbCopy } from "react-icons/tb";
import { PiArrowElbowRightThin } from "react-icons/pi";
import { ShareModal } from "../../../components/ShareModal/ShareModal";
import { FormModal } from "../../../components/FormModal/FormModal";

const AddEventModal = ({ handleCloseModal }) => {
  const [event, setEvent] = useState({
    name: "",
    start_time: "",
    close_date: "",
    duration_in_hours: "",
    max_cap: "",
    link: "",
    registration_end_date: "",
  });
  console.log(event);
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [eventId, setEventId] = useState("");

  const { currentUser } = useUserContext();
  const { addEvent } = useEventsContext();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredKeys = [
      "name",
      "start_time",
      "close_date",
      "duration_in_hours",
      "link",
      "registration_end_date",
    ];

    const newEvent = {
      name: event.name,
      start_time: event.start_time,
      close_date: event.close_date,
      duration_in_hours: event.duration_in_hours,
      max_cap: event.max_cap,
      link: event.link,
      user_id: currentUser?.userinfo?.userID,
      registration_end_date: event.registration_end_date,
    };

    const missingRequiredKey = Object.keys(newEvent || {}).find(
      (key) =>
        requiredKeys.includes(key) &&
        (!newEvent[key] || newEvent[key]?.length < 1)
    );

    if (missingRequiredKey)
      return toast.info("Please fill in all required fields");
    if (
      new Date(newEvent.start_time).getTime() >
      new Date(newEvent.close_date).getTime()
    )
      return toast.info(
        "The 'Start Date' of the event should be before its 'Close Date'"
      );

    if (new Date(newEvent.start_time).getTime() < new Date().getTime())
      return toast.info("'Start Date' of the event cannot be in the past");

    // handleAddEvent(newEvent);

    console.log(newEvent);
    setLoading(true);

    try {
      const res = (await addNewEvent(newEvent)).data;
      const id = res?.data?._id;
      setEventId(id);
      console.log(res);

      addEvent(newEvent);

      setLoading(false);

      toast.success("Successfully added new event!");
      // handleCloseModal();
      setShowShareModal(true);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
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
        {showShareModal ? (
          <ShareModal
            header={"Invite people to register for your event"}
            eventId={eventId}
            eventName={event.name}
            handleCloseModal={handleCloseModal}
          />
        ) : (
          <>
            <FormModal
              title={"Add Event"}
              handleSubmit={handleSubmit}
              handleCloseModal={handleCloseModal}
              loading={loading}
              handleChange={handleChange}
              handleNumericChange={handleNumericChange}
              name={event.name}
              start_time={event.start_time}
              close_date={event.close_date}
              registration_end_date={event.registration_end_date}
              duration_in_hours={event.duration_in_hours}
              max_cap={event.max_cap}
              link={event.link}
            />
          </>
        )}
      </section>
    </Overlay>
  );
};

export default AddEventModal;
