/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import "./validateEmail.css";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import { sendEmail } from "../../utils/email";

const parseEmails = (input) => {
  return input
    .split(/[, ]+/) // Split by commas or spaces
    .map((email) => email.trim()) // Remove leading/trailing spaces
    .filter((email) => email); // Remove empty strings
};

const EmailInput = ({ newEvent, eventLink, closeModal }) => {
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [notValid, setNotValid] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addEmail(inputValue.trim());
    }
  };

  const addEmail = (input) => {
    const emailsArray = parseEmails(input);
    const updatedEmails = emailsArray.map((email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = re.test(String(email).toLowerCase());

      // Extract the name from the email
      const name = email
        .split("@")[0]
        .replace(/[.]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return { email, name, isValid: isValidEmail };
    });

    setEmails((prevEmails) => [...prevEmails, ...updatedEmails]);
    setInputValue("");

    if (updatedEmails.some((email) => !email.isValid)) {
      setNotValid(true);
    } else {
      setNotValid(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("Text");
    addEmail(pastedText);
  };

  const removeEmail = (index) => {
    setEmails((prevEmails) => prevEmails.filter((_, i) => i !== index));
  };

  const handleSendInvite = () => {
    if (notValid) return toast.error("Correct the invalid email address");
    const emailAddresses = emails.map((emailObj) => ({
      email: emailObj.email,
      name: emailObj.name,
    }));

    if (emailAddresses.length < 1) return;

    const message = `Please use this ${eventLink} to register for ${newEvent}`;
    const email = emailAddresses;

    sendEmail(message, email, newEvent)
      .then((response) => {
        console.log("Email sent successfully:", response);
        toast.success("Invitation(s) sent successfully");
        closeModal();
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        toast.error(
          "An error occured while trying to send out the invitation emails"
        );
      });
    console.log("Email addresses:", email);
  };

  return (
    <>
      <div className="email_input_wrapper">
        <div className={`email-input ${notValid ? "notValid" : "valid"}`}>
          {emails.map((email, index) => (
            <div
              key={index}
              className={`email ${email.isValid ? "valid" : "invalid"}`}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {email.email}

                <MdCancel
                  style={{ fontSize: "1rem" }}
                  onClick={() => removeEmail(index)}
                />
              </div>
            </div>
          ))}
          <textarea
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
            className="email__textarea"
            placeholder="abc@email.com, abc@email.com"
            rows={5}
          ></textarea>
        </div>
        <button onClick={handleSendInvite} style={{ height: "3rem" }}>
          Send Invite
        </button>
      </div>
      <p className={'email__Info__Separator'}>You can paste multiple emails at once separated by a comma</p>
    </>
  );
};

export default EmailInput;
