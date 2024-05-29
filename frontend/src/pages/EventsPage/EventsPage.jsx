/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useEventsContext, useUserContext } from "../../contexts/index";
import { formatDate } from "../../helpers/formatDate";
import EventCard from "./EventCard/EventCard";
import {
  allEventsData,
  sampleEventResponse,
} from "../../services/eventsDataServices";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getEventsForPage } from "../../services/eventServices";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const EventsPage = () => {
  const { totalPages } = useEventsContext();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [eventsToShowForPage, setEventsToShowForPage] = useState([]);
  const [eventsForPageLoading, setEventsForPageLoading] = useState(true);
  const { currentUser } = useUserContext();

  useEffect(() => {
    const page = searchParams.get("page") || 1;
    if (page) {
      setCurrentPage(parseInt(page));
    }

    const eventsForPage = async () => {
      try {
        setEventsForPageLoading(true);
        const id = currentUser?.userinfo?.userID;
        const events = (await getEventsForPage(id, page)).data;
        const data = events?.data?.events;
        // const events = sampleEventResponse?.data?.events;
        console.log(data);
        setEventsToShowForPage(data);
        setEventsForPageLoading(false);
      } catch (error) {
        console.log(error);
        setEventsForPageLoading(false);
      }
    };

    eventsForPage();
  }, [searchParams, currentUser]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSearchParams({ page: page });
    navigate(`/events?page=${page}`);
  };

  // console.log(allEventsData);
  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>My Events</h1>
      {eventsForPageLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.main__content}>
            {allEventsData.map((event) => (
              <EventCard
                key={event._id}
                eventName={event.name}
                startTime={formatDate(event.start_time)}
                endTime={formatDate(event.close_date)}
                participants={event.participants}
              />
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              className={`${styles.firstLast} ${styles.button}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`${styles.button} ${
                  currentPage === page ? styles.current : ""
                }`}
                onClick={() => handlePageChange(page)}
                disabled={currentPage === page}
              >
                {page}
              </button>
            ))}
            <button
              className={`${styles.firstLast} ${styles.button}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default EventsPage;
