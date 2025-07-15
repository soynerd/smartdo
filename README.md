# 📝 SmartDo

SmartDo is an intelligent, minimal, and customizable to-do list generator built with a modern tech stack. Just type a prompt like “Things to pack for a beach vacation” and let SmartDo generate a tailored checklist for you. You can edit, delete, and save tasks—all backed by authentication and personalization.

![SmartDo Screenshot - Light and Dark Mode](https://your-screenshot-url-if-any.com)

---

## 🚀 Features

- ✅ **Smart To-Do Generation** using [Gemini](https://aistudio.google.com/) as GPT provider
- 🔐 **Authentication** via **Google** and **GitHub** using OAuth
- ✏️ **Customizable Tasks** – add, edit, delete items
- 💾 **Save To-Do Lists** to the cloud (via backend API)
- 🌙 **Dark Mode** support
- ⏳ **Sessions with 7-day expiry** for persistent login
- 💡 **Minimal & Modern UI** – clean interface with intuitive UX

---

## 🧠 How It Works

1. **Login** via Google or GitHub
2. **Enter a prompt** (e.g., “Study plan for my biology semester”)
3. SmartDo uses GPT (via `sree.shop`) to generate a checklist
4. You can:
   - ✔️ Check items
   - ✏️ Edit tasks or sections
   - ➕ Add your own sections/items
   - 🗑️ Delete anything
   - 💾 Save it for later
5. Data is saved locally and optionally persisted to your backend

---

## ⚙️ Tech Stack

| Area        | Tech                                                      |
| ----------- | --------------------------------------------------------- |
| Frontend    | React, Tailwind CSS, Lucide Icons, React Router Dom       |
| Backend     | Node.js, Express                                          |
| Auth        | Passport.js with Google & GitHub strategies               |
| AI Provider | [Gemini](https://aistudio.google.com/) (Gemma-compatible) |
| Storage     | localStorage + custom API                                 |
| Sessions    | Express-session (7 days expiry)                           |

---

## 🔑 Authentication

Authentication is handled via OAuth:

- Google Login
- GitHub Login

Session cookies are used to maintain the user's login status for **7 days**, ensuring a smooth, persistent experience across visits.

---

## 🧪 Web Development

[Smart DO](https://smartdo.soynerd.co.in/)

### 1. Clone the repository

```bash
git clone https://github.com/soynerd/smartdo.git
cd smartdo
```
