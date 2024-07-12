/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./styles.module.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import {
  getSingleEvent,
  updateSingleEvent,
} from "../../../services/eventServices";
import { sampleEventResponse } from "../../../services/eventsDataServices";
import { IoMdShare } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { formatDate, formatSingleEventDate } from "../../../helpers/formatDate";
import UserIconsInfo from "../../../components/UsersIconsInfo/UserIconsInfo";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ShareModal } from "../../../components/ShareModal/ShareModal";
import { FormModal } from "../../../components/FormModal/FormModal";
import { convertToDateTimeLocal } from "../../../helpers/formatDate";
import { useEventsContext } from "../../../contexts";
import { ParticipantDetails } from "./components/PartcipantDetails";

ChartJS.register(ArcElement, Tooltip, Legend);

const singleEventExample = sampleEventResponse?.data?.events[1];

const SinglePageEvent = () => {
  const [singleEvent, setSingleEvent] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { eventsLoaded, allEvents } = useEventsContext();
  const [showParticipantDetails, setShowParticipantDetails] = useState(false);
  const [participantDetails, setParticipantDetails] = useState({});

  const handleChange = (valueEntered, inputName) => {
    setSingleEvent((prevValue) => ({
      ...prevValue,
      [inputName]: valueEntered,
    }));
  };

  const handleNumericChange = (valueEntered, inputName) => {
    const filteredValue = valueEntered.replace(/[^0-9]/g, "");
    setSingleEvent((prevValue) => ({
      ...prevValue,
      [inputName]: filteredValue,
    }));
  };

  useEffect(() => {
    if (eventsLoaded) {
      const foundEvent = allEvents.find((item) => item._id === eventId);
      if (foundEvent) return setSingleEvent(foundEvent);
    }

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

  const handleUpdateSingleEvent = async () => {
    console.log("Update event click working");
    setLoading(true);
    try {
      const res = await updateSingleEvent(eventId, {
        start_time: singleEvent.start_time,
        registration_end_date: singleEvent.registration_end_date,
        max_cap: singleEvent.max_cap,
        duration_in_hours: singleEvent.duration_in_hours,
      });
      console.log(res);
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleShowPartcipantDetails = (participant) => {
    setShowParticipantDetails(true);
    setParticipantDetails(participant);
    console.log(participant);
    // setShowParticipantDetails(details);
  };

  if (!singleEvent) return <LoadingSpinner />;

  return (
    <section className={styles.wrapper}>
      <div className={styles.single_event_container}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <MdKeyboardArrowLeft size={30} />
          </button>
          <h1 style={{ fontSize: "1.3rem", color: "#005734" }}></h1>
          {singleEvent.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <span
            className={styles.edit_button}
            onClick={() => setShowEditModal(true)}
          >
            <MdEdit size={15} />
            Edit
          </span>
          {showEditModal && (
            <FormModal
              title={"Edit Event"}
              handleSubmit={handleUpdateSingleEvent}
              handleCloseModal={() => setShowEditModal(false)}
              loading={loading}
              handleChange={handleChange}
              handleNumericChange={handleNumericChange}
              name={singleEvent.name}
              start_time={convertToDateTimeLocal(singleEvent.start_time)}
              close_date={convertToDateTimeLocal(singleEvent.close_date)}
              registration_end_date={convertToDateTimeLocal(
                singleEvent.registration_end_date
              )}
              duration_in_hours={singleEvent.duration_in_hours}
              max_cap={singleEvent.max_cap}
              link={singleEvent.link}
              editEvent={true}
            />
          )}
          <button
            className={styles.share_button}
            onClick={() => setShowShareModal(true)}
          >
            Share
            <IoMdShare size={15} />
          </button>
          {showShareModal && (
            <ShareModal
              header={"Invite people to join your event"}
              eventId={eventId}
              eventName={singleEvent.name}
              handleCloseModal={() => setShowShareModal(false)}
            />
          )}
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
          <button
            className={styles.join_button}
            onClick={() => navigate(`/live/${eventId}`)}
            disabled={
              currentDate <= new Date(singleEvent.start_time) ||
              currentDate >= new Date(singleEvent.close_date)
            }
          >
            Join
          </button>
        </div>
        <div>
          <h3>Participants ({singleEvent?.active_participants?.length})</h3>
          <UserIconsInfo
            items={singleEvent?.active_participants?.map(
              (participant) => participant.name
            )}
            numberOfIcons={singleEvent?.active_participants?.length}
            isNotParticipantItem={true}
            className={styles.user_icons_info}
            onIconClick={(participant) =>
              handleShowPartcipantDetails(
                singleEvent?.active_participants?.filter(
                  (p) => p.name === participant
                )
              )
            }
          />
          {showParticipantDetails && (
            <ParticipantDetails
              participants={participantDetails}
              handleCloseModal={() => setShowParticipantDetails(false)}
            />
          )}
        </div>
        <br />
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
            <div className={styles.insights}>
              <h3 style={{ color: "#005734" }}>Insights</h3>
              <div className={styles.insights__content}>
                <p>
                  Average Time Spent <span>2.8hrs</span>
                </p>
                <p>
                  Average ScreenShots Taken <span>50</span>
                </p>
              </div>
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  margin: "0 auto",
                }}
              >
                <Doughnut
                  data={{
                    labels: [
                      "1% were kicked out because they navigated away more than once",
                      "3% navigated away once",
                    ],
                    datasets: [
                      {
                        data: [1, 3],
                        backgroundColor: ["#005734", "#D3D3D3"],
                        borderColor: ["#005734", "#D3D3D3"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SinglePageEvent;
