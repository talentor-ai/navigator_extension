import { create } from "zustand";
import { type ISession } from "@popup/models/model.session"
import { sessionInitialState } from "@popup/constants/session";

interface State {
   session: ISession;
   setSession: (session: ISession) => void;
}

// Store configuration
const useSessionStore = create<State>((set) => ({
   session: sessionInitialState,
   setSession: (session: ISession) => set({ session })
}))

export default useSessionStore;