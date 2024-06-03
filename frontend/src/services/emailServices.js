import axios from "axios"

export const sendEmailToSingleRecipient = async (recipientEmail='', recipientName='', emailSubject='', email_content='') => {
    return axios.post("https://100085.pythonanywhere.com/api/uxlivinglab/email/", {
        toname: recipientName,
        toemail: recipientEmail,
        fromname: "Manish",
        fromemail: "manish@dowellresearch.in",
        subject: emailSubject,
        email_content: email_content
    })
}