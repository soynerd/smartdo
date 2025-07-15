const auth = {
  google: {
    aistudio_api_key: String(import.meta.env.VITE_GOOGLE_AISTUDIO_API_KEY),
  },
  local_Storage: {
    currentStorageKey: String(import.meta.env.VITE_LOCAL_STORAGE_AI_PROMPT_KEY),
    newTaskStorageKey: String(import.meta.env.VITE_LOCAL_STORAGE_NEW_TASK_KEY),
    userTasksStorageKey: String(
      import.meta.env.VITE_LOCAL_STORAGE_USER_TASKS_KEY
    ),
  },
  backend: {
    api_url: String(import.meta.env.VITE_BACKEND_URL),
  },
};
export default auth;
