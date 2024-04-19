/* eslint-disable react/prop-types */
import { useState } from "react";
import "./validateEmail.css";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";

const EmailInput = ({ handlecloseModal }) => {
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [notValid, setNotValid] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addEmail(inputValue.trim());
    }
  };

  const addEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = re.test(String(email).toLowerCase());
    setEmails((prevEmails) => [
      ...prevEmails,
      { email, isValid: isValidEmail },
    ]);
    setInputValue("");
    if (!isValidEmail) {
      setNotValid(true);
    } else {
      setNotValid(false);
    }
  };

  const removeEmail = (index) => {
    setEmails((prevEmails) => prevEmails.filter((_, i) => i !== index));
  };

  const handleSendInvite = () => {
    if (notValid) return toast.error("Correct the invalid email address");
    toast.success("Invitation sent successfully");
    handlecloseModal();
    console.log(emails);
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
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
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="email__textarea"
          placeholder="Enter email address"
        />
      </div>
      <button onClick={handleSendInvite}>Send Invite</button>
    </div>
  );
};

export default EmailInput;
