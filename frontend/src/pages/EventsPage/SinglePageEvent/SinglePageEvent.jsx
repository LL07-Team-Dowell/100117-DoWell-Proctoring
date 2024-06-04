/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./styles.module.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useEventsContext } from "../../../contexts";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const SinglePageEvent = () => {
  const { allEvents } = useEventsContext();
  const [singleEvent, setSingleEvent] = useState({});
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const singleEvent = allEvents.find((event) => event._id === eventId);
    setSingleEvent(singleEvent);
    console.log(singleEvent);
  }, [allEvents, eventId]);

  console.log(eventId);

  if (!singleEvent) return <LoadingSpinner />;

  return (
    <section className={styles.wrapper}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <MdKeyboardArrowLeft size={30} />
        </button>
        <h1>{singleEvent?.name}</h1>
      </div>
    </section>
  );
};

export default SinglePageEvent;
