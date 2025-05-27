const auth={
    sree:{
        api_key: String(import.meta.env.VITE_SREE_API_KEY)
    },
    local_Storage:{
        currentStorageKey: String(import.meta.env.VITE_LOCAL_STORAGE_AI_PROMPT_KEY),
        newTaskStorageKey: String(import.meta.env.VITE_LOCAL_STORAGE_NEW_TASK_KEY),
        userTasksStorageKey: String(import.meta.env.VITE_LOCAL_STORAGE_USER_TASKS_KEY)
    }
}
export default auth;