/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./styles.module.css";
import { PiArrowElbowRightThin } from "react-icons/pi";
import { TbCopy } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import EmailInput from "../ValidatingEmail/validatingEmail";
import Overlay from "../DotLoader/Overlay/Overlay";

export const ShareModal = ({
  handleCloseModal,
  eventId,
  eventName,
  header,
}) => {
  const [copied, setCopiedId] = useState("");

  return (
    <Overlay>
      <div className={styles.event__Modal__wrapper}>
        <div style={{ width: "100%" }}>
          <AiOutlineClose
            onClick={handleCloseModal}
            className={styles.close__event__modal}
          />
        </div>
        <div style={{ width: "100%" }}>
          <h2 style={{ marginBottom: "1rem", color: "#005734" }}>{header}</h2>
          <label htmlFor="link" className={styles.event__share__modal}>
            <div style={{ marginBottom: "0.4rem" }}>
              <span>Share Event link</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                name={"link"}
                placeholder="Event link"
                value={`${window.location.origin}/register-event?view=public&event_id=${eventId}`}
                style={{ width: "100%" }}
              />
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/register-event?view=public&event_id=${eventId}`
                  );

                  setCopiedId("write-text");
                }}
              >
                {copied === "write-text" ? (
                  <>
                    <PiArrowElbowRightThin /> Copied
                  </>
                ) : (
                  <>
                    <TbCopy /> Copy
                  </>
                )}
              </button>
            </div>
          </label>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              margin: "2rem 0",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#d3d3d3",
              }}
            ></div>
            <p>or</p>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#d3d3d3",
              }}
            ></div>
          </div>
          <label htmlFor="emails" className={styles.event__share__modal}>
            <div style={{ margin: "0.4rem 0" }}>
              <span>Invite via email</span>
            </div>
            <EmailInput
              newEvent={eventName}
              eventLink={`${window.location.origin}/register-event?view=public&event_id=${eventId}`}
              closeModal={handleCloseModal}
            />
          </label>
        </div>
      </div>
    </Overlay>
  );
};
