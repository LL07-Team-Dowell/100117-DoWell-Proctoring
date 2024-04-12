/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useUserContext } from "../../contexts";
import { IoAddCircleOutline } from "react-icons/io5";
import styles from "./styles.module.css";
import AddEventModal from "./EventModal/EventModal";
// import RecordView from "../../utils/recordScreen";

const LandingPage = () => {
  const [greeting, setGreeting] = useState("");
  const { currentUser } = useUserContext();
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  console.log(currentUser);

  const handleShowAddEventModal = () => {
    setShowAddEventModal(true);
  };

  useEffect(() => {
    const time = new Date().getHours();
    if (time < 10) return setGreeting("Good Morning");
    if (time < 20) return setGreeting("Good Day");

    setGreeting("Good Evening");
  }, []);
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
        {showAddEventModal && (
          <AddEventModal handleCloseModal={() => setShowAddEventModal(false)} />
        )}
      </main>
    </>
  );
};

export default LandingPage;
