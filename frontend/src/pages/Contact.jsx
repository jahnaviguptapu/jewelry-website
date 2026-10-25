import { useState } from "react";

const WHATSAPP = "91+8885783228";

function Contact() {
  const [form, setForm] = useState({
    type: "Question",
    name: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const text =
      `*${form.type}* from Strii Collections website%0A` +
      `Name: ${encodeURIComponent(form.name)}%0A` +
      `Phone: ${encodeURIComponent(form.phone)}%0A` +
      `Message: ${encodeURIComponent(form.message)}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <div className="wrap contact-page">
      <h2 className="serif" style={{ fontSize: 36, marginBottom: 6 }}>Contact Us</h2>
      <p style={{ marginBottom: 24 }}>
        Any questions, queries or feedback? We would love to hear from you.
      </p>

      <div className="contact-grid">
        <div className="contact-info">
          <h3 className="serif">Get in touch</h3>
          <p>📞 8885783228</p>
          <p>✉ bandiguptapujahnavi@gmail.com</p>
          <p>🕒 Full time</p>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <label>I want to send a</label>
          <select name="type" value={form.type} onChange={change}>
            <option>Question</option>
            <option>Query</option>
            <option>Feedback</option>
          </select>

          <label>Your name</label>
          <input name="name" value={form.name} onChange={change} required />

          <label>Phone number</label>
          <input name="phone" value={form.phone} onChange={change} required />

          <label>Message</label>
          <textarea name="message" rows="5" value={form.message} onChange={change} required />

          <button className="btn" type="submit">SEND ON WHATSAPP</button>
          {sent && <p style={{ marginTop: 10 }}>Thank you! WhatsApp open ayyindi, Send click chey ✅</p>}
        </form>
      </div>
    </div>
  );
}

export default Contact;