/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Card from "../../../../components/Card/Card";
import Overlay from "../../../../components/DotLoader/Overlay/Overlay";
import UserIconsInfo from "../../../../components/UsersIconsInfo/UserIconsInfo";
import styles from "./styles.module.css";
import { AiOutlineClose } from "react-icons/ai";

export const ParticipantDetails = ({ participants, handleCloseModal }) => {
  console.log("Participants: ", participants);
  if (!participants || !Array.isArray(participants)) return null;
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
            items={participants[0].name}
            numberOfIcons={1}
            isNotParticipantItem={true}
          />
          <p>Name: {participants[0].name}</p>
          <p>Email: {participants[0].email}</p>
          <p>Latitude: {participants[0].user_lat}</p>
          <p>Longitude: {participants[0].user_lon}</p>
          <p>
            Time Started:{" "}
            {new Date(participants[0].time_started).toLocaleString()}
          </p>
          <p>Hours Spent: {participants[0].hours_spent_in_event}</p>
        </div>
      </div>
    </Overlay>
  );
};
