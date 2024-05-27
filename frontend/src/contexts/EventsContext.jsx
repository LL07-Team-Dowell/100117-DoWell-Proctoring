/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { getAllEvents } from "../services/eventServices";
import { useUserContext } from "../contexts";
import { sampleEventResponse } from "../services/eventsDataServices";

export const EventsContext = createContext({});

export default function EventsContextProvider({ children }) {
  const [allEvents, setAllEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const { currentUser } = useUserContext();

  useEffect(() => {
    if (eventsLoaded) return;
    const getAllEventsData = async () => {
      try {
        setEventsLoading(true);
        const id = currentUser?.userinfo?.userID;
        // const res = (await getAllEvents(id)).data;
        const res = sampleEventResponse;
        const data = res?.data?.events?.map((event) => {
          const copyOfEvent = { ...event };
          copyOfEvent.start = new Date(event.start_time);
          copyOfEvent.end = new Date(event.close_date);
          copyOfEvent.title = event.name;

          return copyOfEvent;
        });
        const getPaginationDetails = res?.data?.pagination?.totalPages;
        setAllEvents(data);
        setTotalPages(getPaginationDetails);
        setEventsLoading(false);
        setEventsLoaded(true);
      } catch (error) {
        console.log(error);
        setEventsLoading(false);
      }
    };

    getAllEventsData();
  }, [eventsLoaded, currentUser]);

  return (
    <>
      <EventsContext.Provider
        value={{
          allEvents,
          setAllEvents,
          eventsLoading,
          setEventsLoading,
          eventsLoaded,
          setEventsLoaded,
          totalPages,
          setTotalPages,
        }}
      >
        {children}
      </EventsContext.Provider>
    </>
  );
}
