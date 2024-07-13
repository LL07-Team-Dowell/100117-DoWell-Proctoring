/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Card from "../../../../components/Card/Card";
import Overlay from "../../../../components/DotLoader/Overlay/Overlay";
import UserIconsInfo from "../../../../components/UsersIconsInfo/UserIconsInfo";
import styles from "./styles.module.css";
import { AiOutlineClose } from "react-icons/ai";

export const ParticipantDetails = ({ participants, handleCloseModal }) => {
  console.log("Participants: ", participants);
  if (!participants) return null;
  return (
    <Overlay>
      <div className={styles.card__content}>
        <div style={{ width: "100%" }}>
          <AiOutlineClose
            onClick={handleCloseModal}
            className={styles.close__event__modal}
          />
        </div>
        <div className={styles.card__details}>
          <h1>Participants</h1>
          <UserIconsInfo
            items={participants?.name}
            numberOfIcons={1}
            isNotParticipantItem={true}
          />
          <p>Name: {participants.name}</p>
          <p>Email: {participants.email}</p>
          <p>Latitude: {participants.user_lat}</p>
          <p>Longitude: {participants.user_lon}</p>
          <p>
            Time Started: {new Date(participants.time_started).toLocaleString()}
          </p>
          <p>Hours Spent: {participants.hours_spent_in_event}</p>
        </div>
      </div>
    </Overlay>
  );
};
