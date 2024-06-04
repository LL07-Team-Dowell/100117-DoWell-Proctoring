/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styles from "./styles.module.css";
import Card from "../../../components/Card/Card";
import UserIconsInfo from "../../../components/UsersIconsInfo/UserIconsInfo";

const EventCard = ({
  eventName,
  startTime,
  endTime,
  participants,
  handleClick,
}) => {
  return (
    <div className={styles.card}>
      <Card className={styles.card__content}>
        <h1 className={styles.title}>{eventName}</h1>
        <div
          style={{ display: "flex", gap: "0.8rem", flexDirection: "column" }}
        >
          <p>
            <b>Start Date:</b>{" "}
            <span style={{ fontSize: "0.8rem" }}>{startTime}</span>
          </p>
          <p>
            <b>End Date:</b>{" "}
            <span style={{ fontSize: "0.8rem" }}>{endTime}</span>
          </p>
        </div>
        <div className={styles.card__footer__container}>
          <div>
            <UserIconsInfo
              items={participants}
              numberOfIcons={3}
              isNotParticipantItem={true}
            />
          </div>
          <div className={styles.card__footer}>
            <button onClick={handleClick}>View</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventCard;
