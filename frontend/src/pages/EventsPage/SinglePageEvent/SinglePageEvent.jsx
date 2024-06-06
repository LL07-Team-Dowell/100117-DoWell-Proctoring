/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./styles.module.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { getSingleEvent } from "../../../services/eventServices";
import { sampleEventResponse } from "../../../services/eventsDataServices";
import { IoMdShare } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { formatDate, formatSingleEventDate } from "../../../helpers/formatDate";
import UserIconsInfo from "../../../components/UsersIconsInfo/UserIconsInfo";

const SinglePageEvent = () => {
  const [singleEvent, setSingleEvent] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSingleEvent = async () => {
      try {
        const event = (await getSingleEvent(eventId)).data;
        const data = event?.data;
        setSingleEvent(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleEvent();
  }, [eventId]);

  // const singleEventExample = sampleEventResponse?.data?.events[1];

  if (!singleEvent) return <LoadingSpinner />;

  return (
    <section className={styles.wrapper}>
      <div className={styles.single_event_container}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <MdKeyboardArrowLeft size={30} />
          </button>
          <h1 style={{ fontSize: "1.3rem", color: "#005734" }}>
            {singleEvent.name}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <span className={styles.edit_button}>
            <MdEdit size={15} />
            Edit
          </span>
          <button className={styles.share_button}>
            Share
            <IoMdShare size={15} />
          </button>
        </div>
      </div>
      <div className={styles.single_event_body}>
        <div className={styles.single_event_info_container}>
          <p>
            Registration Ends on:{" "}
            <span>
              {formatSingleEventDate(singleEvent.registration_end_date)}
            </span>
          </p>
          <p>
            Start Date:{" "}
            <span>{formatSingleEventDate(singleEvent.start_time)}</span>
          </p>
          <p>
            End Date:{" "}
            <span>{formatSingleEventDate(singleEvent.close_date)}</span>
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {currentDate >= new Date(singleEvent.start_time) &&
            currentDate <= new Date(singleEvent.close_date) &&
            currentDate <= new Date(singleEvent.registration_end_date) && (
              <button
                className={styles.join_button}
                onClick={() => navigate(`${singleEvent.link}`)}
              >
                Join
              </button>
            )}
        </div>
        <div>
          <h3>Participants</h3>
          <UserIconsInfo
            items={singleEvent?.active_participants?.map(
              (participant) => participant.name
            )}
            numberOfIcons={10}
            isNotParticipantItem={true}
            className={styles.user_icons_info}
          />
        </div>
        <div className={styles.single_event_details}>
          {currentDate < new Date(singleEvent.start_time) ? (
            <div style={{ textAlign: "center" }}>
              <img
                src="../../../../public/Loading-bro.svg"
                alt="Event Not Started"
                width={350}
                height={350}
              />
              <h3>Event Has Not Started Yet</h3>
            </div>
          ) : (
            <div>
              <h3>Insight</h3>
              <div>
                <p>
                  Average Time Spent <span></span>
                </p>
                <p>
                  Average ScreenShots Taken <span></span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SinglePageEvent;
