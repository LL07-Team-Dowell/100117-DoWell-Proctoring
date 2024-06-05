/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts";
import { IoAddCircleOutline } from "react-icons/io5";
import styles from "./styles.module.css";
import AddEventModal from "./EventModal/EventModal";
import RecordView from "../../components/RecordScreen/recordScreen";
import EmailInput from "../../components/ValidatingEmail/validatingEmail";
// import RecordView from "../../utils/recordScreen";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { formatDate } from "../../helpers/formatDate";
import EventCard from "../EventsPage/EventCard/EventCard";
import { useEventsContext } from "../../contexts/index";
import { allEventsData } from "../../services/eventsDataServices";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const localizer = momentLocalizer(moment);

const LandingPage = () => {
  const [greeting, setGreeting] = useState("");
  const { currentUser } = useUserContext();
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  console.log(currentUser);
  const navigate = useNavigate();
  const { allEvents, eventsLoading } = useEventsContext();

  const handleShowAddEventModal = () => {
    setShowAddEventModal(true);
  };

  useEffect(() => {
    const time = new Date().getHours();
    if (time < 10) return setGreeting("Good Morning");
    if (time < 20) return setGreeting("Good Day");

    setGreeting("Good Evening");
  }, []);

  const singleEventClick = (event) => {
    const viewEvent = allEvents.find((item) => item.name === event);
    if (viewEvent) {
      return navigate(`/events/${viewEvent._id}`);
    }
  };
  return (
    <>
      <main className={styles.wrapper}>
        <section className={styles.nav__content}>
          <h2>
            <span>
              Hello {currentUser?.userinfo?.first_name}{" "}
              {currentUser?.userinfo?.last_name}
            </span>
            <span className={styles.greeting}>{greeting}</span>
          </h2>
          <button onClick={handleShowAddEventModal}>
            <IoAddCircleOutline />
            <span>Add</span>
          </button>
        </section>
        <div className={styles.main__content}>
          <div className={styles.event__header}>
            <h3>My Events</h3>
            <button onClick={() => navigate("/events")}>
              View All <MdKeyboardDoubleArrowRight className={styles.arrow} />
            </button>
          </div>
          {eventsLoading ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <>
              <section className={styles.main__content__wrapper}>
                {allEvents
                  ?.reverse()
                  ?.slice(0, 5)
                  ?.map((event) => (
                    <EventCard
                      key={event._id}
                      eventName={event.name}
                      startTime={formatDate(event.start_time)}
                      endTime={formatDate(event.close_date)}
                      participants={event.participants}
                      handleClick={() => singleEventClick(event.name)}
                    />
                  ))}
              </section>
              <section className={styles.calendar__wrapper}>
                <BigCalendar
                  localizer={localizer}
                  events={allEvents}
                  startAccessor="start"
                  endAccessor="end"
                  titleAccessor="title"
                  defaultDate={moment().toDate()}
                  eventPropGetter={() => {
                    return {
                      style: {
                        backgroundColor: "#005734",
                        color: "#fff",
                        borderRadius: "7px",
                      },
                    };
                  }}
                />
              </section>
            </>
          )}
        </div>
        {showAddEventModal && (
          <AddEventModal handleCloseModal={() => setShowAddEventModal(false)} />
        )}
      </main>
    </>
  );
};

export default LandingPage;
